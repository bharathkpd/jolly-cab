import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Car, Compass, ArrowRight,
  Gift, Star, Menu, Bell, User2, ShieldCheck, DollarSign,
  PhoneCall, Sparkles, ShieldAlert, Plane, Clock, Navigation
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

  useEffect(() => {
    loadAllAdminData();
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, [loadAllAdminData]);

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
      <div className="screen-body bg-[#F5F5F5]">
        {/* Skeleton Header */}
        <div className="bg-[#FFC107] px-5 pt-6 pb-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl shimmer-bg bg-black/10" />
              <div className="flex flex-col gap-1.5">
                <div className="w-16 h-2.5 shimmer-bg rounded bg-black/10" />
                <div className="w-28 h-3.5 shimmer-bg rounded bg-black/10" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl shimmer-bg bg-black/10" />
              <div className="w-10 h-10 rounded-xl shimmer-bg bg-black/10" />
            </div>
          </div>
        </div>
        <div className="px-5 -mt-12 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm h-28 shimmer-bg" />
          <div className="bg-white rounded-3xl p-5 shadow-sm h-48 shimmer-bg" />
        </div>
      </div>
    );
  }

  return (
    <div className="screen-body bg-[#F5F5F5]">

      {/* ── Header ── */}
      <div className="bg-[#FFC107] px-5 pt-6 pb-20 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)'
        }} />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDrawer}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
              style={{ background: 'rgba(18,18,18,0.12)', border: '1px solid rgba(18,18,18,0.1)' }}
            >
              <Menu className="w-5 h-5 stroke-[2.5]" style={{ color: '#121212' }} />
            </button>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(18,18,18,0.6)' }}>
                Jolly Cabs
              </span>
              <h2
                className="text-base font-black truncate max-w-[160px]"
                style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}
              >
                Hello, {user?.name?.split(' ')[0] || 'Rider'} 👋
              </h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative active:scale-95 transition-all"
              style={{ background: 'rgba(18,18,18,0.12)', border: '1px solid rgba(18,18,18,0.1)' }}
            >
              <Bell className="w-5 h-5 stroke-[2.5]" style={{ color: '#121212' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border border-[#FFC107]" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all"
              style={{ background: 'rgba(18,18,18,0.12)', border: '1px solid rgba(18,18,18,0.1)' }}
            >
              <User2 className="w-5 h-5 stroke-[2.5]" style={{ color: '#121212' }} />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          <MapPin className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" style={{ color: '#121212' }} />
          <span className="text-[10px] font-bold truncate" style={{ color: 'rgba(18,18,18,0.75)' }}>
            Kukatpally, Hyderabad, Telangana
          </span>
        </div>
      </div>

      {/* ── Body (overlaps yellow header) ── */}
      <div className="px-4 -mt-12 flex flex-col gap-4 pb-6">

        {/* Active Ride Banner */}
        {hasActiveRide && (
          <button
            onClick={() => navigate(`/track/${activeBooking!.id}`)}
            className="w-full bg-[#121212] rounded-3xl p-4 flex items-center gap-3 shadow-xl active:scale-[0.98] transition-all"
            style={{ border: '1px solid rgba(255,193,7,0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFC107' }}
            >
              <Navigation className="w-5 h-5 animate-pulse" style={{ color: '#121212' }} />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Active Ride
              </span>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#fff' }}>
                {activeBooking!.status === 'pending' ? 'Finding driver...' :
                 activeBooking!.status === 'accepted' ? `${activeBooking!.driverName} assigned` :
                 activeBooking!.status === 'driver_reached' ? 'Driver arrived!' :
                 activeBooking!.status === 'trip_started' ? 'Ride in progress' : 'Track your ride'}
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl" style={{ background: '#FFC107' }}>
              <span className="text-[10px] font-black" style={{ color: '#121212' }}>Track →</span>
            </div>
          </button>
        )}

        {/* Search / Book Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#888' }}>
            Where can we take you?
          </h4>
          <div className="flex flex-col gap-2.5 relative">
            <div className="absolute left-[22px] top-7 bottom-7 border-l-2 border-dashed" style={{ borderColor: 'rgba(255,193,7,0.4)' }} />

            <button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 active:scale-[0.98] transition-all relative z-10"
              style={{ background: '#F8F8F8', border: '1.5px solid #EFEFEF' }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FFC107', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[8px] font-bold uppercase tracking-wide block" style={{ color: '#aaa' }}>Pickup</span>
                <span className="text-xs font-bold truncate block mt-0.5" style={{ color: '#888' }}>Enter pickup location...</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 active:scale-[0.98] transition-all relative z-10"
              style={{ background: '#F8F8F8', border: '1.5px solid #EFEFEF' }}
            >
              <div className="w-3 h-3 rounded flex-shrink-0" style={{ background: '#F44336', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[8px] font-bold uppercase tracking-wide block" style={{ color: '#aaa' }}>Drop</span>
                <span className="text-xs font-bold truncate block mt-0.5" style={{ color: '#888' }}>Where are you going?</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Book Services */}
        <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: '#888' }}>
            <Compass className="w-3.5 h-3.5" style={{ color: '#FFC107' }} />
            Quick Book
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
                  className="flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all active:scale-95 gap-1.5"
                  style={{ background: '#F8F8F8', border: '1.5px solid #EFEFEF' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,193,7,0.12)' }}>
                    <Icon className="w-4 h-4" style={{ color: '#FFC107' }} />
                  </div>
                  <span className="text-[10px] font-bold leading-tight" style={{ color: '#121212' }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handleQuickBooking('local')}
            className="ripple-btn w-full py-3.5 rounded-2xl mt-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
            style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
          >
            Book Custom Ride <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Why Choose Jolly Cabs */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2 px-1" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
            <span className="w-1 h-4 rounded-full" style={{ background: '#FFC107' }} />
            Why Jolly Cabs?
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
                  className="bg-white p-4 rounded-2xl flex flex-col gap-1.5"
                  style={{ borderLeft: '4px solid #FFC107', border: '1px solid #F0F0F0', borderLeftWidth: '4px', borderLeftColor: '#FFC107' }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FFC107' }}>
                    <Icon className="w-4 h-4" style={{ color: '#121212' }} />
                  </div>
                  <h5 className="text-[11px] font-bold" style={{ color: '#121212' }}>{item.title}</h5>
                  <p className="text-[9.5px] leading-relaxed" style={{ color: '#888' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Packages */}
        {banners.filter(b => b.active).length > 0 && (
          <div>
            <div className="flex items-center justify-between px-1 mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
                <span className="w-1 h-4 rounded-full" style={{ background: '#FFC107' }} />
                Special Packages
              </h4>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-lg" style={{ background: '#FFC107', color: '#121212' }}>Tap to Book</span>
            </div>
            <div className="flex flex-col gap-3">
              {banners.filter(b => b.active).map((banner) => (
                <button
                  key={banner.id}
                  onClick={() => handleBannerClick(banner.id)}
                  className="w-full text-left rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-all"
                  style={{ background: '#121212', border: '1px solid rgba(255,193,7,0.15)' }}
                >
                  <div className="absolute right-3 -bottom-4 opacity-10 pointer-events-none">
                    <Gift className="w-28 h-28" style={{ color: '#FFC107' }} />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide mb-2" style={{ background: 'rgba(255,193,7,0.1)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.25)' }}>
                    {banner.festivalName}
                  </span>
                  <h4 className="text-base font-bold leading-snug max-w-[85%]" style={{ color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                    {banner.title}
                  </h4>
                  <p className="text-[11px] mt-1 max-w-[90%]" style={{ color: '#888' }}>{banner.subtitle}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Code:</span>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono tracking-wider" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFC107' }}>
                      {banner.couponCode}
                    </span>
                    <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-xl" style={{ background: 'rgba(255,193,7,0.1)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.2)' }}>
                      Book →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Routes */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
              <span className="w-1 h-4 rounded-full" style={{ background: '#FFC107' }} />
              Popular Routes
            </h4>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg" style={{ background: '#FFC107', color: '#121212' }}>Best Prices</span>
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
                  className="w-full bg-white p-3 rounded-2xl flex items-center justify-between text-left active:scale-[0.98] transition-all"
                  style={{ border: '1px solid #F0F0F0' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1px solid #F0F0F0' }}>
                      <img src={getAssetUrl(getRouteImage(route.id))} alt={route.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold truncate max-w-[170px]" style={{ color: '#121212' }}>{route.name}</h5>
                      <p className="text-[9.5px] mt-0.5" style={{ color: '#888' }}>
                        {route.distanceKm} KM · {route.durationMin} mins
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#F5F5F5' }}>
                    <ArrowRight className="w-3 h-3" style={{ color: '#888' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium Fleet */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
              <span className="w-1 h-4 rounded-full" style={{ background: '#FFC107' }} />
              Our Fleet
            </h4>
            <span className="text-[10px] font-bold" style={{ color: '#FFC107' }}>Swipe →</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-4 min-w-[190px] w-[190px] snap-center flex-shrink-0 flex flex-col justify-between"
                style={{ border: '1px solid #F0F0F0' }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: '#F5F5F5', color: '#888' }}>{v.category}</span>
                    <span className="text-xs font-bold" style={{ color: '#FFC107' }}>★ 4.9</span>
                  </div>
                  <div className="h-20 w-full rounded-xl flex items-center justify-center my-3 overflow-hidden" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                    <img src={getAssetUrl(v.image)} alt={v.name} className="h-full w-full object-contain" />
                  </div>
                  <h5 className="text-xs font-bold truncate" style={{ color: '#121212' }}>{v.name}</h5>
                  <p className="text-[10px] mt-1" style={{ color: '#888' }}>₹{v.pricing.pricePerKm}/KM</p>
                </div>
                <button
                  onClick={() => handleQuickBooking('local')}
                  className="w-full py-2 rounded-xl mt-3 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all"
                  style={{ background: '#FFC107', color: '#121212' }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SOS Card */}
        <div className="rounded-3xl p-5 flex items-center justify-between gap-4" style={{ background: 'rgba(244,67,54,0.05)', border: '1px solid rgba(244,67,54,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)' }}>
              <ShieldAlert className="w-5 h-5 animate-pulse" style={{ color: '#F44336' }} />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase" style={{ color: '#D32F2F' }}>Emergency Help</h5>
              <p className="text-[9.5px] mt-0.5 max-w-[160px]" style={{ color: '#888' }}>Need immediate safety help? Dial emergency.</p>
            </div>
          </div>
          <button
            onClick={() => window.open('tel:7981232371')}
            className="px-4 py-2.5 rounded-xl text-[10px] font-bold text-white transition-colors active:scale-95"
            style={{ background: '#F44336' }}
          >
            SOS
          </button>
        </div>

        {/* Reviews */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider mb-3 px-1 flex items-center gap-2" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>
            <span className="w-1 h-4 rounded-full" style={{ background: '#FFC107' }} />
            Customer Reviews
          </h4>
          <div className="flex flex-col gap-2.5">
            {MOCK_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-4 flex flex-col gap-1.5" style={{ border: '1px solid #F0F0F0', borderLeft: '4px solid #FFC107' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: '#121212' }}>{rev.customerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: '#888' }}>"{rev.comment}"</p>
                <span className="self-end text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider" style={{ background: 'rgba(255,193,7,0.15)', color: '#121212' }}>
                  {rev.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
