import { User, OtpCode } from '../models/Auth.js';
import { signToken } from '../auth.js';
import nodemailer from 'nodemailer';

export const sendOtp = async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        if (email !== 'bhujasrisadhanand@gmail.com') {
            const existingUser = await User.findOne({ email });
            if (!existingUser || !existingUser.marketflow_access) {
                return res.status(403).json({ error: 'Access denied. You do not have permission to access MarketFlow.' });
            }
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Upsert OTP
        await OtpCode.findOneAndUpdate(
            { email },
            { code, expires_at: expiresAt },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(`[OTP] ${email} → ${code}`); // visible in server console

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS (not SSL on 465)
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
            from: '"BEZENT Server" <' + (process.env.EMAIL_USER || 'noreply') + '>',
            to: email,
            subject: 'Your Bezent Login OTP',
            text: `Hello,\n\nYour BEZENT login OTP is: ${code}\n\nIt expires in 5 minutes.\n\nBest,\nBezent Team`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail(mailOptions);
                console.log(`[MAIL] Email sent successfully to ${email}`);
                res.json({ ok: true, message: 'OTP sent to your email.' });
            } catch (mailErr) {
                console.error(`[MAIL ERROR] Failed to send email to ${email}:`, mailErr.message);
                // Still allow login via Render logs OTP, but tell client mail failed
                res.json({ ok: true, message: `OTP generated (email delivery failed: ${mailErr.message}). Check server logs for OTP.` });
            }
        } else {
            console.warn('[Bezent Mail] WARNING: Email not sent! Provide valid SMTP details in .env');
            res.json({ ok: true, message: 'OTP mapped. (Check Server Terminal!)' });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const verifyOtp = async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();
        const otp = String(req.body.otp || '').trim();
        if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

        const row = await OtpCode.findOne({ email });
        if (!row) return res.status(401).json({ error: 'No OTP found. Please request a new one.' });
        if (Date.now() > row.expires_at) {
            await OtpCode.deleteOne({ email });
            return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
        }
        if (row.code !== otp) return res.status(401).json({ error: 'Invalid OTP. Please try again.' });

        // valid otp — consume it
        await OtpCode.deleteOne({ email });

        let userDoc = await User.findOne({ email });
        
        if (!userDoc) {
            if (email === 'bhujasrisadhanand@gmail.com') {
                const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                userDoc = await User.create({ email, name, role: 'super_admin', marketflow_access: false });
            } else {
                return res.status(403).json({ error: 'Access denied. You do not have permission to access MarketFlow.' });
            }
        } else {
            if (email === 'bhujasrisadhanand@gmail.com' && userDoc.role !== 'super_admin') {
                userDoc.role = 'super_admin';
                await userDoc.save();
            } else if (email !== 'bhujasrisadhanand@gmail.com' && !userDoc.marketflow_access) {
                return res.status(403).json({ error: 'Access denied. You do not have permission to access MarketFlow.' });
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

// ── User Management (super_admin only) ─────────────────────────────────────

export const listUsers = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const users = await User.find({ role: { $ne: 'super_admin' } }).sort({ created_at: -1 }).lean();
        res.json(users.map(u => ({ id: u._id.toString(), email: u.email, role: u.role, marketflow_access: !!u.marketflow_access })));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const email = (req.body.email || '').toLowerCase().trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Valid email required' });

        let userDoc = await User.findOne({ email });
        if (userDoc) return res.status(400).json({ error: 'User already exists' });

        const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        userDoc = await User.create({ email, name, role: 'user', marketflow_access: true });

        res.json({ ok: true, email: userDoc.email, id: userDoc._id, marketflow_access: true, role: 'user' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUserAccess = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        const { marketflow_access } = req.body;
        
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        
        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'super_admin') return res.status(400).json({ error: 'Cannot modify super admin' });

        targetUser.marketflow_access = !!marketflow_access;
        await targetUser.save();
        
        res.json({ ok: true, email: targetUser.email, marketflow_access: targetUser.marketflow_access });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUser = async (req, res) => {
    try {
        const adminUser = await User.findById(req.userId);
        if (!adminUser || adminUser.role !== 'super_admin') return res.status(403).json({ error: 'Forbidden' });

        const targetEmail = (req.params.email || '').toLowerCase().trim();
        if (!targetEmail) return res.status(400).json({ error: 'Email required' });
        if (targetEmail === 'bhujasrisadhanand@gmail.com') return res.status(400).json({ error: 'Cannot delete super admin' });

        await User.deleteOne({ email: targetEmail });
        res.json({ ok: true, email: targetEmail });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
