import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Gift, MapPin, Trash2, LogOut, ChevronRight,
  User, Globe2, Camera, Mail, CreditCard, Bell, HelpCircle, Shield, Phone,
  Car, Star, TrendingUp, Award, ArrowLeft, Check, Copy, X, Save
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserName } = useAuthStore();
  const [walletBalance, setWalletBalance] = useState(350);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr_1', label: 'Home Address', text: 'Kukatpally Phase-3, Hyderabad, Telangana 500072' },
    { id: 'addr_2', label: 'Office HQ', text: 'Hi-Tech City Mindspace Tech Park, Hyderabad 500081' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'telugu' | 'hindi'>('english');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [rideStats, setRideStats] = useState({ total: 0, completed: 0, cancelled: 0, totalSaved: 0 });
  
  // States for Edit Profile modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('rider@jollycabs.in');
  
  // State for Refer code copied state
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem('jolly_cabs_bookings');
      if (local) {
        const bookings = JSON.parse(local);
        if (Array.isArray(bookings)) {
          const completed = bookings.filter((b: any) => b.status === 'trip_completed').length;
          const cancelled = bookings.filter((b: any) => b.status === 'cancelled').length;
          const totalSaved = bookings.reduce((acc: number, b: any) => acc + (b.fareBreakdown?.discount || 0), 0);
          setRideStats({ total: bookings.length, completed, cancelled, totalSaved });
        }
      }
    } catch (e) {}
  }, []);

  // Initialize edit fields
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone.replace('+91', ''));
    }
  }, [user, isEditModalOpen]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/auth', { replace: true });
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your Jolly Cabs account? This will purge all your ride history and wallet balance. This action cannot be undone.')) {
      localStorage.removeItem('jolly_cabs_bookings');
      localStorage.removeItem('jolly_cabs_user');
      logout();
      navigate('/auth', { replace: true });
    }
  };

  const handleAddMoney = () => {
    const amt = prompt('Enter amount to add to Jolly Wallet (INR):', '500');
    if (amt) {
      const parsed = parseInt(amt);
      if (!isNaN(parsed) && parsed > 0) {
        setWalletBalance(prev => prev + parsed);
      } else {
        alert('Invalid amount entered.');
      }
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('JOLLY881');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    // Update store
    await updateUserName(editName);
    setIsEditModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-0 relative">
      {/* Sticky Header */}
      <div className="bg-[#121212] p-5 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h2 className="text-sm font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Profile & Settings
        </h2>
      </div>

      {/* Profile Body Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-5 scrollbar-none">

        {/* 1. Profile Info Card with Avatar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center animate-slide-up">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-black text-[#121212] text-2xl shadow-lg border-4 border-white ring-4 ring-[#FFC107]/20"
              style={{ background: 'linear-gradient(135deg, #FFC107, #FFE082)', fontFamily: 'Poppins, sans-serif' }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#121212] flex items-center justify-center text-[#FFC107] shadow-md border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-black text-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.name || 'Jolly Rider'}</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold flex items-center justify-center gap-1.5">
              <Phone className="w-3 h-3 text-[#FFC107]" /> +91 {user?.phone ? user.phone.replace('+91', '') : '9999999999'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold flex items-center justify-center gap-1.5">
              <Mail className="w-3 h-3 text-[#FFC107]" /> {editEmail}
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[10px] font-black text-[#121212] border-2 border-[#FFC107] bg-[#FFC107]/10 px-5 py-2 rounded-xl hover:bg-[#FFC107] transition-all uppercase tracking-wider shadow-sm"
          >
            Edit Profile Details
          </button>
        </div>

        {/* 2. Ride Stats */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#FFC107]" />
            Your Ride Stats
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total Rides', value: rideStats.total || 12, icon: Car, color: '#FFC107' },
              { label: 'Completed', value: rideStats.completed || 10, icon: Award, color: '#4CAF50' },
              { label: 'Cancelled', value: rideStats.cancelled || 2, icon: Star, color: '#F44336' },
              { label: 'Saved (Rs.)', value: rideStats.totalSaved || 320, icon: Gift, color: '#2196F3' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-black text-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>{stat.value}</span>
                  <span className="text-[8px] font-bold text-gray-400 text-center leading-tight">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Wallet Card - Perfected Credit Card Look */}
        <div
          className="text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden h-44 border border-brand-gold/20"
          style={{ background: 'linear-gradient(135deg, #121212 0%, #202020 60%, #171000 100%)' }}
        >
          {/* Card branding design overlay */}
          <div className="absolute right-0 bottom-0 top-0 w-32 opacity-10 pointer-events-none" style={{
            background: 'radial-gradient(circle at 100% 100%, #FFC107 0%, transparent 75%)'
          }} />
          <div className="absolute top-0 right-0 p-5 flex flex-col items-end">
            <span className="text-[9px] font-black tracking-widest text-[#FFC107] uppercase">Jolly Premium</span>
            <div className="w-9 h-6 rounded-md bg-white/10 mt-2 flex items-center justify-center border border-white/20">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 -mr-1" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            {/* Header: Chip & Wallet info */}
            <div className="flex items-center gap-2">
              {/* Gold Chip Mock */}
              <div className="w-7 h-5.5 rounded bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-500/30 flex flex-col gap-1 p-0.5 justify-around shadow-sm">
                <div className="h-[1px] bg-yellow-800/20" />
                <div className="h-[1px] bg-yellow-800/20" />
                <div className="h-[1px] bg-yellow-800/20" />
              </div>
              <div>
                <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">Wallet Balance</span>
                <span className="text-xl font-black font-mono text-[#FFC107] mt-0.5 block">Rs.{walletBalance}</span>
              </div>
            </div>

            {/* Simulated Card Number */}
            <div className="text-[12px] font-mono tracking-[4px] text-gray-300 mt-2">
              ••••  ••••  ••••  {user?.phone ? user.phone.slice(-4) : '8821'}
            </div>

            {/* Bottom details */}
            <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-2">
              <div>
                <span className="text-[7px] text-gray-500 uppercase tracking-widest block">Card Holder</span>
                <span className="text-[9px] font-bold text-gray-200 uppercase tracking-wide truncate max-w-[130px] block mt-0.5">
                  {user?.name || 'Guest Rider'}
                </span>
              </div>
              <button
                onClick={handleAddMoney}
                className="text-[#121212] text-[9px] font-black px-3.5 py-1.5 rounded-xl shadow-md transition-all active:scale-95 uppercase tracking-wider hover:bg-yellow-400"
                style={{ background: '#FFC107' }}
              >
                + Add Cash
              </button>
            </div>
          </div>
        </div>

        {/* 4. Payment Methods */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-[#FFC107]" />
            Payment Methods
          </h4>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'UPI - PhonePe', detail: 'user@ybl', type: 'UPI' },
              { label: 'Cash Payment', detail: 'Pay driver directly', type: 'Cash' },
            ].map((pm, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#FFC107] shadow-sm">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-[#121212]">{pm.label}</h5>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">{pm.detail}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
            <button className="w-full py-3 bg-white border border-dashed border-[#FFC107]/40 rounded-2xl text-[10px] font-black text-[#FFC107] hover:bg-[#FFC107]/5 transition-colors uppercase tracking-wider">
              + Add Payment Method
            </button>
          </div>
        </div>

        {/* 5. Refer & Earn - Perfected Voucher Layout */}
        <div
          className="rounded-3xl flex items-center justify-between gap-4 p-5 relative overflow-hidden border border-brand-gold/15"
          style={{ background: 'linear-gradient(135deg, #FFFDE7, #FFF8E1)' }}
        >
          {/* Side ticket punches mock */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#F8F9FA] -translate-y-1/2 border-r border-[#FFC107]/20" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#F8F9FA] -translate-y-1/2 border-l border-[#FFC107]/20" />

          <div className="flex items-center gap-3.5 pl-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Gift className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#121212]">Refer & Earn Rs.150</h4>
              <p className="text-[9.5px] text-gray-500 mt-0.5 leading-relaxed max-w-[160px] font-semibold">
                Friend signs up & rides, you both get Rs.150!
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCopyReferral}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black font-mono tracking-wider border-2 border-dashed transition-all active:scale-95 min-w-[100px] justify-center"
            style={{
              borderColor: '#FFC107',
              background: isCopied ? '#FFC107' : 'transparent',
              color: '#121212'
            }}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                COPIED
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-600" />
                JOLLY881
              </>
            )}
          </button>
        </div>

        {/* 6. Notifications Toggle */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#121212]">Push Notifications</h4>
              <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">Ride updates, offers & alerts</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full transition-all relative ${notificationsEnabled ? 'bg-[#FFC107]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notificationsEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* 7. Language Selection - Perfected with Yellow Check Dot */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Globe2 className="w-3.5 h-3.5 text-[#FFC107]" />
            App Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'english', label: 'English (US)' },
              { id: 'telugu', label: 'తెలుగు (Telugu)' },
              { id: 'hindi', label: 'हिन्दी (Hindi)' }
            ].map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id as any)}
                  className={`py-3 px-1 rounded-2xl border text-[9.5px] font-black transition-all text-center flex flex-col items-center justify-center gap-1.5 relative ${
                    isSelected
                      ? 'bg-[#121212] text-white border-[#121212] shadow-sm'
                      : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-[#121212] hover:border-gray-200'
                  }`}
                >
                  <span>{lang.label}</span>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Saved Addresses */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
            Saved Addresses
          </h4>
          <div className="flex flex-col gap-2.5">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start justify-between gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#FFC107] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-black text-[#121212]">{addr.label}</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-normal truncate max-w-[180px] font-semibold">
                      {addr.text}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-0.5"
                  title="Delete Address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="w-full py-3 bg-white border border-dashed border-gray-300 rounded-2xl text-[10px] font-black text-gray-400 hover:text-[#121212] hover:border-gray-400 transition-colors uppercase tracking-wider">
              + Add New Address
            </button>
          </div>
        </div>

        {/* 9. Quick Action Links */}
        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
          {[
            { label: 'Help & Support', icon: HelpCircle, path: '/contact' },
            { label: 'Privacy Policy', icon: Shield, path: '/services' },
            { label: 'About Jolly Cabs', icon: User, path: '/services' },
          ].map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
                className="flex items-center justify-between w-full py-3.5 px-3.5 text-xs font-black text-[#121212] hover:text-[#FFC107] transition-colors border-b border-gray-50 last:border-0 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gray-300" />
                  {link.label}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-200" />
              </button>
            );
          })}
        </div>

        {/* 10. Settings Buttons */}
        <div className="flex flex-col gap-2.5 pb-4">
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#121212] font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            Logout from Account
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-black py-4 rounded-2xl text-[10px] flex items-center justify-center gap-2 transition-all border border-red-100 uppercase tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            Delete Account Permanently (GDPR)
          </button>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-bounce-in">
            {/* Modal Header */}
            <div className="bg-[#121212] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <User className="w-4.5 h-4.5 text-[#FFC107]" />
                <h3 className="text-sm font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>Edit Profile</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-5 flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-bold bg-gray-50 border border-gray-150 focus:border-[#FFC107] focus:bg-white outline-none transition-all text-[#121212]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Phone Number</label>
                <div className="relative">
                  <span className="text-xs font-bold text-[#121212] absolute left-3.5 top-1/2 -translate-y-1/2">+91</span>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile number"
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-2xl text-xs font-bold bg-gray-100 border border-gray-150 outline-none text-[#999] cursor-not-allowed"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[8px] text-gray-400 font-semibold leading-normal">Registered number cannot be changed for security.</p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="rider@jollycabs.in"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-bold bg-gray-50 border border-gray-150 focus:border-[#FFC107] focus:bg-white outline-none transition-all text-[#121212]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  style={{ background: '#FFC107', color: '#121212' }}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
