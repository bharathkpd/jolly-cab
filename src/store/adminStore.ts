import { create } from 'zustand';
import { Vehicle, Booking, Driver, Coupon, FestivalBanner, VehiclePricing } from '../types';

interface AdminState {
  vehicles: Vehicle[];
  bookings: Booking[];
  drivers: Driver[];
  coupons: Coupon[];
  banners: FestivalBanner[];
  isLoading: boolean;
  
  // Actions
  loadAllAdminData: () => void;
  updateVehiclePricing: (vehicleId: string, pricing: VehiclePricing) => void;
  updateVehicleDetails: (vehicleId: string, details: Partial<Vehicle>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  toggleBannerActive: (bannerId: string) => void;
  updateBannerDetails: (bannerId: string, details: Partial<FestivalBanner>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  addBooking: (booking: Booking) => void;
  getAnalytics: () => {
    totalRevenue: number;
    completedRides: number;
    pendingRides: number;
    cancelledRides: number;
    totalDistance: number;
    revenueByCategory: Record<string, number>;
    bookingsByDay: Record<string, number>;
  };
}

export const useAdminStore = create<AdminState>((set, get) => {
  return {
    vehicles: [],
    bookings: [],
    drivers: [],
    coupons: [],
    banners: [],
    isLoading: false,

    loadAllAdminData: () => {
      set({ isLoading: true });

      // Invalidate local storage database cache if database version changes
      const CURRENT_DB_VERSION = 'v5';
      const savedVersion = localStorage.getItem('jolly_cabs_db_version');
      if (savedVersion !== CURRENT_DB_VERSION) {
        localStorage.removeItem('jolly_cabs_vehicles');
        localStorage.removeItem('jolly_cabs_banners');
        localStorage.removeItem('jolly_cabs_coupons');
        localStorage.removeItem('jolly_cabs_drivers');
        localStorage.setItem('jolly_cabs_db_version', CURRENT_DB_VERSION);
      }

      // 1. Load Vehicles
      let vehicles: Vehicle[] = [];
      const savedVehicles = localStorage.getItem('jolly_cabs_vehicles');
      if (savedVehicles) {
        try {
          vehicles = JSON.parse(savedVehicles);
          // Invalidate old localstorage cache if it contains legacy SVG vector coordinates
          if (vehicles.some((v) => !v.image.startsWith('/vehicles/'))) {
            vehicles = [];
          }
        } catch (e) {
          vehicles = [];
        }
      }
      if (vehicles.length === 0) {
        // Seed default vehicles
        import('../services/mockData').then((module) => {
          vehicles = module.INITIAL_VEHICLES;
          localStorage.setItem('jolly_cabs_vehicles', JSON.stringify(vehicles));
          set({ vehicles });
        });
      } else {
        set({ vehicles });
      }

      // 2. Load Bookings
      let bookings: Booking[] = [];
      const savedBookings = localStorage.getItem('jolly_cabs_bookings');
      if (savedBookings) {
        try {
          bookings = JSON.parse(savedBookings);
        } catch (e) {
          bookings = [];
        }
      }
      set({ bookings });

      // 3. Load Drivers
      let drivers: Driver[] = [];
      const savedDrivers = localStorage.getItem('jolly_cabs_drivers');
      if (savedDrivers) {
        try {
          drivers = JSON.parse(savedDrivers);
        } catch (e) {
          drivers = [];
        }
      }
      if (drivers.length === 0) {
        import('../services/mockData').then((module) => {
          drivers = module.MOCK_DRIVERS;
          localStorage.setItem('jolly_cabs_drivers', JSON.stringify(drivers));
          set({ drivers });
        });
      } else {
        set({ drivers });
      }

      // 4. Load Coupons
      let coupons: Coupon[] = [];
      const savedCoupons = localStorage.getItem('jolly_cabs_coupons');
      if (savedCoupons) {
        try {
          coupons = JSON.parse(savedCoupons);
        } catch (e) {
          coupons = [];
        }
      }
      if (coupons.length === 0) {
        import('../services/mockData').then((module) => {
          coupons = module.INITIAL_COUPONS;
          localStorage.setItem('jolly_cabs_coupons', JSON.stringify(coupons));
          set({ coupons });
        });
      } else {
        set({ coupons });
      }

      // 5. Load Banners
      let banners: FestivalBanner[] = [];
      const savedBanners = localStorage.getItem('jolly_cabs_banners');
      if (savedBanners) {
        try {
          banners = JSON.parse(savedBanners);
          // Invalidate old festival banners cache if it contains deprecated IDs (fb_1, fb_2, fb_3)
          if (banners.some((b) => b.id === 'fb_1' || b.id === 'fb_2' || b.id === 'fb_3')) {
            banners = [];
          }
        } catch (e) {
          banners = [];
        }
      }
      if (banners.length === 0) {
        import('../services/mockData').then((module) => {
          banners = module.INITIAL_FESTIVAL_BANNERS;
          localStorage.setItem('jolly_cabs_banners', JSON.stringify(banners));
          set({ banners });
        });
      } else {
        set({ banners });
      }

      set({ isLoading: false });
    },

    updateVehiclePricing: (vehicleId, pricing) => {
      const updatedVehicles = get().vehicles.map((v) => 
        v.id === vehicleId ? { ...v, pricing } : v
      );
      localStorage.setItem('jolly_cabs_vehicles', JSON.stringify(updatedVehicles));
      set({ vehicles: updatedVehicles });
    },

    updateVehicleDetails: (vehicleId, details) => {
      const updatedVehicles = get().vehicles.map((v) => 
        v.id === vehicleId ? { ...v, ...details } : v
      );
      localStorage.setItem('jolly_cabs_vehicles', JSON.stringify(updatedVehicles));
      set({ vehicles: updatedVehicles });
    },

    updateBookingStatus: (bookingId, status) => {
      const localBookings = localStorage.getItem('jolly_cabs_bookings');
      let bookings: Booking[] = localBookings ? JSON.parse(localBookings) : [];
      
      bookings = bookings.map((b) => 
        b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b
      );
      
      localStorage.setItem('jolly_cabs_bookings', JSON.stringify(bookings));
      set({ bookings });
    },

    toggleBannerActive: (bannerId) => {
      // Ensure only one banner is active at a time for demonstration simplicity
      const updatedBanners = get().banners.map((b) => ({
        ...b,
        active: b.id === bannerId ? !b.active : false
      }));
      localStorage.setItem('jolly_cabs_banners', JSON.stringify(updatedBanners));
      set({ banners: updatedBanners });
    },

    updateBannerDetails: (bannerId, details) => {
      const updatedBanners = get().banners.map((b) => 
        b.id === bannerId ? { ...b, ...details } : b
      );
      localStorage.setItem('jolly_cabs_banners', JSON.stringify(updatedBanners));
      set({ banners: updatedBanners });
    },

    addVehicle: (vehicle) => {
      const updated = [...get().vehicles, vehicle];
      localStorage.setItem('jolly_cabs_vehicles', JSON.stringify(updated));
      set({ vehicles: updated });
    },

    addCoupon: (coupon) => {
      const updated = [...get().coupons, coupon];
      localStorage.setItem('jolly_cabs_coupons', JSON.stringify(updated));
      set({ coupons: updated });
    },

    deleteCoupon: (code) => {
      const updated = get().coupons.filter((c) => c.code !== code);
      localStorage.setItem('jolly_cabs_coupons', JSON.stringify(updated));
      set({ coupons: updated });
    },

    getAnalytics: () => {
      const { bookings } = get();
      
      let totalRevenue = 0;
      let completedRides = 0;
      let pendingRides = 0;
      let cancelledRides = 0;
      let totalDistance = 0;
      
      const revenueByCategory: Record<string, number> = {};
      const bookingsByDay: Record<string, number> = {};

      bookings.forEach((b) => {
        // Bookings by day
        const dateStr = b.date; // e.g. "2026-07-09"
        bookingsByDay[dateStr] = (bookingsByDay[dateStr] || 0) + 1;

        if (b.status === 'trip_completed') {
          completedRides++;
          const totalFare = b.fareBreakdown.total;
          totalRevenue += totalFare;
          totalDistance += b.distanceKm;

          // Revenue by vehicle category
          const category = b.vehicleDetails?.category || 'Other';
          revenueByCategory[category] = (revenueByCategory[category] || 0) + totalFare;
        } else if (b.status === 'pending' || b.status === 'accepted' || b.status === 'driver_assigned' || b.status === 'driver_reached' || b.status === 'trip_started') {
          pendingRides++;
        } else if (b.status === 'cancelled') {
          cancelledRides++;
        }
      });

      return {
        totalRevenue,
        completedRides,
        pendingRides,
        cancelledRides,
        totalDistance,
        revenueByCategory,
        bookingsByDay
      };
    },

    addBooking: (booking) => {
      const updated = [booking, ...get().bookings];
      localStorage.setItem('jolly_cabs_bookings', JSON.stringify(updated));
      set({ bookings: updated });
    }
  };
});
