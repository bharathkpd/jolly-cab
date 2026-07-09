import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Clock, MapPin, BadgePercent } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { getAssetUrl } from '../../utils/assets';

interface TravelPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  distanceKm: number;
  sedanPrice: number;
  mpvPrice: number;
  image: string;
  couponCode: string;
  places: string[];
  description: string;
}

const MOCK_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg_srisailam',
    name: 'Srisailam Darshan Package',
    tagline: 'Day Trip to Mallikarjuna Temple',
    duration: '1 Day Trip (05:00 AM - 08:00 PM)',
    distanceKm: 215,
    sedanPrice: 4999,
    mpvPrice: 6999,
    image: '/vehicles/srisailam_temple.jpg',
    couponCode: 'SRISAILAM10',
    places: ['Mallikarjuna Jyotirlinga', 'Sakshi Ganapathi', 'Patalganga Ropeway', 'Srisailam Dam'],
    description: 'Visit the holy shrine of Lord Shiva Mallikarjuna and Goddess Bhramaramba Devi in Nallamala hills. Standard day trip itinerary starting early morning from Hyderabad.'
  },
  {
    id: 'pkg_tirupati',
    name: 'Tirupati Pilgrimage Package',
    tagline: 'Premium Balaji Darshan Gateway',
    duration: '2 Days Round Trip',
    distanceKm: 570,
    sedanPrice: 12999,
    mpvPrice: 16999,
    image: '/vehicles/tirupati_temple.png',
    couponCode: 'OUTSTATION15',
    places: ['Tirumala Venkateswara Temple', 'Padmavathi Ammavari Temple', 'Sri Kalahasti Temple'],
    description: 'A comfortable pilgrimage tour to the richest temple in the world. Includes hassle-free highway driving with dedicated vehicle allocation.'
  },
  {
    id: 'pkg_vijayawada',
    name: 'Vijayawada Durga Darshini',
    tagline: 'Express Kanaka Durga Temple Tour',
    duration: '1 Day Trip (06:00 AM - 10:00 PM)',
    distanceKm: 275,
    sedanPrice: 5999,
    mpvPrice: 7999,
    image: '/vehicles/vijayawada_kanaka_durga.png',
    couponCode: 'WELCOME50',
    places: ['Kanaka Durga Temple', 'Prakasam Barrage', 'Undavalli Caves'],
    description: 'Perfect short trip to the banks of the Krishna River. Enjoy custom-tailored sightseeing in Vijayawada with immediate drop returning to Hyderabad.'
  },
  {
    id: 'pkg_warangal',
    name: 'Warangal Kakatiya Explorer',
    tagline: 'Kakatiya Heritage Gateways',
    duration: '1 Day Cultural Tour',
    distanceKm: 145,
    sedanPrice: 4499,
    mpvPrice: 5999,
    image: '/vehicles/warangal_thousand_pillar.png',
    couponCode: 'OUTSTATION15',
    places: ['Thousand Pillar Temple', 'Warangal Fort Gates', 'Bhadrakali Temple'],
    description: 'Discover the ancient architectural wonders of the Kakatiya Dynasty. Ideal for historical sightseers looking for comfortable day trips.'
  }
];

export const PackagesView: React.FC = () => {
  const navigate = useNavigate();
  const { setBookingField, setRoute } = useBookingStore();

  const handleBook = (pkg: TravelPackage) => {
    // Populate Zustand booking store
    setBookingField('tripType', 'outstation_round');
    setBookingField('pickupAddress', 'Hyderabad, Telangana, India');
    setBookingField('dropAddress', `${pkg.name.split(' ')[0]} Temple Destination`);
    setBookingField('couponCode', pkg.couponCode);
    
    // Simulate routing parameters
    setRoute(
      'Hyderabad, Telangana, India',
      `${pkg.name.split(' ')[0]} Temple Destination`,
      pkg.distanceKm,
      pkg.distanceKm * 1.5, // estimated duration
      pkg.id === 'pkg_srisailam' ? 150 : 250 // tolls
    );

    setBookingField('selectedVehicleId', 'veh_sedan');
    
    // Navigate straight to vehicle selection flow
    navigate('/vehicles');
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Travel Packages</h2>
        </div>
        <Compass className="w-5 h-5 text-brand-gold animate-spin-slow" />
      </div>

      {/* Body Card List */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        <div className="text-left mb-2 px-1">
          <span className="section-label">All-Inclusive Pilgrimage & Tours</span>
          <h3 className="text-lg font-bold text-brand-textDark mt-1">Special Packages</h3>
          <p className="text-xs text-brand-textGray mt-0.5 leading-relaxed">
            Book curated one-day and multi-day tours from Hyderabad starting at flat rates. Transparent charges including driver allowance and highway toll taxes.
          </p>
        </div>

        {MOCK_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-brand-borderLight shadow-sm hover:shadow-premium transition-all overflow-hidden flex flex-col"
          >
            {/* Package Cover Image */}
            <div className="h-44 w-full relative bg-brand-navy overflow-hidden">
              <img
                src={getAssetUrl(pkg.image)}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute left-4 bottom-4 text-white">
                <span className="bg-brand-gold text-brand-dark text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1">
                  Active Promo Code
                </span>
                <h4 className="text-sm font-bold font-display">{pkg.name}</h4>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col gap-4">
              <p className="text-[10px] text-brand-textGray leading-relaxed">
                {pkg.description}
              </p>

              {/* Specs Icons */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-brand-textDark bg-brand-bgLight p-3 rounded-2xl border border-brand-borderLight">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{pkg.distanceKm} KM Round Trip</span>
                </div>
              </div>

              {/* Sightseeing spot tags */}
              <div className="flex flex-wrap gap-1.5">
                {pkg.places.map((place, index) => (
                  <span
                    key={index}
                    className="text-[9px] font-semibold text-brand-textGray bg-brand-bgLight border border-brand-borderLight px-2 py-1 rounded-lg"
                  >
                    • {place}
                  </span>
                ))}
              </div>

              {/* Price list and button */}
              <div className="border-t border-brand-borderLight pt-4 flex items-center justify-between mt-1">
                <div>
                  <span className="text-[8px] text-brand-textGray uppercase block font-bold">Flat Rate From</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-black text-brand-textDark font-mono">₹{pkg.sedanPrice}</span>
                    <span className="text-[9px] text-brand-textGray font-semibold">(Sedan)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(pkg)}
                  className="bg-brand-gold text-brand-dark text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-1.5 hover:bg-brand-lightGold transition-all"
                >
                  <BadgePercent className="w-4.5 h-4.5" />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesView;
