import { Router } from 'express';
import { sendOtp, verifyOtp, getMe, updateMe } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/send-otp',   sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me',   authMiddleware, getMe);
router.put('/me',   authMiddleware, updateMe);

export default router;
