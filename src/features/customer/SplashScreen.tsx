import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-between select-none z-50"
      style={{ background: '#FFC107' }}
    >
      {/* Top ambient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        {/* Logo Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.15 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'rgba(18,18,18,0.12)',
              transform: 'scale(1.18)',
              filter: 'blur(10px)'
            }}
          />
          {/* Logo circle */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{ background: '#121212' }}
          >
            <span
              className="text-5xl font-black tracking-tighter"
              style={{ color: '#FFC107', fontFamily: 'Poppins, sans-serif' }}
            >
              JC
            </span>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col items-center gap-1.5"
        >
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
          >
            Jolly Cabs
          </h1>
          <p
            className="text-sm font-semibold italic"
            style={{ color: 'rgba(18,18,18,0.7)', fontFamily: 'Inter, sans-serif' }}
          >
            Your Comfort, Our Priority
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-1.5 mt-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#121212' }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="pb-10 flex flex-col items-center gap-1"
      >
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: 'rgba(18,18,18,0.6)', fontFamily: 'Inter, sans-serif' }}
        >
          Premium Cab Service • Hyderabad
        </span>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
