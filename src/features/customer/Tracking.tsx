import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Shield, Star, ArrowLeft, Car, MapPin, Clock } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { MapComponent } from '../../components/MapComponent';
import { fetchMapRoute } from '../../services/mapsService';

export const Tracking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { activeBooking, cancelBooking, addReviewToHistory } = useBookingStore();

  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [carCoords, setCarCoords] = useState<[number, number] | null>(null);

  const booking = activeBooking?.id === bookingId ? activeBooking : null;

  // Simulate car movement
  useEffect(() => {
    if (!booking || booking.status !== 'trip_started') { setProgress(0); return; }
    const iv = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + 4);
    }, 800);
    return () => clearInterval(iv);
  }, [booking?.status]);

  // Resolve coords
  useEffect(() => {
    if (!booking) return;
    const getCoords = (addr: string): [number, number] | null => {
      const q = addr.toLowerCase();
      if (q.includes('kukatpally')) return [17.4849, 78.3884];
      if (q.includes('gachibowli')) return [17.4401, 78.3489];
      if (q.includes('secunderabad')) return [17.4344, 78.5011];
      if (q.includes('airport') || q.includes('rgia')) return [17.2403, 78.4294];
      if (q.includes('srisailam')) return [16.0734, 78.8681];
      if (q.includes('tirupati')) return [13.6833, 79.3475];
      if (q.includes('vijayawada')) return [16.5062, 80.6480];
      if (q.includes('charminar')) return [17.3616, 78.4747];
      if (q.includes('hitech') || q.includes('hi-tech')) return [17.4483, 78.3741];
      return null;
    };
    const p = getCoords(booking.pickupAddress) || [17.4849, 78.3884];
    const d = booking.tripType !== 'rental' ? (getCoords(booking.dropAddress) || [17.2403, 78.4294]) : null;
    setPickupCoords(p);
    setDropCoords(d);
  }, [booking?.id]);

  // Fetch route
  useEffect(() => {
    if (!pickupCoords || !dropCoords) return;
    const getRoute = async () => {
      const routeInfo = await fetchMapRoute(pickupCoords[0], pickupCoords[1], dropCoords[0], dropCoords[1]);
      if (routeInfo) {
        setRouteCoords(routeInfo.routeCoords);
        setCarCoords(routeInfo.routeCoords[0]);
      } else {
        setRouteCoords([pickupCoords, dropCoords]);
        setCarCoords(pickupCoords);
      }
    };
    getRoute();
  }, [pickupCoords, dropCoords]);

  // Move car along route
  useEffect(() => {
    if (routeCoords.length === 0) { if (pickupCoords) setCarCoords(pickupCoords); return; }
    const idx = Math.min(routeCoords.length - 1, Math.floor((progress / 100) * routeCoords.length));
    setCarCoords(routeCoords[idx]);
  }, [progress, routeCoords]);

  const handleCancel = async () => {
    if (!booking) return;
    if (window.confirm('Cancel this booking?')) {
      await cancelBooking(booking.id);
      navigate('/', { replace: true });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    addReviewToHistory(booking.id, rating, comment);
    alert('Thank you for your feedback!');
    navigate('/', { replace: true });
  };

  const getStatusInfo = () => {
    switch (booking?.status) {
      case 'accepted': return { text: 'Driver Assigned', color: '#2196F3', desc: `${booking.driverName} is on the way`, pulse: false };
      case 'driver_reached': return { text: 'Driver Arrived', color: '#FF9800', desc: 'Driver has reached your location', pulse: false };
      case 'trip_started': return { text: 'Ride in Progress', color: '#4CAF50', desc: 'Heading to your destination', pulse: false };
      case 'trip_completed': return { text: 'Completed', color: '#121212', desc: 'You have reached your destination', pulse: false };
      case 'cancelled': return { text: 'Cancelled', color: '#F44336', desc: 'This booking was cancelled', pulse: false };
      default: return { text: 'Finding Driver', color: '#FFC107', desc: 'Searching for nearest driver...', pulse: true };
    }
  };

  if (!booking) {
    return (
      <div className="screen items-center justify-center p-6 text-center" style={{ background: '#F5F5F5' }}>
        <Car className="w-12 h-12 mb-4 animate-pulse" style={{ color: '#FFC107' }} />
        <h3 className="font-bold text-sm" style={{ color: '#121212' }}>Ride Not Found</h3>
        <p className="text-xs mt-1" style={{ color: '#888' }}>This booking may have expired.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: '#121212' }}>
          Go Home
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="screen" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4" style={{ background: '#121212' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Booking {booking.id}
            </span>
            <h2 className="text-sm font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Live Tracking</h2>
          </div>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
          style={{ background: `${statusInfo.color}20`, color: statusInfo.color, border: `1px solid ${statusInfo.color}40` }}
        >
          {statusInfo.pulse && <span className="mr-1 animate-pulse">●</span>}
          {statusInfo.text}
        </span>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0" style={{ minHeight: '250px' }}>
        {pickupCoords ? (
          <MapComponent
            pickupCoords={pickupCoords}
            dropCoords={dropCoords}
            routeCoords={routeCoords}
            carCoords={carCoords}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#E8E8E8' }}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#FFC107' }} />
              <span className="text-xs font-semibold" style={{ color: '#888' }}>Loading map...</span>
            </div>
          </div>
        )}

        {/* Status overlay */}
        <div
          className="absolute top-3 left-4 right-4 p-3 rounded-2xl z-10 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #EFEFEF' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-center mb-0.5" style={{ color: '#aaa' }}>
            Trip Status
          </p>
          <p className="text-xs font-bold text-center" style={{ color: '#121212' }}>{statusInfo.desc}</p>
        </div>
      </div>

      {/* Driver / Review Panel */}
      <div
        className="flex-shrink-0 bg-white rounded-t-[32px] p-5"
        style={{ border: '1px solid #F0F0F0', maxHeight: '45%', overflowY: 'auto' }}
      >
        {booking.status === 'trip_completed' ? (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide" style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.2)' }}>
                Trip Completed
              </span>
              <h3 className="text-sm font-bold mt-2" style={{ color: '#121212' }}>Rate Your Experience</h3>
              <p className="text-[10px] mt-0.5" style={{ color: '#888' }}>Help us improve Jolly Cabs</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={`w-8 h-8 transition-all ${star <= rating ? 'fill-[#FFC107] text-[#FFC107]' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-xs font-semibold outline-none"
                style={{ background: '#F5F5F5', border: '1.5px solid #EFEFEF', color: '#121212' }}
              />
              <button
                type="submit"
                className="ripple-btn w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider"
                style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
              >
                Submit Rating
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Driver info */}
            {booking.driverName ? (
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#F5F5F5' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ background: 'rgba(255,193,7,0.12)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.25)' }}
                  >
                    {booking.driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold" style={{ color: '#121212' }}>{booking.driverName}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                      <span className="text-[10px] font-semibold" style={{ color: '#888' }}>{booking.driverRating} · Verified</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: '#121212' }}>{booking.vehicleNumber}</p>
                  <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#888' }}>{booking.vehicleDetails?.name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-3 border-b" style={{ borderColor: '#F5F5F5' }}>
                <p className="text-xs animate-pulse font-semibold" style={{ color: '#888' }}>
                  Assigning driver...
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+917981232371"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all"
                style={{ border: '1.5px solid #EFEFEF', color: '#121212' }}
              >
                <Phone className="w-4 h-4" style={{ color: '#FFC107' }} />
                Call Support
              </a>

              <button
                onClick={() => alert('SOS triggered! Emergency services notified.')}
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                style={{ background: '#F44336' }}
              >
                <Shield className="w-5 h-5 text-white" />
              </button>

              {(booking.status === 'pending' || booking.status === 'accepted') ? (
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center py-3 rounded-2xl text-xs font-bold transition-all"
                  style={{ border: '1.5px solid rgba(244,67,54,0.3)', color: '#F44336' }}
                >
                  Cancel Ride
                </button>
              ) : (
                <div
                  className="flex-1 flex items-center justify-center py-3 rounded-2xl text-xs font-bold"
                  style={{ border: '1.5px solid #EFEFEF', color: '#ccc' }}
                >
                  In Progress
                </div>
              )}
            </div>

            {/* Route info */}
            <div className="flex flex-col gap-2 px-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#FFC107' }} />
                <p className="text-[10px] font-semibold" style={{ color: '#888' }}>{booking.pickupAddress}</p>
              </div>
              {booking.tripType !== 'rental' && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#F44336' }} />
                  <p className="text-[10px] font-semibold" style={{ color: '#888' }}>{booking.dropAddress}</p>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" style={{ color: '#888' }} />
                <p className="text-[10px] font-semibold" style={{ color: '#888' }}>{booking.date} at {booking.time}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
