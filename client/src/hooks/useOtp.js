/**
 * client/src/hooks/useOtp.js
 *
 * Custom hook that encapsulates the entire OTP login flow.
 * Isolates all API calls + state from the UI component.
 */
import { useState } from 'react';
import { authApi } from '../services/api.js';

export function useOtp({ onSuccess } = {}) {
    const [step, setStep]     = useState('email'); // 'email' | 'otp'
    const [email, setEmail]   = useState('');
    const [otp, setOtp]       = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = () => { setStep('email'); setOtp(''); setStatus(''); };

    const handleEmailChange = (val) => {
        setEmail(val);
        if (step === 'otp') { reset(); setStatus('Email changed — please request a new OTP.'); }
    };

    const submitEmail = async () => {
        setLoading(true);
        try {
            const data = await authApi.sendOtp(email.trim());
            setStatus(data.message || 'OTP sent. Check your inbox.');
            setStep('otp');
        } catch (err) {
            setStatus(err.message || 'Failed to send OTP.');
        } finally { setLoading(false); }
    };

    const submitOtp = async () => {
        setLoading(true);
        try {
            const data = await authApi.verifyOtp(email.trim(), otp.trim());
            onSuccess?.(data);
        } catch (err) {
            setStatus(err.message || 'OTP verification failed.');
        } finally { setLoading(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) { setStatus('Please enter your email.'); return; }
        if (step === 'email') return submitEmail();
        if (!otp.trim()) { setStatus('Please enter the OTP.'); return; }
        submitOtp();
    };

    return { step, email, otp, status, loading, setEmail: handleEmailChange, setOtp, handleSubmit, reset };
}
