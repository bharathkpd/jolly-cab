import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, isLoading, error, clearError } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await loginAdmin(username, password);
    if (success) {
      navigate('/admin');
    }
  };

  const handleBack = () => {
    clearError();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#070e1a] text-white min-h-screen relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[80px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[80px] bottom-1/4 right-1/4 pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-brand-textGray hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to App
      </button>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#1E1E1E]/95 border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-md z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="text-xl font-display font-bold">Admin Console Sign In</h2>
          <p className="text-[10px] text-brand-textGray mt-1.5 leading-relaxed">
            Only authorized personnel may access the billing configurations and active ride monitors.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-brand-danger text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-semibold">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-brand-textGray uppercase tracking-wider">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-brand-textGray">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="E.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#050b14] border border-white/10 focus:border-brand-gold rounded-xl text-white outline-none transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-brand-textGray uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-brand-textGray">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#050b14] border border-white/10 focus:border-brand-gold rounded-xl text-white outline-none transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="ripple-btn w-full bg-brand-gold text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-gold-glow mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-brand-dark border-t-transparent animate-spin" />
            ) : (
              'Enter Admin Dashboard'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-[9px] text-brand-textGray">
            Demo Credentials: <span className="text-brand-gold font-bold">admin</span> / <span className="text-brand-gold font-bold">jollyadmin</span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
