import React, { useMemo, useState } from 'react';
import logo from '../assets/logo.svg';

export default function LoginPane({ onLoginSuccess }) {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetToEmailStep = () => {
        setStep('email');
        setOtp('');
        setStatus('');
        setIsError(false);
    };

    const buttonLabel = useMemo(() => {
        if (loading) return step === 'email' ? 'Sending...' : 'Verifying...';
        return step === 'email' ? 'Send OTP' : 'Verify OTP';
    }, [step, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setStatus('Please enter your email.');
            setIsError(true);
            return;
        }

        setLoading(true);
        setStatus('');
        setIsError(false);

        try {
            if (step === 'email') {
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: trimmedEmail }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setIsError(true);
                    setStatus(data.error || 'Failed to send OTP.');
                } else {
                    setStep('otp');
                    setIsError(false);
                    setStatus(`OTP sent to ${trimmedEmail}. Please check your inbox.`);
                }
            } else {
                const entered = otp.trim();
                if (!entered) {
                    setStatus('Please enter the OTP.');
                    setIsError(true);
                    setLoading(false);
                    return;
                }
                const res = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: trimmedEmail, otp: entered }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setIsError(true);
                    setStatus(data.error || 'Invalid OTP. Please try again.');
                } else {
                    // Store token and user in localStorage
                    localStorage.setItem('bezent_jwt', data.token);
                    localStorage.setItem('bezent_user', JSON.stringify(data.user));
                    setIsError(false);
                    setStatus('Logged in successfully.');
                    onLoginSuccess?.(data.user);
                }
            }
        } catch (err) {
            setIsError(true);
            setStatus('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
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
                                    setStep('email');
                                    setOtp('');
                                    setIsError(false);
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
                            style={{ marginBottom: 16, textAlign: 'left', fontSize: 12, color: isError ? '#EF4444' : '#6B7280' }}
                        >
                            <span style={{ whiteSpace: 'pre-line' }}>{status}</span>
                        </div>
                    ) : null}

                    <button type="submit" className="login-btn" disabled={loading}>
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
