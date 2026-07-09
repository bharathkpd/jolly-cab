import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Home, Info, Car, MapPin, Plane, Compass, Phone,
  MessageSquare, LogOut, Bell, Tag, History, Wallet, HelpCircle, User2, ChevronRight, Award
} from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const AppDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDrawerOpen, setDrawerOpen } = useUiStore();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: 'home', label: 'Home', sub: 'Book your ride', path: '/', icon: Home },
    { id: 'bookings', label: 'My Bookings', sub: 'Ride history & active rides', path: '/trips', icon: History },
    { id: 'services', label: 'Our Services', sub: 'What we offer', path: '/services', icon: Info },
    { id: 'fleet', label: 'Our Fleet', sub: 'Recommended vehicles', path: '/fleet', icon: Car },
    { id: 'airport', label: 'Airport Transfers', sub: 'Flat-rate transfers', path: '/airport', icon: Plane },
    { id: 'outstation', label: 'Outstation Travel', sub: 'Intercity one-way/round', path: '/outstation', icon: MapPin },
    { id: 'packages', label: 'Travel Packages', sub: 'Tour specials', path: '/packages', icon: Compass },
    { id: 'offers', label: 'Offers & Coupons', sub: 'Promo codes active', path: '/offers', icon: Tag, badge: 'NEW' },
    { id: 'notifications', label: 'Inbox Alerts', sub: 'System notifications', path: '/notifications', icon: Bell },
    { id: 'help', label: 'Help & Support', sub: '24/7 hotline support', path: '/contact', icon: HelpCircle }
  ];

  const handleClose = () => setDrawerOpen(false);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[999] h-full w-full"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute left-0 top-0 bottom-0 w-[310px] bg-white text-[#121212] flex flex-col justify-between shadow-2xl z-[1000] h-full"
            style={{ borderTopRightRadius: '28px', borderBottomRightRadius: '28px' }}
          >
            {/* Upper Content */}
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">

              {/* Premium Header Profile Section */}
              <div className="p-6 bg-gradient-to-br from-[#121212] to-[#252525] relative overflow-hidden flex-shrink-0">
                {/* Glow graphic design */}
                <div className="absolute right-0 bottom-0 top-0 w-28 opacity-10 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 100% 50%, #FFC107 0%, transparent 80%)'
                }} />
                
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Profile Detail */}
                <div className="flex items-center gap-3.5 mt-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-13 h-13 rounded-full flex items-center justify-center font-display font-black text-[#121212] text-lg shadow-md border-2 border-white ring-4 ring-[#FFC107]/20" style={{ background: 'linear-gradient(135deg, #FFC107, #FFE082)' }}>
                      {user?.name ? user.name[0].toUpperCase() : <User2 className="w-5.5 h-5.5 text-[#121212]" />}
                    </div>
                    {user && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FFC107] border border-white flex items-center justify-center shadow-sm">
                        <Award className="w-3 h-3 text-[#121212]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7.5px] font-black text-brand-gold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                        {user ? 'Premium Rider' : 'Guest Rider'}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-sm text-white tracking-tight truncate mt-1">
                      {user?.name || 'Guest Rider'}
                    </h3>
                    <p className="text-[9.5px] text-gray-400 font-mono mt-0.5 truncate">
                      {user?.phone ? `+91 ${user.phone.replace('+91', '')}` : 'Sign in to book a cab'}
                    </p>
                  </div>
                </div>

                {/* mini-Wallet display card */}
                {user && (
                  <div
                    onClick={() => { handleClose(); navigate('/profile'); }}
                    className="mt-5 p-3.5 rounded-2xl flex items-center justify-between shadow-md border border-white/10 cursor-pointer hover:border-brand-gold/35 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFC107]/10 border border-[#FFC107]/15">
                        <Wallet className="w-4 h-4 text-[#FFC107]" />
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Jolly Wallet</span>
                        <span className="text-[9px] text-[#FFC107] font-bold block mt-0.5">Click to view card</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-white font-mono">Rs.350</span>
                  </div>
                )}
              </div>

              {/* Navigation Menu Links */}
              <nav className="p-4 flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={handleClose}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 relative group ${
                        isActive
                          ? 'bg-[#FFC107]/10 border-l-4 border-[#FFC107] text-[#121212]'
                          : 'text-[#121212]/90 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#FFC107] text-[#121212]' : 'bg-gray-50 group-hover:bg-white text-gray-400 border border-gray-100'}`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display font-black text-[11px] block tracking-wide">{item.label}</span>
                        <span className="text-[8.5px] text-gray-450 font-semibold block mt-0.25">{item.sub}</span>
                      </div>
                      
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded bg-red-500 text-white font-black text-[7.5px] uppercase tracking-wider scale-95 shadow-sm animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Content */}
            <div className="p-5 border-t border-gray-100 bg-[#F8F9FA] flex flex-col gap-3">
              {/* Support Hotline */}
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-2xl border border-gray-150">
                <div className="flex flex-col">
                  <span className="text-[7.5px] text-gray-400 uppercase font-black tracking-widest">Support Line</span>
                  <span className="font-black text-[#121212] mt-0.5 font-mono text-xs">7981232371</span>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href="tel:+917981232371"
                    className="w-8.5 h-8.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-[#FFC107]/30 hover:bg-[#FFC107]/5 transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#121212]" />
                  </a>
                  <a
                    href="https://wa.me/917981232371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8.5 h-8.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-emerald-250 hover:bg-emerald-50 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Log out option */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-150 text-red-500 bg-white hover:bg-red-50 hover:border-red-200 text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Sign Out Account
                </button>
              )}

              {/* Version Label */}
              <div className="text-center mt-1 text-[7.5px] text-gray-400 tracking-widest font-mono uppercase font-black">
                JOLLY CABS APP v1.4.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppDrawer;
