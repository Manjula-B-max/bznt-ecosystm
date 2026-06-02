import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bezent';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB at ' + MONGODB_URI);
    try {
      const UserCollection = mongoose.connection.collection('users');
      const users = await UserCollection.find({}).toArray();
      for (const u of users) {
        if (u.email && u.email !== u.email.toLowerCase()) {
          const lower = u.email.toLowerCase();
          await UserCollection.updateOne({ _id: u._id }, { $set: { email: lower } });
          console.log(`[Migration] Lowercased user email: ${u.email} -> ${lower}`);
        }
      }
      const OtpCollection = mongoose.connection.collection('otpcodes');
      const otps = await OtpCollection.find({}).toArray();
      for (const o of otps) {
        if (o.email && o.email !== o.email.toLowerCase()) {
          const lower = o.email.toLowerCase();
          await OtpCollection.updateOne({ _id: o._id }, { $set: { email: lower } });
          console.log(`[Migration] Lowercased OTP email: ${o.email} -> ${lower}`);
        }
      }
    } catch (migErr) {
      console.error('[Migration] Failed to normalize emails:', migErr.message);
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default mongoose;
