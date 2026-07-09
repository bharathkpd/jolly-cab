import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, Info, Car, MapPin, Plane, Compass, Phone, 
  MessageSquare, LogOut, Bell, Tag, History, Clock, 
  Wallet, HelpCircle, Shield, FileText 
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
    { id: 'services', label: 'Services', path: '/services', icon: Info },
    { id: 'fleet', label: 'Fleet', path: '/fleet', icon: Car },
    { id: 'airport_pickup', label: 'Airport Pickup', path: '/airport', icon: Plane },
    { id: 'airport_drop', label: 'Airport Drop', path: '/airport', icon: Plane },
    { id: 'outstation', label: 'Outstation', path: '/outstation', icon: MapPin },
    { id: 'hourly', label: 'Hourly Rental', path: '/booking', icon: Clock },
    { id: 'packages', label: 'Travel Packages', path: '/packages', icon: Compass },
    { id: 'offers', label: 'Offers', path: '/offers', icon: Tag },
    { id: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell },
    { id: 'wallet', label: 'Wallet', path: '/profile', icon: Wallet },
    { id: 'help', label: 'Help & Support', path: '/contact', icon: HelpCircle },
    { id: 'about', label: 'About Us', path: '/services', icon: Shield },
    { id: 'privacy', label: 'Privacy Policy', path: '/services', icon: FileText }
  ];

  const handleClose = () => setDrawerOpen(false);

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
            className="absolute inset-0 bg-black/60 backdrop-blur-xs z-45"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="absolute left-0 top-0 bottom-0 w-[270px] bg-brand-dark text-white flex flex-col justify-between shadow-2xl z-50"
          >
            {/* Upper Content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center font-display font-black text-brand-dark text-sm">
                    JC
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm tracking-wide">Jolly Cabs</h3>
                    <p className="text-[8px] text-brand-textGray uppercase tracking-wider">Your Comfort, Our Priority</p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Profiling info (if logged in) */}
              {user && (
                <div className="px-5 py-3.5 bg-white/5 border-b border-white/10 text-xs">
                  <p className="text-brand-textGray font-semibold uppercase text-[8px] tracking-wider">Logged In As</p>
                  <p className="font-bold text-white mt-0.5 truncate">{user.name}</p>
                  <p className="text-white/60 font-mono mt-0.5">{user.phone}</p>
                </div>
              )}

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
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#FFC107] text-brand-dark shadow-gold-glow'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-dark stroke-[2.5]' : 'text-white'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Content */}
            <div className="p-5 border-t border-white/10 flex flex-col gap-3">
              {/* Support Hotline */}
              <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[8px] text-brand-textGray uppercase font-bold tracking-wide">Support Line</span>
                  <span className="font-bold text-white mt-0.5">7981232371</span>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href="tel:+917981232371"
                    className="w-7 h-7 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://wa.me/917981232371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success hover:bg-brand-success/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Log out option */}
              <button
                onClick={() => {
                  logout();
                  handleClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-danger/30 text-brand-danger hover:bg-brand-danger/10 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Account
              </button>

              {/* Version Label */}
              <div className="text-center mt-1 text-[8px] text-brand-textGray tracking-widest font-mono uppercase">
                JOLLY CABS MOBILE v1.2.0-RELEASE
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppDrawer;
