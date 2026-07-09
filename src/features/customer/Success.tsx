import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Navigation, Home, Clock, MapPin, Car } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, clearBookingForm } = useBookingStore();

  // Redirect if no active booking
  useEffect(() => {
    if (!activeBooking) {
      const t = setTimeout(() => navigate('/', { replace: true }), 3000);
      return () => clearTimeout(t);
    }
  }, [activeBooking, navigate]);

  const booking = activeBooking;

  return (
    <div
      className="screen items-center justify-between"
      style={{ background: '#fff', overflow: 'hidden' }}
    >
      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto w-full">

        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative mb-6"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(255,193,7,0.2)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center relative"
            style={{ background: '#FFC107' }}
          >
            <CheckCircle className="w-14 h-14 stroke-[2]" style={{ color: '#121212' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center gap-2"
        >
          <h1
            className="text-2xl font-black"
            style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
          >
            Booking Confirmed!
          </h1>
          <p className="text-sm" style={{ color: '#888' }}>
            Your cab has been booked successfully
          </p>
        </motion.div>

        {/* Booking ID card */}
        {booking && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full mt-8 rounded-3xl p-5"
            style={{ background: '#F8F8F8', border: '1px solid #EFEFEF' }}
          >
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#EFEFEF' }}>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Booking ID</span>
                <span className="text-xs font-black font-mono" style={{ color: '#121212' }}>{booking.id}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#FFC107' }} />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#aaa' }}>Pickup</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#121212' }}>{booking.pickupAddress}</span>
                </div>
              </div>
              {booking.tripType !== 'rental' && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#F44336' }} />
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#aaa' }}>Drop</span>
                    <span className="text-[11px] font-semibold" style={{ color: '#121212' }}>{booking.dropAddress}</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Date</span>
                  <span className="text-[10px] font-bold" style={{ color: '#121212' }}>{booking.date}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Time</span>
                  <span className="text-[10px] font-bold" style={{ color: '#121212' }}>{booking.time}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Fare</span>
                  <span className="text-[10px] font-black font-mono" style={{ color: '#121212' }}>₹{booking.fareBreakdown?.total}</span>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: '#EFEFEF' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FFC107' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#888' }}>
                  Searching for nearest driver...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom CTAs */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex-shrink-0 px-6 pb-8 w-full flex flex-col gap-3 safe-area-bottom"
      >
        {booking && (
          <button
            onClick={() => navigate(`/track/${booking.id}`, { replace: true })}
            className="ripple-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all active:scale-[0.97]"
            style={{ background: '#121212', color: '#FFC107', fontFamily: 'Poppins, sans-serif' }}
          >
            <Navigation className="w-4 h-4" />
            Track My Ride
          </button>
        )}
        <button
          onClick={() => {
            clearBookingForm();
            navigate('/', { replace: true });
          }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.97]"
          style={{ background: '#F5F5F5', color: '#121212', border: '1.5px solid #EFEFEF' }}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default Success;
