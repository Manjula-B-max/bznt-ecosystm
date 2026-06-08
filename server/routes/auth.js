import { Router } from 'express';
import { 
    sendOtp, verifyOtp, getMe, updateMe, 
    listUsers, createUser, updateUserAccess, updateUserRole, deleteUser,
    listCompanies, createCompany, updateCompany, deleteCompany,
    listAllowedEmails, addAllowedEmail, deleteAllowedEmail
} from '../controllers/authController.js';
import { authMiddleware } from '../auth.js';

const router = Router();

router.post('/send-otp',   sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me',   authMiddleware, getMe);
router.put('/me',   authMiddleware, updateMe);

// ── Company Management Routes (Super Admin only) ─────────────────────────────
router.get('/companies', authMiddleware, listCompanies);
router.post('/companies', authMiddleware, createCompany);
router.put('/companies/:id', authMiddleware, updateCompany);
router.delete('/companies/:id', authMiddleware, deleteCompany);

// ── User Management Routes (Protected + Super Admin / Admin) ─────────────────
router.get('/users', authMiddleware, listUsers);
router.post('/users', authMiddleware, createUser);
router.put('/users/:email/access', authMiddleware, updateUserAccess);
router.put('/users/:email/role', authMiddleware, updateUserRole);
router.delete('/users/:email', authMiddleware, deleteUser);

// ── Allowed Emails Whitelist Routes (Super Admin / Admin only) ───────────────
router.get('/allowed-emails', authMiddleware, listAllowedEmails);
router.post('/allowed-emails', authMiddleware, addAllowedEmail);
router.delete('/allowed-emails/:email', authMiddleware, deleteAllowedEmail);

export default router;
