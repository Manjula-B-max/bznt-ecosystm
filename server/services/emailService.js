import nodemailer from 'nodemailer';

/**
 * Sends a 6-digit OTP to the given email address using Gmail SMTP.
 * Requires EMAIL_USER and EMAIL_PASS environment variables.
 * Falls back to a console warning in development if env is not set.
 */
export async function sendOtpEmail(email, code) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[Bezent Mail] WARNING: Email not sent! Set EMAIL_USER and EMAIL_PASS in server/.env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
        from: `"BEZENT Server" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Bezent Login OTP',
        text: `Hello,\n\nYour BEZENT login OTP is: ${code}\n\nIt expires in 5 minutes.\n\nBest,\nBezent Team`
    });
}
