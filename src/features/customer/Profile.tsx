import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Wallet, Gift, MapPin, Trash2, LogOut, ChevronRight, 
  User, Globe2, Camera, Mail, CreditCard, Bell, HelpCircle, Shield, Phone 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [walletBalance, setWalletBalance] = useState(350); // mock wallet balance
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'addr_1', label: 'Home Address', text: 'Kukatpally Phase-3, Hyderabad, Telangana 500072' },
    { id: 'addr_2', label: 'Office HQ', text: 'Hi-Tech City Mindspace Tech Park, Hyderabad 500081' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'telugu' | 'hindi'>('english');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'WARNING: Are you sure you want to permanently delete your Jolly Cabs account? This will purge all your ride history and wallet balance. This action cannot be undone.'
      )
    ) {
      localStorage.removeItem('jolly_cabs_bookings');
      localStorage.removeItem('jolly_cabs_user');
      logout();
      alert('Your account and personal data have been completely deleted.');
      navigate('/');
    }
  };

  const handleAddMoney = () => {
    const amt = prompt('Enter amount to add to Jolly Wallet (INR):', '500');
    if (amt) {
      const parsed = parseInt(amt);
      if (!isNaN(parsed) && parsed > 0) {
        setWalletBalance(prev => prev + parsed);
        alert(`Successfully added ₹${parsed} to your Jolly Wallet.`);
      } else {
        alert('Invalid amount entered.');
      }
    }
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Sticky Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Profile & Settings</h2>
        </div>
      </div>

      {/* Profile Body Content */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        
        {/* 1. Profile Info Card with Avatar */}
        <div className="bg-white p-5 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center font-display font-bold text-brand-gold text-2xl border-4 border-brand-gold/20">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark shadow-md border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-textDark">{user?.name || 'Jolly Rider'}</h3>
            <p className="text-[10px] text-brand-textGray mt-0.5 flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" /> +91 {user?.phone || '9999999999'}
            </p>
            <p className="text-[10px] text-brand-textGray mt-0.5 flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" /> rider@jollycabs.in
            </p>
          </div>
          <button className="text-[10px] font-bold text-brand-gold border border-brand-gold/30 px-4 py-1.5 rounded-xl hover:bg-brand-gold/5 transition-all">
            Edit Profile
          </button>
        </div>

        {/* 2. Wallet Card */}
        <div className="bg-[#121212] text-white p-5 rounded-3xl shadow-premium border border-brand-gold/15 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold">
                <Wallet className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] text-brand-textGray font-bold uppercase tracking-wider block">
                  Jolly Wallet Balance
                </span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">
                  ₹{walletBalance}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleAddMoney}
              className="bg-brand-gold text-brand-dark text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-gold-glow hover:bg-brand-lightGold transition-colors uppercase tracking-wider"
            >
              Add Cash
            </button>
          </div>

          <div className="border-t border-white/10 pt-3 mt-4 text-[9px] text-brand-textGray font-semibold flex justify-between items-center">
            <span>Linked to +91 {user?.phone || '9999999999'}</span>
            <span>Fast checkout enabled</span>
          </div>
        </div>

        {/* 3. Payment Methods */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1.5 px-1">
            <CreditCard className="w-4 h-4 text-brand-gold" />
            Payment Methods
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { label: 'UPI - PhonePe', detail: 'user@ybl', type: 'UPI' },
              { label: 'Cash Payment', detail: 'Pay driver directly', type: 'Cash' },
            ].map((pm, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-brand-bgLight rounded-2xl border border-brand-borderLight">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-brand-borderLight flex items-center justify-center text-brand-gold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-brand-textDark">{pm.label}</h5>
                    <p className="text-[9px] text-brand-textGray">{pm.detail}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-textGray" />
              </div>
            ))}
            <button className="w-full py-2.5 bg-white border border-dashed border-brand-gold/40 rounded-xl text-[10px] font-bold text-brand-gold hover:bg-brand-gold/5 transition-colors">
              + Add Payment Method
            </button>
          </div>
        </div>

        {/* 4. Referral Block */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-textDark">Refer & Earn ₹150</h4>
              <p className="text-[9px] text-brand-textGray mt-0.5 leading-normal max-w-[150px]">
                Share code with friends, earn credits on their first trip.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText('JOLLY881');
              alert('Referral link copied! Share with your friends.');
            }}
            className="border border-brand-gold/30 hover:bg-brand-gold/5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wider text-brand-gold transition-all"
          >
            JOLLY881
          </button>
        </div>

        {/* 5. Notifications Toggle */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-textDark">Push Notifications</h4>
              <p className="text-[9px] text-brand-textGray mt-0.5">Ride updates, offers & alerts</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full transition-all relative ${notificationsEnabled ? 'bg-brand-gold' : 'bg-brand-borderLight'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${notificationsEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* 6. Language Selection */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-brand-gold" />
            App Language
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'english', label: 'English' },
              { id: 'telugu', label: 'తెలుగు (Telugu)' },
              { id: 'hindi', label: 'हिन्दी (Hindi)' }
            ].map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id as any)}
                  className={`py-2 rounded-xl border text-[10px] font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-brand-bgLight text-brand-textGray border-brand-borderLight hover:text-brand-textDark'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Saved Addresses */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
            Saved Addresses
          </h4>

          <div className="flex flex-col gap-2.5">
            {savedAddresses.map((addr) => (
              <div 
                key={addr.id}
                className="flex items-start justify-between gap-3 p-3.5 bg-brand-bgLight rounded-2xl border border-brand-borderLight"
              >
                <div className="flex gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-brand-textDark">{addr.label}</h5>
                    <p className="text-[10px] text-brand-textGray mt-0.5 leading-normal truncate max-w-[180px]">
                      {addr.text}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-brand-textGray hover:text-brand-danger transition-colors p-0.5"
                  title="Delete Address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Quick Action Links */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-1">
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
                className="flex items-center justify-between py-3 px-1 text-xs font-bold text-brand-textDark hover:text-brand-gold transition-colors border-b border-brand-bgLight last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-brand-textGray" />
                  {link.label}
                </div>
                <ChevronRight className="w-4 h-4 text-brand-textGray" />
              </button>
            );
          })}
        </div>

        {/* 9. Settings Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-brand-borderLight hover:bg-brand-bgLight text-brand-textDark font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <LogOut className="w-4 h-4 text-brand-textGray" />
            Logout from Account
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-50 hover:bg-red-100 text-brand-danger font-bold py-3.5 rounded-2xl text-[10px] flex items-center justify-center gap-2 transition-all mt-4 border border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5 text-brand-danger" />
            Delete Account Permanently (GDPR / Data Purge)
          </button>
        </div>

      </div>
    </div>
  );
};
export default Profile;
