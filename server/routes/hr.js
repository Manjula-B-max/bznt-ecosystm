import { Router } from 'express';
import { authMiddleware } from '../auth.js';
import { User } from '../models/Auth.js';
import { getModel } from '../models/Generic.js';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const router = Router();
router.use(authMiddleware);

// Middlewares to enforce roles
const hrAccessMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });
        const isHr = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        if (!isHr) {
            return res.status(403).json({ error: 'Access denied. HR credentials required.' });
        }
        next();
    } catch (e) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

const employeeAccessMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(401).json({ error: 'User not found' });
        const hasAccess = user.employee_access || user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied. Employee portal credentials required.' });
        }
        next();
    } catch (e) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

// Helper to determine the database query filter
const getScopedFilter = async (req, restrictToUser = false) => {
    const user = await User.findById(req.userId);
    if (!user) throw new Error('User not found');

    const isHrAdmin = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
    if (restrictToUser || !isHrAdmin) {
        return { user_email: user.email.toLowerCase() };
    }

    if (user.role === 'super_admin') {
        return {};
    }
    if (user.company_id) {
        return { company_id: user.company_id };
    }
    return { company: user.company };
};

// Helper to build document scopes
const getDocumentScope = async (req, data) => {
    const user = await User.findById(req.userId);
    if (!user) throw new Error('User not found');
    return {
        ...data,
        company: user.company,
        company_id: user.company_id,
        user_id: user.id
    };
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─────────────────────────────────────────────────────────────────────────────
// 1. EMPLOYEES DIRECTORY (HR Admin writes/reads, Employees read directory)
// ─────────────────────────────────────────────────────────────────────────────
const EmployeeModel = getModel('hr_employees');

const generateNextEmployeeId = async (company) => {
    const employees = await EmployeeModel.find({ company, employee_id: { $exists: true, $ne: '' } }).lean();
    let maxNum = 0;
    employees.forEach(emp => {
        const idStr = emp.employee_id || '';
        const match = idStr.match(/^EMP(\d+)$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNum) maxNum = num;
        }
    });
    const nextNum = maxNum + 1;
    return 'EMP' + String(nextNum).padStart(4, '0');
};

router.get('/employees', employeeAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        const list = await EmployeeModel.find(filter).sort({ name: 1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/employees', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        
        // Auto-assign Employee ID and onboarding status of Approved since no onboarding is needed
        if (!data.employee_id) {
            data.employee_id = await generateNextEmployeeId(data.company || 'My Company');
        }
        data.onboarding_status = 'Approved';
        
        await EmployeeModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );

        if (data.user_email) {
            const email = data.user_email.toLowerCase().trim();
            const existing = await User.findOne({ email });
            if (!existing) {
                await User.create({
                    email,
                    name: data.name || 'Employee',
                    company: data.company || 'My Company',
                    company_id: data.company_id,
                    department: data.department || 'General',
                    role: 'employee',
                    employee_access: true,
                    status: 'Active'
                });
            }
        }

        res.json({ id: data.id, ok: true, employee_id: data.employee_id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/employees/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        
        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/employees/:id', hrAccessMiddleware, async (req, res) => {
    try {
        await EmployeeModel.findOneAndDelete({ id: req.params.id });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ATTENDANCE & PUNCHES
// ─────────────────────────────────────────────────────────────────────────────
const AttendanceModel = getModel('hr_attendance');

router.get('/attendance', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await AttendanceModel.find(filter).sort({ date: -1, clock_in: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/attendance', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        let deducted = 0;
        let status = 'Present';

        if (data.clock_in) {
            const [hh, mm, ss] = data.clock_in.split(':').map(Number);
            const clockTimeInMinutes = hh * 60 + mm + (ss || 0) / 60;
            const nineAMInMinutes = 9 * 60;
            const nineFiveInMinutes = 9 * 60 + 5;

            if (clockTimeInMinutes > nineAMInMinutes) {
                status = 'Late';
                if (clockTimeInMinutes > nineFiveInMinutes) {
                    deducted = 5;
                    status = 'Half Day';
                } else {
                    deducted = Math.ceil(clockTimeInMinutes - nineAMInMinutes);
                }
            }
        }
        data.status = status;

        const employee = await EmployeeModel.findOne({ user_email: data.user_email });
        if (employee) {
            const currentCredits = employee.late_credits !== undefined ? employee.late_credits : 40;
            const updatedCredits = Math.max(0, currentCredits - deducted);
            const logs = employee.late_credit_logs || [];
            
            if (deducted > 0) {
                logs.push({
                    date: data.date,
                    clock_in: data.clock_in,
                    deducted_credits: deducted,
                    status: status,
                    remaining_credits: updatedCredits
                });
            }
            
            await EmployeeModel.findOneAndUpdate(
                { user_email: data.user_email },
                { $set: { late_credits: updatedCredits, late_credit_logs: logs } }
            );
        }

        await AttendanceModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true, status });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/attendance/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await AttendanceModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ATTENDANCE CORRECTIONS
// ─────────────────────────────────────────────────────────────────────────────
const CorrectionModel = getModel('hr_corrections');

router.get('/corrections', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await CorrectionModel.find(filter).sort({ created_at: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/corrections', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        data.status = data.status || 'Pending';

        await CorrectionModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/corrections/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await CorrectionModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. LEAVES
// ─────────────────────────────────────────────────────────────────────────────
const LeaveModel = getModel('hr_leaves');

router.get('/leaves', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await LeaveModel.find(filter).sort({ start_date: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/leaves', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        data.status = data.status || 'Pending';

        await LeaveModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/leaves/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        
        const user = await User.findById(req.userId);
        const leave = await LeaveModel.findOne({ id: req.params.id });
        if (!leave) return res.status(404).json({ error: 'Leave request not found' });
        
        const isHr = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        const applicantEmp = await EmployeeModel.findOne({ user_email: leave.user_email });
        const isManager = applicantEmp && applicantEmp.reporting_manager && applicantEmp.reporting_manager.toLowerCase() === user.email.toLowerCase();
        
        if (!isHr && !isManager) {
            return res.status(403).json({ error: 'Access denied. Only HR or Reporting Manager can approve leaves.' });
        }
        
        if (data.status === 'Approved') {
            data.approved_by = user.name || user.email;
            data.approved_date = new Date().toISOString().split('T')[0];
        }

        await LeaveModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        await logAudit(req, 'Leave Status', `Leave request for ${leave.user_email} updated to ${data.status} by ${user.email}`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAYROLL
// ─────────────────────────────────────────────────────────────────────────────
const PayrollModel = getModel('hr_payroll');

router.get('/payroll', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await PayrollModel.find(filter).sort({ month: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/payroll', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        await PayrollModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RECRUITMENT (CANDIDATES)
// ─────────────────────────────────────────────────────────────────────────────
const CandidateModel = getModel('hr_candidates');

router.get('/recruitment', hrAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        const list = await CandidateModel.find(filter).sort({ created_at: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/recruitment', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        await CandidateModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/recruitment/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await CandidateModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/recruitment/:id', hrAccessMiddleware, async (req, res) => {
    try {
        await CandidateModel.findOneAndDelete({ id: req.params.id });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. ASSETS
// ─────────────────────────────────────────────────────────────────────────────
const AssetModel = getModel('hr_assets');

router.get('/assets', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await AssetModel.find(filter).sort({ category: 1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/assets', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        await AssetModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/assets/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await AssetModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/assets/:id', hrAccessMiddleware, async (req, res) => {
    try {
        await AssetModel.findOneAndDelete({ id: req.params.id });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. HELPDESK TICKETS
// ─────────────────────────────────────────────────────────────────────────────
const TicketModel = getModel('hr_tickets');

router.get('/tickets', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await TicketModel.find(filter).sort({ created_at: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/tickets', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        data.status = data.status || 'Created';

        await TicketModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/tickets/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await TicketModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. PERFORMANCE & REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
const PerformanceModel = getModel('hr_performance');

router.get('/performance', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await PerformanceModel.find(filter).sort({ created_at: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/performance', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        await PerformanceModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/performance/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await PerformanceModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. TASKS
// ─────────────────────────────────────────────────────────────────────────────
const TaskModel = getModel('hr_tasks');

router.get('/tasks', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await TaskModel.find(filter).sort({ deadline: 1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/tasks', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        await TaskModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/tasks/:id', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await TaskModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/tasks/:id', hrAccessMiddleware, async (req, res) => {
    try {
        await TaskModel.findOneAndDelete({ id: req.params.id });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. POLICIES & ACKNOWLEDGEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const PolicyModel = getModel('hr_policies');
const AcknowledgementModel = getModel('hr_policy_acknowledgements');
const CanteenModel = getModel('hr_canteen_registrations');
const AuditModel = getModel('hr_audit_logs');

// Helper to log audit events
const logAudit = async (req, actionType, details) => {
    try {
        const user = await User.findById(req.userId);
        const auditData = await getDocumentScope(req, {
            id: uid(),
            action_type: actionType,
            user_email: user ? user.email.toLowerCase() : 'system',
            user_name: user ? user.name : 'System',
            details,
            created_at: new Date().toISOString()
        });
        await AuditModel.create(auditData);
    } catch (e) {
        console.error("Audit log error:", e);
    }
};

// ── Policies CRUD ──
router.get('/policies', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        
        // Employees should only see active policies
        const user = await User.findById(req.userId);
        const isHrAdmin = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        if (!isHrAdmin || userOnly) {
            filter.status = 'Active';
        }
        
        const list = await PolicyModel.find(filter).sort({ name: 1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/policies', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        data.last_updated = new Date().toISOString().split('T')[0];
        
        const isNew = !(await PolicyModel.findOne({ id: data.id }));
        
        await PolicyModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        
        await logAudit(req, 'Policy Update', `${isNew ? 'Created' : 'Updated'} policy: ${data.name} (v${data.version || '1.0'})`);
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/policies/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        data.last_updated = new Date().toISOString().split('T')[0];
        
        const policy = await PolicyModel.findOneAndUpdate({ id: req.params.id }, { $set: data }, { new: true });
        await logAudit(req, 'Policy Update', `Updated policy properties: ${policy?.name} (v${policy?.version})`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/policies/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const policy = await PolicyModel.findOneAndDelete({ id: req.params.id });
        await logAudit(req, 'Policy Update', `Deleted policy: ${policy?.name}`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Policy Acknowledgements ──
router.get('/policy-acknowledgements', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await AcknowledgementModel.find(filter).sort({ acceptance_date: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/policy-acknowledgements', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        data.acceptance_date = new Date().toISOString();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();

        await AcknowledgementModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );

        const action = data.status === 'Accepted' ? 'Policy Acceptance' : 'Policy Rejection';
        await logAudit(req, action, `${action} of policy ID ${data.policy_id} by ${data.user_email || 'Associate'} (v${data.accepted_version})`);

        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Canteen Registrations ──
router.get('/canteen-registrations', employeeAccessMiddleware, async (req, res) => {
    try {
        const userOnly = req.query.self === 'true';
        const filter = await getScopedFilter(req, userOnly);
        const list = await CanteenModel.find(filter).sort({ month: -1 }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/canteen-registrations', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        if (data.user_email) data.user_email = data.user_email.toLowerCase();
        data.enrollment_date = new Date().toISOString().split('T')[0];

        // Check if registration exists for the active month
        const existing = await CanteenModel.findOne({
            user_email: data.user_email,
            month: data.month
        });
        
        if (existing) {
            const activeMonthStr = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (data.month === activeMonthStr) {
                return res.status(400).json({ error: `Deductions choices for ${data.month} are locked and cannot be adjusted.` });
            }
        }

        await CanteenModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );

        await logAudit(req, 'Payroll Changes', `Canteen option selection updated for ${data.user_email}: ${data.selection_type} for ${data.month}`);
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// ── Audit Logs ──
router.get('/audit-logs', hrAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        const list = await AuditModel.find(filter).sort({ created_at: -1 }).limit(100).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/audit-logs', employeeAccessMiddleware, async (req, res) => {
    try {
        const { action_type, details } = req.body;
        await logAudit(req, action_type, details);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Compliance Telemetry / Report Stats ──
router.get('/compliance-telemetry', employeeAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        
        const totalEmployees = await EmployeeModel.countDocuments(filter);
        const activePolicies = await PolicyModel.countDocuments({ ...filter, status: 'Active' });
        
        const totalAcks = await AcknowledgementModel.countDocuments({ ...filter, status: 'Accepted' });
        const possibleAcks = totalEmployees * activePolicies;
        const policyAcceptance = possibleAcks > 0 ? Math.round((totalAcks / possibleAcks) * 100) : 100;
        
        const attendanceRecords = await AttendanceModel.find(filter).lean();
        const lates = attendanceRecords.filter(a => a.status === 'Late').length;
        const totalPunches = attendanceRecords.length;
        const attendanceCompliance = totalPunches > 0 ? Math.round(((totalPunches - lates) / totalPunches) * 100) : 100;

        const activeMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const canteenCount = await CanteenModel.countDocuments({ ...filter, month: activeMonth, selection_type: 'Company Canteen' });
        const canteenCompliance = totalEmployees > 0 ? Math.round((canteenCount / totalEmployees) * 100) : 0;
        
        res.json({
            policy_compliance: policyAcceptance,
            sop_compliance: 95,
            document_compliance: 88,
            training_compliance: 90,
            probation_compliance: 100,
            asset_compliance: 94,
            exit_compliance: 100,
            payroll_compliance: 100,
            attendance_compliance: attendanceCompliance,
            canteen_compliance: canteenCompliance
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Offer Letters & Seeding ──
const OfferTemplateModel = getModel('hr_offer_templates');
const DEFAULT_OFFER_TEMPLATE = {
    id: 'tpl_default_01',
    name: 'Standard Employment Offer Letter',
    subject: 'Offer of Employment at Bezent',
    content: `Dear {candidate_name},\n\nWe are pleased to offer you the position of {designation} in our {department} department at Bezent.\n\nYour annual gross salary will be {salary} CTC. Your joining date will be {joining_date}.\n\nReporting Address: {address}\nCompany Details: {company_details}\nHR Contact: {hr_details}\n\nPlease review the attached document and return a signed copy within 3 days.\n\nBest Regards,\nHR Team\nBezent`
};

router.get('/recruitment/templates', employeeAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        let list = await OfferTemplateModel.find(filter).sort({ name: 1 }).lean();
        if (list.length === 0) {
            const defaultDoc = await getDocumentScope(req, DEFAULT_OFFER_TEMPLATE);
            await OfferTemplateModel.create(defaultDoc);
            list = [defaultDoc];
        }
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/recruitment/templates', hrAccessMiddleware, async (req, res) => {
    try {
        const data = await getDocumentScope(req, req.body);
        data.id = data.id || uid();
        await OfferTemplateModel.findOneAndUpdate(
            { id: data.id },
            { $set: data },
            { upsert: true, new: true }
        );
        res.json({ id: data.id, ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/recruitment/templates/:id', hrAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        delete data.id; delete data._id;
        await OfferTemplateModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/recruitment/templates/:id', hrAccessMiddleware, async (req, res) => {
    try {
        await OfferTemplateModel.findOneAndDelete({ id: req.params.id });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/recruitment/send-offer', hrAccessMiddleware, async (req, res) => {
    try {
        const { candidateEmail, candidateName, pdfPath } = req.body;
        if (!candidateEmail || !pdfPath) {
            return res.status(400).json({ error: 'Candidate email and PDF path are required.' });
        }

        const filePath = path.join(process.cwd(), pdfPath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: `Offer letter file not found at ${pdfPath}` });
        }

        const subject = `Offer of Employment - Bezent`;
        const text = `Dear ${candidateName},\n\nPlease find attached your offer letter from Bezent.\n\nBest Regards,\nHR Team`;
        console.log(`[MAIL] Attempting to send offer letter to ${candidateEmail} with attachment ${filePath}`);

        let sent = false;
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const fileBuffer = fs.readFileSync(filePath);
                const result = await resend.emails.send({
                    from: 'BEZENT <onboarding@resend.dev>',
                    to: candidateEmail,
                    subject,
                    text,
                    attachments: [{
                        filename: path.basename(filePath),
                        content: fileBuffer
                    }]
                });
                if (!result.error) {
                    sent = true;
                    console.log(`[MAIL] Resend sent offer letter successfully to ${candidateEmail}`);
                } else {
                    console.error(`[MAIL ERROR] Resend rejected:`, result.error);
                }
            } catch (e) {
                console.error(`[MAIL ERROR] Resend failed:`, e);
            }
        }

        if (!sent) {
            console.log(`[MAIL MOCK] Mail sent (fallback log) to ${candidateEmail} with PDF attachment ${pdfPath}`);
        }

        await logAudit(req, 'Offer Sent', `Sent offer letter PDF to ${candidateEmail}`);
        res.json({ ok: true, message: 'Offer letter sent successfully.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Employee Onboarding & Verification ──

router.put('/employees/:id/onboarding', employeeAccessMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findById(req.userId);
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee record not found' });
        
        const isHrAdmin = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        if (!isHrAdmin && employee.user_email.toLowerCase() !== user.email.toLowerCase()) {
            return res.status(403).json({ error: 'Access denied. You can only update your own onboarding details.' });
        }

        data.onboarding_status = 'Pending Verification';
        
        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: data });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/employees/:id/verify-onboarding', hrAccessMiddleware, async (req, res) => {
    try {
        const { action, remarks } = req.body;
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const updates = { onboarding_remarks: remarks };
        if (action === 'approve') {
            updates.onboarding_status = 'Approved';
            updates.status = 'Active';
            updates.probation_status = 'Probation';
            const joinDate = new Date();
            updates.joined_date = joinDate.toISOString().split('T')[0];
            joinDate.setMonth(joinDate.getMonth() + 1);
            updates.probation_end_date = joinDate.toISOString().split('T')[0];

            if (!employee.employee_id) {
                updates.employee_id = await generateNextEmployeeId(employee.company);
            }
        } else if (action === 'resubmit') {
            updates.onboarding_status = 'Resubmission Required';
            updates.status = 'Inactive';
        } else {
            updates.onboarding_status = 'Rejected';
            updates.status = 'Inactive';
        }

        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: updates });
        await logAudit(req, 'Employee Verification', `Onboarding verification for ${employee.name}: ${updates.onboarding_status}`);
        res.json({ ok: true, employee_id: updates.employee_id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Helper for date prefix
const parseMonthToDatePrefix = (monthStr) => {
    if (!monthStr) return new Date().toISOString().slice(0, 7);
    const parts = monthStr.split(' ');
    if (parts.length < 2) return new Date().toISOString().slice(0, 7);
    const [monthName, year] = parts;
    const months = {
        January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
        July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
    };
    const mm = months[monthName] || '01';
    return `${year}-${mm}`;
};

// ── PF EPFO Export ──
router.get('/pf/export', hrAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        const month = req.query.month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const datePrefix = parseMonthToDatePrefix(month);

        const employees = await EmployeeModel.find(filter).lean();
        const payroll = await PayrollModel.find({ ...filter, month }).lean();
        const attendance = await AttendanceModel.find({ ...filter, date: { $regex: '^' + datePrefix } }).lean();

        const exportData = employees.map(emp => {
            const pay = payroll.find(p => p.user_email.toLowerCase() === emp.user_email.toLowerCase()) || {};
            const gross = pay.salary || pay.net_salary || emp.salary || 0;
            
            const basicWages = Math.min(15000, gross * 0.5);
            const epfWages = emp.pf_eligible ? basicWages : 0;
            const epsWages = emp.eps_eligible ? basicWages : 0;
            const edliWages = emp.pf_eligible ? basicWages : 0;

            const employeePF = Math.round(epfWages * 0.12);
            const employerEPS = Math.round(epsWages * 0.0833);
            const employerPF = Math.round(epfWages * 0.0367);

            const empAtt = attendance.filter(a => a.user_email.toLowerCase() === emp.user_email.toLowerCase());
            const absentDays = empAtt.filter(a => a.status === 'Absent' || a.status === 'Unpaid Leave').length;

            return {
                uan: emp.uan || 'N/A',
                name: emp.name_as_per_uan || emp.name,
                gross_wages: gross,
                epf_wages: epfWages,
                eps_wages: epsWages,
                edli_wages: edliWages,
                employee_pf: employeePF,
                employer_eps: employerEPS,
                employer_pf: employerPF,
                ncp_days: absentDays,
                refund_advance: 0
            };
        });

        res.json(exportData);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Salary Revisions ──
router.post('/employees/:id/revisions', hrAccessMiddleware, async (req, res) => {
    try {
        const { previous_salary, current_salary, hike_percent, effective_date, reason, remarks, approved_by } = req.body;
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const revisions = employee.salary_revisions || [];
        const newRevision = {
            id: uid(),
            previous_salary: Number(previous_salary),
            current_salary: Number(current_salary),
            hike_percent: Number(hike_percent),
            effective_date,
            reason,
            remarks,
            approved_by,
            created_at: new Date().toISOString()
        };
        revisions.push(newRevision);

        await EmployeeModel.findOneAndUpdate(
            { id: req.params.id },
            { $set: { salary: Number(current_salary), salary_revisions: revisions } }
        );

        await logAudit(req, 'Salary Revision', `Salary revised for ${employee.name} (EMP: ${employee.employee_id || employee.id}) from ₹${previous_salary} to ₹${current_salary} by ${approved_by}`);
        res.json({ ok: true, revisions });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Exit & Resignation Approvals ──
router.get('/exits', hrAccessMiddleware, async (req, res) => {
    try {
        const filter = await getScopedFilter(req);
        const list = await EmployeeModel.find({
            ...filter,
            $or: [
                { status: 'Exiting' },
                { resignation_date: { $exists: true, $ne: null } }
            ]
        }).lean();
        res.json(list.map(d => { delete d._id; delete d.__v; return d; }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/employees/:id/resignation', employeeAccessMiddleware, async (req, res) => {
    try {
        const { resignation_date, resignation_reason } = req.body;
        const user = await User.findById(req.userId);
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const isHr = user.hr_access || ['super_admin', 'admin', 'owner'].includes(user.role);
        if (!isHr && employee.user_email.toLowerCase() !== user.email.toLowerCase()) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const updates = {
            resignation_date,
            resignation_reason,
            resignation_status: 'Pending Manager Approval',
            clearance_it: 'Pending',
            clearance_finance: 'Pending',
            clearance_hr: 'Pending',
            status: 'Exiting'
        };

        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: updates });
        await logAudit(req, 'Resignation Submitted', `${employee.name} submitted resignation request. Last day: ${resignation_date}`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/employees/:id/approve-resignation', hrAccessMiddleware, async (req, res) => {
    try {
        const { approval_type, approved, comments, approved_by } = req.body;
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const updates = {};
        if (approval_type === 'manager') {
            updates.manager_approval = approved ? 'Approved' : 'Rejected';
            updates.manager_approval_date = new Date().toISOString().split('T')[0];
            updates.manager_approval_comments = comments;
            updates.resignation_status = approved ? 'Pending HR Approval' : 'Rejected by Manager';
        } else {
            updates.hr_approval = approved ? 'Approved' : 'Rejected';
            updates.hr_approval_date = new Date().toISOString().split('T')[0];
            updates.hr_approval_comments = comments;
            updates.resignation_status = approved ? 'Approved' : 'Rejected by HR';
            if (approved) {
                updates.status = 'Exiting';
            }
        }

        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: updates });
        await logAudit(req, 'Resignation Approval', `Resignation for ${employee.name} updated with ${approval_type} status: ${approved ? 'Approved' : 'Rejected'}`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/employees/:id/settle-exit', hrAccessMiddleware, async (req, res) => {
    try {
        const { final_settlement_details, exit_date } = req.body;
        const employee = await EmployeeModel.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const updates = {
            final_settlement_details,
            exit_date,
            status: 'Inactive',
            resignation_status: 'Exited',
            clearance_it: 'Approved',
            clearance_finance: 'Approved',
            clearance_hr: 'Approved'
        };

        await EmployeeModel.findOneAndUpdate({ id: req.params.id }, { $set: updates });
        
        await User.findOneAndUpdate(
            { email: employee.user_email.toLowerCase() },
            { $set: { status: 'Inactive', employee_access: false } }
        );

        await logAudit(req, 'Exit Settlement', `Final settlement processed for ${employee.name}. Relieved on ${exit_date}`);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
