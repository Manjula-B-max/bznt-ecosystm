import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },
    user_email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    employee_id: { type: String, index: true },
    name: { type: String, required: true },
    designation: { type: String },
    department: { type: String },
    role: { type: String, default: 'employee' },
    status: { type: String, default: 'Active' },
    company: { type: String },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    reporting_manager: { type: String },
    
    // Onboarding & Probation
    onboarding_status: { type: String, default: 'Pending Verification' },
    onboarding_remarks: { type: String },
    joined_date: { type: String },
    probation_status: { type: String, default: 'Probation' },
    probation_end_date: { type: String },
    timeline: { type: Array, default: [] },

    // Financial & Compliance
    salary: { type: Number, default: 0 },
    uan: { type: String },
    name_as_per_uan: { type: String },
    pf_eligible: { type: Boolean, default: false },
    eps_eligible: { type: Boolean, default: false },
    pan: { type: String },
    aadhaar: { type: String },
    bank_holder_name: { type: String },
    bank_name: { type: String },
    bank_account_number: { type: String },
    bank_ifsc: { type: String },
    bank_branch: { type: String },
    bank_account_type: { type: String },
    bank_verification_status: { type: String, default: 'Pending' },
    salary_revisions: { type: Array, default: [] },

    // Attendance & late credits
    late_credits: { type: Number, default: 40 },
    late_credit_logs: { type: Array, default: [] },

    // Resignation & Clearance
    resignation_date: { type: String },
    resignation_reason: { type: String },
    resignation_status: { type: String },
    manager_approval: { type: String },
    manager_approval_date: { type: String },
    hr_approval: { type: String },
    hr_approval_date: { type: String },
    clearance_it: { type: String, default: 'Pending' },
    clearance_finance: { type: String, default: 'Pending' },
    clearance_hr: { type: String, default: 'Pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'hr_employees' });

EmployeeSchema.set('toJSON', {
    transform: (doc, ret) => { delete ret._id; delete ret.__v; }
});

export const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
