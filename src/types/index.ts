export type TripType = 
  | 'local' 
  | 'airport_pickup' 
  | 'airport_drop' 
  | 'outstation_oneway' 
  | 'outstation_round' 
  | 'rental';

export type BookingStatus = 
  | 'pending' 
  | 'accepted' 
  | 'driver_assigned' 
  | 'driver_reached' 
  | 'trip_started' 
  | 'trip_completed' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'wallet';

export type PaymentStatus = 'pending' | 'advance_paid' | 'fully_paid';

export interface VehiclePricing {
  baseFare: number;          // Minimum rate for initial distance
  pricePerKm: number;        // Rate for standard travel
  minDistance: number;       // Minimum distance charged (e.g. 10km local, 300km rental/day)
  driverBata: number;        // Driver allowance per day
  nightCharges: number;      // Fixed extra charges for night driving (e.g. 11 PM to 5 AM)
  waitingCharges: number;    // Charge per minute of waiting
  convenienceFee: number;    // Service convenience charge
  gstPercent: number;        // GST rate (typically 5% for transport)
  extraKmCharge: number;     // Charge per extra KM when limit exceeded
}

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  seats: string | number;
  luggage: number; // Max bag capacity
  ac: boolean;
  fuel: string;
  transmission: string;
  image: string; // URL or inline SVG path representation
  pricing: VehiclePricing;
  isFavorite?: boolean;
  specs?: string[];
  features?: string[];
}

export interface FareBreakdown {
  base: number;
  extraKm: number;
  bata: number;
  tolls: number;
  convenience: number;
  gst: number;
  discount: number;
  
  // User-requested breakdown fields
  baseFare: number;
  distanceFare: number;
  driverBata: number;
  tollCharges: number;
  parkingCharges: number;
  permitCharges: number;
  nightCharges: number;
  taxes: number;

  total: number;
  advancePaid: number;
  remaining: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropAddress: string;
  date: string;
  time: string;
  tripType: TripType;
  passengers: number;
  luggageCount: number;
  vehicleId: string;
  vehicleDetails?: {
    name: string;
    category: string;
  };
  specialRequests?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehicleNumber?: string;
  distanceKm: number;
  durationMin: number;
  estimatedFareMin: number;
  estimatedFareMax: number;
  actualFare?: number;
  fareBreakdown: FareBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleId?: string;
  vehicleNumber: string;
  status: 'active' | 'busy' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minTripValue: number;
  description: string;
  active: boolean;
}

export interface FestivalBanner {
  id: string;
  title: string;
  subtitle: string;
  imageTheme: string; // Tailwind gradient description
  active: boolean;
  festivalName: string;
  discountPercent: number;
  couponCode: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
}
