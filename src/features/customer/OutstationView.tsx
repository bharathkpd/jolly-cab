import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Compass, Calendar, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useBookingStore } from '../../store/bookingStore';
import { getAssetUrl } from '../../utils/assets';

export const OutstationView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();
  const { setBookingField, clearBookingForm } = useBookingStore();

  const handleBookOutstation = () => {
    clearBookingForm();
    setBookingField('tripType', 'outstation_round');
    navigate('/booking');
  };

  const routes = [
    { destination: 'Srisailam Temple', distance: '215 KM', duration: '4.5 Hours', time: 'Round Trip', image: '/vehicles/srisailam_temple.jpg' },
    { destination: 'Tirupati Venkateswara', distance: '570 KM', duration: '10 Hours', time: 'Multi-Day Round', image: '/vehicles/tirupati_temple.png' },
    { destination: 'Vijayawada City', distance: '275 KM', duration: '5 Hours', time: 'One-Way / Round', image: '/vehicles/vijayawada_kanaka_durga.png' },
    { destination: 'Warangal Heritage', distance: '150 KM', duration: '3.5 Hours', time: 'Single / Round', image: '/vehicles/warangal_thousand_pillar.png' },
    { destination: 'Bangalore City', distance: '575 KM', duration: '9.5 Hours', time: 'Multi-Day Round', image: '/vehicles/bangalore_palace.png' },
    { destination: 'Nagpur Junction', distance: '500 KM', duration: '8 Hours', time: 'Multi-Day Round', image: '/vehicles/nagpur_deekshabhoomi.png' },
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
          <h2 className="text-sm font-display font-bold">Outstation Travel</h2>
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
        <div className="bg-gradient-to-r from-brand-dark to-slate-900 text-white rounded-3xl p-5 border border-white/10 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Compass className="w-28 h-28" />
          </div>
          <span className="px-2.5 py-0.5 bg-brand-gold/20 border border-brand-gold/30 rounded-full text-[9px] font-bold text-brand-gold uppercase tracking-wide inline-block">
            Outstation Rides
          </span>
          <h3 className="text-base font-bold font-display mt-2 leading-snug">
            Safe Intercity Journeys
          </h3>
          <p className="text-[11px] text-brand-textGray mt-1 leading-relaxed">
            Travel to any city in India from Hyderabad in our premium AC fleet. Transparent rates, zero cancellations.
          </p>
        </div>

        {/* Policies Infolist */}
        <div className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-3.5">
          <h4 className="text-xs font-bold text-brand-textDark flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-brand-gold" />
            Outstation Terms & Billing
          </h4>
          
          <ul className="flex flex-col gap-3 text-[11px] text-brand-textGray leading-relaxed divide-y divide-brand-bgLight">
            <li className="pt-0 flex flex-col gap-0.5">
              <strong className="text-brand-textDark">250 KM Minimum Billing:</strong>
              <span>A minimum distance of 250 KM is billed per calendar day for round-trips. Total package limit = days × 250 KM.</span>
            </li>
            <li className="pt-2.5 flex flex-col gap-0.5">
              <strong className="text-brand-textDark">Driver Bata (Allowance):</strong>
              <span>Driver allowance (Bata) is calculated at ₹1,000 per day to cover driver food and lodging.</span>
            </li>
            <li className="pt-2.5 flex flex-col gap-0.5">
              <strong className="text-brand-textDark">Toll Taxes & Permits:</strong>
              <span>All toll charges, state entry permits, and parking fees are extra and payable at actual toll plazas or to the driver.</span>
            </li>
            <li className="pt-2.5 flex flex-col gap-0.5">
              <strong className="text-brand-textDark">Night Driving Charge:</strong>
              <span>Driving between 11:00 PM and 5:00 AM incurs an extra night driver allowance.</span>
            </li>
          </ul>
        </div>

        {/* Popular Outstation Routes list */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-brand-textDark px-1">Popular Outstation Routes</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {routes.map((r, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-brand-borderLight shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="h-20 w-full overflow-hidden bg-brand-bgLight">
                  <img 
                    src={getAssetUrl(r.image)} 
                    alt={r.destination} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-left">
                  <h5 className="text-[10px] font-bold text-brand-textDark truncate">{r.destination}</h5>
                  <p className="text-[8.5px] text-brand-textGray mt-0.5">
                    {r.distance} • Est. {r.duration}
                  </p>
                  <span className="mt-2 inline-block px-1.5 py-0.5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded text-[8px] font-bold uppercase">
                    {r.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleBookOutstation}
          className="w-full bg-brand-dark text-white font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-premium mt-2 hover:bg-brand-dark/95"
        >
          Book Outstation Taxi
          <Compass className="w-4 h-4 text-brand-gold" />
        </button>
      </div>
    </div>
  );
};

export default OutstationView;
