import { Vehicle, Coupon, FestivalBanner, Review, Driver } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_carens',
    name: 'KIA Carens',
    category: 'Premium MPV',
    seats: '6+1 Seater',
    luggage: 4,
    ac: true,
    fuel: 'Petrol / Diesel',
    transmission: 'Automatic',
    image: '/vehicles/kia_carens.jpg',
    specs: ['Petrol / Diesel', 'Large Space', 'Long distance', 'Cozy Seats'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 650,
      pricePerKm: 19,
      minDistance: 15,
      driverBata: 1000,
      nightCharges: 220,
      waitingCharges: 3,
      convenienceFee: 55,
      gstPercent: 5,
      extraKmCharge: 19
    }
  },
  {
    id: 'veh_suv',
    name: 'Maruti Ertiga',
    category: 'Family MPV',
    seats: '6+1 Seater',
    luggage: 4,
    ac: true,
    fuel: 'CNG / Petrol',
    transmission: 'Manual',
    image: '/vehicles/maruti_ertiga.jpg',
    specs: ['CNG / Petrol', 'Large Space', 'Long distance', 'Family Ride'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 550,
      pricePerKm: 18,
      minDistance: 15,
      driverBata: 1000,
      nightCharges: 200,
      waitingCharges: 3,
      convenienceFee: 50,
      gstPercent: 5,
      extraKmCharge: 18
    }
  },
  {
    id: 'veh_premium_suv',
    name: 'Innova Crysta',
    category: 'Luxury MPV',
    seats: '6+1 Seater',
    luggage: 5,
    ac: true,
    fuel: 'Diesel',
    transmission: 'Manual',
    image: '/vehicles/innova_crysta.jpg',
    specs: ['Diesel', 'Large Space', 'Long distance', 'Luxury Cabin'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 800,
      pricePerKm: 22,
      minDistance: 20,
      driverBata: 1000,
      nightCharges: 250,
      waitingCharges: 4,
      convenienceFee: 65,
      gstPercent: 5,
      extraKmCharge: 22
    }
  },
  {
    id: 'veh_luxury',
    name: 'Tata Safari',
    category: 'Premium SUV',
    seats: '5+1 Seater',
    luggage: 5,
    ac: true,
    fuel: 'Diesel',
    transmission: 'Automatic',
    image: '/vehicles/tata_safari.jpg',
    specs: ['Diesel', 'Large Space', 'Long distance', 'High Comfort'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 1100,
      pricePerKm: 26,
      minDistance: 20,
      driverBata: 1000,
      nightCharges: 300,
      waitingCharges: 5,
      convenienceFee: 80,
      gstPercent: 5,
      extraKmCharge: 26
    }
  },
  {
    id: 'veh_sedan',
    name: 'Swift Dzire',
    category: 'Sedan',
    seats: '4+1 Seater',
    luggage: 3,
    ac: true,
    fuel: 'Petrol / CNG',
    transmission: 'Manual',
    image: '/vehicles/swift_dzire.jpg',
    specs: ['Petrol / CNG', 'Small Space', 'Short distance', 'Daily Ride'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 350,
      pricePerKm: 14,
      minDistance: 10,
      driverBata: 1000,
      nightCharges: 150,
      waitingCharges: 2,
      convenienceFee: 40,
      gstPercent: 5,
      extraKmCharge: 14
    },
    isFavorite: true
  },
  {
    id: 'veh_xuv',
    name: 'Mahindra XUV300',
    category: 'Compact SUV',
    seats: '4+1 Seater',
    luggage: 3,
    ac: true,
    fuel: 'Petrol / Diesel',
    transmission: 'Manual',
    image: '/vehicles/mahindra_xuv300.jpg',
    specs: ['Petrol / Diesel', 'Small Space', 'Short distance', 'Sporty Ride'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 450,
      pricePerKm: 16,
      minDistance: 12,
      driverBata: 1000,
      nightCharges: 180,
      waitingCharges: 2,
      convenienceFee: 45,
      gstPercent: 5,
      extraKmCharge: 16
    }
  },
  {
    id: 'veh_hatchback',
    name: 'Maruti Fronx',
    category: 'Compact SUV',
    seats: '4+1 Seater',
    luggage: 2,
    ac: true,
    fuel: 'Petrol / Smart Hybrid',
    transmission: 'Manual',
    image: '/vehicles/maruti_fronx.jpg',
    specs: ['Petrol / Smart Hybrid', 'Medium Space', 'Short/Medium distance', 'Smart Crossover'],
    features: ['AC', 'GPS', 'Music', 'USB'],
    pricing: {
      baseFare: 250,
      pricePerKm: 11,
      minDistance: 10,
      driverBata: 1000,
      nightCharges: 150,
      waitingCharges: 2,
      convenienceFee: 30,
      gstPercent: 5,
      extraKmCharge: 12
    }
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'JOLLYNEW',
    discountPercent: 10,
    maxDiscount: 150,
    minTripValue: 500,
    description: '10% OFF up to ₹150 on your first trip',
    active: true
  },
  {
    code: 'SRISAILAM10',
    discountPercent: 10,
    maxDiscount: 500,
    minTripValue: 2000,
    description: 'Srisailam Temple Package: 10% OFF up to ₹500',
    active: true
  },
  {
    code: 'OUTSTATION15',
    discountPercent: 15,
    maxDiscount: 1000,
    minTripValue: 2500,
    description: 'Outstation Special: 15% OFF up to ₹1000',
    active: true
  },
  {
    code: 'CORP10',
    discountPercent: 10,
    maxDiscount: 1000,
    minTripValue: 5000,
    description: 'Corporate client discount: 10% off long tours',
    active: true
  }
];

export const INITIAL_FESTIVAL_BANNERS: FestivalBanner[] = [
  {
    id: 'fb_srisailam',
    festivalName: 'Srisailam Tour Package',
    title: 'Hyderabad to Srisailam Temple',
    subtitle: 'Book a safe round-trip to Srisailam. Professional drivers experienced in ghat road driving. Direct booking.',
    imageTheme: 'from-amber-500 to-amber-700',
    active: true,
    discountPercent: 10,
    couponCode: 'SRISAILAM10'
  },
  {
    id: 'fb_outstation',
    festivalName: 'Outstation Travel Offer',
    title: 'Premium Outstation Rides',
    subtitle: 'Travel to Tirupati, Vijayawada, Bangalore and more with absolute peace of mind. Flat rates, no surge.',
    imageTheme: 'from-brand-dark to-slate-800',
    active: true,
    discountPercent: 15,
    couponCode: 'OUTSTATION15'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    customerName: 'Anil Kumar',
    rating: 5,
    comment: 'Booked an Innova Crysta for a family trip to Srisailam. The car was spotless, driver satya was very professional and knew the ghat roads perfectly. Highly recommended!',
    date: '2026-06-28',
    category: 'Premium SUV'
  },
  {
    id: 'r2',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Jolly Cabs is my default for airport drops now. Extremely punctual. They call 15 mins before time. No cancellation hassles like other apps.',
    date: '2026-07-02',
    category: 'Sedan'
  },
  {
    id: 'r3',
    customerName: 'Rajesh G.',
    rating: 4,
    comment: 'Excellent outstation service. Transparent billing. What they estimate is what you pay. Toll charges and driver bata are listed clearly upfront.',
    date: '2026-07-05',
    category: 'SUV'
  }
];

export interface MockRoute {
  id: string;
  name: string;
  pickup: string;
  drop: string;
  distanceKm: number;
  durationMin: number;
  tollCharges: number;
  polyline: string; // SVG representation for drawing
}

export const MOCK_ROUTES: MockRoute[] = [
  {
    id: 'route_airport_drop',
    name: 'Kukatpally to RGIA Airport Drop',
    pickup: 'Kukatpally, Hyderabad, Telangana',
    drop: 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad',
    distanceKm: 38,
    durationMin: 45,
    tollCharges: 0,
    polyline: 'M 10 10 L 40 40 L 70 80 L 100 120 L 120 150 L 140 200'
  },
  {
    id: 'route_airport_pickup',
    name: 'RGIA Airport Pickup to Gachibowli',
    pickup: 'Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad',
    drop: 'Gachibowli, Hyderabad, Telangana',
    distanceKm: 32,
    durationMin: 35,
    tollCharges: 0,
    polyline: 'M 140 200 L 120 170 L 90 140 L 80 100 L 60 70 L 50 50'
  },
  {
    id: 'route_srisailam',
    name: 'Hyderabad to Srisailam Mallikarjuna Temple',
    pickup: 'Kukatpally, Hyderabad, Telangana',
    drop: 'Srisailam Mallikarjuna Temple, Andhra Pradesh',
    distanceKm: 215,
    durationMin: 270,
    tollCharges: 150,
    polyline: 'M 20 20 L 50 60 L 80 120 L 100 180 L 110 240 L 130 320 L 150 400'
  },
  {
    id: 'route_secunderabad',
    name: 'Gachibowli to Secunderabad Railway Station',
    pickup: 'Gachibowli, Hyderabad, Telangana',
    drop: 'Secunderabad Railway Station, Hyderabad',
    distanceKm: 22,
    durationMin: 45,
    tollCharges: 0,
    polyline: 'M 50 50 L 70 60 L 90 80 L 110 70 L 130 90 L 160 110'
  },
  {
    id: 'route_tirupati',
    name: 'Hyderabad to Tirupati Balaji Temple',
    pickup: 'Secunderabad, Hyderabad, Telangana',
    drop: 'Tirupati Venkateswara Temple, Andhra Pradesh',
    distanceKm: 570,
    durationMin: 600,
    tollCharges: 520,
    polyline: 'M 30 30 L 60 90 L 90 160 L 120 240 L 140 340 L 160 450 L 180 570'
  },
  {
    id: 'route_vijayawada',
    name: 'Hyderabad to Vijayawada Center',
    pickup: 'Kukatpally, Hyderabad, Telangana',
    drop: 'Vijayawada, Andhra Pradesh',
    distanceKm: 275,
    durationMin: 300,
    tollCharges: 380,
    polyline: 'M 20 20 L 60 50 L 110 90 L 160 120 L 210 160 L 260 210 L 300 240'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'dr_1',
    name: 'Satyanarayana Raju',
    phone: '+91 98480 22338',
    rating: 4.9,
    vehicleId: 'veh_premium_suv',
    vehicleNumber: 'TS 08 FA 4422',
    status: 'active',
    currentLocation: { lat: 17.4855, lng: 78.3885 }
  },
  {
    id: 'dr_2',
    name: 'Mohammed Ali',
    phone: '+91 99080 12345',
    rating: 4.8,
    vehicleId: 'veh_sedan',
    vehicleNumber: 'TS 07 UE 8812',
    status: 'active',
    currentLocation: { lat: 17.4483, lng: 78.3741 }
  },
  {
    id: 'dr_3',
    name: 'K. Srinivas',
    phone: '+91 77020 98765',
    rating: 4.7,
    vehicleId: 'veh_suv',
    vehicleNumber: 'TS 09 UD 5519',
    status: 'active',
    currentLocation: { lat: 17.4932, lng: 78.3991 }
  }
];
