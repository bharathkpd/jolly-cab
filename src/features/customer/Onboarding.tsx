import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck, CreditCard } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'Ride in Safety & Comfort',
    description: 'Every driver is strictly verified. Standardized cleanliness and absolute safety on all trips in Hyderabad.',
    icon: ShieldCheck,
    color: 'text-[#FFC107]',
    bg: 'bg-[#FFC107]/10'
  },
  {
    id: 2,
    title: 'Transparent Pricing, Always',
    description: 'No hidden fares or sudden surge prices. See breakdown including toll taxes and driver bata before you book.',
    icon: CreditCard,
    color: 'text-[#FFC107]',
    bg: 'bg-[#FFC107]/10'
  },
  {
    id: 3,
    title: 'Your Trusted Travel Partner',
    description: 'Local daily commutes, airport transfers, or outstation tours. Jolly Cabs is available 24/7 at your command.',
    icon: MapPin,
    color: 'text-[#FFC107]',
    bg: 'bg-[#FFC107]/10'
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const ActiveIcon = SLIDES[currentSlide].icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-brand-dark text-white relative h-full">
      {/* Top logo */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center font-display font-bold text-brand-dark text-sm">JC</div>
          <span className="font-display font-bold text-base tracking-wide text-white">Jolly Cabs</span>
        </div>
        <button 
          onClick={onComplete}
          className="text-xs font-semibold text-brand-textGray hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Content Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Visual Icon Box */}
            <div className={`w-24 h-24 rounded-3xl ${SLIDES[currentSlide].bg} flex items-center justify-center mb-8 border border-white/5 shadow-inner`}>
              <ActiveIcon className={`w-12 h-12 ${SLIDES[currentSlide].color}`} />
            </div>

            <h2 className="text-2xl font-display font-bold mb-4 tracking-tight leading-tight">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-sm text-brand-textGray leading-relaxed px-4">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="pb-8 flex flex-col gap-6">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-gold-glow"
        >
          {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default Onboarding;
