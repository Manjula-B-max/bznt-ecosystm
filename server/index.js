import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import './db.js'; // Ensure MongoDB connection starts with the server
const PORT = process.env.PORT || 3001;


const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Serve uploaded documents
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static frontend in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve the React frontend for non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Bezent API running at http://0.0.0.0:${PORT}`);
    console.log(`   Health:  http://0.0.0.0:${PORT}/health`);
    console.log(`   API:     http://0.0.0.0:${PORT}/api/\n`);
});
