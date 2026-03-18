import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, default: 'User' },
  password_hash: String,
  company: { type: String, default: 'My Company' },
  role: { type: String, default: 'user' },
  marketflow_access: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; }
});
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

const OtpSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  code: { type: String, required: true },
  expires_at: { type: Number, required: true }
});
export const OtpCode = mongoose.models.OtpCode || mongoose.model('OtpCode', OtpSchema);

const AllowedEmailSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true }
});
export const AllowedEmail = mongoose.models.AllowedEmail || mongoose.model('AllowedEmail', AllowedEmailSchema);
