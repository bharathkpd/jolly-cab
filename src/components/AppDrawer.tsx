import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, Info, Car, MapPin, Plane, Compass, Phone, 
  MessageSquare, LogOut, Bell, Tag, History, Clock, 
  Wallet, HelpCircle, Shield, FileText, User2
} from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const AppDrawer: React.FC = () => {
  const location = useLocation();
  const { isDrawerOpen, setDrawerOpen } = useUiStore();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'bookings', label: 'My Bookings', path: '/trips', icon: History },
    { id: 'services', label: 'Our Services', path: '/services', icon: Info },
    { id: 'fleet', label: 'Our Fleet', path: '/fleet', icon: Car },
    { id: 'airport', label: 'Airport Transfers', path: '/airport', icon: Plane },
    { id: 'outstation', label: 'Outstation Travel', path: '/outstation', icon: MapPin },
    { id: 'packages', label: 'Travel Packages', path: '/packages', icon: Compass },
    { id: 'offers', label: 'Offers & Coupons', path: '/offers', icon: Tag },
    { id: 'notifications', label: 'Inbox Alerts', path: '/notifications', icon: Bell },
    { id: 'help', label: 'Help & Support', path: '/contact', icon: HelpCircle }
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
            className="absolute inset-0 bg-black/40 backdrop-blur-xs z-[999] h-full w-full"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="absolute left-0 top-0 bottom-0 w-[300px] bg-white text-[#121212] flex flex-col justify-between shadow-2xl z-[1000] h-full"
            style={{ borderTopRightRadius: '24px', borderBottomRightRadius: '24px' }}
          >
            {/* Upper Content */}
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">
              
              {/* Header Profile Section */}
              <div className="p-6 bg-white border-b border-gray-100 relative">
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>

                {/* Profile Detail */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFC107] flex items-center justify-center font-display font-black text-[#121212] text-xl shadow-md border-2 border-white ring-4 ring-[#FFC107]/10">
                    {user?.name ? user.name[0].toUpperCase() : <User2 className="w-6 h-6 text-[#121212]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Logged in as</span>
                    <h3 className="font-display font-black text-base text-[#121212] tracking-tight truncate mt-0.5">
                      {user?.name || 'Guest Rider'}
                    </h3>
                    <p className="text-[10.5px] text-gray-500 font-mono mt-0.5 truncate">
                      {user?.phone ? `+91 ${user.phone.replace('+91', '')}` : 'Sign in to book a cab'}
                    </p>
                  </div>
                </div>

                {user && (
                  <div className="mt-5 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-4.5 h-4.5 text-[#FFC107] stroke-[2.5]" />
                      <div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Jolly Wallet</span>
                        <span className="text-[10px] font-bold text-gray-500 block">Personal Balance</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#121212] font-mono">₹350</span>
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
                      className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-xs font-black transition-all duration-200 ${
                        isActive
                          ? 'bg-[#FFC107] text-[#121212] shadow-md shadow-[#FFC107]/20 scale-[1.02]'
                          : 'text-[#121212]/95 hover:bg-gray-50 hover:pl-5'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#121212] stroke-[2.5]' : 'text-gray-400 stroke-2'}`} />
                      <span className="flex-1 tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Content */}
            <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-3">
              {/* Support Hotline */}
              <div className="flex items-center justify-between text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Support Line</span>
                  <span className="font-black text-[#121212] mt-0.5 font-mono text-xs">7981232371</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href="tel:+917981232371"
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-[#FFC107]/30 hover:bg-[#FFC107]/5 transition-all shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-[#121212]" />
                  </a>
                  <a
                    href="https://wa.me/917981232371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Log out option */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Account
                </button>
              )}

              {/* Version Label */}
              <div className="text-center mt-1 text-[8px] text-gray-400 tracking-widest font-mono uppercase">
                JOLLY CABS MOBILE v1.3.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppDrawer;
