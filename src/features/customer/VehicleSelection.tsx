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
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Route Info Header Card */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex flex-col gap-3 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Select Vehicle</h2>
        </div>

        <div className="flex flex-col gap-1.5 mt-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-xs">
          <div className="flex items-center gap-2 truncate text-white/90">
            <Route className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span className="font-semibold truncate max-w-[200px]">{pickupAddress.split(',')[0]}</span>
            {tripType !== 'rental' && (
              <>
                <span className="text-brand-gold font-bold">→</span>
                <span className="font-semibold truncate max-w-[200px]">{dropAddress.split(',')[0]}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-brand-textGray text-[10px] font-semibold mt-1">
            <span>Distance: <strong className="text-white">{distanceKm} KM</strong></span>
            <span>Duration: <strong className="text-white">~{durationMin} mins</strong></span>
            {days > 1 && <span>Duration: <strong className="text-white">{days} Days</strong></span>}
          </div>
        </div>
      </div>

      {/* Adjusters Panel (Overnight / Waiting simulation) */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white p-4 rounded-2xl border border-brand-borderLight shadow-sm flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
            Fare adjustments (Interactive simulator)
          </h4>
          
          <div className="flex items-center justify-between gap-4">
            {/* Night drive toggle */}
            <button
              onClick={() => setBookingField('hasNightDriving', !hasNightDriving)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                hasNightDriving
                  ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 shadow-sm'
                  : 'bg-brand-bgLight text-brand-textGray border-brand-borderLight hover:text-brand-textDark'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Night Driving
            </button>

            {/* Waiting Minutes Incrementer */}
            <div className="flex-1 flex items-center justify-between bg-brand-bgLight border border-brand-borderLight rounded-xl p-1 text-xs">
              <button
                onClick={() => setBookingField('waitingMinutes', Math.max(0, waitingMinutes - 15))}
                className="w-6 h-6 rounded-lg bg-white border border-brand-borderLight flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="text-[10px] font-bold flex items-center gap-0.5 text-brand-textDark">
                <Clock className="w-3 h-3 text-brand-gold" />
                {waitingMinutes}m Wait
              </span>
              <button
                onClick={() => setBookingField('waitingMinutes', Math.min(180, waitingMinutes + 15))}
                className="w-6 h-6 rounded-lg bg-white border border-brand-borderLight flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 text-xs font-bold">
          <span>Available Vehicles ({vehicles.length})</span>
          <button 
            onClick={() => {
              setComparingMode(!comparingMode);
              setComparisonIds([]);
            }}
            className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
              comparingMode 
                ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                : 'text-brand-gold border-brand-gold/30 hover:bg-brand-gold/5'
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
              className={`bg-white rounded-3xl p-4 border transition-all relative overflow-hidden flex flex-col gap-3 shadow-sm ${
                comparingMode 
                  ? 'cursor-default' 
                  : 'cursor-pointer hover:border-brand-gold/50'
              } ${isSelected && !comparingMode ? 'ring-2 ring-brand-gold border-brand-gold' : 'border-brand-borderLight'}`}
            >
              {v.isFavorite && (
                <div className="absolute right-0 top-0 bg-brand-gold text-brand-dark px-3 py-0.5 rounded-bl-2xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-brand-dark" />
                  Popular Choice
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Real car image */}
                  <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-brand-borderLight shadow-sm p-0.5">
                    <img 
                      src={getAssetUrl(v.image)} 
                      alt={v.name} 
                      className="h-full w-full object-contain" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-textDark">{v.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 bg-brand-bgLight border border-brand-borderLight rounded text-[9px] font-semibold text-brand-textGray uppercase">
                        {v.category}
                      </span>
                      <span className="text-[10px] text-brand-textGray flex items-center gap-0.5">
                        <User className="w-3 h-3" /> {v.seats} Seats
                      </span>
                      <span className="text-[10px] text-brand-textGray flex items-center gap-0.5">
                        <Briefcase className="w-3 h-3" /> {v.luggage} Bags
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[8px] font-bold text-emerald-600">AC</span>
                      <span className="px-1.5 py-0.5 bg-brand-bgLight border border-brand-borderLight rounded text-[8px] font-bold text-brand-textGray">GPS</span>
                      <span className="px-1.5 py-0.5 bg-brand-bgLight border border-brand-borderLight rounded text-[8px] font-bold text-brand-textGray">USB</span>
                    </div>
                  </div>
                </div>

                {/* Pricing display */}
                <div className="text-right">
                  <div className="text-xs font-bold text-brand-textDark font-mono">
                    ₹{fareRange.min} - ₹{fareRange.max}
                  </div>
                  <div className="text-[9px] text-brand-textGray mt-0.5">
                    Est. Total (incl. GST)
                  </div>
                </div>
              </div>

              {/* Bottom strip for comparing / features info */}
              <div className="flex items-center justify-between border-t border-brand-bgLight pt-2.5 mt-1 text-[10px] font-semibold">
                <span className="text-brand-textGray">
                  Base fare: ₹{v.pricing.baseFare} • ₹{v.pricing.pricePerKm}/KM
                </span>

                {comparingMode ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComparison(v.id);
                    }}
                    className={`px-3 py-1 rounded-lg border text-[9px] font-bold transition-all ${
                      isComparing
                        ? 'bg-brand-gold text-brand-dark border-brand-gold'
                        : 'text-brand-textGray border-brand-borderLight hover:text-brand-textDark'
                    }`}
                  >
                    {isComparing ? 'Comparing' : 'Compare'}
                  </button>
                ) : (
                  <span className="text-brand-gold font-bold">
                    {isSelected ? 'Selected' : 'Tap to Select'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Comparison Dashboard Layer (if active) */}
        {comparingMode && comparisonIds.length === 2 && (
          <div className="bg-brand-dark text-white rounded-3xl p-4 border border-white/5 flex flex-col gap-3 mt-2 shadow-lg animate-skeleton-pulse">
            <h5 className="text-[10px] font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-gold" />
              Comparison Breakdown
            </h5>
            
            <div className="grid grid-cols-3 gap-2 text-[10px] border-b border-white/10 pb-2">
              <span className="text-brand-textGray font-bold">Metric</span>
              <span className="font-bold text-center truncate">{vehicles.find(v => v.id === comparisonIds[0])?.name.split('/')[0]}</span>
              <span className="font-bold text-center truncate">{vehicles.find(v => v.id === comparisonIds[1])?.name.split('/')[0]}</span>
            </div>

            {[
              { label: 'Seats count', val1: (v1: any) => `${v1.seats} Seats`, val2: (v2: any) => `${v2.seats} Seats` },
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
                  <span className="text-brand-textGray font-semibold">{metric.label}</span>
                  <span className="text-center font-bold">{v1 ? metric.val1(v1) : '-'}</span>
                  <span className="text-center font-bold">{v2 ? metric.val2(v2) : '-'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white border-t border-brand-borderLight p-5 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="text-left">
          <span className="text-[10px] text-brand-textGray font-semibold block uppercase">Selected Vehicle</span>
          <span className="text-xs font-bold text-brand-textDark">
            {selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId)?.name.split('/')[0] : 'None'}
          </span>
        </div>
        
        <button
          onClick={handleProceed}
          disabled={!selectedVehicleId}
          className="ripple-btn flex-1 bg-brand-gold hover:bg-brand-lightGold text-brand-dark py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-gold-glow disabled:opacity-40 uppercase tracking-wider"
        >
          Confirm Vehicle
          <ArrowLeft className="w-4 h-4 stroke-[3] rotate-180" />
        </button>
      </div>
    </div>
  );
};
export default VehicleSelection;
