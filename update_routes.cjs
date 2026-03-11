const fs = require('fs');
const file = 'server/routes.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add nodemailer import
content = content.replace(
    "import { signToken, authMiddleware } from './auth.js';",
    "import { signToken, authMiddleware } from './auth.js';\nimport nodemailer from 'nodemailer';"
);

// 2. Change to async
content = content.replace(
    "router.post('/auth/send-otp', (req, res) => {",
    "router.post('/auth/send-otp', async (req, res) => {"
);

// 3. Replace the response logic with nodemailer logic
const target = `        // In dev we return the OTP in the response so the UI can display it.
        // Swap this for an email-sending integration in production.
        res.json({ ok: true, otp: code, message: \`OTP sent to \${email}\` });`;

const replacement = `        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const mailOptions = {
            from: '"BEZENT Server" <' + (process.env.EMAIL_USER || 'noreply') + '>',
            to: email,
            subject: 'Your Bezent Login OTP',
            text: 'Hello,\\n\\nYour BEZENT login OTP is: ' + code + '\\n\\nIt expires in 5 minutes.\\n\\nBest,\\nBezent Team'
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            res.json({ ok: true, message: 'OTP sent to ' + email });
        } else {
            console.warn("[Bezent Mail] WARNING: Email not sent! Provide EMAIL_USER and EMAIL_PASS in your .env");
            res.json({ ok: true, message: 'OTP mapped. (Check Server Terminal!)' });
        }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Routes.js successfully updated.');
