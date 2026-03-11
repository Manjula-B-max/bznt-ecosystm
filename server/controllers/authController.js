import db from '../config/database.js';
import { signToken } from '../middleware/auth.js';
import { sendOtpEmail } from '../services/emailService.js';

// ── POST /auth/send-otp ──────────────────────────────────────────────────────
export async function sendOtp(req, res) {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        const code = String(Math.floor(100000 + Math.random() * 900000));

        // Allow-list check — only authorised emails can log in.
        // If the table is empty the very first request bootstraps it.
        const allowedCount = db.prepare('SELECT COUNT(*) as c FROM allowed_emails').get().c;
        if (allowedCount > 0) {
            const isAllowed = db.prepare('SELECT 1 FROM allowed_emails WHERE email = ?').get(email);
            if (!isAllowed)
                return res.status(403).json({ error: 'Access denied: Email not authorized.' });
        } else {
            db.prepare('INSERT INTO allowed_emails (email) VALUES (?)').run(email);
        }

        const expiresAt = Date.now() + 5 * 60 * 1000;
        db.prepare('INSERT OR REPLACE INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)')
            .run(email, code, expiresAt);

        console.log(`[OTP] ${email} → ${code}`);

        await sendOtpEmail(email, code);

        const hasCreds = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        res.json({
            ok: true,
            message: hasCreds
                ? `OTP sent completely securely to ${email}`
                : 'OTP mapped. (Check Server Terminal!)'
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// ── POST /auth/verify-otp ────────────────────────────────────────────────────
export function verifyOtp(req, res) {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        const otp   = String(req.body.otp || '').trim();
        if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

        const row = db.prepare('SELECT * FROM otp_codes WHERE email = ?').get(email);
        if (!row) return res.status(401).json({ error: 'No OTP found. Please request a new one.' });

        if (Date.now() > row.expires_at) {
            db.prepare('DELETE FROM otp_codes WHERE email = ?').run(email);
            return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
        }
        if (row.code !== otp) return res.status(401).json({ error: 'Invalid OTP. Please try again.' });

        db.prepare('DELETE FROM otp_codes WHERE email = ?').run(email);

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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// ── GET /auth/me ─────────────────────────────────────────────────────────────
export function getMe(req, res) {
    const user = db.prepare('SELECT id, email, name, company, role, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
}

// ── PUT /auth/me ─────────────────────────────────────────────────────────────
export function updateMe(req, res) {
    const { name, company } = req.body;
    db.prepare('UPDATE users SET name = COALESCE(?, name), company = COALESCE(?, company) WHERE id = ?')
        .run(name, company, req.userId);
    res.json({ ok: true });
}
