import { Router } from 'express';
import { sendOtp, verifyOtp, getMe, updateMe, listUsers, createUser, updateUserAccess, updateUserRole, deleteUser } from '../controllers/authController.js';
import { authMiddleware } from '../auth.js';

const router = Router();

router.post('/send-otp',   sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me',   authMiddleware, getMe);
router.put('/me',   authMiddleware, updateMe);

// ── User Management Routes (Protected + Super Admin / Admin) ─────────────────
router.get('/users', authMiddleware, listUsers);
router.post('/users', authMiddleware, createUser);
router.put('/users/:email/access', authMiddleware, updateUserAccess);
router.put('/users/:email/role', authMiddleware, updateUserRole);
router.delete('/users/:email', authMiddleware, deleteUser);

export default router;
