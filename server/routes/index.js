import express from 'express';
import authRoutes from './auth.js';
import dataRoutes from './data.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', dataRoutes); 

export default router;
