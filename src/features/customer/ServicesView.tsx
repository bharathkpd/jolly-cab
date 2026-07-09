import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Plane, MapPin, Clock, Heart, Building2, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useBookingStore } from '../../store/bookingStore';
import { TripType } from '../../types';

export const ServicesView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();
  const { setBookingField, clearBookingForm } = useBookingStore();

  const services = [
    {
      id: 'airport',
      title: 'Airport Pick & Drop',
      desc: 'Affordable flat-rate transfers to and from Rajiv Gandhi International Airport (RGIA), Shamshabad. Flight delay tracking and complimentary waiting times included.',
      icon: Plane,
      color: 'text-brand-gold bg-brand-gold/10 border border-brand-gold/10',
      action: () => {
        clearBookingForm();
        setBookingField('tripType', 'airport_drop');
        navigate('/booking');
      },
      btnLabel: 'Book Airport Taxi'
    },
    {
      id: 'outstation',
      title: 'Outstation Cabs',
      desc: 'Comfortable intercity travel from Hyderabad to Srisailam, Tirupati, Vijayawada, Bangalore, and more. Select one-way drops or round-trip packages with expert highway drivers.',
      icon: MapPin,
      color: 'text-brand-gold bg-brand-gold/10 border border-brand-gold/10',
      action: () => {
        clearBookingForm();
        setBookingField('tripType', 'outstation_round');
        navigate('/booking');
      },
      btnLabel: 'Book Outstation Cab'
    },
    {
      id: 'rental',
      title: 'Local Daily Rentals',
      desc: 'Book a cab by the hour with standard packages (8 Hours/80 KM or 12 Hours/120 KM). Ideal for city sightseeing, local shopping, business meetings, and multi-stop travel.',
      icon: Clock,
      color: 'text-brand-gold bg-brand-gold/10 border border-brand-gold/10',
      action: () => {
        clearBookingForm();
        setBookingField('tripType', 'rental');
        navigate('/booking');
      },
      btnLabel: 'Book Daily Rental'
    },
    {
      id: 'wedding',
      title: 'Wedding Car Rentals',
      desc: 'Make your special day memorable with premium wedding cars. We offer decorated sedans, SUVs, and luxury coaches for the couple and guest logistics in Hyderabad.',
      icon: Heart,
      color: 'text-brand-gold bg-brand-gold/10 border border-brand-gold/10',
      action: () => {
        window.open('https://wa.me/917981232371?text=Hi%20Jolly%20Cabs%2C%20I%20want%20to%20inquire%20about%20wedding%20car%20rentals', '_blank');
      },
      btnLabel: 'Get Wedding Quote'
    },
    {
      id: 'corporate',
      title: 'Corporate Car Rentals',
      desc: 'Tailored corporate logistics, daily employee transport, and executive pick-ups. Transparent monthly billing, dedicated account managers, and verified drivers.',
      icon: Building2,
      color: 'text-brand-gold bg-brand-gold/10 border border-brand-gold/10',
      action: () => {
        window.open('https://wa.me/917981232371?text=Hi%20Jolly%20Cabs%2C%20I%20want%20to%20inquire%20about%20corporate%20car%20rentals', '_blank');
      },
      btnLabel: 'Contact Corporate Desk'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Top Header */}
      <div className="bg-brand-dark text-white px-5 py-4 flex items-center justify-between shadow-md flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Our Services</h2>
        </div>
        <button 
          type="button"
          onClick={toggleDrawer}
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
        >
          <Menu className="w-4.5 h-4.5 text-[#FFC107]" />
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
        <div className="px-1 text-center max-w-md mx-auto mb-2">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Premium Rides</span>
          <h3 className="text-base font-bold text-brand-textDark mt-1">What Jolly Cabs Offers</h3>
          <p className="text-[11px] text-brand-textGray mt-1 leading-relaxed">
            Professional passenger transportation services in Hyderabad. Safe, reliable, and transparently priced.
          </p>
        </div>

        {services.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white rounded-3xl p-5 border border-brand-borderLight shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-brand-textDark">{item.title}</h4>
              </div>
              
              <p className="text-[11px] text-brand-textGray leading-relaxed">
                {item.desc}
              </p>

              <button
                onClick={item.action}
                className="w-full bg-brand-bgLight hover:bg-brand-gold hover:text-brand-dark text-[10px] font-bold py-3 rounded-xl mt-1.5 transition-all flex items-center justify-center gap-1.5"
              >
                {item.btnLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Support Card */}
        <div className="bg-brand-dark text-white rounded-3xl p-5 border border-white/5 shadow-md flex flex-col gap-4 text-center mt-2 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl" />
          <div>
            <h4 className="text-xs font-bold text-white">Need Custom Cab Bookings?</h4>
            <p className="text-[10px] text-brand-textGray mt-1">Contact our dispatcher directly for custom tours or wedding hire.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <a
              href="tel:+917981232371"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-gold text-brand-dark rounded-xl text-[10px] font-bold shadow-gold-glow"
            >
              <Phone className="w-3.5 h-3.5" /> Call Cabs
            </a>
            <a
              href="https://wa.me/917981232371?text=Hi%20Jolly%20Cabs%2C%20I%20want%20to%20book%20a%20cab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-success/15 border border-brand-success/30 text-brand-success rounded-xl text-[10px] font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
