import express from 'express';
import authRoutes from './auth.js';
import hrRoutes from './hr.js';
import dataRoutes from './data.js';
import uploadRoutes from './upload.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hr', hrRoutes);
router.use('/upload', uploadRoutes);
router.use('/', dataRoutes); 

export default router;
