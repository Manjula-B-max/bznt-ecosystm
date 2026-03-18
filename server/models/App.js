import mongoose from 'mongoose';

const KpiTargetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user_id: { type: String, required: true },
  target: { type: Number, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
KpiTargetSchema.index({ id: 1, user_id: 1 }, { unique: true });
export const KpiTarget = mongoose.models.KpiTarget || mongoose.model('KpiTarget', KpiTargetSchema);

const SopDailySchema = new mongoose.Schema({
  date_key: { type: String, required: true },
  user_id: { type: String, required: true },
  items: { type: String, default: '{}' },
  submitted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
SopDailySchema.index({ date_key: 1, user_id: 1 }, { unique: true });
export const SopDaily = mongoose.models.SopDaily || mongoose.model('SopDaily', SopDailySchema);

const KvStoreSchema = new mongoose.Schema({
  key: { type: String, required: true },
  user_id: { type: String, required: true },
  value: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
KvStoreSchema.index({ key: 1, user_id: 1 }, { unique: true });
export const KvStore = mongoose.models.KvStore || mongoose.model('KvStore', KvStoreSchema);
