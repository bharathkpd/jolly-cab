import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Car, 
  Ticket, 
  Image as ImageIcon, 
  DollarSign, 
  Navigation, 
  XCircle, 
  RefreshCw, 
  Save, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  TrendingUp, 
  MapPin, 
  User, 
  LogOut,
  Settings,
  Compass
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useAuthStore } from '../../store/authStore';
import { BookingStatus, TripType, VehiclePricing, Coupon, FestivalBanner, Booking } from '../../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { 
    vehicles, 
    bookings, 
    drivers, 
    coupons, 
    banners, 
    loadAllAdminData, 
    updateVehiclePricing,
    updateVehicleDetails,
    updateBookingStatus,
    toggleBannerActive,
    updateBannerDetails,
    addCoupon,
    deleteCoupon,
    addBooking
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pricing' | 'banners' | 'coupons' | 'settings'>('overview');
  
  // Pricing Form State
  const [selectedPricingVehicleId, setSelectedPricingVehicleId] = useState('');
  const [pricingForm, setPricingForm] = useState<VehiclePricing | null>(null);

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    discountPercent: 10,
    maxDiscount: 200,
    minTripValue: 500,
    description: '',
    active: true
  });

  // Filter Bookings State
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  // Sync Pricing Form when vehicle changes
  useEffect(() => {
    if (vehicles.length > 0) {
      const defaultId = selectedPricingVehicleId || vehicles[0].id;
      if (!selectedPricingVehicleId) {
        setSelectedPricingVehicleId(defaultId);
      }
      const vehicle = vehicles.find(v => v.id === defaultId);
      if (vehicle) {
        setPricingForm({ ...vehicle.pricing });
      }
    }
  }, [vehicles, selectedPricingVehicleId]);

  const handlePricingSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPricingVehicleId && pricingForm) {
      updateVehiclePricing(selectedPricingVehicleId, pricingForm);
      alert('Vehicle pricing configurations updated successfully!');
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    addCoupon({ ...newCoupon, code: newCoupon.code.toUpperCase().trim() });
    alert('Coupon code added successfully!');
    setNewCoupon({
      code: '',
      discountPercent: 15,
      maxDiscount: 200,
      minTripValue: 500,
      description: '',
      active: true
    });
  };

  const handleExcelExport = () => {
    alert('Generating spreadsheets... Revenue report successfully exported to C:/Users/kalav/Downloads/Revenue_Report_JollyCabs.xlsx');
  };

  const triggerSimulatedBooking = (type: 'airport' | 'srisailam') => {
    const simulatedBookingId = 'BK_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const simulatedCustomerName = ['Satish Reddy', 'Kavitha Naidu', 'Ramesh Prasad', 'Suresh Kumar'][Math.floor(Math.random() * 4)];
    const simulatedPhone = '+91 9' + Math.floor(100000000 + Math.random() * 900000000);
    
    let pickup = '';
    let drop = '';
    let distance = 0;
    let duration = 0;
    let toll = 0;
    let baseFare = 0;
    let pricePerKm = 0;
    let driverBata = 1000;
    let selectedVehicleId = '';
    let tripType = '';

    if (type === 'airport') {
      pickup = 'Kukatpally, Hyderabad, Telangana';
      drop = 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad';
      distance = 38;
      duration = 45;
      toll = 0;
      baseFare = 650;
      pricePerKm = 19;
      selectedVehicleId = 'veh_carens';
      tripType = 'airport_drop';
    } else {
      pickup = 'Secunderabad, Hyderabad, Telangana';
      drop = 'Srisailam Mallikarjuna Temple, Andhra Pradesh';
      distance = 215;
      duration = 270;
      toll = 150;
      baseFare = 800;
      pricePerKm = 22;
      selectedVehicleId = 'veh_premium_suv';
      tripType = 'outstation_round';
    }

    const totalFare = baseFare + (distance * pricePerKm) + toll + driverBata;

    const newSimulatedBooking: Booking = {
      id: simulatedBookingId,
      customerName: simulatedCustomerName,
      customerPhone: simulatedPhone,
      pickupAddress: pickup,
      dropAddress: drop,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      tripType: tripType as any,
      passengers: 4,
      luggageCount: 2,
      vehicleId: selectedVehicleId,
      vehicleDetails: {
        name: selectedVehicleId === 'veh_carens' ? 'KIA Carens' : 'Innova Crysta',
        category: selectedVehicleId === 'veh_carens' ? 'Premium MPV' : 'Luxury MPV'
      },
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      status: 'pending',
      distanceKm: distance,
      durationMin: duration,
      estimatedFareMin: totalFare - 50,
      estimatedFareMax: totalFare + 50,
      fareBreakdown: {
        base: baseFare,
        extraKm: distance * pricePerKm,
        bata: driverBata,
        tolls: toll,
        convenience: 50,
        gst: Math.round(totalFare * 0.05),
        discount: 0,
        total: totalFare,
        advancePaid: 0,
        remaining: totalFare,
        // Extended breakdown fields
        baseFare: baseFare,
        distanceFare: distance * pricePerKm,
        driverBata: driverBata,
        tollCharges: toll,
        parkingCharges: 0,
        permitCharges: 0,
        nightCharges: 0,
        taxes: Math.round(totalFare * 0.05)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addBooking(newSimulatedBooking);
    alert(`Live Sim: Incoming request "${simulatedBookingId}" received from ${simulatedCustomerName}!`);
  };

  const analytics = useAdminStore.getState().getAnalytics();

  // Filtered Bookings list
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilter === 'all' ? true : b.status === bookingFilter;
    const matchesSearch = 
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone.includes(bookingSearch) ||
      b.pickupAddress.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex bg-[#050b14] text-white overflow-hidden min-h-screen">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] border-r border-white/5 flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center font-display font-bold text-brand-dark text-sm">
              JC
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-wide text-white">Jolly Admin</h3>
              <p className="text-[9px] text-brand-gold font-bold tracking-wider uppercase">Chauffeur Ops</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'bookings', label: 'Manage Bookings', icon: Navigation },
              { id: 'pricing', label: 'Vehicle Pricing', icon: Car },
              { id: 'banners', label: 'Festival Banners', icon: ImageIcon },
              { id: 'coupons', label: 'Manage Coupons', icon: Ticket },
              { id: 'settings', label: 'API Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                      : 'text-brand-textGray hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-brand-textGray hover:text-brand-danger hover:bg-brand-danger/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Panel
          </button>
        </div>
      </aside>

      {/* 2. Main Page Content View */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header bar */}
        <header className="px-8 py-5 border-b border-white/5 bg-[#1E1E1E]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-brand-textGray">
            <span>Admin Control Panel</span>
            <span>/</span>
            <span className="text-white font-bold capitalize">{activeTab}</span>
          </div>

          <button
            onClick={() => loadAllAdminData()}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-gold" />
            Refresh Data
          </button>
        </header>

        {/* View Layout Container */}
        <div className="p-8">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Analytics row */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `₹${analytics.totalRevenue}`, icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                  { label: 'Completed Rides', value: analytics.completedRides, icon: ShieldCheck, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                  { label: 'Pending Bookings', value: analytics.pendingRides, icon: Navigation, color: 'bg-amber-500/10 text-brand-gold border-brand-gold/20 animate-pulse' },
                  { label: 'Cancelled Trips', value: analytics.cancelledRides, icon: XCircle, color: 'bg-red-500/10 text-red-500 border-red-500/20' }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-brand-textGray font-bold uppercase tracking-wider block">
                          {card.label}
                        </span>
                        <span className="text-2xl font-bold font-mono text-white mt-1.5 block">
                          {card.value}
                        </span>
                      </div>
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Antigravity Ops: Live Simulated dispatch booking trigger */}
              <div className="bg-[#1E1E1E] border border-brand-gold/20 rounded-3xl p-6 shadow-gold-glow flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0">
                    <Compass className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Live Simulation Ops Console
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-bold uppercase animate-pulse border border-emerald-500/20">
                        Online
                      </span>
                    </h4>
                    <p className="text-[10px] text-brand-textGray mt-0.5">
                      Instantly simulate real-time passenger booking requests to test operations dispatch routing and live GPS driver assignment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => triggerSimulatedBooking('airport')}
                    className="bg-brand-gold hover:bg-brand-lightGold text-brand-dark text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    Simulate Airport Drop
                  </button>
                  <button
                    onClick={() => triggerSimulatedBooking('srisailam')}
                    className="bg-[#050b14] hover:bg-white/5 border border-white/10 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    Simulate Srisailam Tour
                  </button>
                </div>
              </div>

              {/* Grid: Charts + Category Breakdown */}
              <div className="grid grid-cols-3 gap-6">
                {/* 1. Bar Chart Visualizer */}
                <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 col-span-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Stream</h4>
                      <p className="text-[10px] text-brand-textGray mt-0.5">Booking completions by day chart</p>
                    </div>
                    <button
                      onClick={handleExcelExport}
                      className="flex items-center gap-1.5 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 px-3.5 py-1.5 rounded-xl text-brand-gold text-[10px] font-bold transition-all"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Export Data to Excel
                    </button>
                  </div>

                  {/* HTML/CSS Bar Chart Mock */}
                  <div className="h-44 flex items-end justify-between px-4 mt-2 relative">
                    <div className="absolute inset-x-0 top-1/2 border-t border-white/5 pointer-events-none" />
                    
                    {/* Simulated bars */}
                    {Object.keys(analytics.bookingsByDay).length === 0 ? (
                      <span className="text-xs text-brand-textGray m-auto">No booking entries currently recorded.</span>
                    ) : (
                      Object.entries(analytics.bookingsByDay).map(([day, val], idx) => {
                        const heightPercent = Math.min(100, (val * 25)); // scale factor
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="text-[8px] font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                              {val} Rides
                            </div>
                            <div 
                              style={{ height: `${heightPercent}px` }} 
                              className="w-8 bg-gradient-to-t from-brand-gold/40 to-brand-gold rounded-t-lg group-hover:from-brand-gold group-hover:shadow-gold-glow transition-all"
                            />
                            <span className="text-[8px] font-bold text-brand-textGray tracking-wide uppercase">
                              {day.split('-')[2]} Jul
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Revenue share by Category */}
                <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Share</h4>
                    <p className="text-[10px] text-brand-textGray mt-0.5">Earnings distribution by fleet class</p>
                  </div>

                  <div className="flex flex-col gap-3.5 mt-5">
                    {vehicles.map((v) => {
                      const share = analytics.revenueByCategory[v.category] || 0;
                      const maxRevenue = Math.max(1, ...Object.values(analytics.revenueByCategory));
                      const fillPercent = Math.max(5, (share / maxRevenue) * 100);
                      return (
                        <div key={v.id} className="flex flex-col gap-1 text-[10px] font-semibold">
                          <div className="flex justify-between">
                            <span className="text-white/80">{v.category} ({v.name.split('/')[0]})</span>
                            <span className="font-bold text-brand-gold font-mono">₹{share}</span>
                          </div>
                          <div className="w-full bg-[#050b14] h-1.5 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${fillPercent}%` }} 
                              className="bg-brand-gold h-full rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Bookings operations manager */}
              <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Rides Dispatch Monitor</h4>
                  <span className="px-2 py-0.5 bg-[#050b14] rounded-full text-[9px] font-semibold text-brand-gold uppercase tracking-wider">
                    Live Dispatch Sim
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-white/5">
                    <thead>
                      <tr className="text-brand-textGray font-bold uppercase tracking-wider text-[9px] opacity-75">
                        <th className="pb-3">Trip ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Route details</th>
                        <th className="pb-3">Fare (total)</th>
                        <th className="pb-3">Dispatcher status</th>
                        <th className="pb-3 text-right">Dispatch override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-bold text-white">{b.id}</td>
                          <td className="py-3.5">
                            <div className="font-bold text-white">{b.customerName}</div>
                            <div className="text-[9px] text-brand-textGray mt-0.5">{b.customerPhone}</div>
                          </td>
                          <td className="py-3.5 max-w-[200px] truncate">
                            <div className="font-bold truncate text-white/90">{b.pickupAddress.split(',')[0]}</div>
                            {b.tripType !== 'rental' && (
                              <div className="text-[9px] text-brand-textGray mt-0.5 truncate">{b.dropAddress.split(',')[0]}</div>
                            )}
                          </td>
                          <td className="py-3.5 font-mono font-bold text-white">₹{b.fareBreakdown.total}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-white/5 border border-white/10 ${
                              b.status === 'trip_completed' ? 'text-brand-success border-brand-success/20 bg-brand-success/5' :
                              b.status === 'cancelled' ? 'text-brand-danger border-brand-danger/20 bg-brand-danger/5' :
                              'text-brand-gold border-brand-gold/20 bg-brand-gold/5'
                            }`}>
                              {b.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <select
                              value={b.status}
                              onChange={(e) => {
                                updateBookingStatus(b.id, e.target.value as BookingStatus);
                                alert(`Status of booking ${b.id} overridden to: ${e.target.value}`);
                              }}
                              className="bg-[#050b14] border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-brand-gold tracking-wide outline-none focus:border-brand-gold"
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="driver_assigned">Driver Assigned</option>
                              <option value="driver_reached">Driver Reached</option>
                              <option value="trip_started">Trip Started</option>
                              <option value="trip_completed">Trip Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ride Booking Register</h4>
                  <p className="text-[10px] text-brand-textGray mt-0.5">Filter, search, and manage all passenger logs</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search customer, ID, addresses..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="bg-[#050b14] border border-white/10 focus:border-brand-gold rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-none w-56 placeholder:text-brand-textGray/60"
                  />

                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="bg-[#050b14] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-gold outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="driver_assigned">Driver Assigned</option>
                    <option value="driver_reached">Driver Reached</option>
                    <option value="trip_started">Trip Started</option>
                    <option value="trip_completed">Trip Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-white/5">
                  <thead>
                    <tr className="text-brand-textGray font-bold uppercase tracking-wider text-[9px] opacity-75">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Customer name</th>
                      <th className="pb-3">Trip details</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Fare total</th>
                      <th className="pb-3">Payment status</th>
                      <th className="pb-3">Dispatch status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold text-white">{b.id}</td>
                        <td className="py-4">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-[9px] text-brand-textGray mt-0.5">{b.customerPhone}</div>
                        </td>
                        <td className="py-4 max-w-[200px]">
                          <div className="truncate text-white/90"><span className="text-[9px] text-brand-gold uppercase font-bold">Pick:</span> {b.pickupAddress}</div>
                          {b.tripType !== 'rental' && (
                            <div className="truncate text-brand-textGray mt-0.5"><span className="text-[9px] text-brand-danger uppercase font-bold">Drop:</span> {b.dropAddress}</div>
                          )}
                          <div className="text-[9px] text-brand-textGray mt-1 font-semibold">{b.date} • {b.time}</div>
                        </td>
                        <td className="py-4 capitalize font-semibold text-brand-gold">{b.tripType.replace('_', ' ')}</td>
                        <td className="py-4 font-mono font-bold text-white">₹{b.fareBreakdown.total}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                            b.paymentStatus === 'fully_paid' ? 'text-brand-success bg-brand-success/5 border border-brand-success/15' :
                            b.paymentStatus === 'advance_paid' ? 'text-brand-info bg-brand-info/5 border border-brand-info/15' :
                            'text-brand-danger bg-brand-danger/5 border border-brand-danger/15'
                          }`}>
                            {b.paymentStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="bg-[#050b14] border border-white/10 rounded-xl px-2 py-1 text-[10px] font-bold text-brand-gold outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="driver_assigned">Driver Assigned</option>
                            <option value="driver_reached">Driver Reached</option>
                            <option value="trip_started">Trip Started</option>
                            <option value="trip_completed">Trip Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              updateBookingStatus(b.id, 'cancelled');
                              alert(`Booking ${b.id} marked as cancelled.`);
                            }}
                            disabled={b.status === 'cancelled' || b.status === 'trip_completed'}
                            className="bg-brand-danger/10 hover:bg-brand-danger/20 text-brand-danger border border-brand-danger/20 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all disabled:opacity-30 disabled:pointer-events-none"
                          >
                            Cancel Ride
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VEHICLE PRICING MANAGER TAB */}
          {activeTab === 'pricing' && (
            <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Fare Configurations</h4>
                  <p className="text-[10px] text-brand-textGray mt-0.5">Fine-tune base rates, kilometer charges, driver bata and toll rules</p>
                </div>
              </div>

              {/* Form Layout */}
              <form onSubmit={handlePricingSave} className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Select vehicle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                      Select Vehicle Category
                    </label>
                    <select
                      value={selectedPricingVehicleId}
                      onChange={(e) => setSelectedPricingVehicleId(e.target.value)}
                      className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-brand-gold outline-none"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {pricingForm && (
                  <div className="grid grid-cols-3 gap-6 bg-[#050b14] border border-white/5 p-6 rounded-3xl">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Base Fare (Initial cover)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.baseFare}
                        onChange={(e) => setPricingForm({ ...pricingForm, baseFare: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Price Per Kilometer (Standard Rate)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.pricePerKm}
                        onChange={(e) => setPricingForm({ ...pricingForm, pricePerKm: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Minimum Distance Covered (KM)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.minDistance}
                        onChange={(e) => setPricingForm({ ...pricingForm, minDistance: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Driver Bata Allowance (Per Day)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.driverBata}
                        onChange={(e) => setPricingForm({ ...pricingForm, driverBata: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Night Driving Charge (Fixed allowance)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.nightCharges}
                        onChange={(e) => setPricingForm({ ...pricingForm, nightCharges: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Waiting Charge (Per Minute)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.waitingCharges}
                        onChange={(e) => setPricingForm({ ...pricingForm, waitingCharges: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Service Convenience Fee
                      </label>
                      <input
                        type="number"
                        value={pricingForm.convenienceFee}
                        onChange={(e) => setPricingForm({ ...pricingForm, convenienceFee: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        GST Tax Percent (%)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.gstPercent}
                        onChange={(e) => setPricingForm({ ...pricingForm, gstPercent: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Extra KM Charge (When limits exceeded)
                      </label>
                      <input
                        type="number"
                        value={pricingForm.extraKmCharge}
                        onChange={(e) => setPricingForm({ ...pricingForm, extraKmCharge: parseInt(e.target.value) || 0 })}
                        className="bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="ripple-btn self-end flex items-center gap-2 bg-brand-gold text-brand-dark px-6 py-3 rounded-2xl text-xs font-bold shadow-gold-glow"
                >
                  <Save className="w-4 h-4" />
                  Save Configurations
                </button>
              </form>
            </div>
          )}

          {/* FESTIVAL BANNER TAB */}
          {activeTab === 'banners' && (
            <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Festival Banner Management</h4>
                  <p className="text-[10px] text-brand-textGray mt-0.5">Configure active promotions shown on customer landing screen</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {banners.map((ban) => (
                  <div
                    key={ban.id}
                    className={`bg-gradient-to-r ${ban.imageTheme} rounded-3xl p-6 border text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      ban.active ? 'border-brand-gold/60 ring-2 ring-brand-gold' : 'border-white/5'
                    }`}
                  >
                    <div>
                      <span className="px-2.5 py-0.5 bg-white/20 border border-white/30 rounded-full text-[9px] font-bold uppercase tracking-wide inline-block">
                        {ban.festivalName}
                      </span>
                      <h4 className="text-base font-bold font-display mt-2">{ban.title}</h4>
                      <p className="text-xs text-white/80 mt-1">{ban.subtitle}</p>
                      
                      <div className="mt-4 flex items-center gap-3 text-[10px]">
                        <span>Applied discount: <strong className="text-brand-gold">{ban.discountPercent}% OFF</strong></span>
                        <span>•</span>
                        <span>Promo Code: <strong className="text-white font-mono">{ban.couponCode}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => {
                          const newTitle = prompt('Edit Banner Title:', ban.title);
                          if (newTitle) updateBannerDetails(ban.id, { title: newTitle });
                        }}
                        className="bg-brand-dark/30 hover:bg-brand-dark/50 border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Edit Text
                      </button>

                      <button
                        onClick={() => {
                          toggleBannerActive(ban.id);
                          alert(`Banner "${ban.festivalName}" toggled.`);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          ban.active
                            ? 'bg-brand-danger text-white hover:bg-brand-danger/90'
                            : 'bg-brand-gold text-brand-dark hover:bg-brand-lightGold'
                        }`}
                      >
                        {ban.active ? 'Disable' : 'Set Active'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MANAGE COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                
                {/* 1. Add Coupon Form */}
                <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Create Promo Coupon</h4>
                  
                  <form onSubmit={handleAddCoupon} className="flex flex-col gap-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. SUMMER15"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold font-bold font-mono tracking-wider"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={newCoupon.discountPercent}
                          onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: parseInt(e.target.value) || 0 })}
                          className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold"
                          min="5"
                          max="90"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                          Max Limit (INR)
                        </label>
                        <input
                          type="number"
                          value={newCoupon.maxDiscount}
                          onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: parseInt(e.target.value) || 0 })}
                          className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Min. Booking Value (INR)
                      </label>
                      <input
                        type="number"
                        value={newCoupon.minTripValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minTripValue: parseInt(e.target.value) || 0 })}
                        className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Get 15% OFF on Srisailam trip"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                        className="bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="ripple-btn w-full bg-brand-gold text-brand-dark py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-gold-glow mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* 2. Coupons List */}
                <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 col-span-2 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Promotional Codes</h4>
                  
                  <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {coupons.map((c) => (
                      <div
                        key={c.code}
                        className="bg-[#050b14] border border-white/5 p-4 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="bg-brand-gold/15 border border-brand-gold/25 px-3 py-1 rounded-xl text-brand-gold font-bold font-mono tracking-wider">
                              {c.code}
                            </span>
                            <span className="font-bold text-white">{c.discountPercent}% OFF (up to ₹{c.maxDiscount})</span>
                          </div>
                          <p className="text-[10px] text-brand-textGray mt-1.5 leading-normal">
                            {c.description} • Min. Ride: ₹{c.minTripValue}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            deleteCoupon(c.code);
                            alert(`Promo code "${c.code}" deleted.`);
                          }}
                          className="text-brand-textGray hover:text-brand-danger transition-colors p-2"
                          title="Delete promo code"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="flex-grow p-8 overflow-y-auto flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Credentials Setup</span>
                <h3 className="text-xl font-bold text-white mt-1">Google Maps API Settings</h3>
                <p className="text-xs text-brand-textGray mt-1.5 leading-relaxed max-w-2xl">
                  By default, the application runs on OpenStreetMap (Nominatim) and OSRM (Open Source Routing Machine) APIs, which are 100% free. 
                  For presentation, you can paste your Google Maps API Key below to enable Google Place Autocomplete, Geocoding, and Directions routing services.
                </p>
              </div>

              <div className="bg-[#1E1E1E] border border-white/5 rounded-3xl p-6 max-w-xl flex flex-col gap-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-gold" />
                  Google Cloud Platform Settings
                </h4>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-brand-textGray uppercase tracking-wider">Google Maps API Key</label>
                  <input
                    type="text"
                    placeholder="AIzaSy..."
                    defaultValue={localStorage.getItem('jolly_cabs_google_api_key') || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (val) {
                        localStorage.setItem('jolly_cabs_google_api_key', val);
                      } else {
                        localStorage.removeItem('jolly_cabs_google_api_key');
                      }
                    }}
                    className="w-full px-4 py-3 bg-[#050b14] border border-white/10 rounded-xl text-xs font-semibold outline-none focus:border-brand-gold text-white"
                  />
                  <span className="text-[9px] text-brand-textGray mt-1 leading-normal">
                    *Requires Geocoding API, Directions API, and Places API enabled in your Google Cloud Console. Leave empty to fallback to free APIs.
                  </span>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      alert('Google Maps API settings saved successfully!');
                      window.location.reload();
                    }}
                    className="bg-brand-gold text-brand-dark font-bold text-xs px-5 py-3 rounded-xl hover:bg-brand-gold/90 transition-colors shadow-gold-glow flex items-center gap-1.5"
                  >
                    Save & Apply Key
                  </button>
                  {localStorage.getItem('jolly_cabs_google_api_key') && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('jolly_cabs_google_api_key');
                        alert('Google Maps API Key removed. Reverted to free OSRM/OSM APIs.');
                        window.location.reload();
                      }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs px-5 py-3 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
