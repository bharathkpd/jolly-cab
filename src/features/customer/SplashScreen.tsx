import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  useEffect(() => {
    // Show splash screen for 2.5 seconds then transition
    const timer = setTimeout(() => {
      onFinished();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-[#FFC107] flex flex-col justify-between items-center p-8 z-50 select-none"
    >
      {/* Top spacing */}
      <div className="h-20" />

      {/* Main Center Content */}
      <div className="flex flex-col items-center text-center">
        {/* Monogram Circle Badge — matches provided image exactly */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 15,
            delay: 0.2
          }}
          className="w-28 h-28 rounded-full bg-[#121212] flex items-center justify-center shadow-2xl"
        >
          <span className="font-display font-black text-4xl text-[#FFC107] tracking-tight">JC</span>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-display font-extrabold text-3xl text-[#121212] mt-6 tracking-tight"
        >
          Jolly Cabs
        </motion.h1>

        {/* Motto */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="font-body italic text-sm text-[#121212]/80 mt-1.5"
        >
          Your Comfort, Our Priority
        </motion.p>
      </div>

      {/* Bottom Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="pb-8"
      >
        <span className="font-display font-semibold text-xs text-[#121212]/75 tracking-wider">
          Premium Cab Service in Hyderabad
        </span>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
