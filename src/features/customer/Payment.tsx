import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, CreditCard, Banknote, Wallet, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { calculateFare } from '../../services/fareEngine';
import { INITIAL_COUPONS } from '../../services/mockData';
import { PaymentMethod } from '../../types';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vehicles } = useAdminStore();
  const {
    tripType,
    pickupAddress,
    dropAddress,
    date,
    time,
    distanceKm,
    durationMin,
    days,
    tollCharges,
    selectedVehicleId,
    hasNightDriving,
    waitingMinutes,
    couponCode,
    createBooking,
    setBookingField
  } = useBookingStore();

  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Run calculation
  const getFareData = () => {
    if (!selectedVehicle) return null;
    
    // Check if coupon is valid
    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.active
    );

    return calculateFare({
      tripType,
      distanceKm,
      durationMin,
      days,
      vehicle: selectedVehicle,
      hasNightDriving,
      waitingMinutes,
      tollCharges,
      couponDiscountPercent: coupon?.discountPercent || 0,
      couponMaxDiscount: coupon?.maxDiscount || 99999
    });
  };

  const fareResult = getFareData();

  const handleApplyCoupon = () => {
    setCouponError(false);
    setCouponMessage('');

    if (!couponInput.trim()) {
      setBookingField('couponCode', '');
      return;
    }

    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.active
    );

    if (coupon) {
      if (fareResult && fareResult.breakdown.total < coupon.minTripValue) {
        setCouponError(true);
        setCouponMessage(`Minimum booking value must be ₹${coupon.minTripValue}.`);
      } else {
        setBookingField('couponCode', coupon.code);
        setCouponMessage(`Coupon applied: ${coupon.description}!`);
      }
    } else {
      setCouponError(true);
      setCouponMessage('Invalid or expired coupon code.');
      setBookingField('couponCode', '');
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      alert('Please log in to confirm booking.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    const booking = await createBooking(user.name, user.phone, payMethod);
    setIsSubmitting(false);

    if (booking) {
      navigate('/success');
    } else {
      alert('Booking confirmation failed. Please try again.');
    }
  };

  if (!selectedVehicle || !fareResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-brand-danger mb-4" />
        <h3 className="font-bold text-sm">Session Expired</h3>
        <p className="text-xs text-brand-textGray mt-1">Please configure your route parameters and try again.</p>
        <button onClick={() => navigate('/booking')} className="mt-4 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const { breakdown } = fareResult;
  const isAdvanceRequired = breakdown.advancePaid > 0;

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight">
      {/* Sticky Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex items-center gap-3 shadow-md flex-shrink-0">
        <button 
          onClick={() => navigate('/vehicles')} 
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h2 className="text-sm font-display font-bold">Review & Payment</h2>
      </div>

      {/* Checkout Screen Scrollable Body */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        
        {/* 1. Trip Summary */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm text-xs flex flex-col gap-2">
          <h4 className="font-bold text-brand-textDark border-b border-brand-bgLight pb-2">
            Trip Summary ({tripType.replace('_', ' ').toUpperCase()})
          </h4>
          <div className="flex flex-col gap-1.5 text-[11px] text-brand-textDark mt-1">
            <p className="truncate"><span className="text-brand-textGray font-semibold">Pickup:</span> {pickupAddress}</p>
            {tripType !== 'rental' && (
              <p className="truncate"><span className="text-brand-textGray font-semibold">Drop:</span> {dropAddress}</p>
            )}
            <p>
              <span className="text-brand-textGray font-semibold">Date & Time:</span> {date} at {time}
            </p>
            <p>
              <span className="text-brand-textGray font-semibold">Vehicle:</span> {selectedVehicle.name} ({selectedVehicle.category})
            </p>
          </div>
        </div>

        {/* 2. Coupon Card */}
        <div className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-brand-gold" />
            Apply Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="E.g. JOLLYNEW"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 bg-brand-bgLight border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              type="button"
              className="px-4 py-2 bg-brand-dark hover:bg-brand-dark/95 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`text-[10px] font-bold flex items-center gap-1 ${couponError ? 'text-brand-danger' : 'text-brand-success'}`}>
              <Percent className="w-3.5 h-3.5" />
              {couponMessage}
            </p>
          )}
        </div>

        {/* 3. Detailed Bill Breakdown */}
        <div className="bg-white p-5 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-brand-textDark border-b border-brand-bgLight pb-3 flex items-center justify-between">
            <span>Fare Breakdown</span>
            <span className="text-[10px] text-brand-textGray font-semibold normal-case">All prices in INR</span>
          </h4>

          <div className="flex flex-col gap-2 text-xs text-brand-textDark border-b border-brand-bgLight pb-3 font-semibold">
            <div className="flex justify-between">
              <span className="text-brand-textGray">Base fare (incl. night charge)</span>
              <span>₹{breakdown.base}</span>
            </div>
            
            {breakdown.extraKm > 0 && (
              <div className="flex justify-between">
                <span className="text-brand-textGray">Extra distance charges</span>
                <span>₹{breakdown.extraKm}</span>
              </div>
            )}
            
            {breakdown.bata > 0 && (
              <div className="flex justify-between">
                <span className="text-brand-textGray">Driver Bata allowance ({days} days)</span>
                <span>₹{breakdown.bata}</span>
              </div>
            )}
            
            {breakdown.tolls > 0 && (
              <div className="flex justify-between">
                <span className="text-brand-textGray">Route toll charges</span>
                <span>₹{breakdown.tolls}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-brand-textGray">Convenience charge</span>
              <span>₹{breakdown.convenience}</span>
            </div>

            {breakdown.discount > 0 && (
              <div className="flex justify-between text-brand-success">
                <span>Coupon discount</span>
                <span>- ₹{breakdown.discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-brand-textGray">Taxes (GST 5%)</span>
              <span>₹{breakdown.gst}</span>
            </div>
          </div>

          {/* Grand total */}
          <div className="flex justify-between items-center text-sm font-bold text-brand-textDark pt-1.5">
            <span>Grand Total</span>
            <span className="text-base font-mono text-brand-dark">₹{breakdown.total}</span>
          </div>

          {/* Advance vs Remaining */}
          {isAdvanceRequired && (
            <div className="bg-brand-gold/5 border border-brand-gold/10 p-3.5 rounded-2xl flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between text-xs font-bold text-brand-dark">
                <span>Advance to Confirm (20%)</span>
                <span>₹{breakdown.advancePaid}</span>
              </div>
              <div className="flex justify-between text-[10px] text-brand-textGray font-semibold border-t border-brand-gold/10 pt-1.5">
                <span>Balance to Pay Driver After Trip</span>
                <span>₹{breakdown.remaining}</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Payment Methods Selector */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
            Choose Payment Method
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'upi', label: 'UPI / GPay / PhonePe', icon: CheckCircle },
              { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'netbanking', label: 'Net Banking', icon: CreditCard },
              { id: 'wallet', label: 'Jolly Wallet', icon: Wallet },
              { id: 'cash', label: 'Pay Cash to Driver', icon: Banknote }
            ].map((method) => {
              const isSelected = payMethod === method.id;
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPayMethod(method.id as PaymentMethod)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center gap-2 transition-all hover:scale-102 ${
                    isSelected
                      ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                      : 'bg-white text-brand-textGray border-brand-borderLight hover:text-brand-textDark shadow-inner-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-gold' : 'text-brand-textGray'}`} />
                  <span className="text-[10px] font-bold">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Razorpay Integration Placeholder */}
          <div className="bg-brand-gold/5 border border-brand-gold/10 rounded-2xl p-3 mt-2">
            <p className="text-[9px] text-brand-textGray font-semibold leading-relaxed">
              🔒 <strong>Razorpay Secure Payments:</strong> Online payments (UPI, Cards, Net Banking) will be processed via Razorpay after API keys are configured. Currently using demo mode.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Sticky Payment CTA */}
      <div className="bg-white border-t border-brand-borderLight p-5 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="text-left">
          <span className="text-[10px] text-brand-textGray font-semibold block uppercase">Amount Payable</span>
          <span className="text-sm font-bold text-brand-textDark font-mono">
            ₹{isAdvanceRequired ? breakdown.advancePaid : breakdown.total}
          </span>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="ripple-btn flex-1 bg-brand-gold hover:bg-brand-lightGold text-brand-dark py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-gold-glow"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 rounded-full border-2 border-brand-dark border-t-transparent animate-spin" />
          ) : (
            <>
              {isAdvanceRequired ? 'Pay Advance & Book' : 'Confirm & Book Ride'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default Payment;
