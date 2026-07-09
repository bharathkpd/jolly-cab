import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Plane, Shield, Clock, Compass, AlertCircle, Phone } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useBookingStore } from '../../store/bookingStore';

export const AirportView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();
  const { setBookingField, clearBookingForm } = useBookingStore();

  const handleBookAirport = (isPickup: boolean) => {
    clearBookingForm();
    setBookingField('tripType', isPickup ? 'airport_pickup' : 'airport_drop');
    // Default to common airport routes
    if (isPickup) {
      setBookingField('pickupAddress', 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad');
      setBookingField('dropAddress', 'Kukatpally, Hyderabad, Telangana');
    } else {
      setBookingField('pickupAddress', 'Kukatpally, Hyderabad, Telangana');
      setBookingField('dropAddress', 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad');
    }
    navigate('/booking');
  };

  const rates = [
    { area: 'Kukatpally / Miyapur', hatchback: '₹1,299', sedan: '₹1,499', suv: '₹1,999' },
    { area: 'Gachibowli / Hitech City', hatchback: '₹1,099', sedan: '₹1,299', suv: '₹1,799' },
    { area: 'Secunderabad / Begumpet', hatchback: '₹1,399', sedan: '₹1,599', suv: '₹2,099' },
    { area: 'Charminar / Old City', hatchback: '₹1,199', sedan: '₹1,399', suv: '₹1,899' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Top Header */}
      <div className="bg-brand-dark text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Airport Transfers</h2>
        </div>
        <button 
          type="button"
          onClick={toggleDrawer}
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
        >
          <Menu className="w-4.5 h-4.5 text-[#FFC107]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-5 border border-white/10 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Plane className="w-28 h-28" />
          </div>
          <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[9px] font-bold text-blue-400 uppercase tracking-wide inline-block">
            RGIA transfers
          </span>
          <h3 className="text-base font-bold font-display mt-2 leading-snug">
            Airport Pickups & Drops
          </h3>
          <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
            Reliable, 24/7 airport cabs in Hyderabad. On-time chauffeur reporting, neat cars, and transparent flat pricing.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-brand-borderLight flex flex-col gap-1.5 shadow-sm">
            <Clock className="w-5 h-5 text-brand-gold" />
            <h4 className="text-[10px] font-bold text-brand-textDark uppercase">Delay Tracking</h4>
            <p className="text-[9.5px] text-brand-textGray leading-relaxed">We monitor flight schedules to adjust pickup times automatically.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-borderLight flex flex-col gap-1.5 shadow-sm">
            <Shield className="w-5 h-5 text-brand-gold" />
            <h4 className="text-[10px] font-bold text-brand-textDark uppercase">Zero Surges</h4>
            <p className="text-[9.5px] text-brand-textGray leading-relaxed">Rain or peak traffic hours, airport rates remain fixed as estimated.</p>
          </div>
        </div>

        {/* Flat Rate Estimation Sheet */}
        <div className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <h4 className="text-xs font-bold text-brand-textDark flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-brand-gold" />
            Estimated Regional Flat Fares
          </h4>
          <p className="text-[9px] text-brand-textGray leading-normal">
            *Inclusive of fuel & driver bata. Toll charges (Outer Ring Road) are extra as per actuals.
          </p>

          <div className="flex flex-col gap-2.5 mt-2.5">
            {rates.map((r, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 border-b border-brand-bgLight pb-2.5 last:border-b-0 last:pb-0">
                <span className="text-[10px] font-bold text-brand-textDark">{r.area}</span>
                <div className="grid grid-cols-3 gap-2 text-[9px] text-brand-textGray">
                  <span>Hatchback: <strong className="text-brand-textDark">{r.hatchback}</strong></span>
                  <span>Sedan: <strong className="text-brand-textDark">{r.sedan}</strong></span>
                  <span>SUV: <strong className="text-brand-textDark">{r.suv}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Buttons */}
        <div className="flex gap-3 mt-1.5">
          <button
            onClick={() => handleBookAirport(false)}
            className="flex-1 bg-brand-dark text-white font-display font-bold py-3.5 rounded-2xl text-[10px] flex items-center justify-center gap-1.5 shadow-premium hover:bg-brand-dark/95"
          >
            Book Airport Drop
          </button>
          <button
            onClick={() => handleBookAirport(true)}
            className="flex-1 bg-brand-gold text-brand-dark font-display font-bold py-3.5 rounded-2xl text-[10px] flex items-center justify-center gap-1.5 shadow-gold-glow hover:bg-brand-lightGold"
          >
            Book Airport Pickup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirportView;
