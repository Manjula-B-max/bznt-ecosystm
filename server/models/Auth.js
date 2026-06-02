import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  owner_email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  subscription: { type: String, default: 'Basic' },
  status: { type: String, default: 'Active' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

CompanySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; }
});
export const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, default: 'User' },
  password_hash: String,
  company: { type: String, default: 'My Company' },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  department: { type: String, default: 'General' },
  role: { type: String, default: 'user' },
  marketflow_access: { type: Boolean, default: false },
  projectflow_access: { type: Boolean, default: false },
  hr_access: { type: Boolean, default: false },
  admin_access: { type: Boolean, default: false },
  employee_access: { type: Boolean, default: false },
  status: { type: String, default: 'Active' }
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
