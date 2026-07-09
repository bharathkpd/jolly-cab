import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, MessageSquare, Car, Compass, ArrowRight, 
  Gift, Star, Menu, Bell, User2, ShieldCheck, DollarSign, 
  PhoneCall, Sparkles, ShieldAlert, Plane, Clock 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { useAdminStore } from '../../store/adminStore';
import { useUiStore } from '../../store/uiStore';
import { MOCK_ROUTES, MOCK_REVIEWS } from '../../services/mockData';
import { TripType } from '../../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setBookingField, setRoute, clearBookingForm } = useBookingStore();
  const { banners, vehicles, loadAllAdminData } = useAdminStore();
  const { toggleDrawer } = useUiStore();

  const [isLoadingScreen, setIsLoadingScreen] = React.useState(true);

  useEffect(() => {
    // Load admin settings (pricing, active banners)
    loadAllAdminData();

    // Premium shimmer loader simulator
    const timer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 850);
    return () => clearTimeout(timer);
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
      setRoute(
        'Kukatpally, Hyderabad, Telangana',
        'Srisailam Mallikarjuna Temple, Andhra Pradesh',
        215,
        270,
        150
      );
      setBookingField('selectedVehicleId', 'veh_sedan');
      navigate('/vehicles');
    } else if (bannerId === 'fb_outstation') {
      setBookingField('tripType', 'outstation_round');
      setBookingField('couponCode', 'OUTSTATION15');
      navigate('/booking');
    }
  };

  if (isLoadingScreen) {
    return (
      <div className="flex-1 flex flex-col bg-brand-bgLight overflow-hidden p-6 gap-6 min-h-0 select-none">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-borderLight shimmer-bg" />
            <div className="flex flex-col gap-1.5">
              <div className="w-16 h-3 bg-brand-borderLight rounded-md shimmer-bg" />
              <div className="w-28 h-4 bg-brand-borderLight rounded-md shimmer-bg" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-borderLight shimmer-bg" />
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-borderLight shimmer-bg" />
          </div>
        </div>

        {/* Skeleton Banner */}
        <div className="w-full h-36 rounded-3xl bg-white border border-brand-borderLight p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="w-20 h-4 bg-brand-borderLight rounded-md shimmer-bg" />
            <div className="w-48 h-5 bg-brand-borderLight rounded-md shimmer-bg" />
            <div className="w-32 h-3 bg-brand-borderLight rounded-md shimmer-bg" />
          </div>
          <div className="w-24 h-8 bg-brand-borderLight rounded-xl shimmer-bg" />
        </div>

        {/* Skeleton Grid Title */}
        <div className="flex flex-col gap-1">
          <div className="w-28 h-4 bg-brand-borderLight rounded-md shimmer-bg" />
        </div>

        {/* Skeleton Categories Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-white border border-brand-borderLight p-3 flex flex-col justify-center items-center gap-2">
              <div className="w-12 h-3.5 bg-brand-borderLight rounded-md shimmer-bg" />
            </div>
          ))}
        </div>

        {/* Skeleton Routes List Title */}
        <div className="flex flex-col gap-1">
          <div className="w-32 h-4 bg-brand-borderLight rounded-md shimmer-bg" />
        </div>

        {/* Skeleton Routes List */}
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-16 bg-white rounded-2xl border border-brand-borderLight p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-xl bg-brand-borderLight shimmer-bg" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-32 h-3.5 bg-brand-borderLight rounded-md shimmer-bg" />
                  <div className="w-24 h-2.5 bg-brand-borderLight rounded-md shimmer-bg" />
                </div>
              </div>
              <div className="w-6 h-6 rounded-lg bg-brand-borderLight shimmer-bg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight overflow-y-auto scrollbar-none pb-6 min-h-0 relative">
      {/* 1. Header welcome - Taxi Yellow themed for brand prominence */}
      <div 
        className="bg-brand-gold text-brand-dark px-6 pt-6 pb-20 rounded-b-[36px] relative overflow-hidden flex-shrink-0 border-b border-brand-dark/10 shadow-md"
      >
        <div className="absolute w-44 h-44 bg-white/15 rounded-full blur-[50px] -top-10 -right-10 pointer-events-none" />
        
        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={toggleDrawer}
              className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center border border-brand-dark/15 hover:bg-brand-dark/20 transition-all text-brand-dark"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <span className="text-[9px] text-brand-dark/65 tracking-wider font-bold uppercase">Jolly Cabs</span>
              <h3 className="text-base font-display font-extrabold text-brand-dark mt-0.5 truncate max-w-[150px]">
                Hello, {user?.name || 'Jolly Rider'}
              </h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center border border-brand-dark/15 hover:bg-brand-dark/20 transition-all relative animate-bounce-gentle text-brand-dark"
              title="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[2.5]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border border-brand-gold" />
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center border border-brand-dark/15 hover:bg-brand-dark/20 transition-all text-brand-dark"
              title="Profile"
            >
              <User2 className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Current Location Bar */}
        <div className="mt-4 flex items-center gap-2 text-[10px] text-brand-dark/85 font-bold">
          <MapPin className="w-3.5 h-3.5 text-brand-dark stroke-[2.5]" />
          <span className="truncate">Kukatpally, Hyderabad, Telangana, India</span>
        </div>
      </div>

      {/* Main content body */}
      <div className="px-6 -mt-12 z-10 flex flex-col gap-6">
        
        {/* 2. Cohesive Destination Search Box */}
        <div className="bg-white rounded-3xl p-5 shadow-premium border border-brand-borderLight flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider px-1">
            Where can we take you?
          </h4>
          
          <div className="flex flex-col gap-3 relative">
            {/* Visual connector line */}
            <div className="absolute left-[21px] top-6 bottom-6 w-[1.5px] border-l border-dashed border-brand-textGray/30 z-0" />

            <div 
              className="flex items-center gap-3 bg-brand-bgLight border border-brand-borderLight rounded-2xl px-4 py-3 hover:border-brand-gold/60 transition-all cursor-pointer relative z-10" 
              onClick={() => navigate('/booking')}
            >
              <div className="w-3 h-3 rounded-full bg-brand-gold border-2 border-white shadow flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] text-brand-textGray block uppercase font-bold tracking-wide">Pickup Location</span>
                <span className="text-xs font-bold text-brand-textDark truncate block mt-0.5">Enter pickup address...</span>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-3 bg-brand-bgLight border border-brand-borderLight rounded-2xl px-4 py-3 hover:border-brand-gold/60 transition-all cursor-pointer relative z-10" 
              onClick={() => navigate('/booking')}
            >
              <div className="w-3 h-3 bg-red-500 border-2 border-white shadow flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] text-brand-textGray block uppercase font-bold tracking-wide">Drop Destination</span>
                <span className="text-xs font-bold text-brand-textDark truncate block mt-0.5">Where are you heading?</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick booking categories grid */}
        <div className="bg-white rounded-3xl p-5 shadow-premium border border-brand-borderLight">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-brand-textGray">
            <Compass className="w-4 h-4 text-brand-gold" />
            Quick Book Services
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'local', label: 'Local Ride', icon: Car },
              { id: 'airport_drop', label: 'Airport Drop', icon: Plane },
              { id: 'airport_pickup', label: 'Airport Pick', icon: Plane },
              { id: 'outstation_round', label: 'Outstation', icon: MapPin },
              { id: 'rental', label: 'Day Rental', icon: Clock },
              { id: 'outstation_oneway', label: 'One Way Out', icon: Compass }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleQuickBooking(cat.id as TripType)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border border-brand-borderLight bg-brand-bgLight text-center transition-all hover:border-brand-gold hover:bg-white active:scale-95 gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-textDark leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleQuickBooking('local')}
            className="w-full bg-brand-gold text-brand-dark text-xs font-black py-3.5 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all hover:bg-brand-lightGold shadow-gold-glow uppercase tracking-wider"
          >
            Create Custom Booking
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* 4. Why Choose Jolly Cabs */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider px-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-gold rounded-full" />
            Why Choose Jolly Cabs?
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Verified Drivers', desc: 'Safety first. Background checked and professional pilots.', icon: ShieldCheck },
              { title: 'Transparent Fares', desc: 'No hidden charges or surge pricing on pilgrimage trips.', icon: DollarSign },
              { title: '24/7 Hotline Support', desc: 'Support line active through calls and WhatsApp live chat.', icon: PhoneCall },
              { title: 'Sanitized Cabs', desc: 'Standardized cleanliness parameters on all rides.', icon: Sparkles }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border-l-4 border-l-brand-gold border border-brand-borderLight shadow-sm flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-gold flex items-center justify-center text-brand-dark">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h5 className="text-[11px] font-extrabold text-brand-textDark">{item.title}</h5>
                  <p className="text-[9.5px] text-brand-textGray leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Special Travel Packages Banners */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-gold rounded-full" />
              Special Travel Packages
            </h4>
            <span className="text-[10px] font-black text-brand-dark bg-brand-gold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Tap to Book</span>
          </div>

          {banners.filter(b => b.active).map((banner) => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner.id)}
              className="bg-[#121212] border border-brand-gold/15 rounded-3xl p-5 text-white shadow-premium relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-all active:scale-[0.99]"
            >
              <div className="absolute right-2 -bottom-4 opacity-10">
                <Gift className="w-32 h-32 text-brand-gold" />
              </div>
              <span className="px-2.5 py-0.5 bg-brand-gold/10 border border-brand-gold/25 rounded-full text-[9px] font-bold text-brand-gold uppercase tracking-wide inline-block">
                {banner.festivalName}
              </span>
              <h4 className="text-base font-bold font-display mt-2 leading-snug max-w-[85%]">
                {banner.title}
              </h4>
              <p className="text-[11px] text-brand-textGray mt-1 leading-normal max-w-[90%]">
                {banner.subtitle}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] font-semibold text-white/90">Use Code:</span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs font-bold font-mono tracking-wider text-brand-gold">
                  {banner.couponCode}
                </span>
                <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-xl ml-auto border border-brand-gold/20">
                  Book package →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 6. Popular regional route shortcuts */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-black text-brand-dark tracking-tight flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-gold rounded-full" />
              Popular Routes
            </h4>
            <span className="text-[10px] font-black text-brand-dark bg-brand-gold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Best Prices</span>
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
                  className="w-full bg-white p-3 rounded-2xl border border-brand-borderLight shadow-sm flex items-center justify-between text-left hover:scale-[1.01] hover:border-brand-gold/30 transition-all group flex-shrink-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-xl bg-brand-bgLight flex items-center justify-center flex-shrink-0 overflow-hidden border border-brand-borderLight">
                      <img 
                        src={getRouteImage(route.id)}
                        alt={route.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold truncate max-w-[170px] text-brand-textDark">
                        {route.name}
                      </h5>
                      <p className="text-[9.5px] text-brand-textGray mt-0.5">
                        Distance: <span className="font-semibold text-brand-textDark">{route.distanceKm} KM</span> • {route.durationMin} mins
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-brand-bgLight group-hover:bg-brand-gold flex items-center justify-center text-brand-textGray group-hover:text-brand-dark transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Premium Fleet showcase */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-black text-brand-dark tracking-tight flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-gold rounded-full" />
              Premium Fleet
            </h4>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Swipe →</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {vehicles.map((v) => (
              <div 
                key={v.id}
                className="bg-white rounded-2xl border border-brand-borderLight p-4 shadow-sm min-w-[200px] w-[200px] snap-center flex-shrink-0 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-brand-dark/5 rounded-full text-[9px] font-semibold text-brand-textGray">
                      {v.category}
                    </span>
                    <span className="text-xs font-bold text-brand-gold flex items-center gap-0.5">
                      ★ 4.9
                    </span>
                  </div>
                  
                  {/* Rendered vehicle JPEG */}
                  <div className="h-24 w-full bg-white rounded-xl flex items-center justify-center my-3 overflow-hidden border border-brand-borderLight shadow-sm p-1">
                    <img 
                      src={v.image} 
                      alt={v.name} 
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h5 className="text-xs font-bold text-brand-textDark truncate">{v.name}</h5>
                  <p className="text-[10px] text-brand-textGray mt-1">
                    Rate: <span className="font-bold text-brand-textDark">₹{v.pricing.pricePerKm}/KM</span>
                  </p>
                </div>
                <button
                  onClick={() => handleQuickBooking('local')}
                  className="w-full bg-brand-gold text-brand-dark text-[10px] font-black py-2 rounded-xl mt-3 transition-all hover:bg-brand-lightGold shadow-sm uppercase tracking-wider"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Emergency SOS Card */}
        <div className="bg-red-500/5 border border-red-500/15 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-red-600 uppercase">Emergency Safety Help</h5>
              <p className="text-[9.5px] text-brand-textGray mt-0.5 leading-normal max-w-[160px]">
                Need immediate safety help on trip? Dial emergency police hotline.
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.open('tel:7981232371')}
            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            SOS Call
          </button>
        </div>

        {/* 9. Customer Testimonials */}
        <div className="mb-4">
          <h4 className="text-sm font-black text-brand-dark tracking-tight mb-3 px-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-gold rounded-full" />
            What Our Customers Say
          </h4>
          <div className="flex flex-col gap-2.5">
            {MOCK_REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white rounded-2xl p-4 border border-brand-borderLight border-l-4 border-l-brand-gold shadow-sm flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-brand-dark">{rev.customerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-brand-textGray italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[9px] font-black text-brand-dark bg-brand-gold/15 px-2 py-0.5 rounded-lg self-end uppercase tracking-wider">
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
