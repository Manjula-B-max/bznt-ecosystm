import React, { useMemo, useState } from 'react';
import logo from '../assets/logo.svg';

export default function LoginPane({ onLoginSuccess }) {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [pendingOtp, setPendingOtp] = useState(null);
    const [status, setStatus] = useState('');

    const resetToEmailStep = () => {
        setPendingOtp(null);
        setStep('email');
        setOtp('');
        setStatus('');
    };

    const buttonLabel = useMemo(() => {
        return step === 'email' ? 'Send OTP' : 'Verify OTP';
    }, [step]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setStatus('Please enter your email.');
            return;
        }

        if (step === 'email') {
            const generated = String(Math.floor(100000 + Math.random() * 900000));
            setPendingOtp(generated);
            setOtp('');
            setStep('otp');
            setStatus(`OTP has been sent to ${trimmedEmail}\nOTP : ${generated}`);
            return;
        }

        const entered = otp.trim();
        if (!entered) {
            setStatus('Please enter the OTP.');
            return;
        }

        if (!/^[0-9]{6}$/.test(entered) || entered !== pendingOtp) {
            setStatus('Invalid OTP. Please try again.');
            return;
        }

        setStatus('Logged in successfully.');
        onLoginSuccess?.(trimmedEmail);
    };

    return (
        <section className="login-pane">
            <div className="login-details-box">
                <header className="branding">
                    <div className="brand-mark" id="brandMark">
                        <img id="brandLogo" className="brand-logo" alt="BEZENT" src={logo} style={{ display: 'block' }} />
                        <h1 className="logo brand-text" id="brandText" style={{ display: 'none' }}>BEZENT</h1>
                    </div>
                </header>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                const v = e.target.value;
                                setEmail(v);
                                if (step === 'otp') {
                                    setPendingOtp(null);
                                    setStep('email');
                                    setOtp('');
                                    setStatus('Email changed. Please request a new OTP.');
                                }
                            }}
                        />
                        <label htmlFor="email" className="floating-label">Email</label>
                    </div>

                    {step === 'otp' && (
                        <div className="form-group">
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="OTP"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <label htmlFor="otp" className="floating-label">OTP</label>
                        </div>
                    )}

                    {status ? (
                        <div
                            className="form-footer"
                            style={{ marginBottom: 16, textAlign: 'left', fontSize: 12, color: '#6B7280' }}
                        >
                            <span style={{ whiteSpace: 'pre-line' }}>{status}</span>
                        </div>
                    ) : null}

                    <button type="submit" className="login-btn">
                        <span>{buttonLabel}</span>
                    </button>
                </form>

                {step === 'otp' ? (
                    <footer className="form-footer">
                        <a
                            href="#"
                            className="forgot-password"
                            onClick={(e) => {
                                e.preventDefault();
                                resetToEmailStep();
                            }}
                        >
                            Change email
                        </a>
                    </footer>
                ) : null}
            </div>
        </section>
    );
}
