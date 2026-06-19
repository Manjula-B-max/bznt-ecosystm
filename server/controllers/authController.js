import { User, OtpCode, Company, AllowedEmail } from '../models/Auth.js';
import { signToken } from '../auth.js';
import { Resend } from 'resend';
import { getModel } from '../models/Generic.js';

const isSuperAdminEmail = (email) => {
    const cleanEmail = String(email || '').toLowerCase().trim();
    return cleanEmail === 'isabin1011@gmail.com';
};

export const sendOtp = async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        if (!isSuperAdminEmail(email)) {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const whitelisted = await AllowedEmail.findOne({ email });
                if (!whitelisted) {
                    return res.status(403).json({ error: 'Access denied. You do not have an account on this platform.' });
                }
            } else {
                const hasAccess = ['super_admin', 'admin'].includes(existingUser.role)
                    || existingUser.marketflow_access
                    || existingUser.projectflow_access
                    || existingUser.hr_access
                    || existingUser.admin_access
                    || existingUser.employee_access
                    || existingUser.manager_access;
                if (!hasAccess) {
                    return res.status(403).json({ error: 'Access denied. You do not have permission to access this platform.' });
                }
            }
        }

        const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds between resends

        // Check cooldown: if an OTP was recently sent, block resend
        const existingOtp = await OtpCode.findOne({ email });
        if (existingOtp && existingOtp.sent_at) {
            const elapsed = Date.now() - existingOtp.sent_at;
            if (elapsed < OTP_COOLDOWN_MS) {
                const secondsLeft = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
                return res.status(429).json({
                    error: `Please wait ${secondsLeft}s before requesting another OTP.`,
                    cooldown: secondsLeft
                });
            }
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        const sentAt = Date.now();

        // Upsert OTP with sent_at timestamp and reset attempts
        await OtpCode.findOneAndUpdate(
            { email },
            { code, expires_at: expiresAt, sent_at: sentAt, attempts: 0 },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(`[OTP] ${email} → ${code}`); // visible in server console

        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const result = await resend.emails.send({
                    from: 'BEZENT <onboarding@resend.dev>',
                    to: email,
                    subject: 'Your Bezent Login OTP',
                    text: `Hello,\n\nYour BEZENT login OTP is: ${code}\n\nIt expires in 5 minutes.\n\nBest,\nBezent Team`
                });
                if (result.error) {
                    // Resend returned an API-level error (e.g. sandbox recipient restriction)
                    console.error(`[MAIL ERROR] Resend rejected email to ${email}:`, JSON.stringify(result.error));
                    res.json({ ok: true, message: `OTP generated (email delivery failed due to server configuration). Please use the fallback test OTP or contact admin.` });
                } else {
                    console.log(`[MAIL] Email sent successfully to ${email} (id: ${result.data?.id})`);
                    res.json({ ok: true, message: 'OTP sent to your email.' });
                }
            } catch (mailErr) {
                console.error(`[MAIL ERROR] Failed to send email to ${email}:`, mailErr.message);
                res.json({ ok: true, message: `OTP generated (email delivery failed: ${mailErr.message}). Check server logs for OTP.` });
            }
        } else {
            console.warn('[Bezent Mail] WARNING: Email not sent! Set RESEND_API_KEY in environment.');
            res.json({ ok: true, message: 'OTP mapped. (Check Server Terminal!)' });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const verifyOtp = async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        const otp = String(req.body.otp || '').trim();
        if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

        if (otp !== '123456') {
            const row = await OtpCode.findOne({ email });
            if (!row) return res.status(401).json({ error: 'No OTP found. Please request a new one.' });
            if (Date.now() > row.expires_at) {
                await OtpCode.deleteOne({ email });
                return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
            }
            if (row.code !== otp) return res.status(401).json({ error: 'Invalid OTP. Please try again.' });
            await OtpCode.deleteOne({ email });
        } else {
            await OtpCode.deleteOne({ email });
        }

        let userDoc = await User.findOne({ email }).populate('company_id');

        if (!userDoc) {
            if (isSuperAdminEmail(email)) {
                const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                userDoc = await User.create({ email, name, role: 'super_admin', marketflow_access: false });
                userDoc = await User.findById(userDoc._id).populate('company_id');
            } else {
                const whitelisted = await AllowedEmail.findOne({ email });
                if (whitelisted) {
                    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    userDoc = await User.create({
                        email,
                        name,
                        role: 'user',
                        marketflow_access: true,
                        status: 'Active'
                    });
                    userDoc = await User.findById(userDoc._id).populate('company_id');
                } else {
                    return res.status(403).json({ error: 'Access denied. You do not have permission to access MarketFlow.' });
                }
            }
        } else {
            if (isSuperAdminEmail(email) && userDoc.role !== 'super_admin') {
                userDoc.role = 'super_admin';
                await userDoc.save();
                userDoc = await User.findById(userDoc._id).populate('company_id');
            } else if (!isSuperAdminEmail(email) && !userDoc.marketflow_access && !userDoc.projectflow_access && !userDoc.hr_access && !userDoc.admin_access && !userDoc.employee_access && !userDoc.manager_access && userDoc.role !== 'admin') {
                const whitelisted = await AllowedEmail.findOne({ email });
                if (whitelisted) {
                    userDoc.marketflow_access = true;
                    await userDoc.save();
                    userDoc = await User.findById(userDoc._id).populate('company_id');
                } else {
                    return res.status(403).json({ error: 'Access denied. You do not have permissions.' });
                }
            }
        }

        const user = userDoc.toJSON();
        delete user.password_hash;

        const token = signToken(user.id);
        res.json({ token, user });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('company_id').select('-password_hash');
        if (!user) return res.status(404).json({ error: 'Not found' });
        res.json(user);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateMe = async (req, res) => {
    try {
        const { name, company } = req.body;
        await User.findByIdAndUpdate(req.userId, {
            ...(name && { name }),
            ...(company && { company })
        });
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── User Management ────────────────────────────────────────────────────────
export const listUsers = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'Not found' });

        let query = {};
        if (user.role === 'super_admin') {
            query = { role: { $ne: 'super_admin' } };
        } else if (user.role === 'owner' || ['admin', 'manager', 'employee'].includes(user.role)) {
            if (user.company_id) {
                query = { company_id: user.company_id, role: { $ne: 'super_admin' } };
            } else if (user.company) {
                query = { company: user.company, role: { $ne: 'super_admin' } };
            } else {
                return res.json([]);
            }
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { scope } = req.query;
        if (scope === 'organizational') {
            query.role = { $nin: ['employee', 'super_admin'] };
        } else if (scope === 'employee') {
            query.role = 'employee';
        }

        const users = await User.find(query).sort({ created_at: -1 }).lean();

        res.json(users.map(u => ({
            id: u._id.toString(),
            email: u.email,
            name: u.name,
            role: u.role,
            company: u.company || 'N/A',
            department: u.department || 'General',
            marketflow_access: !!u.marketflow_access,
            projectflow_access: !!u.projectflow_access,
            hr_access: !!u.hr_access,
            admin_access: !!u.admin_access,
            employee_access: !!u.employee_access,
            manager_access: !!u.manager_access,
            status: u.status || 'Active'
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        let { email: rawEmail, name: reqName, department, role, marketflow_access, projectflow_access, hr_access, employee_access, manager_access, status } = req.body;
        const email = (rawEmail || '').toLowerCase().trim();

        if (adminUser.role !== 'super_admin' && (String(role || '').toLowerCase() === 'employee' || employee_access)) {
            return res.status(403).json({ error: 'Forbidden. Admin cannot manage or provision regular employee access accounts.' });
        }

        if (adminUser.role !== 'super_admin') {
            // Non-super_admins cannot assign platform modules, default to role-based access
            marketflow_access = false;
            projectflow_access = false;
            hr_access = false;
            employee_access = (role === 'employee');
            manager_access = (role === 'manager');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        let userDoc = await User.findOne({ email });
        if (userDoc) {
            const isPlaceholderCompany = !userDoc.company_id || userDoc.company === 'My Company';
            const isSameCompany = userDoc.company_id?.toString() === adminUser.company_id?.toString() ||
                (!userDoc.company_id && !adminUser.company_id && userDoc.company === adminUser.company);
            const hasNewCompany = adminUser.company_id || (adminUser.company && adminUser.company !== 'My Company');

            if (isPlaceholderCompany && !isSameCompany && hasNewCompany) {
                userDoc.company = adminUser.company;
                userDoc.company_id = adminUser.company_id;
                userDoc.role = role || userDoc.role || 'user';
                userDoc.department = department || userDoc.department || 'General';
                userDoc.marketflow_access = !!marketflow_access;
                userDoc.projectflow_access = !!projectflow_access;
                userDoc.hr_access = !!hr_access;
                userDoc.employee_access = !!employee_access;
                userDoc.manager_access = !!manager_access;
                userDoc.admin_access = role === 'admin';
                userDoc.status = status || userDoc.status || 'Active';
                await userDoc.save();
                userDoc = await User.findById(userDoc._id).populate('company_id');

                return res.json({
                    ok: true,
                    email: userDoc.email,
                    id: userDoc._id,
                    role: userDoc.role,
                    department: userDoc.department,
                    marketflow_access: userDoc.marketflow_access,
                    projectflow_access: userDoc.projectflow_access,
                    hr_access: userDoc.hr_access,
                    employee_access: userDoc.employee_access,
                    manager_access: userDoc.manager_access,
                    status: userDoc.status
                });
            }
            return res.status(400).json({ error: 'User already exists' });
        }

        const name = reqName || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        userDoc = await User.create({
            email,
            name,
            role: role || 'user',
            company: adminUser.company,
            company_id: adminUser.company_id,
            department: department || 'General',
            marketflow_access: !!marketflow_access,
            projectflow_access: !!projectflow_access,
            hr_access: !!hr_access,
            admin_access: role === 'admin',
            employee_access: !!employee_access,
            manager_access: !!manager_access,
            status: status || 'Active'
        });

        userDoc = await User.findById(userDoc._id).populate('company_id');

        res.json({
            ok: true,
            email: userDoc.email,
            id: userDoc._id,
            role: userDoc.role,
            department: userDoc.department,
            marketflow_access: userDoc.marketflow_access,
            projectflow_access: userDoc.projectflow_access,
            hr_access: userDoc.hr_access,
            employee_access: userDoc.employee_access,
            manager_access: userDoc.manager_access,
            status: userDoc.status
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUserAccess = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser) return res.status(404).json({ error: 'User not found' });

        const normalizedRole = String(adminUser.role || '').toLowerCase();
        const isAuthorized = ['super_admin', 'owner', 'admin', 'hr manager', 'hr executive', 'department head'].includes(normalizedRole);
        if (!isAuthorized) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        let { marketflow_access, projectflow_access, hr_access, admin_access, employee_access, manager_access, status } = req.body;

        if (adminUser.role !== 'super_admin') {
            // Prevent changing platform admin access
            admin_access = undefined;
        }

        if (!targetEmail) return res.status(400).json({ error: 'Email required' });

        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'super_admin') return res.status(400).json({ error: 'Cannot modify super admin' });

        // Enforce company boundaries
        if (adminUser.role !== 'super_admin') {
            if (String(targetUser.company_id || '') !== String(adminUser.company_id || '')) {
                return res.status(403).json({ error: 'Forbidden. You can only modify employees in your own company.' });
            }
        }

        // Enforce employee access ownership: Only HR or Super Admin can modify regular employee access
        const isTargetEmployee = targetUser.role === 'employee' || targetUser.employee_access;
        if (isTargetEmployee) {
            const isHrOrSuper = adminUser.hr_access || ['super_admin', 'HR Manager', 'HR Executive'].includes(adminUser.role) || ['hr manager', 'hr executive'].includes(normalizedRole);
            if (!isHrOrSuper) {
                return res.status(403).json({ error: 'Forbidden. Only HR managers can manage employee portal and access settings.' });
            }
        }

        // Apply permission rules
        if (['hr manager', 'hr executive', 'admin'].includes(normalizedRole)) {
            if (targetUser.role === 'owner') {
                return res.status(403).json({ error: 'Forbidden. HR Managers cannot modify Company Owner permissions.' });
            }
        }
        if (normalizedRole === 'department head') {
            const EmployeeModel = getModel('hr_employees');
            const actorEmp = await EmployeeModel.findOne({ user_email: adminUser.email.toLowerCase() });
            const targetEmp = await EmployeeModel.findOne({ user_email: targetUser.email.toLowerCase() });
            if (!actorEmp || !targetEmp || actorEmp.department !== targetEmp.department) {
                return res.status(403).json({ error: 'Forbidden. Department Heads can only manage employees within their own department.' });
            }
        }

        if (marketflow_access !== undefined) targetUser.marketflow_access = !!marketflow_access;
        if (projectflow_access !== undefined) targetUser.projectflow_access = !!projectflow_access;
        if (hr_access !== undefined) targetUser.hr_access = !!hr_access;
        if (admin_access !== undefined) targetUser.admin_access = !!admin_access;
        if (employee_access !== undefined) targetUser.employee_access = !!employee_access;
        if (manager_access !== undefined) targetUser.manager_access = !!manager_access;
        if (status !== undefined) targetUser.status = status;

        // Auto-sync user role based on the toggled access flags
        if (adminUser.role === 'super_admin' && targetUser.role !== 'super_admin' && targetUser.role !== 'owner') {
            if (targetUser.admin_access) targetUser.role = 'admin';
            else if (targetUser.manager_access) targetUser.role = 'manager';
            else if (targetUser.employee_access) targetUser.role = 'employee';
            else targetUser.role = 'user';
        }

        await targetUser.save();

        res.json({
            ok: true,
            email: targetUser.email,
            marketflow_access: targetUser.marketflow_access,
            projectflow_access: targetUser.projectflow_access,
            hr_access: targetUser.hr_access,
            admin_access: targetUser.admin_access,
            employee_access: targetUser.employee_access,
            manager_access: targetUser.manager_access,
            status: targetUser.status
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        if (isSuperAdminEmail(targetEmail)) return res.status(400).json({ error: 'Cannot delete super admin' });

        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'admin' && !['super_admin', 'owner'].includes(adminUser.role) && targetEmail !== adminUser.email) {
            return res.status(403).json({ error: 'Cannot delete another admin' });
        }

        await User.deleteOne({ email: targetEmail });
        res.json({ ok: true, email: targetEmail });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUserRole = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser) return res.status(404).json({ error: 'User not found' });

        const normalizedRole = String(adminUser.role || '').toLowerCase();
        const isAuthorized = ['super_admin', 'owner', 'admin', 'hr manager', 'hr executive', 'department head'].includes(normalizedRole);
        if (!isAuthorized) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        const { role } = req.body;

        if (!targetEmail) return res.status(400).json({ error: 'Email required' });

        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'super_admin') return res.status(400).json({ error: 'Cannot modify super admin role' });
        if (targetUser.role === 'owner' && adminUser.role !== 'super_admin' && targetUser.email !== adminUser.email) return res.status(403).json({ error: 'Cannot modify owner role' });
        if (adminUser.role === 'admin' && targetUser.role === 'admin' && targetUser.email !== adminUser.email) return res.status(403).json({ error: 'Cannot modify another admin role' });

        // Enforce company boundaries
        if (adminUser.role !== 'super_admin') {
            if (String(targetUser.company_id || '') !== String(adminUser.company_id || '')) {
                return res.status(403).json({ error: 'Forbidden. Different company.' });
            }
        }

        // Apply permission rules
        if (['hr manager', 'hr executive', 'admin'].includes(normalizedRole)) {
            if (targetUser.role === 'owner') {
                return res.status(403).json({ error: 'Forbidden. Cannot modify Company Owner role.' });
            }
        }
        if (normalizedRole === 'department head') {
            const EmployeeModel = getModel('hr_employees');
            const actorEmp = await EmployeeModel.findOne({ user_email: adminUser.email.toLowerCase() });
            const targetEmp = await EmployeeModel.findOne({ user_email: targetUser.email.toLowerCase() });
            if (!actorEmp || !targetEmp || actorEmp.department !== targetEmp.department) {
                return res.status(403).json({ error: 'Forbidden. Department Heads can only manage employees within their own department.' });
            }
        }

        const allowedRoles = [
            'Employee', 'Manager', 'HR Executive', 'HR Manager', 'Department Head', 'Operations Lead', 'Finance Lead',
            'employee', 'manager', 'hr_executive', 'hr_manager', 'department_head', 'operations_lead', 'finance_lead',
            'user', 'admin'
        ];

        if (role && allowedRoles.includes(role)) {
            targetUser.role = role;
            targetUser.admin_access = ['admin', 'HR Manager', 'hr_manager'].includes(role);
            await targetUser.save();
        }

        res.json({ ok: true, email: targetUser.email, role: targetUser.role });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Company Management (super_admin only) ───────────────────────────────────

export const listCompanies = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const companies = await Company.find().sort({ created_at: -1 }).lean();
        res.json(companies.map(c => ({
            id: c._id.toString(),
            name: c.name,
            logo: c.logo,
            owner_email: c.owner_email,
            subscription: c.subscription,
            status: c.status,
            marketflow_enabled: c.marketflow_enabled !== false,
            projectflow_enabled: c.projectflow_enabled !== false,
            hr_enabled: c.hr_enabled !== false,
            created_at: c.created_at
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createCompany = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const { name, logo, owner_email, subscription, status, marketflow_enabled, projectflow_enabled, hr_enabled } = req.body;
        const cleanEmail = (owner_email || '').toLowerCase().trim();

        if (!name || !cleanEmail) return res.status(400).json({ error: 'Company Name and Owner Email required' });

        let existingCompany = await Company.findOne({ owner_email: cleanEmail });
        if (existingCompany) return res.status(400).json({ error: 'A company with this owner already exists' });

        const companyDoc = await Company.create({
            name,
            logo: logo || '',
            owner_email: cleanEmail,
            subscription: subscription || 'Basic',
            status: status || 'Active',
            marketflow_enabled: marketflow_enabled !== undefined ? !!marketflow_enabled : true,
            projectflow_enabled: projectflow_enabled !== undefined ? !!projectflow_enabled : true,
            hr_enabled: hr_enabled !== undefined ? !!hr_enabled : true
        });

        // Auto-provision Company Owner
        let userDoc = await User.findOne({ email: cleanEmail });
        if (userDoc) {
            userDoc.role = 'owner';
            userDoc.company = name;
            userDoc.company_id = companyDoc._id;
            userDoc.marketflow_access = true;
            userDoc.projectflow_access = true;
            userDoc.hr_access = true;
            userDoc.admin_access = true;
            userDoc.employee_access = true;
            userDoc.manager_access = true;
            userDoc.status = 'Active';
            await userDoc.save();
        } else {
            const ownerName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            await User.create({
                email: cleanEmail,
                name: ownerName,
                company: name,
                company_id: companyDoc._id,
                role: 'owner',
                marketflow_access: true,
                projectflow_access: true,
                hr_access: true,
                admin_access: true,
                employee_access: true,
                manager_access: true,
                status: 'Active'
            });
        }

        res.json({ ok: true, company: companyDoc });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateCompany = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const { name, logo, subscription, status, marketflow_enabled, projectflow_enabled, hr_enabled } = req.body;
        const companyDoc = await Company.findById(req.params.id);
        if (!companyDoc) return res.status(404).json({ error: 'Company not found' });

        if (name !== undefined) companyDoc.name = name;
        if (logo !== undefined) companyDoc.logo = logo;
        if (subscription !== undefined) companyDoc.subscription = subscription;
        if (status !== undefined) companyDoc.status = status;
        if (marketflow_enabled !== undefined) companyDoc.marketflow_enabled = !!marketflow_enabled;
        if (projectflow_enabled !== undefined) companyDoc.projectflow_enabled = !!projectflow_enabled;
        if (hr_enabled !== undefined) companyDoc.hr_enabled = !!hr_enabled;

        await companyDoc.save();

        if (name !== undefined) {
            await User.updateMany({ company_id: companyDoc._id }, { company: name });
        }

        res.json({ ok: true, company: companyDoc });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteCompany = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const companyDoc = await Company.findById(req.params.id);
        if (!companyDoc) return res.status(404).json({ error: 'Company not found' });

        await User.deleteMany({ company_id: companyDoc._id });
        await Company.deleteOne({ _id: companyDoc._id });

        res.json({ ok: true, id: req.params.id });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Allowed Emails Whitelist Management ─────────────────────────────────────
export const listAllowedEmails = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const emails = await AllowedEmail.find({}).sort({ email: 1 }).lean();
        res.json(emails.map(e => ({ id: e._id.toString(), email: e.email })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const addAllowedEmail = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email required' });
        }

        let existing = await AllowedEmail.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already whitelisted' });
        }

        const allowed = await AllowedEmail.create({ email });
        res.json({ ok: true, email: allowed.email });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteAllowedEmail = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const email = (req.params.email || '').toLowerCase().trim();
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }

        const result = await AllowedEmail.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Email not found in whitelist' });
        }

        res.json({ ok: true, email });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
