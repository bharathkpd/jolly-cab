import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, CreditCard, Banknote, Wallet, CheckCircle, Percent, AlertCircle, Lock, Smartphone } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { calculateFare } from '../../services/fareEngine';
import { INITIAL_COUPONS } from '../../services/mockData';
import { PaymentMethod } from '../../types';
import { loadRazorpayScript } from '../../utils/razorpay';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vehicles } = useAdminStore();
  const {
    tripType, pickupAddress, dropAddress, date, time,
    distanceKm, durationMin, days, tollCharges,
    selectedVehicleId, hasNightDriving, waitingMinutes,
    couponCode, createBooking, setBookingField
  } = useBookingStore();

  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const getFareData = () => {
    if (!selectedVehicle) return null;
    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.active
    );
    return calculateFare({
      tripType, distanceKm, durationMin, days, vehicle: selectedVehicle,
      hasNightDriving, waitingMinutes, tollCharges,
      couponDiscountPercent: coupon?.discountPercent || 0,
      couponMaxDiscount: coupon?.maxDiscount || 99999
    });
  };

  const fareResult = getFareData();

  const handleApplyCoupon = () => {
    setCouponError(false);
    setCouponMessage('');
    if (!couponInput.trim()) { setBookingField('couponCode', ''); return; }
    const coupon = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.active);
    if (coupon) {
      if (fareResult && fareResult.breakdown.total < coupon.minTripValue) {
        setCouponError(true);
        setCouponMessage(`Min booking value must be ₹${coupon.minTripValue}.`);
      } else {
        setBookingField('couponCode', coupon.code);
        setCouponMessage(`Applied: ${coupon.description}!`);
      }
    } else {
      setCouponError(true);
      setCouponMessage('Invalid or expired coupon code.');
      setBookingField('couponCode', '');
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!selectedVehicle || !fareResult) return;
    const { breakdown } = fareResult;
    const payAmount = breakdown.advancePaid > 0 ? breakdown.advancePaid : breakdown.total;

    if (payMethod === 'cash') {
      setIsSubmitting(true);
      const booking = await createBooking(user.name, user.phone, 'cash');
      setIsSubmitting(false);
      if (booking) navigate('/success');
      else alert('Booking failed. Please try again.');
      return;
    }

    setIsSubmitting(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setIsSubmitting(false);
      alert('Payment gateway unavailable. Please try again or use Cash.');
      return;
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

    const rzpOptions = {
      key: rzpKey,
      amount: payAmount * 100,
      currency: 'INR',
      name: 'Jolly Cabs',
      description: `${selectedVehicle.name} - ${tripType.replace('_', ' ')}`,
      image: '/favicon.svg',
      handler: async (response: any) => {
        const booking = await createBooking(user.name, user.phone, payMethod);
        setIsSubmitting(false);
        if (booking) {
          if (response.razorpay_payment_id) {
            setBookingField('razorpayPaymentId' as any, response.razorpay_payment_id);
          }
          navigate('/success');
        } else {
          alert('Booking confirmation failed. Contact support.');
        }
      },
      prefill: { name: user.name, contact: user.phone, email: `${user.phone}@jollycabs.in` },
      theme: { color: '#FFC107' },
      modal: {
        ondismiss: () => { setIsSubmitting(false); }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on('payment.failed', (response: any) => {
        setIsSubmitting(false);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      // Sandbox/demo fallback
      const simulate = window.confirm(
        'Razorpay sandbox mode.\nSimulate successful payment for testing?'
      );
      if (simulate) {
        const booking = await createBooking(user.name, user.phone, payMethod);
        setIsSubmitting(false);
        if (booking) navigate('/success');
        else alert('Booking failed. Please try again.');
      } else {
        setIsSubmitting(false);
      }
    }
  };

  if (!selectedVehicle || !fareResult) {
    return (
      <div className="screen flex items-center justify-center p-6 text-center" style={{ background: '#F5F5F5' }}>
        <div>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#F44336' }} />
          <h3 className="font-bold text-sm" style={{ color: '#121212' }}>Session Expired</h3>
          <p className="text-xs mt-1" style={{ color: '#888' }}>Please start your booking again.</p>
          <button onClick={() => navigate('/booking')} className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: '#121212' }}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const { breakdown } = fareResult;
  const isAdvanceRequired = breakdown.advancePaid > 0;

  const payMethods = [
    { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'netbanking', label: 'Net Banking', icon: CreditCard },
    { id: 'wallet', label: 'Jolly Wallet', icon: Wallet },
    { id: 'cash', label: 'Cash to Driver', icon: Banknote }
  ];

  return (
    <div className="screen" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ background: '#121212' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h2 className="text-sm font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Review & Pay
          </h2>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {selectedVehicle.name} · {tripType.replace('_', ' ')}
          </p>
        </div>
        <div className="ml-auto">
          <Lock className="w-4 h-4" style={{ color: '#FFC107' }} />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="screen-body p-4 flex flex-col gap-4">

        {/* Trip Summary */}
        <div className="bg-white rounded-3xl p-4" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="text-xs font-bold border-b pb-2 mb-3" style={{ color: '#121212', borderColor: '#F5F5F5' }}>
            Trip Summary
          </h4>
          <div className="flex flex-col gap-1.5 text-[11px]">
            <p><span className="font-semibold" style={{ color: '#888' }}>Pickup: </span><span style={{ color: '#121212' }}>{pickupAddress}</span></p>
            {tripType !== 'rental' && <p><span className="font-semibold" style={{ color: '#888' }}>Drop: </span><span style={{ color: '#121212' }}>{dropAddress}</span></p>}
            <p><span className="font-semibold" style={{ color: '#888' }}>Date & Time: </span><span style={{ color: '#121212' }}>{date} at {time}</span></p>
            <p><span className="font-semibold" style={{ color: '#888' }}>Vehicle: </span><span style={{ color: '#121212' }}>{selectedVehicle.name}</span></p>
            <p><span className="font-semibold" style={{ color: '#888' }}>Distance: </span><span style={{ color: '#121212' }}>{distanceKm} KM</span></p>
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-3xl p-4" style={{ border: '1px solid #F0F0F0' }}>
          <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3" style={{ color: '#888' }}>
            <Ticket className="w-4 h-4" style={{ color: '#FFC107' }} />
            Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="E.g. JOLLYNEW"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
              style={{ background: '#F5F5F5', border: '1.5px solid #EFEFEF', color: '#121212' }}
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: '#121212' }}
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${couponError ? 'text-red-500' : 'text-green-600'}`}>
              <Percent className="w-3.5 h-3.5" /> {couponMessage}
            </p>
          )}
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white rounded-3xl p-5" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="text-xs font-bold pb-3 border-b flex items-center justify-between mb-3" style={{ color: '#121212', borderColor: '#F5F5F5' }}>
            <span>Fare Breakdown</span>
            <span className="text-[10px] font-semibold" style={{ color: '#aaa' }}>All in INR</span>
          </h4>
          <div className="flex flex-col gap-2 text-[11px] border-b pb-3" style={{ borderColor: '#F5F5F5' }}>
            <div className="flex justify-between">
              <span style={{ color: '#888' }}>Base fare</span>
              <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.base}</span>
            </div>
            {breakdown.extraKm > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#888' }}>Extra distance</span>
                <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.extraKm}</span>
              </div>
            )}
            {breakdown.bata > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#888' }}>Driver bata ({days} days)</span>
                <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.bata}</span>
              </div>
            )}
            {breakdown.tolls > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#888' }}>Toll charges</span>
                <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.tolls}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: '#888' }}>Convenience fee</span>
              <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.convenience}</span>
            </div>
            {breakdown.discount > 0 && (
              <div className="flex justify-between" style={{ color: '#4CAF50' }}>
                <span>Coupon discount</span>
                <span className="font-semibold">- ₹{breakdown.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: '#888' }}>GST (5%)</span>
              <span className="font-semibold" style={{ color: '#121212' }}>₹{breakdown.gst}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-sm font-bold" style={{ color: '#121212' }}>Grand Total</span>
            <span className="text-base font-black font-mono" style={{ color: '#121212' }}>₹{breakdown.total}</span>
          </div>
          {isAdvanceRequired && (
            <div className="mt-3 p-3.5 rounded-2xl" style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)' }}>
              <div className="flex justify-between text-xs font-bold" style={{ color: '#121212' }}>
                <span>Advance to pay now (20%)</span>
                <span>₹{breakdown.advancePaid}</span>
              </div>
              <div className="flex justify-between text-[10px] font-semibold border-t pt-1.5 mt-1.5" style={{ color: '#888', borderColor: 'rgba(255,193,7,0.15)' }}>
                <span>Balance to pay driver after trip</span>
                <span>₹{breakdown.remaining}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider px-1 mb-3" style={{ color: '#888' }}>
            Payment Method
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {payMethods.map(({ id, label, icon: Icon }) => {
              const selected = payMethod === id;
              return (
                <button
                  key={id}
                  onClick={() => setPayMethod(id as PaymentMethod)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl text-center gap-2 transition-all active:scale-[0.97]"
                  style={{
                    background: selected ? '#121212' : '#fff',
                    border: selected ? '2px solid #FFC107' : '1.5px solid #EFEFEF'
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: selected ? '#FFC107' : '#aaa' }} />
                  <span className="text-[10px] font-bold leading-tight" style={{ color: selected ? '#fff' : '#888' }}>{label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-2xl flex items-center gap-2" style={{ background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.15)' }}>
            <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#FFC107' }} />
            <p className="text-[9px] font-semibold" style={{ color: '#888' }}>
              Online payments processed via <strong>Razorpay</strong>. Your data is 256-bit encrypted and secure.
            </p>
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div
        className="flex-shrink-0 bg-white px-5 py-4 flex items-center justify-between gap-4 safe-area-bottom"
        style={{ border: '1px solid #F0F0F0' }}
      >
        <div>
          <span className="text-[10px] font-semibold uppercase block" style={{ color: '#888' }}>
            {isAdvanceRequired ? 'Pay Now' : 'Total'}
          </span>
          <span className="text-sm font-black font-mono" style={{ color: '#121212' }}>
            ₹{isAdvanceRequired ? breakdown.advancePaid : breakdown.total}
          </span>
        </div>
        <button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="ripple-btn flex-1 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50"
          style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
          ) : (
            isAdvanceRequired ? 'Pay Advance & Confirm' : 'Confirm & Book Ride'
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
