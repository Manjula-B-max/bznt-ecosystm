import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Define storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { resource, id } = req.params;
        const dest = path.join(__dirname, '../../uploads', resource || 'general', id || 'unknown');
        
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ storage });

router.post('/:resource/:id', upload.array('documents'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const { resource, id } = req.params;
        const paths = req.files.map(f => `/uploads/${resource}/${id}/${f.filename}`);
        
        res.json({ success: true, files: paths });
    } catch (e) {
        console.error('Upload Error:', e);
        res.status(500).json({ error: 'Upload failed' });
    }
});

export default router;
