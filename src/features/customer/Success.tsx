import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, clearBookingForm } = useBookingStore();

  const handleTrack = () => {
    if (activeBooking) {
      navigate(`/track/${activeBooking.id}`);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    clearBookingForm();
    navigate('/');
  };

  if (!activeBooking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-12 h-12 text-brand-gold mb-3" />
        <h3 className="font-bold text-sm">Booking Confirmed</h3>
        <p className="text-xs text-brand-textGray mt-1">Please return to home or check history.</p>
        <button onClick={handleHome} className="mt-4 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      {/* 1. Header Spacer */}
      <div />

      {/* 2. Success Celebration Card */}
      <div className="flex flex-col items-center text-center my-6">
        {/* Confetti Circle Ripple */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center shadow-gold-glow z-10 relative"
          >
            <Check className="w-10 h-10 text-brand-dark stroke-[3]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-brand-gold rounded-full z-0"
          />
        </div>

        <h2 className="text-xl font-display font-bold text-brand-textDark">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-brand-textGray mt-1 max-w-[280px]">
          Your ride request has been dispatched. Jolly Cabs is assigning your vehicle.
        </p>

        {/* Short specs card */}
        <div className="bg-brand-bgLight border border-brand-borderLight p-4 rounded-3xl w-full max-w-[300px] mt-6 flex flex-col gap-3 text-xs text-left shadow-sm">
          <div className="flex justify-between border-b border-brand-borderLight pb-2 text-[10px] font-bold text-brand-textGray uppercase">
            <span>Booking ID: {activeBooking.id}</span>
            <span>{activeBooking.tripType.replace('_', ' ')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-textDark truncate max-w-[200px]">Pickup Location</p>
                <p className="text-[10px] text-brand-textGray truncate max-w-[200px]">{activeBooking.pickupAddress}</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-brand-bgLight pt-2">
              <Calendar className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-brand-textDark">Scheduled Date & Time</p>
                <p className="text-[10px] text-brand-textGray mt-0.5">{activeBooking.date} • {activeBooking.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Action Buttons */}
      <div className="flex flex-col gap-3 pb-4">
        <button
          onClick={handleTrack}
          className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-gold-glow hover:bg-brand-lightGold transition-all uppercase tracking-wider text-xs"
        >
          Track Ride Live
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={handleHome}
          className="w-full bg-brand-bgLight hover:bg-brand-gold/10 border border-brand-borderLight text-brand-textDark font-display font-bold py-3.5 rounded-2xl text-xs transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
export default Success;
