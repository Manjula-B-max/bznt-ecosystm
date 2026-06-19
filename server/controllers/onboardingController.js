import { User } from '../models/Auth.js';
import { Employee } from '../models/Employee.js';
import { getModel } from '../models/Generic.js';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ── Helper: get employee record for current user ────────────────────────────
const getEmployeeForUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const employee = await Employee.findOne({ user_email: user.email.toLowerCase() });
    return { user, employee };
};

// ── GET /onboarding/status ──────────────────────────────────────────────────
export const getOnboardingStatus = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) {
            return res.json({
                onboarding_status: 'Not Found',
                onboarding_step: 0,
                employee_type: 'Fresher',
                email_verified: false,
                employee: null
            });
        }
        res.json({
            onboarding_status: employee.onboarding_status,
            onboarding_step: employee.onboarding_step || 0,
            employee_type: employee.employee_type || 'Fresher',
            email_verified: employee.email_verified || false,
            employee: {
                id: employee.id,
                name: employee.name,
                employee_id: employee.employee_id,
                designation: employee.designation,
                department: employee.department,
                company: employee.company,
                reporting_manager: employee.reporting_manager,
                user_email: employee.user_email,
                employee_type: employee.employee_type || 'Fresher',
                onboarding_status: employee.onboarding_status,
                onboarding_step: employee.onboarding_step || 0,
                email_verified: employee.email_verified || false
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── GET /onboarding/draft ───────────────────────────────────────────────────
export const getOnboardingDraft = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.json({ draft: null });

        const OnboardingDraft = getModel('employee_onboarding');
        const draft = await OnboardingDraft.findOne({ user_email: user.email.toLowerCase() });
        res.json({ draft: draft ? draft.draft_data : null });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/draft ──────────────────────────────────────────────────
export const saveOnboardingDraft = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee record not found' });

        const OnboardingDraft = getModel('employee_onboarding');
        await OnboardingDraft.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    id: uid(),
                    user_id: user.id,
                    employee_id: employee.employee_id,
                    user_email: user.email.toLowerCase(),
                    draft_data: req.body.draft_data || {},
                    step: req.body.step || 1
                }
            },
            { upsert: true, new: true }
        );

        // Update onboarding_step on the employee record
        if (req.body.step) {
            await Employee.findOneAndUpdate(
                { user_email: user.email.toLowerCase() },
                { $set: { onboarding_step: req.body.step } }
            );
        }

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/personal-info ─────────────────────────────────────────
export const savePersonalInfo = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee record not found' });

        const {
            dob, gender, blood_group, marital_status, nationality,
            personal_email, mobile, alternate_mobile,
            permanent_address, current_address,
            emergency_contacts
        } = req.body;

        await Employee.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    dob, gender, blood_group, marital_status, nationality,
                    personal_email, mobile, alternate_mobile,
                    permanent_address: permanent_address || {},
                    current_address: current_address || {},
                    emergency_contacts: emergency_contacts || [],
                    onboarding_step: Math.max(employee.onboarding_step || 0, 1),
                    onboarding_status: employee.onboarding_status === 'Pending Onboarding'
                        ? 'In Progress'
                        : employee.onboarding_status
                }
            }
        );

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── GET /onboarding/documents ───────────────────────────────────────────────
export const getOnboardingDocuments = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.json([]);

        const DocModel = getModel('employee_documents');
        const docs = await DocModel.find({ user_email: user.email.toLowerCase() }).lean();
        res.json(docs.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/documents/save ────────────────────────────────────────
// Saves document metadata (file_url comes from the upload endpoint)
export const saveDocument = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const { doc_type, doc_label, file_url, file_name } = req.body;
        if (!doc_type || !file_url) return res.status(400).json({ error: 'doc_type and file_url required' });

        const DocModel = getModel('employee_documents');
        await DocModel.findOneAndUpdate(
            { user_email: user.email.toLowerCase(), doc_type },
            {
                $set: {
                    id: uid(),
                    user_id: user.id,
                    user_email: user.email.toLowerCase(),
                    employee_id: employee.employee_id,
                    doc_type,
                    doc_label: doc_label || doc_type,
                    file_url,
                    file_name: file_name || '',
                    status: 'Pending',
                    uploaded_at: new Date()
                }
            },
            { upsert: true, new: true }
        );

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── DELETE /onboarding/documents/:doc_type ──────────────────────────────────
export const deleteDocument = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const DocModel = getModel('employee_documents');
        await DocModel.deleteOne({ user_email: user.email.toLowerCase(), doc_type: req.params.doc_type });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/bank-details ───────────────────────────────────────────
export const saveBankDetails = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const {
            bank_holder_name, bank_name, bank_account_number,
            bank_ifsc, bank_branch, bank_account_type,
            uan_exists, uan, esi_exists, esi_number,
            cheque_file_url
        } = req.body;

        await Employee.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    bank_holder_name,
                    bank_name,
                    bank_account_number,
                    bank_ifsc,
                    bank_branch,
                    bank_account_type: bank_account_type || 'Savings',
                    uan_exists: !!uan_exists,
                    uan: uan || '',
                    esi_exists: !!esi_exists,
                    esi_number: esi_number || '',
                    onboarding_step: Math.max(employee.onboarding_step || 0, 3)
                }
            }
        );

        // Save cheque doc if provided
        if (cheque_file_url) {
            const DocModel = getModel('employee_documents');
            await DocModel.findOneAndUpdate(
                { user_email: user.email.toLowerCase(), doc_type: 'cancelled_cheque' },
                {
                    $set: {
                        id: uid(),
                        user_id: user.id,
                        user_email: user.email.toLowerCase(),
                        employee_id: employee.employee_id,
                        doc_type: 'cancelled_cheque',
                        doc_label: 'Cancelled / Crossed Cheque',
                        file_url: cheque_file_url,
                        status: 'Pending',
                        uploaded_at: new Date()
                    }
                },
                { upsert: true, new: true }
            );
        }

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/policy-acknowledge ─────────────────────────────────────
export const savePolicyAcknowledgement = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const { acknowledgements, policies_read, esign_confirmed, esign_timestamp } = req.body;

        if (!esign_confirmed) {
            return res.status(400).json({ error: 'Electronic signature confirmation required.' });
        }

        const AckModel = getModel('employee_policy_acknowledgements');
        await AckModel.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    id: uid(),
                    user_id: user.id,
                    user_email: user.email.toLowerCase(),
                    employee_id: employee.employee_id,
                    employee_name: employee.name,
                    policies_read: policies_read || [],
                    acknowledgements: acknowledgements || {},
                    esign_confirmed: true,
                    esign_timestamp: esign_timestamp || new Date().toISOString(),
                    created_at: new Date()
                }
            },
            { upsert: true, new: true }
        );

        await Employee.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    policies_read: policies_read || [],
                    policy_acknowledged_at: new Date(),
                    esign_confirmed: true,
                    onboarding_step: Math.max(employee.onboarding_step || 0, 4)
                }
            }
        );

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /onboarding/submit ─────────────────────────────────────────────────
export const submitOnboarding = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        if (!employee.esign_confirmed && !req.body.force) {
            return res.status(400).json({ error: 'Please complete all steps including policy acknowledgement.' });
        }

        await Employee.findOneAndUpdate(
            { user_email: user.email.toLowerCase() },
            {
                $set: {
                    onboarding_status: 'Pending HR Verification',
                    onboarding_step: 5,
                    onboarding_submitted_at: new Date(),
                    status: 'Pending Verification'
                }
            }
        );

        // Log the submission
        const LogModel = getModel('employee_verification_logs');
        await LogModel.create({
            id: uid(),
            user_id: user.id,
            employee_id: employee.employee_id,
            action: 'submitted',
            remarks: 'Employee submitted onboarding for HR verification',
            actor_email: user.email,
            timestamp: new Date()
        });

        res.json({ ok: true, message: 'Onboarding submitted successfully. Pending HR verification.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── GET /onboarding/full-data ───────────────────────────────────────────────
// Returns complete onboarding submission (used by review step and HR portal)
export const getFullOnboardingData = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const DocModel = getModel('employee_documents');
        const AckModel = getModel('employee_policy_acknowledgements');
        const DraftModel = getModel('employee_onboarding');

        const [docs, ack, draft] = await Promise.all([
            DocModel.find({ user_email: employee.user_email.toLowerCase() }).lean(),
            AckModel.findOne({ user_email: employee.user_email.toLowerCase() }).lean(),
            DraftModel.findOne({ user_email: employee.user_email.toLowerCase() }).lean()
        ]);

        res.json({
            employee: employee.toJSON ? employee.toJSON() : employee,
            documents: docs.map(d => { delete d._id; delete d.__v; return d; }),
            policy_acknowledgement: ack ? (() => { delete ack._id; delete ack.__v; return ack; })() : null,
            draft: draft ? draft.draft_data : null
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// HR VERIFICATION QUEUE HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

// ── GET /hr/onboarding/queue ────────────────────────────────────────────────
export const getOnboardingQueue = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        const filter = { onboarding_status: 'Pending HR Verification' };
        if (user.company_id) filter.company_id = user.company_id;
        else if (user.company) filter.company = user.company;

        const employees = await Employee.find(filter).sort({ onboarding_submitted_at: 1 }).lean();

        const DocModel = getModel('employee_documents');
        const result = [];
        for (const emp of employees) {
            const docs = await DocModel.find({ user_email: emp.user_email.toLowerCase() }).lean();
            result.push({
                ...emp,
                documents: docs.map(d => { delete d._id; delete d.__v; return d; })
            });
        }

        res.json(result.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── GET /hr/onboarding/:employee_id ─────────────────────────────────────────
export const getOnboardingDetail = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const filter = { employee_id: req.params.employee_id };
        if (user) {
            if (user.company_id) filter.company_id = user.company_id;
            else if (user.company) filter.company = user.company;
        }
        const employee = await Employee.findOne(filter).lean();
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const DocModel = getModel('employee_documents');
        const AckModel = getModel('employee_policy_acknowledgements');
        const LogModel = getModel('employee_verification_logs');

        const [docs, ack, logs] = await Promise.all([
            DocModel.find({ user_email: employee.user_email.toLowerCase() }).lean(),
            AckModel.findOne({ user_email: employee.user_email.toLowerCase() }).lean(),
            LogModel.find({ employee_id: employee.employee_id }).sort({ timestamp: -1 }).lean()
        ]);

        delete employee._id; delete employee.__v;
        res.json({
            employee,
            documents: docs.map(d => { delete d._id; delete d.__v; return d; }),
            policy_acknowledgement: ack ? (() => { delete ack._id; delete ack.__v; return ack; })() : null,
            verification_logs: logs.map(l => { delete l._id; delete l.__v; return l; })
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /hr/onboarding/:employee_id/verify-doc ─────────────────────────────
export const verifyDocument = async (req, res) => {
    try {
        const actorUser = await User.findById(req.userId);
        const { doc_type, action, remarks } = req.body; // action: verified | rejected | re-upload

        const filter = { employee_id: req.params.employee_id };
        if (actorUser) {
            if (actorUser.company_id) filter.company_id = actorUser.company_id;
            else if (actorUser.company) filter.company = actorUser.company;
        }
        const employee = await Employee.findOne(filter);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const DocModel = getModel('employee_documents');
        const LogModel = getModel('employee_verification_logs');

        await DocModel.findOneAndUpdate(
            { user_email: employee.user_email.toLowerCase(), doc_type },
            {
                $set: {
                    status: action === 'verified' ? 'Verified' : action === 'rejected' ? 'Rejected' : 'Re-upload Requested',
                    remarks: remarks || '',
                    verified_at: new Date(),
                    verified_by: actorUser?.email || 'HR'
                }
            }
        );

        await LogModel.create({
            id: uid(),
            user_id: actorUser?.id || '',
            employee_id: employee.employee_id,
            action: `doc_${action}`,
            field: doc_type,
            remarks: remarks || '',
            actor_email: actorUser?.email || 'HR',
            timestamp: new Date()
        });

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /hr/onboarding/:employee_id/approve ────────────────────────────────
export const approveOnboarding = async (req, res) => {
    try {
        const actorUser = await User.findById(req.userId);
        const { remarks } = req.body;

        const filter = { employee_id: req.params.employee_id };
        if (actorUser) {
            if (actorUser.company_id) filter.company_id = actorUser.company_id;
            else if (actorUser.company) filter.company = actorUser.company;
        }

        const employee = await Employee.findOneAndUpdate(
            filter,
            {
                $set: {
                    onboarding_status: 'Approved',
                    status: 'Active',
                    onboarding_approved_at: new Date(),
                    onboarding_remarks: remarks || 'All documents verified. Onboarding complete.'
                }
            },
            { new: true }
        );

        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const LogModel = getModel('employee_verification_logs');
        await LogModel.create({
            id: uid(),
            user_id: actorUser?.id || '',
            employee_id: employee.employee_id,
            action: 'approved',
            remarks: remarks || 'Onboarding approved',
            actor_email: actorUser?.email || 'HR',
            timestamp: new Date()
        });

        res.json({ ok: true, message: 'Employee onboarding approved. Portal access granted.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── POST /hr/onboarding/:employee_id/reject ──────────────────────────────────
export const rejectOnboarding = async (req, res) => {
    try {
        const actorUser = await User.findById(req.userId);
        const { remarks } = req.body;

        const filter = { employee_id: req.params.employee_id };
        if (actorUser) {
            if (actorUser.company_id) filter.company_id = actorUser.company_id;
            else if (actorUser.company) filter.company = actorUser.company;
        }

        const employee = await Employee.findOneAndUpdate(
            filter,
            {
                $set: {
                    onboarding_status: 'In Progress',
                    onboarding_remarks: remarks || 'Please review and resubmit.'
                }
            },
            { new: true }
        );

        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const LogModel = getModel('employee_verification_logs');
        await LogModel.create({
            id: uid(),
            user_id: actorUser?.id || '',
            employee_id: employee.employee_id,
            action: 'rejected',
            remarks: remarks || 'Onboarding rejected — re-submission required',
            actor_email: actorUser?.email || 'HR',
            timestamp: new Date()
        });

        res.json({ ok: true, message: 'Onboarding returned to employee for correction.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// ── GET /hr/onboarding/all-employees ────────────────────────────────────────
export const getAllOnboardingEmployees = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        const filter = {};
        if (user.company_id) filter.company_id = user.company_id;
        else if (user.company && user.role !== 'super_admin') filter.company = user.company;

        const employees = await Employee.find(filter)
            .sort({ created_at: -1 })
            .lean();

        res.json(employees.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
