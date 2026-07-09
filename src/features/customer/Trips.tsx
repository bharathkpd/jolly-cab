import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Star, AlertCircle, FileText, ChevronRight, XCircle, Navigation } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { Booking } from '../../types';

type TabType = 'upcoming' | 'completed' | 'cancelled';

export const Trips: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { history, loadHistory } = useBookingStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  useEffect(() => {
    if (user?.phone) {
      loadHistory(user.phone);
    }
  }, [user, loadHistory]);

  const handleBack = () => {
    navigate('/');
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'trip_completed':
        return 'bg-brand-success/10 border-brand-success/20 text-brand-success';
      case 'cancelled':
        return 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger';
      case 'pending':
      case 'accepted':
      case 'driver_assigned':
      case 'driver_reached':
      case 'trip_started':
        return 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold';
      default:
        return 'bg-brand-bgLight border-brand-borderLight text-brand-textGray';
    }
  };

  const upcomingStatuses = ['pending', 'accepted', 'driver_assigned', 'driver_reached', 'trip_started'];
  const filteredTrips = history.filter((trip) => {
    if (activeTab === 'upcoming') return upcomingStatuses.includes(trip.status);
    if (activeTab === 'completed') return trip.status === 'trip_completed';
    if (activeTab === 'cancelled') return trip.status === 'cancelled';
    return true;
  });

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'upcoming', label: 'Upcoming', count: history.filter(t => upcomingStatuses.includes(t.status)).length },
    { id: 'completed', label: 'Completed', count: history.filter(t => t.status === 'trip_completed').length },
    { id: 'cancelled', label: 'Cancelled', count: history.filter(t => t.status === 'cancelled').length },
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Header sticky bar */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex flex-col gap-4 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">My Bookings</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-brand-gold text-brand-dark'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-brand-dark text-brand-gold' : 'bg-white/20 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trips list body */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {filteredTrips.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <Clock className="w-12 h-12 text-brand-textGray/40 mb-3" />
            <h3 className="font-bold text-sm text-brand-textDark">
              {activeTab === 'upcoming' ? 'No Upcoming Rides' : activeTab === 'completed' ? 'No Completed Rides' : 'No Cancelled Rides'}
            </h3>
            <p className="text-xs text-brand-textGray mt-1">
              {activeTab === 'upcoming' ? 'Book your first premium ride with Jolly Cabs now!' : 'Rides will appear here once available.'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/booking')}
                className="mt-4 px-5 py-2.5 bg-brand-gold text-brand-dark rounded-xl text-xs font-black shadow-gold-glow uppercase tracking-wider transition-all hover:bg-brand-lightGold"
              >
                Book Cab Ride
              </button>
            )}
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl p-4 border border-brand-borderLight shadow-sm flex flex-col gap-3 relative"
            >
              <div className="flex items-center justify-between border-b border-brand-bgLight pb-3">
                <div>
                  <span className="text-[9px] text-brand-textGray font-bold uppercase tracking-wider block">
                    ID: {trip.id}
                  </span>
                  <span className="text-[10px] font-bold text-brand-textDark mt-0.5 block">
                    {trip.date} at {trip.time}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide ${getStatusBadge(trip.status)}`}>
                  {trip.status.replace('_', ' ')}
                </span>
              </div>

              {/* Locations details */}
              <div className="flex flex-col gap-2 text-[11px] text-brand-textDark">
                <div className="flex gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="truncate max-w-[280px]">{trip.pickupAddress}</span>
                </div>
                {trip.tripType !== 'rental' && (
                  <div className="flex gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-danger flex-shrink-0 mt-0.5" />
                    <span className="truncate max-w-[280px]">{trip.dropAddress}</span>
                  </div>
                )}
              </div>

              {/* Bottom details */}
              <div className="flex items-center justify-between pt-3 border-t border-brand-bgLight mt-1.5">
                <span className="text-[10px] text-brand-textGray">
                  Vehicle: <strong className="text-brand-textDark">{trip.vehicleDetails?.name.split('/')[0]}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-textDark font-mono">
                    ₹{trip.fareBreakdown.total}
                  </span>
                  
                  {/* Action buttons based on status */}
                  {trip.status === 'trip_completed' && (
                    <button
                      onClick={() => setSelectedInvoice(trip)}
                      className="w-7 h-7 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 flex items-center justify-center text-brand-gold transition-colors"
                      title="View Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}

                  {upcomingStatuses.includes(trip.status) && (
                    <>
                      <button
                        onClick={() => navigate(`/track/${trip.id}`)}
                        className="w-7 h-7 rounded-lg bg-brand-dark hover:bg-brand-dark/90 flex items-center justify-center text-brand-gold transition-colors"
                        title="Track ride"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Cancel booking ${trip.id}? This feature will be connected to Firebase in Phase 4.`)}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center text-red-500 transition-colors"
                        title="Cancel ride"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Detailed Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[32px] w-full max-w-[320px] p-5 shadow-2xl border border-brand-borderLight animate-skeleton-pulse">
            <h3 className="font-display font-bold text-sm text-brand-textDark text-center border-b border-brand-bgLight pb-3">
              Jolly Cabs Tax Invoice
            </h3>
            
            <div className="my-4 flex flex-col gap-2 text-[10px] text-brand-textDark">
              <div className="flex justify-between font-bold text-brand-textGray uppercase">
                <span>Invoice ID: {selectedInvoice.id.replace('BK_', 'INV_')}</span>
                <span>GSTIN: 36JCABS4422A1Z0</span>
              </div>
              <div className="flex justify-between border-b border-brand-bgLight pb-2">
                <span>Date: {selectedInvoice.date}</span>
                <span>Vehicle: {selectedInvoice.vehicleDetails?.name.split('/')[0]}</span>
              </div>

              <div className="flex flex-col gap-1.5 border-b border-brand-bgLight pb-3 font-semibold text-brand-textGray">
                <div className="flex justify-between">
                  <span>Base Trip Charge</span>
                  <span>₹{selectedInvoice.fareBreakdown.base}</span>
                </div>
                {selectedInvoice.fareBreakdown.extraKm > 0 && (
                  <div className="flex justify-between">
                    <span>Extra KM Charges</span>
                    <span>₹{selectedInvoice.fareBreakdown.extraKm}</span>
                  </div>
                )}
                {selectedInvoice.fareBreakdown.bata > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Bata Allowance</span>
                    <span>₹{selectedInvoice.fareBreakdown.bata}</span>
                  </div>
                )}
                {selectedInvoice.fareBreakdown.tolls > 0 && (
                  <div className="flex justify-between">
                    <span>Toll Charges</span>
                    <span>₹{selectedInvoice.fareBreakdown.tolls}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹{selectedInvoice.fareBreakdown.convenience}</span>
                </div>
                {selectedInvoice.fareBreakdown.discount > 0 && (
                  <div className="flex justify-between text-brand-success font-bold">
                    <span>Promo Discount</span>
                    <span>- ₹{selectedInvoice.fareBreakdown.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST + SGST (5%)</span>
                  <span>₹{selectedInvoice.fareBreakdown.gst}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xs text-brand-textDark mt-1">
                <span>Total Amount Paid</span>
                <span>₹{selectedInvoice.fareBreakdown.total}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <button
                onClick={() => {
                  alert('Invoice PDF Download Started! (Local demonstration file successfully saved)');
                }}
                className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <FileText className="w-4 h-4 text-brand-gold" />
                Download PDF Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full bg-brand-bgLight hover:bg-brand-gold/10 border border-brand-borderLight text-brand-textDark font-bold py-2.5 rounded-xl text-[10px] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Trips;
