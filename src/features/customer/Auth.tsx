import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../services/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

export const Auth: React.FC = () => {
  const { sendOtp, verifyOtp, verificationId, sentPhone, isLoading, error, clearError } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize recaptcha verifier only once on component mount
    const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });
    setVerifier(recaptcha);

    return () => {
      try {
        recaptcha.clear();
      } catch (e) {
        console.warn('Error clearing recaptcha verifier on unmount:', e);
      }
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const BYPASS_ACTIVE = true;
    if (!BYPASS_ACTIVE && !verifier) {
      alert('reCAPTCHA security module is loading. Please try again in a moment.');
      return;
    }
    const success = await sendOtp(phone, verifier);
    if (success) {
      const state = useAuthStore.getState();
      if (!state.isAuthenticated) {
        setStep('otp');
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(otp, name || 'Jolly Rider');
  };

  const handleBack = () => {
    clearError();
    setStep('phone');
    setOtp('');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-brand-dark h-full relative">
      {/* Header Back Button */}
      <div className="pt-2 z-10 flex items-center h-10">
        {step === 'otp' && (
          <button 
            onClick={handleBack}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Core Form Section */}
      <div className="flex-1 flex flex-col justify-center z-10 max-w-sm mx-auto w-full py-4">
        {/* Large Premium Branding & Monogram Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-dark flex items-center justify-center shadow-lg border border-gray-150">
            <span className="font-display font-black text-2xl text-brand-gold tracking-tight">JC</span>
          </div>

          <h2 className="text-2xl font-display font-black tracking-tight text-brand-dark">
            Jolly <span className="text-brand-gold">Cabs</span>
          </h2>
          <p className="text-xs text-brand-textGray mt-1.5 font-semibold tracking-wide">
            Your Comfort, Our Priority
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-brand-danger text-xs font-semibold mb-5 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </motion.div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
                Enter your mobile number
              </label>
              
              <div className="flex items-center bg-brand-bgLight border border-gray-200 focus-within:border-brand-gold rounded-2xl px-3 py-1 gap-2 shadow-sm focus-within:ring-1 focus-within:ring-brand-gold/25 transition-all">
                {/* Country Code Picker Dropdown */}
                <div className="relative flex items-center">
                  <select 
                    className="appearance-none bg-transparent py-3 pl-1 pr-6 text-sm font-black text-brand-dark outline-none cursor-pointer"
                    defaultValue="+91"
                    disabled={isLoading}
                  >
                    <option value="+91" className="bg-white text-brand-dark">+91</option>
                    <option value="+1" className="bg-white text-brand-dark">+1</option>
                    <option value="+44" className="bg-white text-brand-dark">+44</option>
                    <option value="+971" className="bg-white text-brand-dark">+971</option>
                  </select>
                  <div className="pointer-events-none absolute right-1.5 flex items-center text-brand-textGray">
                    <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1.5px] h-6 bg-gray-200" />

                {/* Number Input */}
                <input
                  type="tel"
                  placeholder="00000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 py-3 text-sm font-black text-brand-dark bg-transparent outline-none placeholder:text-brand-textGray/45 placeholder:font-normal tracking-wider"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-gold-glow mt-2 disabled:opacity-40 disabled:pointer-events-none uppercase tracking-wider text-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-dark border-t-transparent animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="E.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-brand-bgLight border border-gray-200 focus:border-brand-gold rounded-2xl text-xs font-bold text-brand-dark outline-none shadow-sm focus:ring-1 focus:ring-brand-gold/25 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3.5 bg-brand-bgLight border border-gray-200 focus:border-brand-gold rounded-2xl text-center text-lg font-black tracking-[0.4em] text-brand-dark outline-none shadow-sm focus:ring-1 focus:ring-brand-gold/25 transition-all placeholder:text-brand-textGray/40"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-gold-glow mt-2 disabled:opacity-40 disabled:pointer-events-none uppercase tracking-wider text-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-dark border-t-transparent animate-spin" />
              ) : (
                <>
                  Verify & Log In
                  <ShieldCheck className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer Support Info */}
      <div className="pb-2 text-center z-10">
        <p className="text-[10px] text-brand-textGray font-semibold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
          Need assistance? Contact support at +91 79812 32371
        </p>
      </div>

      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container" className="absolute bottom-0 left-0 h-0 w-0 opacity-0 pointer-events-none"></div>
    </div>
  );
};

export default Auth;
