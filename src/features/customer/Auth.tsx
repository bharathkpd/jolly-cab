import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, ChevronLeft, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../services/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, sentPhone, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [verifierRef, setVerifierRef] = useState<RecaptchaVerifier | null>(null);

  // Redirect if already authenticated (e.g. back-press from auth screen)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Initialize invisible reCAPTCHA
  useEffect(() => {
    let verifier: RecaptchaVerifier | null = null;
    const container = document.getElementById('recaptcha-container');
    if (!container) return;

    try {
      verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
      setVerifierRef(verifier);
    } catch (e) {
      console.warn('reCAPTCHA init failed (expected in dev/mock mode):', e);
    }

    return () => {
      try { verifier?.clear(); } catch {}
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await sendOtp(phone, verifierRef);
    if (success) setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await verifyOtp(otp, name.trim() || 'Jolly Rider');
    if (success) {
      navigate('/', { replace: true });
    }
  };

  const handleBack = () => {
    clearError();
    setStep('phone');
    setOtp('');
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: '#fff', overflow: 'hidden' }}
    >
      {/* Yellow header band */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center pt-12 pb-8 px-6"
        style={{ background: '#FFC107' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-4"
          style={{ background: '#121212' }}
        >
          <span
            className="text-3xl font-black"
            style={{ color: '#FFC107', fontFamily: 'Poppins, sans-serif' }}
          >
            JC
          </span>
        </div>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
        >
          Jolly Cabs
        </h1>
        <p className="text-xs font-semibold mt-1" style={{ color: 'rgba(18,18,18,0.65)' }}>
          Your Comfort, Our Priority
        </p>
      </div>

      {/* Form area */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#fff' }}>
        <div className="flex-1 flex flex-col justify-center px-6 py-6 max-w-sm mx-auto w-full">

          {/* Back button (OTP step only) */}
          {step === 'otp' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-bold mb-6 w-fit"
              style={{ color: '#121212' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Change Number
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2
                  className="text-xl font-black mb-1"
                  style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
                >
                  Enter your number
                </h2>
                <p className="text-xs mb-6" style={{ color: '#888' }}>
                  We'll send a 6-digit OTP to verify your identity
                </p>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2" style={{ background: '#FFF0F0', color: '#D32F2F', border: '1px solid #FFCDD2' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                  {/* Phone field */}
                  <div className="flex items-center rounded-2xl border-2 px-4 py-3 gap-3 transition-all"
                    style={{ borderColor: '#FFC107', background: '#FFFDE7' }}>
                    <span className="text-sm font-bold" style={{ color: '#121212' }}>+91</span>
                    <div className="w-px h-5" style={{ background: '#ddd' }} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 text-sm font-bold outline-none tracking-wider"
                      style={{ background: 'transparent', color: '#121212' }}
                      autoFocus
                      disabled={isLoading}
                      required
                    />
                    <Phone className="w-4 h-4" style={{ color: '#FFC107' }} />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    className="ripple-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all"
                    style={{ background: '#121212', color: '#FFC107', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                    ) : (
                      <>Get OTP <ArrowRight className="w-4 h-4 stroke-[3]" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2
                  className="text-xl font-black mb-1"
                  style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
                >
                  Verify OTP
                </h2>
                <p className="text-xs mb-6" style={{ color: '#888' }}>
                  Code sent to {sentPhone || phone}
                </p>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2" style={{ background: '#FFF0F0', color: '#D32F2F', border: '1px solid #FFCDD2' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#888' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-semibold outline-none"
                      style={{ background: '#F5F5F5', border: '1.5px solid #E0E0E0', color: '#121212' }}
                      disabled={isLoading}
                    />
                  </div>

                  {/* OTP field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#888' }}>
                      6-Digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none"
                      style={{ background: '#FFFDE7', border: '2px solid #FFC107', color: '#121212' }}
                      autoFocus
                      disabled={isLoading}
                      required
                    />
                    <p className="text-[10px] text-center mt-1" style={{ color: '#aaa' }}>
                      Demo mode: use <strong>123456</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="ripple-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider"
                    style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <><ShieldCheck className="w-4 h-4 stroke-[3]" /> Verify & Login</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 text-center flex-shrink-0">
          <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#aaa' }}>
            <HelpCircle className="w-3.5 h-3.5" style={{ color: '#FFC107' }} />
            Need help? Call +91 79812 32371
          </p>
        </div>
      </div>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} />
    </div>
  );
};

export default Auth;
