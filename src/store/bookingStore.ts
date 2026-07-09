import { create } from 'zustand';
import { Booking, BookingStatus, TripType, Vehicle, PaymentMethod, PaymentStatus } from '../types';
import { calculateFare } from '../services/fareEngine';
import { INITIAL_COUPONS } from '../services/mockData';

interface BookingFormState {
  tripType: TripType;
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  durationMin: number;
  tollCharges: number;
  date: string;
  time: string;
  passengers: number;
  luggageCount: number;
  days: number;
  specialRequests: string;
  couponCode: string;
  selectedVehicleId: string | null;
  hasNightDriving: boolean;
  waitingMinutes: number;
}

interface BookingState extends BookingFormState {
  activeBooking: Booking | null;
  history: Booking[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setBookingField: <K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) => void;
  setRoute: (pickup: string, drop: string, distanceKm: number, durationMin: number, tollCharges: number) => void;
  createBooking: (customerName: string, customerPhone: string, paymentMethod: PaymentMethod) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  simulateRideLifecycle: (bookingId: string) => void;
  clearBookingForm: () => void;
  loadHistory: (phone: string) => void;
  addReviewToHistory: (bookingId: string, rating: number, comment: string) => void;
}

const initialFormState: BookingFormState = {
  tripType: 'local',
  pickupAddress: '',
  dropAddress: '',
  distanceKm: 0,
  durationMin: 0,
  tollCharges: 0,
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  passengers: 1,
  luggageCount: 0,
  days: 1,
  specialRequests: '',
  couponCode: '',
  selectedVehicleId: null,
  hasNightDriving: false,
  waitingMinutes: 0
};

export const useBookingStore = create<BookingState>((set, get) => {
  return {
    ...initialFormState,
    activeBooking: null,
    history: [],
    isLoading: false,
    error: null,

    setBookingField: (field, value) => {
      set({ [field]: value });
    },

    setRoute: (pickupAddress, dropAddress, distanceKm, durationMin, tollCharges) => {
      set({
        pickupAddress,
        dropAddress,
        distanceKm,
        durationMin,
        tollCharges
      });
    },

    createBooking: async (customerName, customerPhone, paymentMethod) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const state = get();

        // Retrieve vehicle pricing
        const savedVehiclesJson = localStorage.getItem('jolly_cabs_vehicles');
        let vehicles: Vehicle[] = [];
        if (savedVehiclesJson) {
          vehicles = JSON.parse(savedVehiclesJson);
        } else {
          const mockVehiclesModule = await import('../services/mockData');
          vehicles = mockVehiclesModule.INITIAL_VEHICLES;
        }

        const selectedVehicle = vehicles.find((v) => v.id === state.selectedVehicleId);
        if (!selectedVehicle) {
          throw new Error('Please select a vehicle to book.');
        }

        // Retrieve coupon details
        const coupon = INITIAL_COUPONS.find(
          (c) => c.code.toUpperCase() === state.couponCode.toUpperCase() && c.active
        );

        // Run through Fare Engine
        const fareResult = calculateFare({
          tripType: state.tripType,
          distanceKm: state.distanceKm,
          durationMin: state.durationMin,
          days: state.days,
          vehicle: selectedVehicle,
          hasNightDriving: state.hasNightDriving,
          waitingMinutes: state.waitingMinutes,
          tollCharges: state.tollCharges,
          couponDiscountPercent: coupon?.discountPercent || 0,
          couponMaxDiscount: coupon?.maxDiscount || 99999
        });

        const bookingId = 'BK_' + Math.floor(Math.random() * 900000 + 100000);
        const newBooking: Booking = {
          id: bookingId,
          customerName,
          customerPhone,
          pickupAddress: state.pickupAddress,
          dropAddress: state.dropAddress,
          date: state.date,
          time: state.time,
          tripType: state.tripType,
          passengers: state.passengers,
          luggageCount: state.luggageCount,
          vehicleId: selectedVehicle.id,
          vehicleDetails: {
            name: selectedVehicle.name,
            category: selectedVehicle.category
          },
          specialRequests: state.specialRequests,
          couponCode: state.couponCode || undefined,
          paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'pending' : 'advance_paid',
          status: 'pending',
          distanceKm: state.distanceKm,
          durationMin: state.durationMin,
          estimatedFareMin: fareResult.estMin,
          estimatedFareMax: fareResult.estMax,
          actualFare: fareResult.breakdown.total,
          fareBreakdown: fareResult.breakdown,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save to booking list
        const localBookings = localStorage.getItem('jolly_cabs_bookings');
        let currentBookings: Booking[] = [];
        if (localBookings) {
          try {
            currentBookings = JSON.parse(localBookings);
          } catch (e) {
            currentBookings = [];
          }
        }
        currentBookings.unshift(newBooking);
        localStorage.setItem('jolly_cabs_bookings', JSON.stringify(currentBookings));

        set({
          activeBooking: newBooking,
          history: currentBookings.filter((b) => b.customerPhone === customerPhone),
          isLoading: false
        });

        // Trigger simulation
        get().simulateRideLifecycle(bookingId);

        return newBooking;
      } catch (err: any) {
        set({ error: err.message || 'Booking failed.', isLoading: false });
        return null;
      }
    },

    cancelBooking: async (bookingId) => {
      set({ isLoading: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const localBookings = localStorage.getItem('jolly_cabs_bookings');
        if (!localBookings) return false;

        let bookings: Booking[] = JSON.parse(localBookings);
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
        
        if (bookingIndex > -1) {
          bookings[bookingIndex].status = 'cancelled';
          bookings[bookingIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem('jolly_cabs_bookings', JSON.stringify(bookings));
          
          const { activeBooking, user } = get() as any;
          const updatedActive = activeBooking?.id === bookingId ? bookings[bookingIndex] : activeBooking;
          
          set({
            activeBooking: updatedActive,
            history: bookings,
            isLoading: false
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      } catch (e) {
        set({ isLoading: false });
        return false;
      }
    },

    simulateRideLifecycle: (bookingId) => {
      const updateStatus = (status: BookingStatus, extraFields: Partial<Booking> = {}) => {
        const localBookings = localStorage.getItem('jolly_cabs_bookings');
        if (!localBookings) return;
        
        let bookings: Booking[] = JSON.parse(localBookings);
        const index = bookings.findIndex((b) => b.id === bookingId);
        
        if (index > -1) {
          // If booking was cancelled by user, stop simulation
          if (bookings[index].status === 'cancelled') return;

          bookings[index] = {
            ...bookings[index],
            status,
            ...extraFields,
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem('jolly_cabs_bookings', JSON.stringify(bookings));
          
          const currentActive = get().activeBooking;
          if (currentActive && currentActive.id === bookingId) {
            set({
              activeBooking: bookings[index],
              history: bookings.filter((b) => b.customerPhone === bookings[index].customerPhone)
            });
          }
        }
      };

      // Lifecycle timers:
      // 1. Pending -> Accepted (Assign driver) (4s)
      setTimeout(() => {
        updateStatus('accepted', {
          driverName: 'Satyanarayana Raju',
          driverPhone: '+91 98480 22338',
          driverRating: 4.9,
          vehicleNumber: 'TS 08 FA 4422'
        });

        // 2. Accepted -> Driver Reached (4s)
        setTimeout(() => {
          updateStatus('driver_reached');

          // 3. Driver Reached -> Trip Started (4s)
          setTimeout(() => {
            updateStatus('trip_started');

            // 4. Trip Started -> Trip Completed (10s)
            setTimeout(() => {
              updateStatus('trip_completed', {
                paymentStatus: 'fully_paid'
              });
            }, 10000);
            
          }, 4000);

        }, 4000);

      }, 4000);
    },

    clearBookingForm: () => {
      set({ ...initialFormState });
    },

    loadHistory: (phone) => {
      const localBookings = localStorage.getItem('jolly_cabs_bookings');
      if (localBookings) {
        try {
          const bookings: Booking[] = JSON.parse(localBookings);
          set({ history: bookings.filter((b) => b.customerPhone === phone) });
        } catch (e) {
          set({ history: [] });
        }
      }
    },

    addReviewToHistory: (bookingId, rating, comment) => {
      const localBookings = localStorage.getItem('jolly_cabs_bookings');
      if (!localBookings) return;

      try {
        let bookings: Booking[] = JSON.parse(localBookings);
        const index = bookings.findIndex((b) => b.id === bookingId);
        if (index > -1) {
          bookings[index].driverRating = rating;
          bookings[index].specialRequests = (bookings[index].specialRequests || '') + ` [Review: ${comment}]`;
          bookings[index].updatedAt = new Date().toISOString();
          localStorage.setItem('jolly_cabs_bookings', JSON.stringify(bookings));
          
          set({
            history: bookings.filter((b) => b.customerPhone === bookings[index].customerPhone),
            activeBooking: get().activeBooking?.id === bookingId ? bookings[index] : get().activeBooking
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
});
