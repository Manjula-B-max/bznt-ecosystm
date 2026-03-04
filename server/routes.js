import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { signToken, authMiddleware } from './auth.js';

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const parseCur = (v) => {
    if (typeof v === 'number') return v;
    return parseFloat(String(v || '0').replace(/[^0-9.]/g, '')) || 0;
};

// ── POST /auth/send-otp  { email } ──────────────────────────────────────────
// Generates a 6-digit OTP, stores it with a 5-minute TTL, returns it in the
// response (dev mode — in production you'd email it instead).
router.post('/auth/send-otp', (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Upsert OTP — one active code per email at a time
        db.prepare(`INSERT OR REPLACE INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)`)
            .run(email, code, expiresAt);

        console.log(`[OTP] ${email} → ${code}`); // visible in server console

        // In dev we return the OTP in the response so the UI can display it.
        // Swap this for an email-sending integration in production.
        res.json({ ok: true, otp: code, message: `OTP sent to ${email}` });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /auth/verify-otp  { email, otp } ───────────────────────────────────
// Verifies the OTP. If correct, auto-creates the user (first login) or signs
// in the existing user, then returns a JWT.
router.post('/auth/verify-otp', (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        const otp = String(req.body.otp || '').trim();
        if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

        const row = db.prepare('SELECT * FROM otp_codes WHERE email = ?').get(email);
        if (!row) return res.status(401).json({ error: 'No OTP found. Please request a new one.' });
        if (Date.now() > row.expires_at) {
            db.prepare('DELETE FROM otp_codes WHERE email = ?').run(email);
            return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
        }
        if (row.code !== otp) return res.status(401).json({ error: 'Invalid OTP. Please try again.' });

        // OTP is valid — consume it
        db.prepare('DELETE FROM otp_codes WHERE email = ?').run(email);

        // Find or create user
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const result = db.prepare('INSERT INTO users (email, name) VALUES (?, ?)').run(email, name);
            user = db.prepare('SELECT id, email, name, company, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        } else {
            const { password_hash, ...safe } = user;
            user = safe;
        }

        const token = signToken(user.id);
        res.json({ token, user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/auth/me', authMiddleware, (req, res) => {
    const user = db.prepare('SELECT id, email, name, company, role, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
});

router.put('/auth/me', authMiddleware, (req, res) => {
    const { name, company } = req.body;
    db.prepare('UPDATE users SET name = COALESCE(?, name), company = COALESCE(?, company) WHERE id = ?').run(name, company, req.userId);
    res.json({ ok: true });
});


// ═══════════════════════════════════════════════════════════════════════════
// GENERIC CRUD FACTORY
// ═══════════════════════════════════════════════════════════════════════════
function crudRoutes(table, extraCols = []) {
    const r = express.Router();
    r.use(authMiddleware);

    r.get('/', (req, res) => {
        const rows = db.prepare(`SELECT * FROM ${table} WHERE user_id = ? ORDER BY created_at DESC`).all(req.userId);
        res.json(rows);
    });

    r.post('/', (req, res) => {
        const data = req.body;
        data.id = data.id || uid();
        data.user_id = req.userId;
        const cols = Object.keys(data);
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`);
        stmt.run(...Object.values(data));
        res.json({ id: data.id, ok: true });
    });

    r.put('/:id', (req, res) => {
        const data = req.body;
        delete data.id; delete data.user_id;
        const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
        db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ? AND user_id = ?`).run(...Object.values(data), req.params.id, req.userId);
        res.json({ ok: true });
    });

    r.delete('/:id', (req, res) => {
        db.prepare(`DELETE FROM ${table} WHERE id = ? AND user_id = ?`).run(req.params.id, req.userId);
        res.json({ ok: true });
    });

    return r;
}

router.use('/leads', crudRoutes('leads'));
router.use('/clients', crudRoutes('clients'));
router.use('/invoices', crudRoutes('invoices'));
router.use('/projects', crudRoutes('projects'));
router.use('/campaigns', crudRoutes('campaigns'));
router.use('/followups', crudRoutes('followups'));
router.use('/quotations', crudRoutes('quotations'));
router.use('/contracts', crudRoutes('contracts'));
router.use('/visits', crudRoutes('visits'));
router.use('/greetings', crudRoutes('greetings'));
router.use('/feedback', crudRoutes('feedback_submissions'));
router.use('/workflow_rules', crudRoutes('workflow_rules'));

// ═══════════════════════════════════════════════════════════════════════════
// KPI TARGETS — key-value per user
// ═══════════════════════════════════════════════════════════════════════════
router.get('/kpi_targets', authMiddleware, (req, res) => {
    const rows = db.prepare('SELECT id, target FROM kpi_targets WHERE user_id = ?').all(req.userId);
    const obj = {};
    rows.forEach(r => { obj[r.id] = { target: r.target }; });
    res.json(obj);
});

router.put('/kpi_targets/:id', authMiddleware, (req, res) => {
    const { target } = req.body;
    db.prepare('INSERT OR REPLACE INTO kpi_targets (id, user_id, target, updated_at) VALUES (?,?,?, CURRENT_TIMESTAMP)').run(req.params.id, req.userId, target);
    res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════════════════════
// SOP DAILY REPORT — per date per user
// ═══════════════════════════════════════════════════════════════════════════
router.get('/sop/:date', authMiddleware, (req, res) => {
    const row = db.prepare('SELECT * FROM sop_daily WHERE date_key = ? AND user_id = ?').get(req.params.date, req.userId);
    if (!row) return res.json({ items: {}, submitted: false });
    res.json({ items: JSON.parse(row.items || '{}'), submitted: Boolean(row.submitted) });
});

router.put('/sop/:date', authMiddleware, (req, res) => {
    const { items, submitted } = req.body;
    db.prepare('INSERT OR REPLACE INTO sop_daily (date_key, user_id, items, submitted) VALUES (?,?,?,?)').run(
        req.params.date, req.userId, JSON.stringify(items || {}), submitted ? 1 : 0
    );
    res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════════════════════
// KV STORE — generic key-value (for greetings reminders, playbooks, etc.)
// ═══════════════════════════════════════════════════════════════════════════
router.get('/kv/:key', authMiddleware, (req, res) => {
    const row = db.prepare('SELECT value FROM kv_store WHERE key = ? AND user_id = ?').get(req.params.key, req.userId);
    if (!row) return res.json(null);
    try { res.json(JSON.parse(row.value)); } catch { res.json(row.value); }
});

router.put('/kv/:key', authMiddleware, (req, res) => {
    const value = JSON.stringify(req.body.value);
    db.prepare('INSERT OR REPLACE INTO kv_store (key, user_id, value, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP)').run(req.params.key, req.userId, value);
    res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD SUMMARY — computed from all tables
// ═══════════════════════════════════════════════════════════════════════════
router.get('/dashboard/summary', authMiddleware, (req, res) => {
    const uid = req.userId;
    const leads = db.prepare('SELECT COUNT(*) as c FROM leads WHERE user_id = ?').get(uid).c;
    const hotLeads = db.prepare("SELECT COUNT(*) as c FROM leads WHERE user_id = ? AND LOWER(stage) IN ('warm','hot','demo','proposal')").get(uid).c;
    const clients = db.prepare('SELECT COUNT(*) as c FROM clients WHERE user_id = ?').get(uid).c;
    const overdueInvoices = db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(amount_num),0) as amt FROM invoices WHERE user_id = ? AND LOWER(status) = 'overdue'").get(uid);
    const paidAmt = db.prepare("SELECT COALESCE(SUM(amount_num),0) as amt FROM invoices WHERE user_id = ? AND LOWER(status) = 'paid'").get(uid).amt;
    const openFollowups = db.prepare("SELECT COUNT(*) as c FROM followups WHERE user_id = ? AND done = 0").get(uid).c;
    const activeCampaigns = db.prepare("SELECT COUNT(*) as c FROM campaigns WHERE user_id = ? AND LOWER(status) = 'active'").get(uid).c;
    const activeProjects = db.prepare("SELECT COUNT(*) as c FROM projects WHERE user_id = ? AND LOWER(status) != 'completed'").get(uid).c;
    res.json({ leads, hotLeads, clients, overdueCount: overdueInvoices.c, overdueAmt: overdueInvoices.amt, paidAmt, openFollowups, activeCampaigns, activeProjects });
});

export default router;
