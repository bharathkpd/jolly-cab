import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Eye, Flame, Moon, Clock, Route } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAdminStore } from '../../store/adminStore';
import { calculateFare } from '../../services/fareEngine';
import { getAssetUrl } from '../../utils/assets';

export const VehicleSelection: React.FC = () => {
  const navigate = useNavigate();
  const {
    tripType,
    pickupAddress,
    dropAddress,
    distanceKm,
    durationMin,
    days,
    tollCharges,
    selectedVehicleId,
    hasNightDriving,
    waitingMinutes,
    setBookingField
  } = useBookingStore();

  const { vehicles, loadAllAdminData } = useAdminStore();
  const [comparingMode, setComparingMode] = useState(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  const handleSelectVehicle = (id: string) => {
    setBookingField('selectedVehicleId', id);
  };

  const handleProceed = () => {
    if (!selectedVehicleId) {
      alert('Please select a vehicle to proceed.');
      return;
    }
    navigate('/payment');
  };

  const getVehicleFareRange = (vehicle: typeof vehicles[0]) => {
    const res = calculateFare({
      tripType,
      distanceKm,
      durationMin,
      days,
      vehicle,
      hasNightDriving,
      waitingMinutes,
      tollCharges
    });
    return { min: res.estMin, max: res.estMax, total: res.breakdown.total };
  };

  const toggleComparison = (id: string) => {
    if (comparisonIds.includes(id)) {
      setComparisonIds(prev => prev.filter(item => item !== id));
    } else {
      if (comparisonIds.length >= 2) {
        // limit to comparing 2 vehicles
        setComparisonIds(prev => [prev[1], id]);
      } else {
        setComparisonIds(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-0">
      {/* Route Info Header Card */}
      <div className="bg-white text-[#121212] p-5 rounded-b-[32px] flex flex-col gap-3 shadow-sm border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8.5 h-8.5 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 text-[#121212]" />
          </button>
          <h2 className="text-sm font-display font-black text-[#121212]">Select Vehicle</h2>
        </div>

        <div className="flex flex-col gap-1.5 mt-1 bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-xs text-gray-700">
          <div className="flex items-center gap-2 truncate">
            <Route className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
            <span className="font-bold truncate max-w-[200px] text-[#121212]">{pickupAddress.split(',')[0]}</span>
            {tripType !== 'rental' && (
              <>
                <span className="text-[#FFC107] font-black">→</span>
                <span className="font-bold truncate max-w-[200px] text-[#121212]">{dropAddress.split(',')[0]}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold mt-1">
            <span>Distance: <strong className="text-gray-700">{distanceKm} KM</strong></span>
            <span>Duration: <strong className="text-gray-700">~{durationMin} mins</strong></span>
            {days > 1 && <span>Duration: <strong className="text-gray-700">{days} Days</strong></span>}
          </div>
        </div>
      </div>

      {/* Adjusters Panel (Overnight / Waiting simulation) */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-3">
          <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Fare adjustments (Interactive simulator)
          </h4>
          
          <div className="flex items-center justify-between gap-4">
            {/* Night drive toggle */}
            <button
              onClick={() => setBookingField('hasNightDriving', !hasNightDriving)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                hasNightDriving
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-xs scale-[1.02]'
                  : 'bg-gray-50 text-gray-500 border-gray-100 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Night Driving
            </button>

            {/* Waiting Minutes Incrementer */}
            <div className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-1 text-xs">
              <button
                onClick={() => setBookingField('waitingMinutes', Math.max(0, waitingMinutes - 15))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-[#121212]"
              >
                -
              </button>
              <span className="text-[10px] font-black flex items-center gap-1 text-[#121212]">
                <Clock className="w-3 h-3 text-[#FFC107]" />
                {waitingMinutes}m Wait
              </span>
              <button
                onClick={() => setBookingField('waitingMinutes', Math.min(180, waitingMinutes + 15))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-[#121212]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-gray-500">
          <span>Available Vehicles ({vehicles.length})</span>
          <button 
            onClick={() => {
              setComparingMode(!comparingMode);
              setComparisonIds([]);
            }}
            className={`text-[9px] px-3 py-1.5 rounded-xl border font-black uppercase tracking-wider transition-all ${
              comparingMode 
                ? 'bg-[#FFC107] text-[#121212] border-[#FFC107] shadow-sm' 
                : 'text-brand-gold border-[#FFC107]/30 hover:bg-[#FFC107]/5'
            }`}
          >
            {comparingMode ? 'Exit Compare' : 'Compare Fares'}
          </button>
        </div>

        {vehicles.map((v) => {
          const isSelected = selectedVehicleId === v.id;
          const isComparing = comparisonIds.includes(v.id);
          const fareRange = getVehicleFareRange(v);

          return (
            <div
              key={v.id}
              onClick={() => !comparingMode && handleSelectVehicle(v.id)}
              className={`bg-white rounded-3xl p-4.5 border transition-all relative overflow-hidden flex flex-col gap-3 shadow-xs ${
                comparingMode 
                  ? 'cursor-default' 
                  : 'cursor-pointer'
              } ${isSelected && !comparingMode ? 'border-[#FFC107] ring-4 ring-[#FFC107]/10 scale-[1.01] shadow-md' : 'border-gray-100 hover:border-[#FFC107]/30'}`}
            >
              {v.isFavorite && (
                <div className="absolute right-0 top-0 bg-[#FFC107] text-[#121212] px-3.5 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#121212]" />
                  Popular
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* transparent vehicle floating over white background */}
                  <div className="w-24 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 p-1 shadow-inner">
                    <img 
                      src={getAssetUrl(v.image)} 
                      alt={v.name} 
                      className="h-full w-full object-contain filter drop-shadow-sm" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#121212]">{v.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[8.5px] font-bold text-gray-500 uppercase">
                        {v.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
                        <User className="w-3 h-3 text-[#FFC107]" /> {v.seats}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
                        <Briefcase className="w-3 h-3 text-[#FFC107]" /> {v.luggage} Bags
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[8px] font-black text-emerald-600">AC</span>
                      <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[8px] font-black text-gray-400">GPS</span>
                      <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[8px] font-black text-gray-400">USB</span>
                    </div>
                  </div>
                </div>

                {/* Pricing display */}
                <div className="text-right">
                  <div className="text-[13px] font-black text-[#121212] font-mono">
                    ₹{fareRange.min} - ₹{fareRange.max}
                  </div>
                  <div className="text-[8px] text-gray-400 uppercase font-black tracking-wider mt-0.5">
                    Est. Total
                  </div>
                </div>
              </div>

              {/* Bottom strip for comparing / features info */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1 text-[10px] font-bold">
                <span className="text-gray-400">
                  Base fare: ₹{v.pricing.baseFare} • ₹{v.pricing.pricePerKm}/KM
                </span>

                {comparingMode ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComparison(v.id);
                    }}
                    className={`px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all ${
                      isComparing
                        ? 'bg-[#FFC107] text-[#121212] border-[#FFC107]'
                        : 'text-gray-400 border-gray-200 hover:text-[#121212]'
                    }`}
                  >
                    {isComparing ? 'Comparing' : 'Compare'}
                  </button>
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-[#FFC107] animate-pulse' : 'text-gray-300'}`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Comparison Dashboard Layer (if active) */}
        {comparingMode && comparisonIds.length === 2 && (
          <div className="bg-[#121212] text-white rounded-3xl p-5 border border-white/5 flex flex-col gap-3 mt-2 shadow-lg animate-skeleton-pulse">
            <h5 className="text-[10px] font-black text-[#FFC107] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#FFC107]" />
              Comparison Breakdown
            </h5>
            
            <div className="grid grid-cols-3 gap-2 text-[10px] border-b border-white/10 pb-2">
              <span className="text-gray-500 font-bold">Metric</span>
              <span className="font-bold text-center truncate text-brand-gold">{vehicles.find(v => v.id === comparisonIds[0])?.name.split('/')[0]}</span>
              <span className="font-bold text-center truncate text-brand-gold">{vehicles.find(v => v.id === comparisonIds[1])?.name.split('/')[0]}</span>
            </div>

            {[
              { label: 'Seats count', val1: (v1: any) => `${v1.seats}`, val2: (v2: any) => `${v2.seats}` },
              { label: 'Transmission', val1: (v1: any) => v1.transmission, val2: (v2: any) => v2.transmission },
              { label: 'Fuel system', val1: (v1: any) => v1.fuel, val2: (v2: any) => v2.fuel },
              { label: 'KM rate', val1: (v1: any) => `₹${v1.pricing.pricePerKm}/km`, val2: (v2: any) => `₹${v2.pricing.pricePerKm}/km` },
              { label: 'Base rate', val1: (v1: any) => `₹${v1.pricing.baseFare}`, val2: (v2: any) => `₹${v2.pricing.baseFare}` },
              { label: 'Est. total', val1: (v1: any) => `₹${getVehicleFareRange(v1).total}`, val2: (v2: any) => `₹${getVehicleFareRange(v2).total}` }
            ].map((metric, idx) => {
              const v1 = vehicles.find(v => v.id === comparisonIds[0]);
              const v2 = vehicles.find(v => v.id === comparisonIds[1]);
              return (
                <div key={idx} className="grid grid-cols-3 gap-2 text-[10px]">
                  <span className="text-gray-400 font-semibold">{metric.label}</span>
                  <span className="text-center font-bold text-white">{v1 ? metric.val1(v1) : '-'}</span>
                  <span className="text-center font-bold text-white">{v2 ? metric.val2(v2) : '-'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white border-t border-gray-100 p-5 flex items-center justify-between gap-4 flex-shrink-0 safe-area-bottom">
        <div className="text-left">
          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Selected</span>
          <span className="text-xs font-black text-[#121212] block mt-0.5">
            {selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId)?.name : 'None'}
          </span>
        </div>
        
        <button
          onClick={handleProceed}
          disabled={!selectedVehicleId}
          className="ripple-btn flex-1 bg-[#FFC107] hover:bg-brand-lightGold text-[#121212] py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#FFC107]/20 disabled:opacity-40 uppercase tracking-wider"
        >
          Confirm Vehicle
          <ArrowLeft className="w-4 h-4 stroke-[3] rotate-180" />
        </button>
      </div>
    </div>
  );
};
export default VehicleSelection;
