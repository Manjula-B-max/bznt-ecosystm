import { Router } from 'express';
import { authMiddleware } from '../auth.js';
import * as ctrl from '../controllers/onboardingController.js';

const router = Router();
router.use(authMiddleware);

// ── Employee-facing onboarding endpoints ─────────────────────────────────────
router.get('/status',              ctrl.getOnboardingStatus);
router.get('/draft',               ctrl.getOnboardingDraft);
router.post('/draft',              ctrl.saveOnboardingDraft);
router.post('/personal-info',      ctrl.savePersonalInfo);
router.get('/documents',           ctrl.getOnboardingDocuments);
router.post('/documents/save',     ctrl.saveDocument);
router.delete('/documents/:doc_type', ctrl.deleteDocument);
router.post('/bank-details',       ctrl.saveBankDetails);
router.post('/policy-acknowledge', ctrl.savePolicyAcknowledgement);
router.post('/submit',             ctrl.submitOnboarding);
router.get('/full-data',           ctrl.getFullOnboardingData);

// ── HR verification queue endpoints ─────────────────────────────────────────
router.get('/hr/queue',                              ctrl.getOnboardingQueue);
router.get('/hr/all',                                ctrl.getAllOnboardingEmployees);
router.get('/hr/detail/:employee_id',                ctrl.getOnboardingDetail);
router.post('/hr/detail/:employee_id/verify-doc',    ctrl.verifyDocument);
router.post('/hr/detail/:employee_id/approve',       ctrl.approveOnboarding);
router.post('/hr/detail/:employee_id/reject',        ctrl.rejectOnboarding);

export default router;
