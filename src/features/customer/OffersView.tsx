import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Copy, Check, Ticket, Gift, Star, Sparkles } from 'lucide-react';

interface PromoCoupon {
  code: string;
  discount: string;
  minRide: string;
  validUntil: string;
  description: string;
  type: 'coupon' | 'referral' | 'festival';
}

const MOCK_OFFERS: PromoCoupon[] = [
  {
    code: 'WELCOME50',
    discount: '₹50 Off',
    minRide: 'Min. Ride: ₹100',
    validUntil: 'Valid until: 31st Dec 2026',
    description: 'Get an instant flat ₹50 discount on your first local commute ride with Jolly Cabs.',
    type: 'coupon'
  },
  {
    code: 'SRISAILAM10',
    discount: '₹1,000 Off',
    minRide: 'Min. Ride: ₹5,000',
    validUntil: 'Valid until: 30th Nov 2026',
    description: 'Special pilgrimage discount! Save flat ₹1,000 on Srisailam Day Trip or Overnight packages.',
    type: 'festival'
  },
  {
    code: 'OUTSTATION15',
    discount: '15% Off',
    minRide: 'Min. Ride: ₹2,000',
    validUntil: 'Valid until: 15th Oct 2026',
    description: 'Explore outstation destinations from Hyderabad and save 15% (up to ₹500) on round trip bookings.',
    type: 'coupon'
  },
  {
    code: 'AIRPORT10',
    discount: '10% Off',
    minRide: 'Min. Ride: ₹500',
    validUntil: 'Valid until: 31st Dec 2026',
    description: 'Enjoy stress-free airport transfers to RGIA Shamshabad with 10% off.',
    type: 'coupon'
  },
  {
    code: 'JOLLY881',
    discount: '₹150 Credit',
    minRide: 'Refer a friend',
    validUntil: 'No expiry',
    description: 'Share your referral code with friends. Both you and your friend get ₹150 ride credits on their first booking!',
    type: 'referral'
  },
  {
    code: 'DIWALI500',
    discount: '₹500 Off',
    minRide: 'Min. Ride: ₹3,000',
    validUntil: 'Festival Season Only',
    description: 'Celebrate Diwali with Jolly Cabs! Flat ₹500 off on outstation trips during the festival season.',
    type: 'festival'
  }
];

export const OffersView: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'coupon' | 'referral' | 'festival'>('all');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOffers = activeFilter === 'all' ? MOCK_OFFERS : MOCK_OFFERS.filter(o => o.type === activeFilter);

  const getTypeIcon = (type: PromoCoupon['type']) => {
    switch (type) {
      case 'referral': return <Gift className="w-5 h-5" />;
      case 'festival': return <Sparkles className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: PromoCoupon['type']) => {
    switch (type) {
      case 'referral': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
      case 'festival': return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
      default: return 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Sticky Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex flex-col gap-4 shadow-md flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h2 className="text-sm font-display font-bold">Discounts & Offers</h2>
          </div>
          <Ticket className="w-5 h-5 text-brand-gold" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Offers' },
            { id: 'coupon', label: 'Coupons' },
            { id: 'referral', label: 'Referral' },
            { id: 'festival', label: 'Festival' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-brand-gold text-brand-dark'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body List */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-brand-dark to-brand-navy rounded-3xl p-5 text-white relative overflow-hidden">
          <div className="absolute right-2 -bottom-4 opacity-10">
            <Star className="w-32 h-32" />
          </div>
          <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest">Limited Time</span>
          <h3 className="text-sm font-bold font-display mt-1">Get ₹150 for Every Referral!</h3>
          <p className="text-[10px] text-white/70 mt-1 leading-relaxed max-w-[90%]">
            Share your code <span className="font-mono font-bold text-brand-gold">JOLLY881</span> with friends. Both of you earn ride credits instantly.
          </p>
        </div>

        {filteredOffers.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              className="bg-white rounded-3xl border border-brand-borderLight shadow-sm hover:border-brand-gold/20 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Ticket Head */}
              <div className="p-5 flex items-start justify-between gap-4 border-b border-dashed border-brand-borderLight relative">
                {/* Visual Circle punches on sides for coupon ticket feel */}
                <div className="absolute w-4 h-4 rounded-full bg-brand-bgLight -left-2 top-[92%] border-r border-brand-borderLight" />
                <div className="absolute w-4 h-4 rounded-full bg-brand-bgLight -right-2 top-[92%] border-l border-brand-borderLight" />

                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${getTypeColor(offer.type)} border flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(offer.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-textDark flex items-center gap-2">
                      {offer.discount}
                    </h4>
                    <p className="text-[10px] text-brand-textGray mt-1 leading-normal">
                      {offer.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket Footer */}
              <div className="p-4 bg-brand-bgLight/40 flex items-center justify-between text-[10px] font-bold">
                <div className="flex flex-col gap-0.5 text-brand-textGray">
                  <span>{offer.minRide}</span>
                  <span className="font-medium text-[9px]">{offer.validUntil}</span>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all font-mono tracking-wider text-xs font-black border ${
                    isCopied
                      ? 'bg-brand-success/15 border-brand-success/20 text-brand-success'
                      : 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/25'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {offer.code}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OffersView;
