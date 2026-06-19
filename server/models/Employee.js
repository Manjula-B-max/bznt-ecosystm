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
    employee_type: { type: String, default: 'Fresher' }, // Fresher | Experienced | Intern | Contract

    // Onboarding & Probation
    onboarding_status: { type: String, default: 'Pending Onboarding' },
    // Statuses: Pending Onboarding | Email Verified | In Progress | Pending HR Verification | Approved | Rejected
    onboarding_step: { type: Number, default: 0 },       // 0=welcome, 1=personal, 2=docs, 3=bank, 4=policy, 5=review
    onboarding_token: { type: String },
    onboarding_submitted_at: { type: Date },
    onboarding_approved_at: { type: Date },
    onboarding_remarks: { type: String },
    email_verified: { type: Boolean, default: false },
    joined_date: { type: String },
    probation_status: { type: String, default: 'Probation' },
    probation_end_date: { type: String },
    timeline: { type: Array, default: [] },

    // Personal Info (collected during onboarding)
    dob: { type: String },
    gender: { type: String },
    blood_group: { type: String },
    marital_status: { type: String },
    nationality: { type: String },
    personal_email: { type: String },
    mobile: { type: String },
    alternate_mobile: { type: String },

    // Address
    permanent_address: { type: Object, default: {} },
    current_address: { type: Object, default: {} },

    // Emergency Contacts
    emergency_contacts: { type: Array, default: [] },

    // Financial & Compliance
    salary: { type: Number, default: 0 },
    uan: { type: String },
    uan_exists: { type: Boolean, default: false },
    esi_number: { type: String },
    esi_exists: { type: Boolean, default: false },
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

    // Policy Acknowledgement
    policy_acknowledged_at: { type: Date },
    esign_confirmed: { type: Boolean, default: false },
    policies_read: { type: Array, default: [] },

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
