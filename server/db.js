import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bezent';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB at ' + MONGODB_URI))
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default mongoose;
