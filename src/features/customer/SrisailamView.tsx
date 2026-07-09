import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Compass, Eye, AlertCircle, Clock, Calendar, CheckCircle, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useBookingStore } from '../../store/bookingStore';
import { getAssetUrl } from '../../utils/assets';

export const SrisailamView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();
  const { setBookingField, setRoute, clearBookingForm } = useBookingStore();

  const handleBookPackage = (pkgType: string, carName: string) => {
    clearBookingForm();
    setBookingField('tripType', pkgType.includes('Overnight') ? 'outstation_round' : 'outstation_round');
    setBookingField('pickupAddress', 'Kukatpally, Hyderabad, Telangana');
    setBookingField('dropAddress', 'Srisailam Mallikarjuna Temple, Andhra Pradesh');
    
    // Auto fill route details for Hyderabad -> Srisailam (~215 KM)
    setRoute(
      'Kukatpally, Hyderabad, Telangana',
      'Srisailam Mallikarjuna Temple, Andhra Pradesh',
      215,
      270,
      150
    );

    if (carName.includes('Dzire')) {
      setBookingField('selectedVehicleId', 'veh_sedan');
    } else if (carName.includes('Ertiga')) {
      setBookingField('selectedVehicleId', 'veh_suv');
    } else {
      setBookingField('selectedVehicleId', 'veh_premium_suv');
    }
    
    navigate('/vehicles');
  };

  const packages = [
    {
      title: 'Day Trip — Sedan',
      car: 'Swift Dzire',
      seats: 4,
      price: 'On Request',
      features: ['Cab + Driver + Fuel', 'AC Vehicle', 'Same Day Return', 'Toll extra']
    },
    {
      title: 'Day Trip — MPV',
      car: 'Ertiga or KIA Carens',
      seats: 6,
      price: 'On Request',
      features: ['Cab + Driver + Fuel', 'AC Vehicle', 'Comfortable for Family', 'Toll extra']
    },
    {
      title: 'Overnight — Luxury',
      car: 'Innova Crysta',
      seats: 6,
      price: 'On Request',
      features: ['Cab + Driver + Fuel', '1 Night Driver Stay', 'Premium Luxury Ride', 'Toll extra']
    }
  ];

  const places = [
    'Mallikarjuna Jyotirlinga Temple',
    'Bramarambika Devi Temple',
    'Sakshi Ganapathi Temple',
    'Paladara Panchadara',
    'Hatakeshwar Shiva Temple',
    'Pathala Ganga',
    'Ropeway',
    'Dam View Point'
  ];

  const itinerary = [
    { time: '05:00', title: 'Departure from Hyderabad', desc: 'Pick up from your doorstep in Hyderabad or Secunderabad. Start early to avoid city traffic.' },
    { time: '10:00', title: 'Arrive Srisailam, Temple Darshan', desc: 'Reach the sacred temple hill and head for Mallikarjuna Jyotirlinga and Bhramaramba Devi darshan.' },
    { time: '13:00', title: 'Lunch Break at Srisailam', desc: 'Delectable vegetarian lunch break at the local temple dining halls or surrounding restaurants.' },
    { time: '14:30', title: 'Visit Dam & Akhanda Jyothi', desc: 'Explore the engineering marvel of Srisailam Dam and visit the nearby Akhanda Jyothi Mandir shrine.' },
    { time: '17:00', title: 'Departure from Srisailam', desc: 'Start the return journey back toward Hyderabad, crossing the forest checkpost before sunset.' },
    { time: '20:00', title: 'Arrive Hyderabad', desc: 'Reach Hyderabad and get dropped off directly back at your home or hotel. Tour ends.' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Top Header */}
      <div className="bg-brand-dark text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Srisailam Tour</h2>
        </div>
        <button 
          type="button"
          onClick={toggleDrawer}
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
        >
          <Menu className="w-4.5 h-4.5 text-[#FFC107]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-5">
        
        {/* Hero split layout */}
        <div className="relative rounded-3xl overflow-hidden shadow-md flex flex-col bg-brand-dark text-white">
          <div className="h-40 w-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent z-10" />
            <img 
              src={getAssetUrl('/vehicles/srisailam_temple.jpg')} 
              alt="Srisailam Temple" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex flex-col gap-2 relative z-10 -mt-8">
            <span className="px-2.5 py-0.5 bg-brand-gold/20 border border-brand-gold/30 rounded-full text-[9px] font-bold text-brand-gold uppercase tracking-wide inline-block w-fit">
              Temple Tour Package
            </span>
            <h3 className="text-base font-bold font-display leading-snug">
              One of South India's Most Sacred Destinations
            </h3>
            <p className="text-[11px] text-brand-textGray leading-relaxed">
              Srisailam is home to the Mallikarjuna Jyotirlinga, one of the twelve Jyotirlingas in India. Located approximately 230 km from Hyderabad, it is one of the most visited pilgrimage sites in Andhra Pradesh.
            </p>
            <p className="text-[11px] text-brand-textGray leading-relaxed">
              Our Srisailam cab packages include a dedicated driver who is familiar with the route, all tolls covered in the fare, and vehicles that are maintained for long-distance comfort.
            </p>
          </div>
        </div>

        {/* Packages Cards list */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-brand-textDark px-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-gold" />
            Srisailam Packages
          </h4>
          
          <div className="flex flex-col gap-4">
            {packages.map((pkg, pidx) => (
              <div key={pidx} className="bg-white p-5 rounded-3xl border border-brand-borderLight shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-brand-textDark">{pkg.title}</h5>
                    <p className="text-[9.5px] text-brand-textGray mt-0.5">
                      Car: {pkg.car} | Seats: {pkg.seats}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-gold font-mono">{pkg.price}</span>
                    <span className="text-[8px] text-brand-textGray block uppercase">All Inclusive</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-brand-textGray border-t border-b border-brand-bgLight py-3">
                  {pkg.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-success flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleBookPackage(pkg.title, pkg.car)}
                  className="w-full py-2.5 bg-brand-dark hover:bg-brand-gold hover:text-brand-dark text-white rounded-xl text-[10px] font-bold transition-all shadow-md"
                >
                  Book Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Places to Cover Section */}
        <div className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-3.5">
          <h4 className="text-xs font-bold text-brand-textDark flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-brand-gold" />
            Places to Cover (Sightseeing)
          </h4>
          <p className="text-[10px] text-brand-textGray leading-relaxed -mt-1.5">
            Must-visit shrines and scenic reservoirs included in your tour itinerary.
          </p>

          <div className="grid grid-cols-2 gap-2.5 mt-1.5">
            {places.map((place, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] text-brand-textDark font-semibold">
                <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span className="truncate">{place}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Itinerary Section */}
        <div className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-4">
          <h4 className="text-xs font-bold text-brand-textDark flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-gold" />
            Standard Day Trip Timeline
          </h4>

          <div className="flex flex-col gap-4 relative border-l-2 border-brand-gold/25 pl-4 ml-2 mt-1">
            {itinerary.map((item, idx) => (
              <div key={idx} className="relative text-left">
                {/* Timeline Dot */}
                <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-gold border-2 border-white shadow-sm" />
                
                <span className="text-[9px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded-md font-mono">
                  {item.time}
                </span>
                
                <h5 className="text-[10px] font-bold text-brand-textDark mt-1.5">{item.title}</h5>
                <p className="text-[9.5px] text-brand-textGray leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toll details / Forest checkpost notice */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[10px] text-amber-800 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Important Travel Note:</strong>
            The forest check post at Srisailam ghat road remains closed from 9:00 PM to 6:00 AM. Plan your travel timing accordingly.
          </div>
        </div>

        {/* CTA strip */}
        <div className="bg-gradient-to-r from-brand-dark to-slate-900 text-white rounded-3xl p-5 border border-white/5 shadow-md flex flex-col gap-3 text-center">
          <h4 className="text-xs font-bold font-display">Book Your Srisailam Package</h4>
          <div className="flex gap-2.5 mt-1.5">
            <a 
              href="tel:+917981232371" 
              className="flex-grow bg-brand-gold hover:bg-brand-lightGold text-brand-dark text-[10px] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-gold-glow"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
            <a 
              href="https://wa.me/917981232371?text=Hi%20Jolly%20Cabs%2C%20I%20want%20to%20book%20a%20Srisailam%20package"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow bg-brand-success hover:bg-brand-success/90 text-white text-[10px] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Book
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SrisailamView;
