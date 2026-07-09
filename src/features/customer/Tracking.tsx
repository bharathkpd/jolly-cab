import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Shield, Navigation, Star, FileText } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { MapComponent } from '../../components/MapComponent';
import { fetchMapRoute } from '../../services/mapsService';

export const Tracking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { activeBooking, cancelBooking, addReviewToHistory } = useBookingStore();

  const [progress, setProgress] = useState(0); // 0 to 100 for car position
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [carCoords, setCarCoords] = useState<[number, number] | null>(null);
  const [isLoadingMapData, setIsLoadingMapData] = useState(false);

  // Retrieve current tracking details
  const booking = activeBooking?.id === bookingId ? activeBooking : null;

  // Car map animation during "trip_started"
  useEffect(() => {
    if (!booking || booking.status !== 'trip_started') {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // increase progress gradually
      });
    }, 800);

    return () => clearInterval(interval);
  }, [booking?.status]);

  // Geocode pickup & drop addresses on mount / booking change
  useEffect(() => {
    if (!booking) return;

    const resolveAddresses = async () => {
      setIsLoadingMapData(true);
      let pCoords: [number, number] = [17.4849, 78.3884]; // Fallback Kukatpally
      let dCoords: [number, number] = [17.2403, 78.4294]; // Fallback Airport

      // Address coordinates lookup
      const getCoords = async (address: string): Promise<[number, number] | null> => {
        // Quick fallbacks for popular locations to make loading instant
        const query = address.toLowerCase();
        if (query.includes('kukatpally')) return [17.4849, 78.3884];
        if (query.includes('gachibowli')) return [17.4401, 78.3489];
        if (query.includes('secunderabad')) return [17.4344, 78.5011];
        if (query.includes('airport') || query.includes('rgia')) return [17.2403, 78.4294];
        if (query.includes('srisailam')) return [16.0734, 78.8681];
        if (query.includes('tirupati')) return [13.6833, 79.3475];
        if (query.includes('vijayawada')) return [16.5062, 80.6480];

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
              return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
          }
        } catch (e) {
          console.warn('Geocoding error in tracking, using defaults.');
        }
        return null;
      };

      const resolvedPickup = await getCoords(booking.pickupAddress);
      if (resolvedPickup) pCoords = resolvedPickup;

      if (booking.tripType !== 'rental') {
        const resolvedDrop = await getCoords(booking.dropAddress);
        if (resolvedDrop) dCoords = resolvedDrop;
      }

      setPickupCoords(pCoords);
      if (booking.tripType !== 'rental') {
        setDropCoords(dCoords);
      } else {
        setDropCoords(null);
      }
      setIsLoadingMapData(false);
    };

    resolveAddresses();
  }, [booking?.id]);

  // Fetch actual street route from OSRM between pickup & drop
  useEffect(() => {
    if (!pickupCoords) return;

    const getRoutePath = async () => {
      if (booking?.tripType === 'rental' || !dropCoords) {
        setRouteCoords([]);
        setCarCoords(pickupCoords);
        return;
      }

      const routeInfo = await fetchMapRoute(pickupCoords[0], pickupCoords[1], dropCoords[0], dropCoords[1]);
      if (routeInfo) {
        setRouteCoords(routeInfo.routeCoords);
        setCarCoords(routeInfo.routeCoords[0]);
      } else {
        console.warn('Routing path fetch failed in tracking.');
        setRouteCoords([pickupCoords, dropCoords]);
        setCarCoords(pickupCoords);
      }

      // Straight line fallback
      setRouteCoords([pickupCoords, dropCoords]);
      setCarCoords(pickupCoords);
    };

    getRoutePath();
  }, [pickupCoords, dropCoords, booking?.tripType]);

  // Move car along the route coords array based on progress percentage
  useEffect(() => {
    if (routeCoords.length === 0) {
      if (pickupCoords) setCarCoords(pickupCoords);
      return;
    }

    const index = Math.min(
      routeCoords.length - 1,
      Math.floor((progress / 100) * routeCoords.length)
    );
    setCarCoords(routeCoords[index]);
  }, [progress, routeCoords, pickupCoords]);

  const handleCancel = async () => {
    if (!booking) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(booking.id);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    addReviewToHistory(booking.id, rating, comment);
    setReviewSubmitted(true);
    alert('Thank you for your feedback!');
    navigate('/');
  };

  if (!booking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Navigation className="w-12 h-12 text-brand-gold animate-bounce mb-3" />
        <h3 className="font-bold text-sm">Searching Booking ID...</h3>
        <p className="text-xs text-brand-textGray mt-1">We couldn't locate this active trip. It may have expired.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold">
          Go Home
        </button>
      </div>
    );
  }

  // Determine status color/text
  const getStatusDetails = () => {
    switch (booking.status) {
      case 'accepted':
        return { text: 'Driver Assigned', color: 'bg-blue-500 text-white', desc: 'Driver is arriving at your location.' };
      case 'driver_reached':
        return { text: 'Driver Reached', color: 'bg-amber-500 text-brand-dark', desc: 'Driver has arrived. Share OTP 1234.' };
      case 'trip_started':
        return { text: 'In Transit', color: 'bg-brand-success text-white', desc: 'Heading towards drop-off point.' };
      case 'trip_completed':
        return { text: 'Trip Finished', color: 'bg-brand-dark text-white', desc: 'Thank you for riding with Jolly Cabs!' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-brand-danger text-white', desc: 'This trip was cancelled.' };
      case 'pending':
      default:
        return { text: 'Assigning Driver', color: 'bg-[#FFC107] text-brand-dark animate-pulse', desc: 'Finding the nearest verified cab...' };
    }
  };

  const statusInfo = getStatusDetails();

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight">
      {/* Dynamic Status Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex items-center justify-between shadow-md flex-shrink-0">
        <div>
          <span className="text-[10px] text-brand-textGray font-semibold uppercase block">Trip Tracking</span>
          <h2 className="text-xs font-bold font-display mt-0.5">Booking ID: {booking.id}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>

      {/* Simulated Live Route Map */}
      <div className="flex-1 min-h-[300px] relative overflow-hidden flex items-center justify-center bg-brand-borderLight z-0">
        {pickupCoords ? (
          <MapComponent
            pickupCoords={pickupCoords}
            dropCoords={dropCoords}
            routeCoords={routeCoords}
            carCoords={carCoords}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-xs text-brand-textGray font-semibold gap-2">
            <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            <span>Resolving street locations...</span>
          </div>
        )}
        
        {/* Live Tracking overlay card */}
        <div className="absolute top-3 left-4 right-4 bg-white/95 border border-brand-borderLight p-3 rounded-2xl shadow-premium text-center z-10 backdrop-blur-sm">
          <p className="text-[10px] text-brand-textGray font-bold uppercase tracking-wider">Ride Dispatch Status</p>
          <p className="text-xs font-bold text-brand-textDark mt-1">{statusInfo.desc}</p>
        </div>
      </div>

      {/* Driver info / Review Panels */}
      <div className="bg-white rounded-t-[36px] border-t border-brand-borderLight p-6 flex-shrink-0 shadow-premium relative z-10">
        {booking.status === 'trip_completed' ? (
          /* Post-Trip Rating Review Card */
          <div className="flex flex-col gap-4 text-center animate-slide-up">
            <div className="flex flex-col items-center">
              <span className="px-2.5 py-0.5 bg-brand-success/10 border border-brand-success/20 rounded-full text-[9px] font-bold text-brand-success uppercase tracking-wide">
                Completed
              </span>
              <h3 className="text-sm font-bold text-brand-textDark mt-2">Rate Your Driver & Trip</h3>
              <p className="text-[10px] text-brand-textGray mt-0.5">Help us improve Jolly Cabs premium taxi services.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              {/* Star inputs */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-textGray/30'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review comments */}
              <input
                type="text"
                placeholder="E.g. Great ride, clean car, professional driver"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bgLight border border-brand-borderLight focus:border-brand-gold rounded-2xl text-xs font-semibold outline-none"
              />

              <button
                type="submit"
                className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-gold-glow uppercase tracking-wider"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        ) : (
          /* Dispatch Active Driver Card */
          <div className="flex flex-col gap-5">
            {booking.driverName ? (
              <div className="flex items-center justify-between border-b border-brand-bgLight pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center font-display font-bold text-brand-gold text-sm">
                    SR
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-textDark">{booking.driverName}</h4>
                    <p className="text-[10px] text-brand-textGray flex items-center gap-0.5 mt-0.5 font-semibold">
                      <Star className="w-3 h-3 fill-brand-gold text-brand-gold" /> {booking.driverRating} • Verified
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h4 className="text-xs font-bold text-brand-textDark">{booking.vehicleNumber}</h4>
                  <p className="text-[9px] text-brand-textGray font-semibold mt-0.5">
                    {booking.vehicleDetails?.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 border-b border-brand-bgLight">
                <p className="text-xs text-brand-textGray animate-pulse font-semibold">
                  Waiting to assign chauffeur details...
                </p>
              </div>
            )}

            {/* Support Call/WhatsApp & SOS controls */}
            <div className="flex items-center justify-between gap-3">
              <a
                href="tel:+917981232371"
                className="flex-1 flex items-center justify-center gap-2 border border-brand-borderLight text-brand-textDark hover:bg-brand-bgLight py-3 rounded-2xl text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                Call Driver
              </a>

              {/* SOS Emergency button */}
              <button
                onClick={() => alert('SOS Triggered! Dispatch team has been notified. Calling emergency services...')}
                className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow transition-colors"
                title="SOS Trigger"
              >
                <Shield className="w-5 h-5" />
              </button>

              {/* Cancel Option */}
              {(booking.status === 'pending' || booking.status === 'accepted') ? (
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 border border-brand-danger/30 text-brand-danger hover:bg-red-50 py-3 rounded-2xl text-xs font-bold transition-all"
                >
                  Cancel Ride
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 border border-brand-borderLight text-brand-textGray py-3 rounded-2xl text-xs font-bold opacity-45 cursor-not-allowed"
                >
                  Trip Underway
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
