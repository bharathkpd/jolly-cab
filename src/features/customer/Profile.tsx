import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Gift, MapPin, Trash2, LogOut, ChevronRight,
  User, Globe2, Camera, Mail, CreditCard, Bell, HelpCircle, Shield, Phone,
  Car, Star, TrendingUp, Award, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [walletBalance, setWalletBalance] = useState(350);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr_1', label: 'Home Address', text: 'Kukatpally Phase-3, Hyderabad, Telangana 500072' },
    { id: 'addr_2', label: 'Office HQ', text: 'Hi-Tech City Mindspace Tech Park, Hyderabad 500081' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'telugu' | 'hindi'>('english');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [rideStats, setRideStats] = useState({ total: 0, completed: 0, cancelled: 0, totalSaved: 0 });

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
        alert(`Successfully added Rs.${parsed} to your Jolly Wallet.`);
      } else {
        alert('Invalid amount entered.');
      }
    }
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-0">
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
              <Phone className="w-3 h-3 text-[#FFC107]" /> +91 {user?.phone || '9999999999'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold flex items-center justify-center gap-1.5">
              <Mail className="w-3 h-3 text-[#FFC107]" /> rider@jollycabs.in
            </p>
          </div>
          <button className="text-[10px] font-black text-[#121212] border-2 border-[#FFC107]/40 px-5 py-2 rounded-xl hover:bg-[#FFC107]/5 transition-all uppercase tracking-wider">
            Edit Profile
          </button>
        </div>

        {/* 2. Ride Stats */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#FFC107]" />
            Your Ride Stats
          </h4>
          <div className="grid grid-cols-4 gap-3">
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
                  <span className="text-sm font-black text-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>{stat.value}</span>
                  <span className="text-[8px] font-bold text-gray-400 text-center leading-tight">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Wallet Card */}
        <div
          className="text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 60%, #2a1a00 100%)', border: '1px solid rgba(255,193,7,0.15)' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#FFC107]" style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.2)' }}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block">Jolly Wallet</span>
                <span className="text-2xl font-black font-mono text-white mt-0.5 block">Rs.{walletBalance}</span>
              </div>
            </div>
            <button
              onClick={handleAddMoney}
              className="text-[#121212] text-[10px] font-black px-4 py-2 rounded-xl shadow-md transition-colors uppercase tracking-wider"
              style={{ background: '#FFC107' }}
            >
              Add Cash
            </button>
          </div>
          <div className="border-t border-white/10 pt-3 text-[9px] text-gray-500 font-bold flex justify-between items-center">
            <span>Linked to +91 {user?.phone || '9999999999'}</span>
            <span className="text-[#FFC107]/60">Fast checkout enabled</span>
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

        {/* 5. Referral Block */}
        <div
          className="p-5 rounded-3xl flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #fff9e6, #fffde7)', border: '1px solid #FFC107/20' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#121212]">Refer & Earn Rs.150</h4>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-normal max-w-[150px] font-semibold">
                Share code with friends, earn credits on their first trip.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText('JOLLY881');
              alert('Referral code copied! Share with your friends.');
            }}
            className="border-2 border-[#FFC107]/30 hover:bg-[#FFC107]/10 px-3.5 py-2 rounded-xl text-xs font-black font-mono tracking-wider text-[#FFC107] transition-all"
          >
            JOLLY881
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

        {/* 7. Language Selection */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Globe2 className="w-3.5 h-3.5 text-[#FFC107]" />
            App Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'english', label: 'English' },
              { id: 'telugu', label: 'Telugu' },
              { id: 'hindi', label: 'Hindi' }
            ].map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id as any)}
                  className={`py-2.5 rounded-2xl border text-[10px] font-black transition-all text-center ${
                    isSelected
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-[#121212] hover:border-gray-200'
                  }`}
                >
                  {lang.label}
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
    </div>
  );
};
export default Profile;
