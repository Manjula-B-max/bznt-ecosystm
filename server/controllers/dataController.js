import db from '../config/database.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Generic CRUD factory — produces controller functions for any table.
// Every row is scoped to req.userId for strict data isolation.
export function crudController(table) {
    return {
        list(req, res) {
            const rows = db.prepare(`SELECT * FROM ${table} WHERE user_id = ? ORDER BY created_at DESC`).all(req.userId);
            res.json(rows);
        },
        create(req, res) {
            const data = { ...req.body };
            data.id = data.id || uid();
            data.user_id = req.userId;
            const cols = Object.keys(data);
            db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`)
                .run(...Object.values(data));
            res.json({ id: data.id, ok: true });
        },
        update(req, res) {
            const data = { ...req.body };
            delete data.id; delete data.user_id;
            const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
            db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ? AND user_id = ?`)
                .run(...Object.values(data), req.params.id, req.userId);
            res.json({ ok: true });
        },
        remove(req, res) {
            db.prepare(`DELETE FROM ${table} WHERE id = ? AND user_id = ?`).run(req.params.id, req.userId);
            res.json({ ok: true });
        }
    };
}

// ── KPI Targets ───────────────────────────────────────────────────────────────
export function listKpiTargets(req, res) {
    const rows = db.prepare('SELECT id, target FROM kpi_targets WHERE user_id = ?').all(req.userId);
    const obj = {};
    rows.forEach(r => { obj[r.id] = { target: r.target }; });
    res.json(obj);
}

export function upsertKpiTarget(req, res) {
    const { target } = req.body;
    db.prepare('INSERT OR REPLACE INTO kpi_targets (id, user_id, target, updated_at) VALUES (?,?,?, CURRENT_TIMESTAMP)')
        .run(req.params.id, req.userId, target);
    res.json({ ok: true });
}

// ── SOP Daily Report ──────────────────────────────────────────────────────────
export function getSop(req, res) {
    const row = db.prepare('SELECT * FROM sop_daily WHERE date_key = ? AND user_id = ?').get(req.params.date, req.userId);
    if (!row) return res.json({ items: {}, submitted: false });
    res.json({ items: JSON.parse(row.items || '{}'), submitted: Boolean(row.submitted) });
}

export function upsertSop(req, res) {
    const { items, submitted } = req.body;
    db.prepare('INSERT OR REPLACE INTO sop_daily (date_key, user_id, items, submitted) VALUES (?,?,?,?)')
        .run(req.params.date, req.userId, JSON.stringify(items || {}), submitted ? 1 : 0);
    res.json({ ok: true });
}

// ── KV Store ──────────────────────────────────────────────────────────────────
export function getKv(req, res) {
    const row = db.prepare('SELECT value FROM kv_store WHERE key = ? AND user_id = ?').get(req.params.key, req.userId);
    if (!row) return res.json(null);
    try { res.json(JSON.parse(row.value)); } catch { res.json(row.value); }
}

export function setKv(req, res) {
    const value = JSON.stringify(req.body.value);
    db.prepare('INSERT OR REPLACE INTO kv_store (key, user_id, value, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP)')
        .run(req.params.key, req.userId, value);
    res.json({ ok: true });
}

// ── Dashboard Summary ─────────────────────────────────────────────────────────
export function dashboardSummary(req, res) {
    const id = req.userId;
    const leads          = db.prepare('SELECT COUNT(*) as c FROM leads WHERE user_id = ?').get(id).c;
    const hotLeads       = db.prepare("SELECT COUNT(*) as c FROM leads WHERE user_id = ? AND LOWER(stage) IN ('warm','hot','demo','proposal')").get(id).c;
    const clients        = db.prepare('SELECT COUNT(*) as c FROM clients WHERE user_id = ?').get(id).c;
    const overdueInvoices = db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(amount_num),0) as amt FROM invoices WHERE user_id = ? AND LOWER(status) = 'overdue'").get(id);
    const paidAmt        = db.prepare("SELECT COALESCE(SUM(amount_num),0) as amt FROM invoices WHERE user_id = ? AND LOWER(status) = 'paid'").get(id).amt;
    const openFollowups  = db.prepare("SELECT COUNT(*) as c FROM followups WHERE user_id = ? AND done = 0").get(id).c;
    const activeCampaigns = db.prepare("SELECT COUNT(*) as c FROM campaigns WHERE user_id = ? AND LOWER(status) = 'active'").get(id).c;
    const activeProjects  = db.prepare("SELECT COUNT(*) as c FROM projects WHERE user_id = ? AND LOWER(status) != 'completed'").get(id).c;

    res.json({ leads, hotLeads, clients, overdueCount: overdueInvoices.c, overdueAmt: overdueInvoices.amt, paidAmt, openFollowups, activeCampaigns, activeProjects });
}
