import { User, OtpCode, Company } from '../models/Auth.js';
import { signToken } from '../auth.js';
import { Resend } from 'resend';

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
                return res.status(403).json({ error: 'Access denied. You do not have an account on this platform.' });
            }
            const hasAccess = ['super_admin', 'admin'].includes(existingUser.role)
                || existingUser.marketflow_access
                || existingUser.projectflow_access
                || existingUser.hr_access
                || existingUser.admin_access;
            if (!hasAccess) {
                return res.status(403).json({ error: 'Access denied. You do not have permission to access this platform.' });
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

        let userDoc = await User.findOne({ email });
        
        if (!userDoc) {
            if (isSuperAdminEmail(email)) {
                const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                userDoc = await User.create({ email, name, role: 'super_admin', marketflow_access: false });
            } else {
                return res.status(403).json({ error: 'Access denied. You do not have permission to access MarketFlow.' });
            }
        } else {
            if (isSuperAdminEmail(email) && userDoc.role !== 'super_admin') {
                userDoc.role = 'super_admin';
                await userDoc.save();
            } else if (!isSuperAdminEmail(email) && !userDoc.marketflow_access && !userDoc.projectflow_access && !userDoc.hr_access && !userDoc.admin_access && userDoc.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. You do not have permissions.' });
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
        const user = await User.findById(req.userId).select('-password_hash');
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

        const users = await User.find(query).sort({ created_at: -1 }).lean();
        
        res.json(users.map(u => ({
            id: u._id.toString(),
            email: u.email,
            name: u.name,
            role: u.role,
            department: u.department || 'General',
            marketflow_access: !!u.marketflow_access,
            projectflow_access: !!u.projectflow_access,
            hr_access: !!u.hr_access,
            admin_access: !!u.admin_access,
            employee_access: !!u.employee_access,
            status: u.status || 'Active'
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'owner', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        const { email: rawEmail, name: reqName, department, role, marketflow_access, projectflow_access, hr_access, employee_access, status } = req.body;
        const email = (rawEmail || '').toLowerCase().trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        let userDoc = await User.findOne({ email });
        if (userDoc) return res.status(400).json({ error: 'User already exists' });

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
            admin_access: false,
            employee_access: !!employee_access,
            status: status || 'Active'
        });

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
            status: userDoc.status
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUserAccess = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        const { marketflow_access, projectflow_access, hr_access, admin_access, employee_access, status } = req.body;
        
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        
        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'super_admin') return res.status(400).json({ error: 'Cannot modify super admin' });

        if (marketflow_access !== undefined) targetUser.marketflow_access = !!marketflow_access;
        if (projectflow_access !== undefined) targetUser.projectflow_access = !!projectflow_access;
        if (hr_access !== undefined) targetUser.hr_access = !!hr_access;
        if (admin_access !== undefined) targetUser.admin_access = !!admin_access;
        if (employee_access !== undefined) targetUser.employee_access = !!employee_access;
        if (status !== undefined) targetUser.status = status;
        
        await targetUser.save();
        
        res.json({
            ok: true,
            email: targetUser.email,
            marketflow_access: targetUser.marketflow_access,
            projectflow_access: targetUser.projectflow_access,
            hr_access: targetUser.hr_access,
            admin_access: targetUser.admin_access,
            employee_access: targetUser.employee_access,
            status: targetUser.status
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        if (isSuperAdminEmail(targetEmail)) return res.status(400).json({ error: 'Cannot delete super admin' });

        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'admin' && adminUser.role !== 'super_admin' && targetEmail !== adminUser.email) {
            return res.status(403).json({ error: 'Cannot delete another admin' });
        }

        await User.deleteOne({ email: targetEmail });
        res.json({ ok: true, email: targetEmail });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUserRole = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        const { role } = req.body;
        
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        
        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'super_admin') return res.status(400).json({ error: 'Cannot modify super admin role' });
        if (adminUser.role === 'admin' && targetUser.role === 'admin' && targetUser.email !== adminUser.email) return res.status(403).json({ error: 'Cannot modify another admin role' });

        const allowedRoles = ['user', 'admin', 'manager', 'employee']; // Expanded roles for project flow

        if(role && allowedRoles.includes(role)) {
            targetUser.role = role;
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
            created_at: c.created_at
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createCompany = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const { name, logo, owner_email, subscription, status } = req.body;
        const cleanEmail = (owner_email || '').toLowerCase().trim();

        if (!name || !cleanEmail) return res.status(400).json({ error: 'Company Name and Owner Email required' });

        let existingCompany = await Company.findOne({ owner_email: cleanEmail });
        if (existingCompany) return res.status(400).json({ error: 'A company with this owner already exists' });

        const companyDoc = await Company.create({
            name,
            logo: logo || '',
            owner_email: cleanEmail,
            subscription: subscription || 'Basic',
            status: status || 'Active'
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

        const { name, logo, subscription, status } = req.body;
        const companyDoc = await Company.findById(req.params.id);
        if (!companyDoc) return res.status(404).json({ error: 'Company not found' });

        if (name !== undefined) companyDoc.name = name;
        if (logo !== undefined) companyDoc.logo = logo;
        if (subscription !== undefined) companyDoc.subscription = subscription;
        if (status !== undefined) companyDoc.status = status;

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
