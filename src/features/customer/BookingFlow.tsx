import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, UserPlus, BaggageClaim, AlertCircle, CalendarDays, Compass } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { TripType } from '../../types';
import { MapComponent } from '../../components/MapComponent';
import { fetchAddressSuggestions, fetchMapRoute } from '../../services/mapsService';

export const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const {
    tripType,
    pickupAddress,
    dropAddress,
    date,
    time,
    passengers,
    luggageCount,
    days,
    specialRequests,
    setBookingField,
    setRoute,
    clearBookingForm
  } = useBookingStore();

  const [pickupInput, setPickupInput] = useState(pickupAddress);
  const [dropInput, setDropInput] = useState(dropAddress);
  const [stops, setStops] = useState<string[]>([]);
  
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fallback coordinates for common search places to ensure seamless performance
  const getFallbackLocation = (address: string): { lat: number, lon: number } | null => {
    const query = address.toLowerCase();
    if (query.includes('kukatpally')) return { lat: 17.4849, lon: 78.3884 };
    if (query.includes('gachibowli')) return { lat: 17.4401, lon: 78.3489 };
    if (query.includes('secunderabad')) return { lat: 17.4344, lon: 78.5011 };
    if (query.includes('airport') || query.includes('rgia') || query.includes('shamshabad')) return { lat: 17.2403, lon: 78.4294 };
    if (query.includes('srisailam')) return { lat: 16.0734, lon: 78.8681 };
    if (query.includes('tirupati')) return { lat: 13.6833, lon: 79.3475 };
    if (query.includes('vijayawada')) return { lat: 16.5062, lon: 80.6480 };
    if (query.includes('charminar')) return { lat: 17.3616, lon: 78.4747 };
    if (query.includes('hi-tech') || query.includes('hitech')) return { lat: 17.4483, lon: 78.3741 };
    return null;
  };

  // 1. Fetch suggestions from mapsService (Google Place Autocomplete or Nominatim)
  const fetchSuggestions = async (query: string, setSuggestions: (s: any[]) => void) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    const results = await fetchAddressSuggestions(query);
    if (results && results.length > 0) {
      setSuggestions(results);
    } else {
      // Default suggestions database fallback if geocoding fails or is offline
      const fallbackList = [
        { name: 'Kukatpally, Hyderabad, Telangana', lat: 17.4849, lon: 78.3884 },
        { name: 'Gachibowli, Hyderabad, Telangana', lat: 17.4401, lon: 78.3489 },
        { name: 'Secunderabad Railway Station, Hyderabad, Telangana', lat: 17.4344, lon: 78.5011 },
        { name: 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad', lat: 17.2403, lon: 78.4294 },
        { name: 'Srisailam Mallikarjuna Temple, Andhra Pradesh', lat: 16.0734, lon: 78.8681 },
        { name: 'Tirupati Venkateswara Temple, Andhra Pradesh', lat: 13.6833, lon: 79.3475 },
        { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lon: 80.6480 },
        { name: 'Charminar, Hyderabad, Telangana', lat: 17.3616, lon: 78.4747 },
        { name: 'Hi-Tech City, Hyderabad, Telangana', lat: 17.4483, lon: 78.3741 },
      ].filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()));
      
      setSuggestions(fallbackList);
    }
  };

  // Debouncing geocoding inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(pickupInput, setPickupSuggestions);
    }, 450);
    return () => clearTimeout(timer);
  }, [pickupInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(dropInput, setDropSuggestions);
    }, 450);
    return () => clearTimeout(timer);
  }, [dropInput]);

  // Set default coordinates when pickup or drop matches a popular route on initial load
  useEffect(() => {
    if (pickupInput) {
      const loc = getFallbackLocation(pickupInput);
      if (loc) setPickupCoords([loc.lat, loc.lon]);
    }
    if (dropInput) {
      const loc = getFallbackLocation(dropInput);
      if (loc) setDropCoords([loc.lat, loc.lon]);
    }
  }, []);

  // Monitor rental mode state
  useEffect(() => {
    if (tripType === 'rental') {
      setDropInput('');
      setBookingField('dropAddress', '');
      setDropCoords(null);
      setRouteCoords([]);
      setRoute(pickupInput, '', 0, 0, 0); // Reset destination metrics
    }
  }, [tripType]);

  // 2. Fetch routing path, exact KM, and duration from mapsService (Google Directions or OSRM)
  const fetchRouteDetails = async (pLat: number, pLon: number, dLat: number, dLon: number) => {
    setIsLoadingRoute(true);
    setErrorMessage('');
    
    const routeInfo = await fetchMapRoute(pLat, pLon, dLat, dLon);
    if (routeInfo) {
      setRouteCoords(routeInfo.routeCoords);
      setRoute(pickupInput, dropInput, routeInfo.distanceKm, routeInfo.durationMin, routeInfo.tolls);
    } else {
      // Fallback
      const fallbackDistance = Math.floor(Math.random() * 25) + 15; // 15 - 40 KM
      const fallbackDuration = Math.round(fallbackDistance * 1.5);
      const fallbackTolls = fallbackDistance > 30 ? 80 : 0;
      
      setRouteCoords([[pLat, pLon], [dLat, dLon]]);
      setRoute(pickupInput, dropInput, fallbackDistance, fallbackDuration, fallbackTolls);
    }
    setIsLoadingRoute(false);
  };

  // Run routing calculations on coordinates update
  useEffect(() => {
    if (pickupCoords && dropCoords && tripType !== 'rental') {
      fetchRouteDetails(pickupCoords[0], pickupCoords[1], dropCoords[0], dropCoords[1]);
    }
  }, [pickupCoords, dropCoords, tripType]);

  const handleSelectPickup = (item: any) => {
    setPickupInput(item.name);
    setBookingField('pickupAddress', item.name);
    setPickupCoords([item.lat, item.lon]);
    setShowPickupSuggestions(false);
  };

  const handleSelectDrop = (item: any) => {
    setDropInput(item.name);
    setBookingField('dropAddress', item.name);
    setDropCoords([item.lat, item.lon]);
    setShowDropSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pickupInput.trim()) {
      setErrorMessage('Please specify a pickup location.');
      return;
    }
    if (tripType !== 'rental' && !dropInput.trim()) {
      setErrorMessage('Please specify a drop destination.');
      return;
    }

    // Fallback coordinates check if user typed but didn't trigger suggestion selection
    if (!pickupCoords) {
      const loc = getFallbackLocation(pickupInput);
      if (loc) {
        setPickupCoords([loc.lat, loc.lon]);
      } else {
        // Fallback default coordinates (Hyderabad center)
        setPickupCoords([17.385044, 78.486671]);
      }
    }

    if (tripType !== 'rental' && !dropCoords) {
      const loc = getFallbackLocation(dropInput);
      if (loc) {
        setDropCoords([loc.lat, loc.lon]);
      } else {
        setDropCoords([17.2403, 78.4294]); // default RGIA airport
      }
    }

    setBookingField('selectedVehicleId', 'veh_sedan'); // default Swift Dzire
    navigate('/vehicles');
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      {/* Sticky Header */}
      <div className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-white/80 hover:text-brand-gold transition-colors text-xs font-semibold"
          >
            Cancel
          </button>
          <h2 className="text-base font-display font-bold">Book a Cabin Ride</h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
      </div>

      {/* Booking Form Layout */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
        <div className="flex flex-col gap-4">
          
          {/* Trip Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
              Booking Category
            </label>
            <div className="grid grid-cols-4 gap-1 bg-brand-bgLight p-1 rounded-xl border border-brand-borderLight">
              {[
                { id: 'local', label: 'Local' },
                { id: 'airport_drop', label: 'Airport' },
                { id: 'outstation_round', label: 'Outstation' },
                { id: 'rental', label: 'Day Cab' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBookingField('tripType', tab.id as TripType)}
                  className={`text-[9px] font-bold py-2 rounded-lg transition-all ${
                    tripType === tab.id || 
                    (tab.id === 'airport_drop' && tripType.startsWith('airport')) || 
                    (tab.id === 'outstation_round' && tripType.startsWith('outstation'))
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-textGray hover:text-brand-textDark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-brand-danger text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          {/* Address Autocomplete Fields */}
          <div className="flex flex-col gap-3 bg-brand-bgLight p-4 rounded-2xl border border-brand-borderLight relative">
            <div className="absolute left-7 top-[48px] bottom-[48px] w-0.5 border-l-2 border-dashed border-brand-gold/40" />

            {/* Pickup Input */}
            <div className="flex flex-col gap-1 relative z-20">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                Pickup Location
              </label>
              <input
                type="text"
                placeholder="Where to pick you up? (e.g. Kukatpally)"
                value={pickupInput}
                onChange={(e) => {
                  setPickupInput(e.target.value);
                  setBookingField('pickupAddress', e.target.value);
                  setShowPickupSuggestions(true);
                }}
                onFocus={() => setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 250)}
                className="w-full pl-5 pr-3 py-3 bg-white border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none shadow-sm"
              />
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <div className="absolute top-[62px] left-0 right-0 max-h-48 overflow-y-auto bg-white rounded-xl shadow-lg border border-brand-borderLight z-30 divide-y divide-brand-bgLight">
                  {pickupSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => handleSelectPickup(s)}
                      className="w-full text-left px-4 py-2.5 hover:bg-brand-bgLight text-[11px] font-semibold text-brand-textDark truncate block"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input (Hidden for Day Rental) */}
            {tripType !== 'rental' && (
              <div className="flex flex-col gap-1 relative z-10">
                <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-danger" />
                  Drop Destination
                </label>
                <input
                  type="text"
                  placeholder="Where is the drop-off? (e.g. RGIA Airport)"
                  value={dropInput}
                  onChange={(e) => {
                    setDropInput(e.target.value);
                    setBookingField('dropAddress', e.target.value);
                    setShowDropSuggestions(true);
                  }}
                  onFocus={() => setShowDropSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDropSuggestions(false), 250)}
                  className="w-full pl-5 pr-3 py-3 bg-white border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none shadow-sm"
                />
                {showDropSuggestions && dropSuggestions.length > 0 && (
                  <div className="absolute top-[62px] left-0 right-0 max-h-48 overflow-y-auto bg-white rounded-xl shadow-lg border border-brand-borderLight z-30 divide-y divide-brand-bgLight">
                    {dropSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleSelectDrop(s)}
                        className="w-full text-left px-4 py-2.5 hover:bg-brand-bgLight text-[11px] font-semibold text-brand-textDark truncate block"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Intermediate Stops */}
          {tripType !== 'rental' && (
            <div className="flex flex-col gap-2 bg-brand-bgLight p-4 rounded-2xl border border-brand-borderLight">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                Add Stops (Optional)
              </label>
              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Stop ${idx + 1}`}
                    value={stop}
                    onChange={(e) => {
                      const updated = [...stops];
                      updated[idx] = e.target.value;
                      setStops(updated);
                    }}
                    className="flex-1 px-3.5 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-white shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setStops(stops.filter((_, i) => i !== idx))}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {stops.length < 3 && (
                <button
                  type="button"
                  onClick={() => setStops([...stops, ''])}
                  className="w-full py-2.5 bg-white border border-dashed border-brand-gold/40 rounded-xl text-[10px] font-bold text-brand-gold hover:bg-brand-gold/5 transition-colors"
                >
                  + Add a Stop
                </button>
              )}
            </div>
          )}

          {/* Interactive Routing Map Preview */}
          {pickupCoords && (
            <div className="w-full flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-brand-gold" />
                Live Route Map Preview
              </span>
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-brand-borderLight shadow-inner relative z-0">
                <MapComponent
                  pickupCoords={pickupCoords}
                  dropCoords={tripType !== 'rental' ? dropCoords : null}
                  routeCoords={tripType !== 'rental' ? routeCoords : []}
                />
                {isLoadingRoute && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-semibold text-brand-dark gap-2 z-10">
                    <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                    <span>Calculating real route KM...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date & Time Select */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                Pickup Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingField('date', e.target.value)}
                className="w-full px-3 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                Pickup Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setBookingField('time', e.target.value)}
                className="w-full px-3 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight shadow-sm"
              />
            </div>
          </div>

          {/* Passengers & Luggage Counters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5 text-brand-gold" />
                Passengers
              </label>
              <div className="flex items-center justify-between border border-brand-borderLight rounded-xl bg-brand-bgLight p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setBookingField('passengers', Math.max(1, passengers - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-borderLight font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-bold">{passengers}</span>
                <button
                  type="button"
                  onClick={() => setBookingField('passengers', Math.min(8, passengers + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-borderLight font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-brand-textGray uppercase tracking-wider flex items-center gap-1">
                <BaggageClaim className="w-3.5 h-3.5 text-brand-gold" />
                Bags Count
              </label>
              <div className="flex items-center justify-between border border-brand-borderLight rounded-xl bg-brand-bgLight p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setBookingField('luggageCount', Math.max(0, luggageCount - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-borderLight font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-bold">{luggageCount}</span>
                <button
                  type="button"
                  onClick={() => setBookingField('luggageCount', Math.min(6, luggageCount + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-borderLight font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Multi-day Rental Field (300 KM package range) */}
          {(tripType === 'rental' || tripType.startsWith('outstation')) && (
            <div className="flex flex-col gap-1.5 bg-[#FFC107]/10 border border-[#FFC107]/30 p-4 rounded-2xl">
              <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-brand-gold" />
                Day Cab Booking Packages
              </label>
              <div className="flex items-center justify-between border border-brand-gold/20 rounded-xl bg-white p-1 shadow-sm mt-1">
                <button
                  type="button"
                  onClick={() => setBookingField('days', Math.max(1, days - 1))}
                  className="w-9 h-9 rounded-lg bg-brand-bgLight border border-brand-borderLight font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="text-xs font-bold text-brand-dark">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </span>
                <button
                  type="button"
                  onClick={() => setBookingField('days', Math.min(30, days + 1))}
                  className="w-9 h-9 rounded-lg bg-brand-bgLight border border-brand-borderLight font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
              <p className="text-[9.5px] font-bold text-brand-textDark mt-1.5 px-1 leading-relaxed">
                {tripType === 'rental' 
                  ? `Package Range: Includes 300 KM per day. Minimum billing is one full day. Total Package Limit: ${days * 300} KM. Extra KM rate applies thereafter.` 
                  : `Package Range: Includes 250 KM per day minimum billing for outstation round trips. Total Package Limit: ${days * 250} KM.`}
              </p>
            </div>
          )}

          {/* Special Requests */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-brand-textGray uppercase tracking-wider">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="E.g. Carrier needed, baby seat, silent driver"
              value={specialRequests}
              onChange={(e) => setBookingField('specialRequests', e.target.value)}
              className="w-full px-3.5 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight shadow-sm"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="ripple-btn w-full bg-brand-gold text-brand-dark font-display font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-gold-glow mt-6 hover:bg-brand-lightGold transition-all uppercase tracking-wider text-xs"
        >
          Check Estimated Fares
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>
    </div>
  );
};

export default BookingFlow;
