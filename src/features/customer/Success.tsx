import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Navigation, Home, MapPin, Car, Clock, CreditCard, Share2 } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

// Confetti particle
const ConfettiParticle = ({ delay, color, x }: { delay: number; color: string; x: number }) => (
  <motion.div
    className="fixed w-2.5 h-2.5 rounded-sm pointer-events-none z-50"
    style={{ left: `${x}%`, top: '-10px', background: color }}
    initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
    animate={{
      y: '110vh',
      x: [0, Math.random() * 80 - 40, Math.random() * 60 - 30],
      rotate: [0, 180, 360, 540],
      opacity: [1, 1, 0.5, 0]
    }}
    transition={{ duration: 2.5 + Math.random(), delay, ease: 'easeIn' }}
  />
);

const CONFETTI_COLORS = ['#FFC107', '#FF8C00', '#FFE082', '#121212', '#4CAF50', '#2196F3', '#FF5722'];

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, clearBookingForm } = useBookingStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiParticles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1.2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      x: Math.random() * 100
    }))
  );

  useEffect(() => {
    if (!activeBooking) {
      const t = setTimeout(() => navigate('/', { replace: true }), 3000);
      return () => clearTimeout(t);
    }
    // Stop confetti after 4 seconds
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [activeBooking, navigate]);

  const booking = activeBooking;
  const payMethodLabel = (method: string) => {
    const map: Record<string, string> = {
      upi: 'UPI / GPay',
      card: 'Credit/Debit Card',
      netbanking: 'Net Banking',
      wallet: 'Jolly Wallet',
      cash: 'Cash to Driver'
    };
    return map[method] || method;
  };

  return (
    <div className="screen items-center justify-between" style={{ background: '#fff', overflow: 'hidden' }}>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map(p => (
          <ConfettiParticle key={p.id} delay={p.delay} color={p.color} x={p.x} />
        ))}
      </AnimatePresence>

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto w-full">

        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative mb-6"
        >
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(255,193,7,0.15)', transform: 'scale(1.3)' }}
            animate={{ scale: [1.3, 1.7, 1.3], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Inner pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(255,193,7,0.25)', transform: 'scale(1.1)' }}
            animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
          />
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #FFC107, #FFE082)' }}
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
          <h1 className="text-2xl font-black" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
            Booking Confirmed!
          </h1>
          <p className="text-sm" style={{ color: '#888' }}>
            Your cab has been booked successfully
          </p>
          {/* Estimated time */}
          <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
            <Clock className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Driver arriving in ~8-12 mins</span>
          </div>
        </motion.div>

        {/* Booking Details Card */}
        {booking && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full mt-6 rounded-3xl overflow-hidden shadow-md"
            style={{ border: '1px solid #EFEFEF' }}
          >
            {/* Card header */}
            <div className="p-4 flex items-center justify-between" style={{ background: '#121212' }}>
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 block">Booking ID</span>
                <span className="text-xs font-black font-mono text-[#FFC107]">{booking.id}</span>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wide"
                style={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.3)' }}
              >
                Confirmed
              </span>
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col gap-3.5 text-left" style={{ background: '#F8F8F8' }}>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#FFC107' }} />
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: '#aaa' }}>Pickup</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#121212' }}>{booking.pickupAddress}</span>
                </div>
              </div>
              {booking.tripType !== 'rental' && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#F44336' }} />
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: '#aaa' }}>Drop</span>
                    <span className="text-[11px] font-semibold" style={{ color: '#121212' }}>{booking.dropAddress}</span>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: '#EFEFEF' }}>
                <div className="flex flex-col gap-0.5 items-center">
                  <Car className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Vehicle</span>
                  <span className="text-[10px] font-bold text-center" style={{ color: '#121212' }}>{booking.vehicleDetails?.name || 'Sedan'}</span>
                </div>
                <div className="flex flex-col gap-0.5 items-center">
                  <Clock className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Time</span>
                  <span className="text-[10px] font-bold" style={{ color: '#121212' }}>{booking.time}</span>
                </div>
                <div className="flex flex-col gap-0.5 items-center">
                  <CreditCard className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>Fare</span>
                  <span className="text-[10px] font-black font-mono" style={{ color: '#121212' }}>Rs.{booking.fareBreakdown?.total}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="flex items-center gap-2 p-3 rounded-2xl" style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)' }}>
                <CreditCard className="w-3.5 h-3.5 text-[#FFC107]" />
                <span className="text-[10px] font-bold" style={{ color: '#888' }}>
                  Payment via <strong style={{ color: '#121212' }}>{payMethodLabel(booking.paymentMethod || 'cash')}</strong>
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
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
        {/* Share booking */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Jolly Cabs Booking', text: `My cab is booked! Booking ID: ${booking?.id}` });
            } else {
              alert(`Share your booking ID: ${booking?.id}`);
            }
          }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.97] border border-[#FFC107]/30 text-[#FFC107]"
          style={{ background: 'rgba(255,193,7,0.06)' }}
        >
          <Share2 className="w-4 h-4" />
          Share Booking
        </button>
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
