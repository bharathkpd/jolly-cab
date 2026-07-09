import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, FileText, Navigation, XCircle, Car, RefreshCw, User, TrendingUp } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { Booking } from '../../types';

type TabType = 'active' | 'completed' | 'cancelled';

export const Trips: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { history, activeBooking, loadHistory, cancelBooking, clearBookingForm, setBookingField } = useBookingStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('active');

  useEffect(() => {
    if (user?.phone) loadHistory(user.phone);
  }, [user, loadHistory]);

  const activeStatuses = ['pending', 'accepted', 'driver_assigned', 'driver_reached', 'trip_started'];

  const statusLabel = (status: Booking['status']) => {
    const map: Record<string, string> = {
      pending: 'Finding Driver',
      accepted: 'Driver Assigned',
      driver_assigned: 'Driver Assigned',
      driver_reached: 'Driver Arrived',
      trip_started: 'In Progress',
      trip_completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return map[status] || status;
  };

  const statusColor = (status: Booking['status']) => {
    if (status === 'trip_completed') return { bg: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: 'rgba(76,175,80,0.25)' };
    if (status === 'cancelled') return { bg: 'rgba(244,67,54,0.1)', color: '#F44336', border: 'rgba(244,67,54,0.25)' };
    return { bg: 'rgba(255,193,7,0.1)', color: '#E6AC00', border: 'rgba(255,193,7,0.35)' };
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filteredTrips = history.filter((t) => {
    if (activeTab === 'active') return activeStatuses.includes(t.status);
    if (activeTab === 'completed') return t.status === 'trip_completed';
    if (activeTab === 'cancelled') return t.status === 'cancelled';
    return false;
  });

  const counts = {
    active: history.filter(t => activeStatuses.includes(t.status)).length,
    completed: history.filter(t => t.status === 'trip_completed').length,
    cancelled: history.filter(t => t.status === 'cancelled').length
  };

  const handleRebook = (trip: Booking) => {
    clearBookingForm();
    setBookingField('tripType', trip.tripType);
    setBookingField('pickupAddress', trip.pickupAddress);
    setBookingField('dropAddress', trip.dropAddress);
    navigate('/booking');
  };

  return (
    <div className="screen" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ background: '#121212' }}>
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <h2 className="text-base font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Rides
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 pb-4">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              style={{
                background: activeTab === id ? '#FFC107' : 'rgba(255,255,255,0.1)',
                color: activeTab === id ? '#121212' : 'rgba(255,255,255,0.6)'
              }}
            >
              {label}
              {counts[id] > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center"
                  style={{
                    background: activeTab === id ? '#121212' : 'rgba(255,255,255,0.2)',
                    color: activeTab === id ? '#FFC107' : '#fff'
                  }}
                >
                  {counts[id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      <div className="screen-body p-4 flex flex-col gap-3">

        {/* Active booking highlight */}
        {activeTab === 'active' && activeBooking && activeStatuses.includes(activeBooking.status) && (
          <button
            onClick={() => navigate(`/track/${activeBooking.id}`)}
            className="w-full rounded-3xl p-4 text-left flex items-center gap-3 active:scale-[0.98] transition-all"
            style={{ background: '#121212', border: '1px solid rgba(255,193,7,0.2)' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFC107' }}>
              <Navigation className="w-5 h-5 animate-pulse" style={{ color: '#121212' }} />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Current Ride · {activeBooking.id}
              </span>
              <p className="text-xs font-bold mt-0.5 text-white">{statusLabel(activeBooking.status)}</p>
              <p className="text-[10px] mt-0.5 truncate max-w-[200px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {activeBooking.pickupAddress}
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl" style={{ background: '#FFC107' }}>
              <span className="text-[10px] font-black" style={{ color: '#121212' }}>Track</span>
            </div>
          </button>
        )}

        {filteredTrips.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-float"
              style={{ background: 'linear-gradient(135deg, #FFC107/10, #FFC107/5)', border: '2px dashed #FFC10730' }}
            >
              {activeTab === 'active'
                ? <Navigation className="w-9 h-9" style={{ color: '#FFC107' }} />
                : activeTab === 'completed'
                ? <TrendingUp className="w-9 h-9" style={{ color: '#4CAF50' }} />
                : <XCircle className="w-9 h-9" style={{ color: '#F44336' }} />}
            </div>
            <h3 className="font-bold text-sm" style={{ color: '#121212' }}>
              {activeTab === 'active' ? 'No Active Rides' : activeTab === 'completed' ? 'No Completed Rides Yet' : 'No Cancelled Rides'}
            </h3>
            <p className="text-xs mt-1 max-w-[200px]" style={{ color: '#888' }}>
              {activeTab === 'active' ? 'Your booked rides will appear here.' : activeTab === 'completed' ? 'Complete a ride to see history here.' : 'Cancelled bookings appear here.'}
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/booking')}
                className="mt-5 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95"
                style={{ background: '#FFC107', color: '#121212', fontFamily: 'Poppins, sans-serif' }}
              >
                Book a Ride Now
              </button>
            )}
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const sc = statusColor(trip.status);
            const isActive = activeStatuses.includes(trip.status);
            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-4 flex flex-col gap-3 animate-slide-up"
                style={{ border: '1px solid #F0F0F0' }}
              >
                {/* Trip header */}
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#F5F5F5' }}>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#aaa' }}>
                      {trip.id}
                    </span>
                    <span className="text-[10px] font-bold block mt-0.5" style={{ color: '#121212' }}>
                      {trip.date} · {trip.time}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                  >
                    {statusLabel(trip.status)}
                  </span>
                </div>

                {/* Driver info for completed */}
                {trip.status === 'trip_completed' && trip.driverName && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: '#F8F8F8' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black" style={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107' }}>
                      {trip.driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[#121212] block">{trip.driverName}</span>
                      <span className="text-[8.5px] text-gray-400">Verified Driver · {trip.vehicleNumber}</span>
                    </div>
                    {trip.customerRating && (
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= trip.customerRating! ? 'fill-[#FFC107] text-[#FFC107]' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Route */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: '#FFC107', border: '2px solid white', boxShadow: '0 0 0 1px #FFC107' }} />
                    <p className="text-[11px] font-semibold truncate max-w-[260px]" style={{ color: '#121212' }}>{trip.pickupAddress}</p>
                  </div>
                  {trip.tripType !== 'rental' && (
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded flex-shrink-0 mt-1" style={{ background: '#F44336', border: '2px solid white', boxShadow: '0 0 0 1px #F44336' }} />
                      <p className="text-[11px] font-semibold truncate max-w-[260px]" style={{ color: '#121212' }}>{trip.dropAddress}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F5F5F5' }}>
                  <div>
                    <span className="text-[10px] font-semibold" style={{ color: '#888' }}>
                      {trip.vehicleDetails?.name}
                    </span>
                    <span className="font-black font-mono text-xs ml-1.5" style={{ color: '#121212' }}>Rs.{trip.fareBreakdown?.total}</span>
                    {trip.fareBreakdown?.discount > 0 && (
                      <span className="ml-1.5 text-[9px] font-bold text-green-600">-Rs.{trip.fareBreakdown.discount} saved</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {trip.status === 'trip_completed' && (
                      <>
                        <button
                          onClick={() => handleRebook(trip)}
                          title="Rebook"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black transition-all active:scale-95 uppercase tracking-wider"
                          style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.25)', color: '#E6AC00' }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Rebook
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(trip)}
                          title="Invoice"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-95"
                          style={{ background: '#F5F5F5' }}
                        >
                          <FileText className="w-3.5 h-3.5" style={{ color: '#888' }} />
                        </button>
                      </>
                    )}
                    {isActive && (
                      <>
                        <button
                          onClick={() => navigate(`/track/${trip.id}`)}
                          title="Track"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[9px] font-black transition-all active:scale-95 uppercase tracking-wider"
                          style={{ background: '#121212' }}
                        >
                          <Navigation className="w-3 h-3" style={{ color: '#FFC107' }} />
                          Track
                        </button>
                        <button
                          onClick={() => { if (window.confirm('Cancel this booking?')) cancelBooking(trip.id); }}
                          title="Cancel"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-95"
                          style={{ background: 'rgba(244,67,54,0.06)', border: '1px solid rgba(244,67,54,0.2)' }}
                        >
                          <XCircle className="w-3.5 h-3.5" style={{ color: '#F44336' }} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 flex items-center justify-center p-6 z-50"
          style={{ background: 'rgba(18,18,18,0.65)' }}
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white rounded-[32px] w-full max-w-sm p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center border-b pb-3 mb-4" style={{ borderColor: '#F5F5F5' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: '#FFC107' }}>
                <span className="font-black text-lg" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>JC</span>
              </div>
              <h3 className="text-sm font-black" style={{ color: '#121212', fontFamily: 'Poppins, sans-serif' }}>Tax Invoice</h3>
              <p className="text-[9px] mt-0.5" style={{ color: '#aaa' }}>Jolly Cabs · GSTIN: 36JCABS4422A1Z0</p>
            </div>
            <div className="flex flex-col gap-1.5 text-[10px] mb-4">
              <div className="flex justify-between border-b pb-2 mb-1" style={{ borderColor: '#F5F5F5' }}>
                <span style={{ color: '#aaa' }}>Invoice: {selectedInvoice.id.replace('BK_', 'INV_')}</span>
                <span style={{ color: '#aaa' }}>{selectedInvoice.date}</span>
              </div>
              {[
                { label: 'Base Fare', val: selectedInvoice.fareBreakdown?.base },
                { label: 'Extra KM', val: selectedInvoice.fareBreakdown?.extraKm > 0 ? selectedInvoice.fareBreakdown.extraKm : null },
                { label: 'Driver Bata', val: selectedInvoice.fareBreakdown?.bata > 0 ? selectedInvoice.fareBreakdown.bata : null },
                { label: 'Tolls', val: selectedInvoice.fareBreakdown?.tolls > 0 ? selectedInvoice.fareBreakdown.tolls : null },
                { label: 'Convenience', val: selectedInvoice.fareBreakdown?.convenience },
                { label: 'GST (5%)', val: selectedInvoice.fareBreakdown?.gst }
              ].filter(item => item.val != null).map(({ label, val }) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: '#888' }}>{label}</span>
                  <span className="font-semibold" style={{ color: '#121212' }}>₹{val}</span>
                </div>
              ))}
              {selectedInvoice.fareBreakdown?.discount > 0 && (
                <div className="flex justify-between" style={{ color: '#4CAF50' }}>
                  <span>Discount</span>
                  <span className="font-semibold">- ₹{selectedInvoice.fareBreakdown.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-black pt-2 border-t text-xs" style={{ borderColor: '#F5F5F5', color: '#121212' }}>
                <span>Total Paid</span>
                <span>₹{selectedInvoice.fareBreakdown?.total}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => alert('Invoice saved to Downloads!')}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white"
                style={{ background: '#121212' }}
              >
                <FileText className="w-4 h-4" style={{ color: '#FFC107' }} />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full py-2.5 rounded-xl text-[10px] font-bold"
                style={{ background: '#F5F5F5', color: '#888' }}
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
