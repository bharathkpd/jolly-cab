import { Vehicle, TripType, FareBreakdown } from '../types';

interface FareCalculationInput {
  tripType: TripType;
  distanceKm: number;
  durationMin: number;
  days: number;
  vehicle: Vehicle;
  hasNightDriving: boolean;
  waitingMinutes: number;
  tollCharges: number;
  couponDiscountPercent?: number;
  couponMaxDiscount?: number;
  marginPercent?: number; // Configurable margin for approximate price range (default 5)
}

export interface FareCalculationResult {
  breakdown: FareBreakdown;
  estMin: number;
  estMax: number;
}

export const calculateFare = (input: FareCalculationInput): FareCalculationResult => {
  const {
    tripType,
    distanceKm,
    durationMin,
    days: rawDays,
    vehicle,
    hasNightDriving,
    waitingMinutes,
    tollCharges,
    couponDiscountPercent = 0,
    couponMaxDiscount = 99999,
    marginPercent = 5 // Default estimate margin ±5%
  } = input;

  const pricing = vehicle.pricing;
  const days = Math.max(1, rawDays);

  let base = 0;
  let extraKm = 0;
  let bata = 0;
  let convenience = pricing.convenienceFee;

  // 1. Core Fare Calculation by Trip Type
  switch (tripType) {
    case 'rental': {
      // Per Day Rental Logic: 300 KM minimum billing per day
      const includedKm = days * 300;
      const effectiveDistance = Math.max(includedKm, distanceKm);
      
      // Minimum fare is based on 300km per day * pricePerKm
      base = includedKm * pricing.pricePerKm;
      
      // Extra KM if actual distance exceeds included KM
      if (distanceKm > includedKm) {
        const extraDistance = distanceKm - includedKm;
        extraKm = extraDistance * pricing.pricePerKm;
      }
      
      // Driver Bata is automatic per day
      bata = days * pricing.driverBata;
      break;
    }
    
    case 'outstation_round': {
      // Outstation Round Trip: usually 250km minimum per day
      const minOutstationKmPerDay = 250;
      const includedKm = days * minOutstationKmPerDay;
      const effectiveDistance = Math.max(includedKm, distanceKm);
      
      base = includedKm * pricing.pricePerKm;
      
      if (distanceKm > includedKm) {
        extraKm = (distanceKm - includedKm) * pricing.pricePerKm;
      }
      
      bata = days * pricing.driverBata;
      break;
    }
    
    case 'outstation_oneway': {
      // Outstation Oneway: direct distance billing, but driver bata is charged if multiday
      base = Math.max(pricing.minDistance, distanceKm) * pricing.pricePerKm;
      if (days > 1) {
        bata = (days - 1) * pricing.driverBata;
      }
      break;
    }
    
    case 'local':
    case 'airport_pickup':
    case 'airport_drop':
    default: {
      // Standard local/airport trips: base fare covers minDistance, then extra per KM
      base = pricing.baseFare;
      const chargeableDistance = Math.max(0, distanceKm - pricing.minDistance);
      extraKm = chargeableDistance * pricing.pricePerKm;
      
      // If trip takes longer, waiting charges can apply (e.g. waiting in traffic)
      if (waitingMinutes > 0) {
        extraKm += waitingMinutes * pricing.waitingCharges;
      }
      
      // No driver bata for local, unless overnight nightCharges apply
      break;
    }
  }

  // 2. Night Charges
  let nightChargeCost = 0;
  if (hasNightDriving) {
    nightChargeCost = pricing.nightCharges * (tripType === 'rental' || tripType.startsWith('outstation') ? days : 1);
  }
  
  // Add night charges into base fare
  base += nightChargeCost;

  // 3. Subtotal before taxes & discounts
  const subtotal = base + extraKm + bata + tollCharges + convenience;

  // 4. Coupon Discount
  let discount = 0;
  if (couponDiscountPercent > 0) {
    discount = Math.min(couponMaxDiscount, (subtotal * couponDiscountPercent) / 100);
  }

  // 5. Taxes (GST)
  // GST is 5% on passenger transport services in India
  const taxableAmount = subtotal - discount;
  const gst = Math.round(taxableAmount * (pricing.gstPercent / 100));

  // 6. Grand Total
  const total = Math.round(taxableAmount + gst);

  // 7. Advance Payment Logic
  // Customers usually pay a 20% advance for outstation/rentals to confirm booking, remainder to driver
  const requiresAdvance = tripType === 'rental' || tripType.startsWith('outstation');
  const advancePercent = requiresAdvance ? 20 : 0;
  const advancePaid = advancePercent > 0 ? Math.round((total * advancePercent) / 100) : 0;
  const remaining = total - advancePaid;

  const breakdown: FareBreakdown = {
    base: Math.round(base),
    extraKm: Math.round(extraKm),
    bata: Math.round(bata),
    tolls: Math.round(tollCharges),
    convenience: Math.round(convenience),
    gst,
    discount: Math.round(discount),
    total,
    advancePaid,
    remaining
  };

  // 8. Approximate Price Display (Estimated Fare Range: e.g. ₹4300 - ₹5000)
  // We apply the margin percentage (e.g. ±5%) to the total fare
  const marginFactor = marginPercent / 100;
  const estMin = Math.round(total * (1 - marginFactor) / 50) * 50; // Round to nearest 50
  const estMax = Math.round(total * (1 + marginFactor) / 50) * 50;

  return {
    breakdown,
    estMin,
    estMax
  };
};
