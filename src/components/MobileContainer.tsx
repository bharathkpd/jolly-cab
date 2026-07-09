import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Shield, Wifi, Battery, Signal, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();
  const [time, setTime] = useState('');

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminToggle = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  const handleCustomerToggle = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-body selection:bg-brand-gold selection:text-brand-dark">
      {/* Top Demo Bar - Only visible on desktop/landscape */}
      <header className="hidden lg:flex items-center justify-between px-8 py-3 bg-[#121212] border-b border-brand-dark/20 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center font-display font-bold text-brand-dark text-sm">
            JC
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-wide">JOLLY CABS</h1>
            <p className="text-[10px] text-brand-textGray tracking-wider font-semibold">COMMERCIAL TAXI PLATFORM</p>
          </div>
        </div>

        <div className="flex items-center bg-[#1c1c1c] p-1 rounded-full border border-white/5">
          <button
            onClick={handleCustomerToggle}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              !isAdminRoute
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'text-brand-textGray hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Customer App (Mobile View)
          </button>
          <button
            onClick={handleAdminToggle}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              isAdminRoute
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'text-brand-textGray hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Console (Desktop View)
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {user ? (
            <div className="flex items-center gap-3 bg-[#1E1E1E] px-3.5 py-1.5 rounded-full border border-white/5">
              <div className="w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                <User className="w-3 h-3 text-brand-gold" />
              </div>
              <span className="text-white/80 font-medium truncate max-w-[120px]">
                {user.name}
              </span>
              <button
                onClick={logout}
                title="Log Out"
                className="text-brand-textGray hover:text-brand-danger transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-brand-textGray">Demo Account: Connected</span>
          )}
        </div>
      </header>

      {isAdminRoute ? (
        // Full screen view for Admin Console
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          {children}
        </div>
      ) : (
        // Simulated Mobile Device Frame for Customer App
        <div className="flex-1 flex items-center justify-center p-0 lg:p-6 bg-gradient-to-b from-[#121212] to-[#0a0a0a] relative overflow-hidden">
          {/* Ambient glow backgrounds on desktop */}
          <div className="hidden lg:block absolute w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] top-1/4 left-1/4 pointer-events-none" />
          <div className="hidden lg:block absolute w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

          {/* Smartphone mockup */}
          <div className="w-full h-screen lg:h-[820px] lg:w-[380px] lg:rounded-[48px] bg-brand-dark lg:border-[10px] lg:border-[#2d2d2d] lg:shadow-2xl flex flex-col relative overflow-hidden lg:ring-1 lg:ring-white/10">
            {/* Notch - Only on desktop device frame */}
            <div className="hidden lg:block phone-notch" />

            {/* Mobile Status Bar */}
            <div className="h-11 bg-brand-dark px-6 flex items-center justify-between text-[11px] font-semibold text-white/90 z-40 select-none flex-shrink-0">
              <span>{time || '10:00 AM'}</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5">
                  <Battery className="w-4 h-4 rotate-0" />
                  <span className="text-[9px]">98%</span>
                </div>
              </div>
            </div>

            {/* App viewport content */}
            <div className="flex-1 flex flex-col relative bg-brand-bgLight text-brand-textDark overflow-hidden h-full scrollbar-none min-h-0">
              {children}
            </div>
            
            {/* Home Indicator - Only on desktop device frame */}
            <div className="hidden lg:block h-6 bg-brand-dark flex-shrink-0 relative">
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/35 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MobileContainer;
