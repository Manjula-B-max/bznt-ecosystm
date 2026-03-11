import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
    crudController,
    listKpiTargets, upsertKpiTarget,
    getSop, upsertSop,
    getKv, setKv,
    dashboardSummary
} from '../controllers/dataController.js';

const router = Router();

// All data routes require authentication
router.use(authMiddleware);

// ── Generic CRUD resources ────────────────────────────────────────────────────
const resources = [
    'leads', 'clients', 'invoices', 'projects', 'campaigns',
    'followups', 'quotations', 'contracts', 'visits', 'greetings',
    'feedback', 'workflow_rules', 'rfps'
];

const tableMap = { feedback: 'feedback_submissions', workflow_rules: 'workflow_rules' };

resources.forEach(resource => {
    const table = tableMap[resource] || resource;
    const ctrl  = crudController(table);
    router.get(`/${resource}`,      ctrl.list);
    router.post(`/${resource}`,     ctrl.create);
    router.put(`/${resource}/:id`,  ctrl.update);
    router.delete(`/${resource}/:id`, ctrl.remove);
});

// ── KPI Targets ───────────────────────────────────────────────────────────────
router.get('/kpi_targets',       listKpiTargets);
router.put('/kpi_targets/:id',   upsertKpiTarget);

// ── SOP Daily ─────────────────────────────────────────────────────────────────
router.get('/sop/:date',   getSop);
router.put('/sop/:date',   upsertSop);

// ── KV Store ──────────────────────────────────────────────────────────────────
router.get('/kv/:key',   getKv);
router.put('/kv/:key',   setKv);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard/summary', dashboardSummary);

export default router;
