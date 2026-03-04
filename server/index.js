import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => {
    console.log(`\n🚀 Bezent API running at http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/health`);
    console.log(`   API:     http://localhost:${PORT}/api/\n`);
});
