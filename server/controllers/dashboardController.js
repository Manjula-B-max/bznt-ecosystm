import { getModel } from '../models/Generic.js';
import { KpiTarget, SopDaily, KvStore } from '../models/App.js';

export const getDashboardSummary = async (req, res) => {
    try {
        const uid = req.userId;
        
        const Leads = getModel('leads');
        const Clients = getModel('clients');
        const Invoices = getModel('invoices');
        const Followups = getModel('followups');
        const Campaigns = getModel('campaigns');
        const Projects = getModel('projects');

        const [
            leads, hotLeads, clients, overdueInvoices, paidInvoices,
            openFollowups, activeCampaigns, activeProjects
        ] = await Promise.all([
            Leads.countDocuments({ user_id: uid }),
            Leads.countDocuments({ user_id: uid, stage: { $regex: /^(warm|hot|demo|proposal)$/i } }),
            Clients.countDocuments({ user_id: uid }),
            Invoices.aggregate([
                { $match: { user_id: uid, status: { $regex: /^overdue$/i } } },
                { $group: { _id: null, count: { $sum: 1 }, amt: { $sum: "$amount_num" } } }
            ]),
            Invoices.aggregate([
                { $match: { user_id: uid, status: { $regex: /^paid$/i } } },
                { $group: { _id: null, amt: { $sum: "$amount_num" } } }
            ]),
            Followups.countDocuments({ user_id: uid, done: 0 }),
            Campaigns.countDocuments({ user_id: uid, status: { $regex: /^active$/i } }),
            Projects.countDocuments({ user_id: uid, status: { $regex: /^(?!.*completed).*$/i } }) 
        ]);

        const overdueCount = overdueInvoices.length > 0 ? overdueInvoices[0].count : 0;
        const overdueAmt = overdueInvoices.length > 0 ? (overdueInvoices[0].amt || 0) : 0;
        const paidAmt = paidInvoices.length > 0 ? (paidInvoices[0].amt || 0) : 0;

        res.json({ 
            leads, hotLeads, clients, overdueCount, overdueAmt, paidAmt, 
            openFollowups, activeCampaigns, activeProjects 
        });
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const getKpiTargets = async (req, res) => {
    try {
        const rows = await KpiTarget.find({ user_id: req.userId });
        const obj = {};
        rows.forEach(r => { obj[r.id] = { target: r.target }; });
        res.json(obj);
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const updateKpiTarget = async (req, res) => {
    try {
        const { target } = req.body;
        await KpiTarget.findOneAndUpdate(
            { id: req.params.id, user_id: req.userId },
            { target, updated_at: new Date() },
            { upsert: true }
        );
        res.json({ ok: true });
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const getSopDaily = async (req, res) => {
    try {
        const row = await SopDaily.findOne({ date_key: req.params.date, user_id: req.userId });
        if (!row) return res.json({ items: {}, submitted: false });
        res.json({ items: JSON.parse(row.items || '{}'), submitted: Boolean(row.submitted) });
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const updateSopDaily = async (req, res) => {
    try {
        const { items, submitted } = req.body;
        await SopDaily.findOneAndUpdate(
            { date_key: req.params.date, user_id: req.userId },
            { items: JSON.stringify(items || {}), submitted: submitted ? 1 : 0 },
            { upsert: true }
        );
        res.json({ ok: true });
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const getKvStore = async (req, res) => {
    try {
        const row = await KvStore.findOne({ key: req.params.key, user_id: req.userId });
        if (!row) return res.json(null);
        try { res.json(JSON.parse(row.value)); } catch { res.json(row.value); }
    } catch(err) { res.status(500).json({error: err.message}); }
};

export const updateKvStore = async (req, res) => {
    try {
        const value = JSON.stringify(req.body.value);
        await KvStore.findOneAndUpdate(
            { key: req.params.key, user_id: req.userId },
            { value, updated_at: new Date() },
            { upsert: true }
        );
        res.json({ ok: true });
    } catch(err) { res.status(500).json({error: err.message}); }
};
