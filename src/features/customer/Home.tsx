import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Car, Compass, ArrowRight,
  Gift, Star, Menu, Bell, User2, ShieldCheck, DollarSign,
  PhoneCall, Sparkles, ShieldAlert, Plane, Clock, Navigation, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useAdminStore } from '../../store/adminStore';
import { useUiStore } from '../../store/uiStore';
import { MOCK_ROUTES, MOCK_REVIEWS } from '../../services/mockData';
import { TripType } from '../../types';
import { getAssetUrl } from '../../utils/assets';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setBookingField, setRoute, clearBookingForm, activeBooking } = useBookingStore();
  const { banners, vehicles, loadAllAdminData } = useAdminStore();
  const { toggleDrawer } = useUiStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllAdminData();
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, [loadAllAdminData]);

  // Auto-scroll banner carousel
  useEffect(() => {
    const activeBannerList = banners.filter(b => b.active);
    if (activeBannerList.length <= 1) return;
    const iv = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % activeBannerList.length);
    }, 3500);
    return () => clearInterval(iv);
  }, [banners]);

  useEffect(() => {
    try {
      const local = localStorage.getItem('jolly_cabs_bookings');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          setRecentBookings(parsed.slice(0, 2));
        }
      }
    } catch (e) {}
  }, []);

  const handleRebook = (booking: any) => {
    clearBookingForm();
    setBookingField('tripType', booking.tripType);
    setBookingField('pickupAddress', booking.pickupAddress);
    setBookingField('dropAddress', booking.dropAddress);
    setRoute(booking.pickupAddress, booking.dropAddress, booking.distanceKm, booking.durationMin, booking.fareBreakdown?.tollCharges || 0);
    setBookingField('selectedVehicleId', booking.vehicleId);
    navigate('/vehicles');
  };

  const handleQuickBooking = (type: TripType) => {
    clearBookingForm();
    setBookingField('tripType', type);
    navigate('/booking');
  };

  const handlePopularRouteClick = (route: any) => {
    clearBookingForm();
    setBookingField('tripType', route.tripType || 'outstation_round');
    setBookingField('pickupAddress', route.pickupAddress || 'Hyderabad, Telangana, India');
    setBookingField('dropAddress', route.dropAddress || route.name);
    setRoute(
      route.pickupAddress || 'Hyderabad, Telangana, India',
      route.dropAddress || route.name,
      route.distanceKm,
      route.durationMin,
      route.id.includes('srisailam') ? 150 : 0
    );
    setBookingField('selectedVehicleId', 'veh_sedan');
    navigate('/vehicles');
  };

  const handleBannerClick = (bannerId: string) => {
    clearBookingForm();
    if (bannerId === 'fb_srisailam') {
      setBookingField('tripType', 'outstation_round');
      setBookingField('pickupAddress', 'Kukatpally, Hyderabad, Telangana');
      setBookingField('dropAddress', 'Srisailam Mallikarjuna Temple, Andhra Pradesh');
      setBookingField('couponCode', 'SRISAILAM10');
      setRoute('Kukatpally, Hyderabad, Telangana', 'Srisailam Mallikarjuna Temple, Andhra Pradesh', 215, 270, 150);
      setBookingField('selectedVehicleId', 'veh_sedan');
      navigate('/vehicles');
    } else if (bannerId === 'fb_outstation') {
      setBookingField('tripType', 'outstation_round');
      setBookingField('couponCode', 'OUTSTATION15');
      navigate('/booking');
    }
  };

  const activeStatuses = ['pending', 'accepted', 'driver_assigned', 'driver_reached', 'trip_started'];
  const hasActiveRide = activeBooking && activeStatuses.includes(activeBooking.status);

  if (isLoading) {
    return (
      <div className="screen-body bg-[#F8F9FA]">
        {/* Skeleton Header */}
        <div className="bg-[#FFC107] px-5 pt-8 pb-20 rounded-b-[36px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl shimmer-bg bg-black/10" />
              <div className="flex flex-col gap-1.5">
                <div className="w-16 h-3 shimmer-bg rounded bg-black/10" />
                <div className="w-28 h-4.5 shimmer-bg rounded bg-black/10" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-11 h-11 rounded-2xl shimmer-bg bg-black/10" />
              <div className="w-11 h-11 rounded-2xl shimmer-bg bg-black/10" />
            </div>
          </div>
        </div>
        <div className="px-5 -mt-12 flex flex-col gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-md h-32 shimmer-bg" />
          <div className="bg-white rounded-3xl p-5 shadow-md h-56 shimmer-bg" />
        </div>
      </div>
    );
  }

  return (
    <div className="screen-body bg-[#F8F9FA] scrollbar-none">

      {/* ── Header Section ── */}
      <div className="bg-[#FFC107] px-5 pt-7 pb-20 relative overflow-hidden flex-shrink-0 rounded-b-[36px] shadow-md">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.22) 0%, transparent 60%)'
        }} />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={toggleDrawer}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <Menu className="w-5.5 h-5.5 stroke-[2.5]" style={{ color: '#121212' }} />
            </button>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: 'rgba(18,18,18,0.5)' }}>
                Jolly Cabs
              </span>
              <h2
                className="text-base font-black truncate max-w-[170px] mt-0.5"
                style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
              >
                Hello, {user?.name?.split(' ')[0] || 'Rider'} 👋
              </h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="w-11 h-11 rounded-2xl flex items-center justify-center relative active:scale-90 transition-all shadow-sm"
              style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <Bell className="w-5 h-5 stroke-[2.5]" style={{ color: '#121212' }} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-[#FFC107]" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-sm"
              style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <User2 className="w-5 h-5 stroke-[2.5]" style={{ color: '#121212' }} />
            </button>
          </div>
        </div>

        {/* Live Offer Ticker */}
        <div
          className="relative overflow-hidden h-8 flex items-center"
          style={{ background: '#121212', borderRadius: '0 0 12px 12px', marginTop: '-1px' }}
        >
          <div className="absolute inset-y-0 left-0 w-8 z-10" style={{ background: 'linear-gradient(to right, #121212, transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-8 z-10" style={{ background: 'linear-gradient(to left, #121212, transparent)' }} />
          <div
            className="flex gap-8 whitespace-nowrap text-[9px] font-black uppercase tracking-widest"
            style={{ color: '#FFC107', animation: 'marquee 18s linear infinite' }}
          >
            {[
              '🎉 Use JOLLYNEW for 10% off your first ride',
              '✈️ Airport drops from Rs.899 flat rate',
              '🛕 Srisailam trip special — Rs.150 off with SRISAILAM10',
              '🌟 4.9 star rated drivers · 100% verified',
              '📞 24/7 support: 7981232371',
              '🎉 Use JOLLYNEW for 10% off your first ride',
              '✈️ Airport drops from Rs.899 flat rate'
            ].map((msg, i) => (
              <span key={i}>{msg}</span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Floating content stack ── */}
      <div className="px-5 -mt-12 flex flex-col gap-6 pb-8">

        {/* Active Ride Card */}
        {hasActiveRide && (
          <button
            onClick={() => navigate(`/track/${activeBooking!.id}`)}
            className="w-full bg-[#121212] rounded-3xl p-4.5 flex items-center gap-3.5 shadow-xl active:scale-[0.98] transition-all border border-brand-gold/20"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#FFC107]">
              <Navigation className="w-5.5 h-5.5 animate-pulse" style={{ color: '#121212' }} />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold">
                Ride In Progress
              </span>
              <p className="text-xs font-black text-white mt-0.5">
                {activeBooking!.status === 'pending' ? 'Finding driver...' :
                 activeBooking!.status === 'accepted' ? `${activeBooking!.driverName} assigned` :
                 activeBooking!.status === 'driver_reached' ? 'Driver arrived!' :
                 activeBooking!.status === 'trip_started' ? 'Ride in progress' : 'Track your ride'}
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#FFC107] text-[#121212] hover:bg-brand-lightGold transition-colors text-[10px] font-black uppercase tracking-wider">
              Track
            </div>
          </button>
        )}

        {/* Premium Booking Card (floating) */}
        <div className="bg-white rounded-3xl p-5.5 shadow-md border border-[#F0F0F0]">
          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3.5 text-gray-400">
            Where can we take you?
          </h4>
          <div className="flex flex-col gap-3 relative">
            <div className="absolute left-[20px] top-[30px] bottom-[30px] border-l-2 border-dashed border-gray-100" />

            <button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 active:scale-[0.99] transition-all text-left bg-gray-50/50 hover:bg-gray-50 border border-gray-100"
            >
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-[#FFC107] border-2 border-white shadow-md shadow-[#FFC107]/20" />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block">Pickup</span>
                <span className="text-[11.5px] font-bold text-gray-600 block mt-0.5">Enter pickup location...</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 active:scale-[0.99] transition-all text-left bg-gray-50/50 hover:bg-gray-50 border border-gray-100"
            >
              <div className="w-3.5 h-3.5 rounded-lg flex-shrink-0 bg-red-500 border-2 border-white shadow-md shadow-red-500/20" />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block">Drop</span>
                <span className="text-[11.5px] font-bold text-gray-600 block mt-0.5">Where are you going?</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Booking Options Grid */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-[#F0F0F0]">
          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-gray-400">
            <Compass className="w-4 h-4 text-[#FFC107]" />
            Quick Booking Services
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'local', label: 'Local Ride', icon: Car },
              { id: 'airport_drop', label: 'Airport Drop', icon: Plane },
              { id: 'airport_pickup', label: 'Airport Pick', icon: Plane },
              { id: 'outstation_round', label: 'Outstation', icon: MapPin },
              { id: 'rental', label: 'Day Rental', icon: Clock },
              { id: 'outstation_oneway', label: 'One Way', icon: Compass }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleQuickBooking(cat.id as TripType)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl text-center transition-all active:scale-95 gap-2 border border-gray-50 bg-[#F9FBFD] hover:bg-white hover:border-[#FFC107]/20"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFC107]/10">
                    <Icon className="w-4.5 h-4.5 text-[#FFC107]" />
                  </div>
                  <span className="text-[10.5px] font-bold leading-tight text-[#121212]">{cat.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handleQuickBooking('local')}
            className="ripple-btn w-full py-4 rounded-2xl mt-4 flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-[#FFC107]/15"
            style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
          >
            Custom Booking Flow <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Airport Services Highlight */}
        <div className="bg-white rounded-3xl p-5.5 shadow-md border border-[#F0F0F0] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-sky-50 border border-sky-100 flex-shrink-0">
              <Plane className="w-5.5 h-5.5 text-sky-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-textDark">Airport Services</h4>
              <p className="text-[9.5px] text-gray-500 mt-0.5 leading-relaxed">
                Flat rates starting at just ₹899. Free 60 mins waiting time.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleQuickBooking('airport_drop')}
            className="bg-[#121212] text-white hover:bg-black font-black text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl flex-shrink-0 transition-colors shadow-sm"
          >
            Airport
          </button>
        </div>

        {/* Travel Packages / Banners - Auto Carousel */}
        {banners.filter(b => b.active).length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display">
                <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
                Travel Packages
              </h4>
              <span className="text-[9px] font-black text-brand-gold uppercase tracking-wider">Promo active</span>
            </div>
            {/* Carousel with active dot */}
            <div className="relative">
              {banners.filter(b => b.active).map((banner, idx) => (
                <div
                  key={banner.id}
                  style={{ display: idx === activeBannerIdx ? 'block' : 'none' }}
                >
                  <button
                    onClick={() => handleBannerClick(banner.id)}
                    className="w-full text-left rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-all shadow-md bg-gradient-to-br from-brand-dark to-stone-900 border border-brand-gold/15"
                  >
                    <div className="absolute right-2 -bottom-5 opacity-8 pointer-events-none">
                      <Gift className="w-28 h-28 text-brand-gold" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest mb-2 bg-[#FFC107]/10 text-brand-gold border border-brand-gold/20">
                      {banner.festivalName}
                    </span>
                    <h4 className="text-sm font-bold leading-snug max-w-[85%] text-white font-display">
                      {banner.title}
                    </h4>
                    <p className="text-[10px] mt-1 max-w-[90%] text-gray-400">{banner.subtitle}</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-3">
                      <span className="text-[9px] font-bold text-gray-400">Coupon:</span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono tracking-wider bg-white/5 border border-white/10 text-brand-gold">
                        {banner.couponCode}
                      </span>
                      <span className="ml-auto text-[9px] font-black px-3 py-1 bg-[#FFC107] text-[#121212] rounded-xl shadow-sm">
                        Book Now &rarr;
                      </span>
                    </div>
                  </button>
                </div>
              ))}
              {/* Carousel dots */}
              {banners.filter(b => b.active).length > 1 && (
                <div className="flex justify-center gap-1.5 mt-2">
                  {banners.filter(b => b.active).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBannerIdx(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === activeBannerIdx ? '20px' : '6px',
                        height: '6px',
                        background: i === activeBannerIdx ? '#FFC107' : '#E0E0E0'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display px-1">
              <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
              Recent Bookings
            </h4>
            <div className="flex flex-col gap-2.5">
              {recentBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-white p-4 rounded-3xl border border-[#F0F0F0] shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[8px] font-black text-gray-500 uppercase">
                        {bk.tripType.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {bk.date}
                      </span>
                    </div>
                    <h5 className="text-[11px] font-bold text-brand-textDark truncate mt-1">
                      {bk.pickupAddress.split(',')[0]} → {bk.dropAddress.split(',')[0] || 'Rental'}
                    </h5>
                    <p className="text-[9.5px] text-gray-400 mt-0.5">
                      {bk.vehicleDetails?.name || 'Cab Ride'} · ₹{bk.actualFare || bk.estimatedFareMin}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRebook(bk)}
                    className="border border-brand-gold/40 hover:bg-brand-gold/5 text-brand-gold text-[9px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-all"
                  >
                    Rebook
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Vehicles / Fleet Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display">
              <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
              Recommended Cabs
            </h4>
            <span className="text-[9px] font-bold text-brand-textGray">Swipe →</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl p-4 min-w-[200px] w-[200px] snap-center flex-shrink-0 flex flex-col justify-between border border-[#F0F0F0] shadow-sm hover:border-brand-gold/25 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-gray-50 border border-gray-100 text-gray-500 uppercase">{v.category}</span>
                    <span className="text-xs font-bold text-[#FFC107]">★ 4.9</span>
                  </div>
                  {/* transparent vehicle floating over white background */}
                  <div className="h-20 w-full rounded-2xl flex items-center justify-center my-3 overflow-hidden bg-gray-50/50 border border-gray-50 p-1">
                    <img src={getAssetUrl(v.image)} alt={v.name} className="h-full w-full object-contain filter drop-shadow-md" />
                  </div>
                  <h5 className="text-xs font-bold text-brand-textDark truncate">{v.name}</h5>
                  <p className="text-[10px] mt-1 text-gray-500 font-semibold">₹{v.pricing.pricePerKm}/KM · Min billing {v.pricing.minDistance}KM</p>
                </div>
                <button
                  onClick={() => handleQuickBooking('local')}
                  className="w-full py-2.5 rounded-2xl mt-3 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all bg-[#FFC107] text-[#121212] shadow-sm"
                >
                  Book Cabs
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Jolly Cabs */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display px-1">
            <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
            Why Choose Us?
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Verified Drivers', desc: 'Background checked professionals', icon: ShieldCheck },
              { title: 'No Hidden Fares', desc: 'Transparent pricing always', icon: DollarSign },
              { title: '24/7 Support', desc: 'Always available via call', icon: PhoneCall },
              { title: 'Clean Cabs', desc: 'Sanitized before every ride', icon: Sparkles }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-4 rounded-3xl flex flex-col gap-2 border border-[#F0F0F0] shadow-xs"
                >
                  <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center bg-[#FFC107]/10 text-[#FFC107]">
                    <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-brand-textDark">{item.title}</h5>
                    <p className="text-[9.5px] leading-relaxed text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Routes */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display">
              <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
              Popular Destinations
            </h4>
            <span className="text-[9px] font-black text-brand-gold uppercase tracking-wider">Best Prices</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {MOCK_ROUTES.filter(r => ['route_airport_drop', 'route_srisailam', 'route_tirupati', 'route_vijayawada'].includes(r.id)).map((route) => {
              const getRouteImage = (id: string) => {
                if (id.includes('srisailam')) return '/vehicles/srisailam_temple.jpg';
                if (id.includes('tirupati')) return '/vehicles/tirupati_temple.png';
                if (id.includes('vijayawada')) return '/vehicles/vijayawada_kanaka_durga.png';
                return '/vehicles/happy_passengers.jpg';
              };
              return (
                <button
                  key={route.id}
                  onClick={() => handlePopularRouteClick(route)}
                  className="w-full bg-white p-3 rounded-2xl flex items-center justify-between text-left active:scale-[0.99] transition-all border border-[#F0F0F0] shadow-sm hover:border-brand-gold/15"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-10.5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                      <img src={getAssetUrl(getRouteImage(route.id))} alt={route.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-brand-textDark truncate max-w-[170px]">{route.name}</h5>
                      <p className="text-[9.5px] mt-0.5 text-gray-400">
                        {route.distanceKm} KM · {route.durationMin} mins
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display px-1">
            <span className="w-1.5 h-4.5 rounded-full bg-[#FFC107]" />
            What Riders Say
          </h4>
          <div className="flex flex-col gap-2.5">
            {MOCK_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-4 flex flex-col gap-2 border border-[#F0F0F0] shadow-sm" style={{ borderLeft: '4.5px solid #FFC107' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-textDark">{rev.customerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed italic text-gray-500">"{rev.comment}"</p>
                <span className="self-end text-[8.5px] font-black px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-400 uppercase tracking-widest">
                  {rev.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Support & SOS */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-brand-textDark font-display px-1">
            <span className="w-1.5 h-4.5 rounded-full bg-red-500 animate-pulse" />
            Customer Support & Safety
          </h4>

          <div className="rounded-3xl p-4.5 flex items-center justify-between gap-4 bg-red-500/5 border border-red-500/15 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 flex-shrink-0">
                <ShieldAlert className="w-5.5 h-5.5 text-red-500 animate-pulse" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-red-700 uppercase tracking-wide">SOS Safety Button</h5>
                <p className="text-[9.5px] text-gray-400 mt-0.5 max-w-[170px] leading-normal">
                  In case of emergency, contact safety desk.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open('tel:7981232371')}
              className="px-4 py-2.5 rounded-xl text-[10px] font-black text-white bg-red-500 hover:bg-red-600 transition-colors active:scale-95 shadow-sm uppercase tracking-wider"
            >
              SOS Call
            </button>
          </div>

          {/* WhatsApp Quick Book */}
          <button
            onClick={() => window.open('https://wa.me/917981232371?text=Hi%20Jolly%20Cabs%2C%20I%20want%20to%20book%20a%20cab!', '_blank')}
            className="w-full rounded-3xl p-4 flex items-center gap-3.5 transition-all active:scale-[0.98] shadow-sm"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: '1px solid rgba(37,211,102,0.3)' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 block">Quick Book</span>
              <p className="text-xs font-black text-white mt-0.5">WhatsApp Us at 7981232371</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/70" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
