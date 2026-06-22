import { User } from '../models/Auth.js';
import { Employee } from '../models/Employee.js';
import { getModel } from '../models/Generic.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ── Helper ─────────────────────────────────────────────────────────────────
const getEmployeeForUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const employee = await Employee.findOne({ user_email: user.email.toLowerCase() });
    return { user, employee };
};

// ── Profile Completion Calculator ───────────────────────────────────────────
const calcProfileCompletion = (employee, docs) => {
    const checks = [
        !!employee.name,           !!employee.dob,
        !!employee.gender,         !!employee.blood_group,
        !!employee.marital_status, !!employee.nationality,
        !!employee.personal_email, !!employee.mobile,
        !!(employee.current_address?.address_line1),
        !!(employee.permanent_address?.address_line1),
        !!(employee.emergency_contacts?.length > 0),
        !!employee.bank_account_number, !!employee.bank_ifsc, !!employee.pan,
        docs.some(d => d.doc_type === 'employee_photo'),
        docs.some(d => d.doc_type === 'aadhaar'),
        docs.some(d => d.doc_type === 'pan'),
        !!employee.designation,    !!employee.department,
        !!employee.joined_date,    !!employee.esign_confirmed,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ── Resolve file path from stored URL ──────────────────────────────────────
const resolveFilePath = (fileUrl) => {
    const uploadsRoot = path.join(__dirname, '../../uploads');
    const relative = fileUrl.replace(/^\/uploads\//, '');
    return path.join(uploadsRoot, relative);
};

// ── Find doc and resolve its path (shared helper) ──────────────────────────
const getDocForEmployee = async (user, employee, docType) => {
    const DocModel = getModel('employee_documents');
    const doc = await DocModel.findOne({ user_email: user.email.toLowerCase(), doc_type: docType }).lean();
    if (!doc?.file_url) return null;
    const filePath = resolveFilePath(doc.file_url);
    if (!fs.existsSync(filePath)) return null;
    return { doc, filePath };
};

// ── GET /employee/profile ───────────────────────────────────────────────────
export const getFullProfile = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee record not found' });

        const DocModel = getModel('employee_documents');
        const docs = await DocModel.find({ user_email: user.email.toLowerCase() }).lean();

        let manager = null;
        if (employee.reporting_manager) {
            try {
                const mgr = await Employee.findOne({
                    $or: [{ name: employee.reporting_manager }, { employee_id: employee.reporting_manager }]
                }).lean();
                if (mgr) {
                    manager = { name: mgr.name, designation: mgr.designation || 'Manager', department: mgr.department || '', email: mgr.user_email || '', employee_id: mgr.employee_id || '' };
                }
            } catch (_) {}
        }
        if (!manager && employee.reporting_manager) {
            manager = { name: employee.reporting_manager };
        }

        const photoDoc = docs.find(d => d.doc_type === 'employee_photo');
        const empJson = employee.toJSON ? employee.toJSON() : { ...employee._doc };

        res.json({
            employee: {
                ...empJson,
                photo_url: photoDoc ? photoDoc.file_url : null,
                completion: calcProfileCompletion(employee, docs),
                manager
            }
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/manager ───────────────────────────────────────────
export const getManagerProfile = async (req, res) => {
    try {
        const { employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        if (!employee.reporting_manager) return res.json({ manager: null });

        const mgr = await Employee.findOne({
            $or: [{ name: employee.reporting_manager }, { employee_id: employee.reporting_manager }]
        }).lean();

        if (mgr) {
            return res.json({ manager: { name: mgr.name, designation: mgr.designation || 'Manager', department: mgr.department || '', email: mgr.user_email || '', employee_id: mgr.employee_id || '' } });
        }
        res.json({ manager: { name: employee.reporting_manager } });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/documents ────────────────────────────────────────
export const getProfileDocuments = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.json([]);

        const DocModel = getModel('employee_documents');
        const docs = await DocModel.find({ user_email: user.email.toLowerCase() }).lean();

        res.json(docs.map(d => ({
            id: d.id,
            doc_type: d.doc_type,
            doc_label: d.doc_label,
            file_name: d.file_name || '',
            status: d.status || 'Pending',
            uploaded_at: d.uploaded_at || d.created_at,
            download_ref: d.doc_type
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/documents/:doc_type/view ─────────────────────────
export const viewDocument = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(403).json({ error: 'Forbidden' });

        const result = await getDocForEmployee(user, employee, req.params.doc_type);
        if (!result) return res.status(404).json({ error: 'Document not found' });

        const { doc, filePath } = result;
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = { '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
        res.setHeader('Content-Disposition', `inline; filename="${doc.file_name || path.basename(filePath)}"`);
        res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/documents/:doc_type/download ─────────────────────
export const downloadDocument = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(403).json({ error: 'Forbidden' });

        const result = await getDocForEmployee(user, employee, req.params.doc_type);
        if (!result) return res.status(404).json({ error: 'Document not found' });

        const { doc, filePath } = result;
        res.setHeader('Content-Disposition', `attachment; filename="${doc.file_name || path.basename(filePath)}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/requests ─────────────────────────────────────────
export const getProfileRequests = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.json([]);

        const ReqModel = getModel('employee_profile_requests');
        const requests = await ReqModel.find({ user_email: user.email.toLowerCase() }).sort({ created_at: -1 }).lean();
        res.json(requests.map(r => { delete r._id; delete r.__v; return r; }));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── GET /employee/profile/requests/:id ─────────────────────────────────────
export const getProfileRequestById = async (req, res) => {
    try {
        const { user } = await getEmployeeForUser(req.userId);
        const ReqModel = getModel('employee_profile_requests');
        const request = await ReqModel.findOne({ id: req.params.id, user_email: user.email.toLowerCase() }).lean();
        if (!request) return res.status(404).json({ error: 'Request not found' });
        delete request._id; delete request.__v;
        res.json(request);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── POST /employee/profile/requests ─────────────────────────────────────────
export const submitProfileRequest = async (req, res) => {
    try {
        const { user, employee } = await getEmployeeForUser(req.userId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const { request_type, related_field, current_value, new_value, reason, remarks } = req.body;
        if (!request_type || !new_value || !reason) {
            return res.status(400).json({ error: 'request_type, new_value, and reason are required' });
        }

        const ReqModel = getModel('employee_profile_requests');
        const reqId = 'PR-' + Date.now().toString(36).toUpperCase();

        await ReqModel.create({
            id: reqId,
            user_id: user.id,
            user_email: user.email.toLowerCase(),
            employee_id: employee.employee_id,
            employee_name: employee.name,
            department: employee.department,
            designation: employee.designation,
            request_type,
            related_field: related_field || '',
            current_value: current_value || '',
            new_value,
            reason,
            remarks: remarks || '',
            status: 'Pending',
            hr_remarks: '',
            reviewed_by: '',
            reviewed_date: null,
            applied_on: new Date(),
            created_at: new Date()
        });

        res.json({ ok: true, id: reqId, message: 'Request submitted. HR will review within 1–2 business days.' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
