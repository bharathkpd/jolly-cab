import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, Mail, Clock, Send, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const FAQ_DATA = [
  { q: 'How are fares calculated?', a: 'Fares are calculated based on distance (per KM rate), vehicle type, trip category (local/outstation/airport), driver bata allowance, toll charges, and applicable GST. You can see a detailed breakdown before confirming your booking.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a booking before driver pickup. Cancellations made within 5 minutes of booking are free. After that, a small cancellation fee may apply depending on how far the driver has travelled.' },
  { q: 'What payment methods are accepted?', a: 'We accept Cash, UPI (PhonePe, GPay, Paytm), Credit/Debit Cards, Net Banking, and Jolly Wallet. Razorpay integration will be enabled for online payments soon.' },
  { q: 'How do outstation packages work?', a: 'Outstation packages include a minimum per-day KM allowance (typically 250-300 KM/day). Extra KM is charged at the vehicle-specific per-KM rate. Driver bata (daily allowance) and toll charges are added separately.' },
  { q: 'Is there a refund policy?', a: 'Yes, refunds for prepaid bookings are processed within 5-7 business days. For wallet payments, the refund is instant. Contact our support team for assistance with refund requests.' },
  { q: 'Can I add stops during my ride?', a: 'Yes, you can add up to 3 intermediate stops when booking. Additional stops can be requested to the driver during the ride. Waiting charges may apply at each stop.' },
];

export const ContactView: React.FC = () => {
  const navigate = useNavigate();
  const { toggleDrawer } = useUiStore();

  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      alert('Thank you for contacting Jolly Cabs! Our booking manager will call you shortly.');
      setForm({ name: '', phone: '', message: '' });
      setSubmitted(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bgLight min-h-0">
      {/* Top Header */}
      <div className="bg-brand-dark text-white p-5 rounded-b-[32px] flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h2 className="text-sm font-display font-bold">Help & Support</h2>
        </div>
        <HelpCircle className="w-5 h-5 text-brand-gold" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
        
        {/* Quick Contact Shortcuts */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href="https://wa.me/917981232371"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-2xl border border-brand-borderLight shadow-sm flex flex-col items-center gap-2 hover:border-brand-success/30 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-brand-textDark">WhatsApp</span>
          </a>
          <a
            href="tel:+917981232371"
            className="bg-white p-4 rounded-2xl border border-brand-borderLight shadow-sm flex flex-col items-center gap-2 hover:border-brand-gold/30 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-brand-textDark">Call Us</span>
          </a>
          <a
            href="mailto:support@jollycabs.in"
            className="bg-white p-4 rounded-2xl border border-brand-borderLight shadow-sm flex flex-col items-center gap-2 hover:border-brand-info/30 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-info/10 border border-brand-info/20 flex items-center justify-center text-brand-info">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-brand-textDark">Email</span>
          </a>
        </div>

        {/* Working Hours */}
        <div className="bg-white p-4 rounded-2xl border border-brand-borderLight shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-textDark">24/7 Support Available</h4>
            <p className="text-[9px] text-brand-textGray mt-0.5">Our support team is available round the clock for booking inquiries, cancellations, and safety concerns.</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold tracking-tight px-1">Frequently Asked Questions</h4>
          
          {FAQ_DATA.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-borderLight shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-bgLight/50 transition-colors"
              >
                <span className="text-xs font-bold text-brand-textDark pr-4">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-gold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-textGray flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-[10px] text-brand-textGray leading-relaxed border-t border-brand-bgLight pt-3">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl border border-brand-borderLight shadow-sm p-5 flex flex-col gap-4">
          <h4 className="text-sm font-bold tracking-tight">Send us a Message</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight"
            />
            <textarea
              placeholder="How can we help you?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-brand-borderLight focus:border-brand-gold rounded-xl text-xs font-semibold outline-none bg-brand-bgLight resize-none"
            />
            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-40"
            >
              {submitted ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 text-brand-gold" />
                  Submit Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
