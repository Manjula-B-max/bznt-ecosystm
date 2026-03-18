import { Router } from 'express';
import { authMiddleware } from '../auth.js';
import { User } from '../models/Auth.js';
import { createCrudController } from '../controllers/crudController.js';
import {
    getDashboardSummary, getKpiTargets, updateKpiTarget,
    getSopDaily, updateSopDaily, getKvStore, updateKvStore
} from '../controllers/dashboardController.js';

const router = Router();

// 1. All data routes require valid JWT token
router.use(authMiddleware);

// 2. All data routes require MarketFlow access flag
const marketflowAccessMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });
        if (!user.marketflow_access) {
            return res.status(403).json({ error: 'MarketFlow access denied. Please request access from the admin.' });
        }
        next();
    } catch (e) {
        return res.status(500).json({ error: 'Error validating access' });
    }
};
router.use(marketflowAccessMiddleware);

// ── Generic CRUD resources ────────────────────────────────────────────────────
const resources = [
    'leads', 'clients', 'invoices', 'projects', 'campaigns',
    'followups', 'quotations', 'contracts', 'visits', 'greetings',
    'feedback', 'workflow_rules', 'rfps'
];

const tableMap = { feedback: 'feedback_submissions', workflow_rules: 'workflow_rules' };

resources.forEach(resource => {
    const table = tableMap[resource] || resource;
    const ctrl  = createCrudController(table);
    router.get(`/${resource}`,      ctrl.getAll);
    router.post(`/${resource}`,     ctrl.create);
    router.put(`/${resource}/:id`,  ctrl.update);
    router.delete(`/${resource}/:id`, ctrl.remove);
});

// ── KPI Targets ───────────────────────────────────────────────────────────────
router.get('/kpi_targets',       getKpiTargets);
router.put('/kpi_targets/:id',   updateKpiTarget);

// ── SOP Daily ─────────────────────────────────────────────────────────────────
router.get('/sop/:date',   getSopDaily);
router.put('/sop/:date',   updateSopDaily);

// ── KV Store ──────────────────────────────────────────────────────────────────
router.get('/kv/:key',   getKvStore);
router.put('/kv/:key',   updateKvStore);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard/summary', getDashboardSummary);

export default router;
