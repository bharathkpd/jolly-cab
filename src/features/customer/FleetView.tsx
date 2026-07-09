import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, User, Briefcase, Flame, Check, Route, HeartHandshake } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useBookingStore } from '../../store/bookingStore';
import { useAdminStore } from '../../store/adminStore';
import { getAssetUrl } from '../../utils/assets';

export const FleetView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();
  const { setBookingField, clearBookingForm } = useBookingStore();
  const { vehicles, loadAllAdminData } = useAdminStore();

  React.useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  const handleBookVehicle = (vehicleId: string) => {
    clearBookingForm();
    setBookingField('selectedVehicleId', vehicleId);
    setBookingField('tripType', 'local'); // Default category
    navigate('/booking');
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Top Header */}
      <div className="bg-brand-dark text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Our Fleet</h2>
        </div>
        <button 
          type="button"
          onClick={toggleDrawer}
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
        >
          <Menu className="w-4.5 h-4.5 text-[#FFC107]" />
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
        <div className="px-1 text-center max-w-md mx-auto mb-2">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Premium Cabs</span>
          <h3 className="text-base font-bold text-brand-textDark mt-1">Select Your Perfect Ride</h3>
          <p className="text-[11px] text-brand-textGray mt-1 leading-relaxed">
            All vehicles are fully air-conditioned, sanitised, and chauffeured by verified professional drivers.
          </p>
        </div>

        {vehicles.map((v) => {
          return (
            <div
              key={v.id}
              className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-4 relative overflow-hidden flex-shrink-0"
            >
              {v.isFavorite && (
                <div className="absolute right-0 top-0 bg-brand-gold text-brand-dark px-3 py-0.5 rounded-bl-2xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-brand-dark" />
                  Popular Choice
                </div>
              )}

              {/* Vehicle Title & Image */}
              <div className="flex items-center gap-4">
                <div className="w-28 h-18 bg-white rounded-2xl flex items-center justify-center p-1 flex-shrink-0 overflow-hidden border border-brand-borderLight shadow-sm">
                  <img 
                    src={getAssetUrl(v.image)} 
                    alt={v.name} 
                    className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-brand-gold/10 border border-brand-gold/20 rounded text-[8px] font-bold text-brand-gold uppercase">
                      {v.category}
                    </span>
                    <span className="px-1.5 py-0.5 bg-brand-dark/5 rounded text-[8px] font-bold text-brand-textGray">
                      {v.seats}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-textDark mt-1.5">{v.name}</h4>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {(v.features || ['AC', 'GPS', 'Music', 'USB']).map((feat, fidx) => (
                      <span key={fidx} className="px-2 py-0.5 bg-brand-bgLight rounded-full text-[8.5px] text-brand-textGray font-semibold border border-brand-borderLight">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra specifications matching website */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-b border-brand-bgLight py-3.5 my-0.5">
                {(v.specs || [v.fuel, 'Large Space', 'Long distance', 'Premium Ride']).map((spec, sidx) => {
                  let Icon = Check;
                  if (sidx === 0) Icon = Check;
                  else if (sidx === 1) Icon = Briefcase;
                  else if (sidx === 2) Icon = Route;
                  else Icon = HeartHandshake;

                  return (
                    <div key={sidx} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                      <span className="text-brand-textGray font-medium truncate max-w-[130px]">{spec}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price rate and Book button */}
              <div className="flex items-center justify-between mt-1">
                <div>
                  <span className="text-[10px] text-brand-textGray block">Outstation Rate</span>
                  <span className="text-sm font-bold text-brand-textDark font-mono">₹{v.pricing.pricePerKm}/KM</span>
                </div>
                
                <button
                  onClick={() => handleBookVehicle(v.id)}
                  className="bg-brand-dark hover:bg-brand-gold hover:text-brand-dark text-white text-[10px] font-bold px-5 py-3 rounded-xl transition-all shadow-md"
                >
                  Book {v.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FleetView;
