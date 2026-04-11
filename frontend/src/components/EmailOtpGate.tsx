'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clipboard, Loader2, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type EmailOtpGateProps = {
  redirectPath: string;
  forceVerification?: boolean;
  eyebrow?: string;
  emailHeading?: string;
  emailDescription?: string;
  codeHeading?: string;
};

type PersistedOtpDraft = {
  step: 'email' | 'code';
  email: string;
  code: string[];
  resendCountdown: number;
  devCode: string;
  infoMessage: string;
};

const OTP_DRAFT_PREFIX = 'evently_auth_gate_draft';

function getOtpDraftKey(redirectPath: string, forceVerification: boolean) {
  return `${OTP_DRAFT_PREFIX}:${forceVerification ? 'force' : 'login'}:${encodeURIComponent(redirectPath)}`;
}

function readOtpDraft(key: string): PersistedOtpDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedOtpDraft>;
    const email = typeof parsed.email === 'string' ? parsed.email : '';
    const code = Array.isArray(parsed.code)
      ? parsed.code.slice(0, 6).map((digit) => String(digit || '').slice(0, 1))
      : ['', '', '', '', '', ''];
    const resendCountdownValue = Number(parsed.resendCountdown);

    if (!email && code.every((digit) => !digit)) {
      return null;
    }

    return {
      step: parsed.step === 'code' ? 'code' : 'email',
      email,
      code: Array.from({ length: 6 }, (_, index) => code[index] || ''),
      resendCountdown: Number.isFinite(resendCountdownValue)
        ? Math.max(0, Math.floor(resendCountdownValue))
        : 0,
      devCode: typeof parsed.devCode === 'string' ? parsed.devCode : '',
      infoMessage: typeof parsed.infoMessage === 'string' ? parsed.infoMessage : '',
    };
  } catch {
    return null;
  }
}

function writeOtpDraft(key: string, draft: PersistedOtpDraft) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(draft));
}

function clearOtpDraft(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(key);
}

export default function EmailOtpGate({
  redirectPath,
  forceVerification = false,
  eyebrow,
  emailHeading = 'Continue with email',
  emailDescription = 'Enter your email address and we will send a 6 digit code. If you are new, your account will be created automatically.',
  codeHeading = 'Enter Code',
}: EmailOtpGateProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [devCode, setDevCode] = useState('');

  const { requestLoginOtp, verifyLoginOtp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const draftStorageKey = getOtpDraftKey(redirectPath, forceVerification);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    document.body.classList.add('hide-nav');
    return () => document.body.classList.remove('hide-nav');
  }, []);

  useEffect(() => {
    if (!forceVerification && !authLoading && user) {
      router.replace(redirectPath);
    }
  }, [authLoading, forceVerification, redirectPath, router, user]);

  useEffect(() => {
    const draft = readOtpDraft(draftStorageKey);
    if (draft) {
      setStep(draft.step);
      setEmail(draft.email);
      setCode(draft.code);
      setResendCountdown(draft.resendCountdown);
      setDevCode(draft.devCode);
      setInfoMessage(draft.infoMessage);
    }
    setDraftReady(true);
  }, [draftStorageKey]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    const nextDraft: PersistedOtpDraft = {
      step,
      email,
      code,
      resendCountdown,
      devCode,
      infoMessage,
    };

    const hasContent =
      nextDraft.email.trim().length > 0 ||
      nextDraft.step === 'code' ||
      nextDraft.code.some((digit) => digit) ||
      nextDraft.resendCountdown > 0 ||
      nextDraft.devCode.length > 0 ||
      nextDraft.infoMessage.length > 0;

    if (!hasContent) {
      clearOtpDraft(draftStorageKey);
      return;
    }

    writeOtpDraft(draftStorageKey, nextDraft);
  }, [code, devCode, draftReady, draftStorageKey, email, infoMessage, resendCountdown, step]);

  const joinedCode = code.join('');
  const enterCodeCopy = devCode
    ? `Use the fallback 6 digit code shown below for ${email}.`
    : `Please enter the 6 digit code we sent to ${email}.`;

  const moveToCodeStep = (
    nextEmail: string,
    cooldownSeconds?: number,
    nextError?: string,
    nextInfoMessage?: string,
  ) => {
    setEmail(nextEmail);
    setStep('code');
    setCode(['', '', '', '', '', '']);
    if (typeof cooldownSeconds === 'number' && cooldownSeconds > 0) {
      setResendCountdown(cooldownSeconds);
    }
    if (nextError) {
      setError(nextError);
    }
    setInfoMessage(nextInfoMessage || '');
    window.setTimeout(() => inputRefs.current[0]?.focus(), 40);
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (resendCountdown > 0 && normalizedEmail === email.trim().toLowerCase()) {
      moveToCodeStep(
        normalizedEmail,
        resendCountdown,
        `A code was already sent. Enter it below or wait ${resendCountdown}s to resend.`,
      );
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await requestLoginOtp(normalizedEmail);
      if (!result.success) {
        if (result.resendInSeconds) {
          moveToCodeStep(
            normalizedEmail,
            result.resendInSeconds,
            result.message || 'A code was already sent recently.',
          );
          return;
        }
        setError(result.message || 'Could not send verification code');
        return;
      }

      setDevCode(result.debugCode || '');
      moveToCodeStep(normalizedEmail, result.resendInSeconds || 56, undefined, result.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    if (joinedCode.length !== 6) {
      setError('Please enter the 6 digit code');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await verifyLoginOtp(email, joinedCode);
      if (!result.success) {
        setError(result.message || 'Invalid verification code');
        return;
      }

      clearOtpDraft(draftStorageKey);
      router.push(redirectPath);
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const nextChar = value.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextChar;
    setCode(nextCode);

    if (nextChar && index < nextCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePasteCode = async () => {
    try {
      const pasted = await navigator.clipboard.readText();
      const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length === 0) {
        return;
      }

      const nextCode = Array.from({ length: 6 }, (_, index) => digits[index] || '');
      setCode(nextCode);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    } catch {
      setError('Could not access the clipboard');
    }
  };

  const handleResend = async () => {
    if (loading || resendCountdown > 0) return;

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await requestLoginOtp(email);
      if (!result.success) {
        if (result.resendInSeconds) {
          setResendCountdown(result.resendInSeconds);
        }
        setError(result.message || 'Could not resend the code');
        return;
      }

      setDevCode(result.debugCode || '');
      setInfoMessage(result.message || '');
      setResendCountdown(result.resendInSeconds || 56);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background:
          'radial-gradient(circle at 14% 18%, rgba(14,118,120,0.12), transparent 26%), radial-gradient(circle at 84% 12%, rgba(14,118,120,0.08), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f5fbfb 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,251,251,0.98))',
          borderRadius: '32px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 32px 70px rgba(17,39,45,0.1)',
          padding: '22px 20px 24px',
        }}
      >
        {step === 'code' && (
          <button
            onClick={() => {
              clearOtpDraft(draftStorageKey);
              setStep('email');
              setEmail('');
              setError('');
              setInfoMessage('');
              setCode(['', '', '', '', '', '']);
              setResendCountdown(0);
              setDevCode('');
            }}
            style={backButtonStyle}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div style={{ padding: '18px 10px 8px', display: 'grid', gap: '14px' }}>
          {eyebrow ? (
            <div className="eyebrow" style={{ width: 'fit-content' }}>
              <ShieldCheck size={16} />
              {eyebrow}
            </div>
          ) : null}

          <div>
            <h1
              style={{
                margin: '0 0 12px',
                fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              {step === 'email' ? emailHeading : codeHeading}
            </h1>
            <p
              style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '1.02rem',
                lineHeight: 1.7,
                maxWidth: '470px',
              }}
            >
              {step === 'email' ? emailDescription : enterCodeCopy}
            </p>
          </div>
        </div>

        {infoMessage && (
          <div style={infoBoxStyle}>
            {infoMessage}
          </div>
        )}

        {devCode && step === 'code' && (
          <div style={infoBoxStyle}>
            Use this code: <strong>{devCode}</strong>
          </div>
        )}

        {error && (
          <div
            style={{
              margin: '18px 10px 0',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 244, 244, 0.96)',
              border: '1px solid rgba(220, 38, 38, 0.14)',
              color: '#b91c1c',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} style={{ padding: '28px 10px 4px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                color: 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '18px 18px 18px 46px',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.96)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="primary-button" style={submitButtonStyle}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} style={{ padding: '28px 10px 4px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: '12px',
              }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    inputRefs.current[index] = node;
                  }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleDigitKeyDown(index, event)}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: '18px',
                    border: digit ? '1px solid var(--border-strong)' : '1px solid var(--border-color)',
                    background: digit ? 'rgba(14,118,120,0.06)' : '#fff',
                    textAlign: 'center',
                    fontSize: '1.85rem',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: '22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" onClick={handlePasteCode} style={softButtonStyle}>
                <Clipboard size={16} />
                Paste Code
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resendCountdown > 0}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: resendCountdown > 0 ? 'var(--text-tertiary)' : 'var(--primary-color)',
                  fontWeight: 700,
                  cursor: loading || resendCountdown > 0 ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RefreshCw size={14} />
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || joinedCode.length !== 6}
              className="primary-button"
              style={{
                ...submitButtonStyle,
                opacity: joinedCode.length === 6 ? 1 : 0.7,
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify and Continue'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const backButtonStyle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '999px',
  border: '1px solid var(--border-color)',
  background: '#fff',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const infoBoxStyle: React.CSSProperties = {
  margin: '18px 10px 0',
  padding: '12px 14px',
  borderRadius: '16px',
  background: 'rgba(14,118,120,0.08)',
  border: '1px solid var(--border-color)',
  color: 'var(--primary-color)',
  fontSize: '0.95rem',
  fontWeight: 700,
};

const submitButtonStyle: React.CSSProperties = {
  marginTop: '22px',
  width: '100%',
};

const softButtonStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid var(--border-color)',
  background: '#fff',
  color: 'var(--text-secondary)',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};
