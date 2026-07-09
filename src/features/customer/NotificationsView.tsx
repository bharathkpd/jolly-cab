import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Tag, ShieldCheck, HelpCircle } from 'lucide-react';

interface AlertNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'booking' | 'promo' | 'safety' | 'general';
}

const MOCK_NOTIFICATIONS: AlertNotification[] = [
  {
    id: 'n_1',
    title: 'Ride Confirmed Successfully!',
    body: 'Your booking BK_SRI9284 to Srisailam is confirmed. A driver will be assigned 2 hours before pickup.',
    time: '2 hours ago',
    type: 'booking'
  },
  {
    id: 'n_2',
    title: 'New Coupon Available!',
    body: 'Use code WELCOME50 on your first local booking to claim flat ₹50 cash discount immediately.',
    time: '5 hours ago',
    type: 'promo'
  },
  {
    id: 'n_3',
    title: 'Verified Drivers & COVID Safety',
    body: 'Jolly Cabs complies with maximum safety rules. Daily temperature check for drivers and sanitizer in all vehicles.',
    time: '1 day ago',
    type: 'safety'
  },
  {
    id: 'n_4',
    title: 'Srisailam Sightseeing Update',
    body: 'Ghat roads in Srisailam are closed between 21:00 PM and 06:00 AM. Plan your departures accordingly.',
    time: '2 days ago',
    type: 'general'
  }
];

export const NotificationsView: React.FC = () => {
  const navigate = useNavigate();

  const getIcon = (type: AlertNotification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-brand-gold" />;
      case 'promo':
        return <Tag className="w-5 h-5 text-amber-500" />;
      case 'safety':
        return <ShieldCheck className="w-5 h-5 text-brand-success" />;
      default:
        return <HelpCircle className="w-5 h-5 text-brand-info" />;
    }
  };

  const getIconBg = (type: AlertNotification['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-brand-gold/10 border-brand-gold/20';
      case 'promo':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'safety':
        return 'bg-brand-success/10 border-brand-success/20';
      default:
        return 'bg-brand-info/10 border-brand-info/20';
    }
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
          <h2 className="text-sm font-display font-bold">Inbox Notifications</h2>
        </div>
        <Bell className="w-5 h-5 text-brand-gold" />
      </div>

      {/* List */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
        <div className="text-left mb-2 px-1">
          <span className="section-label">User Alerts</span>
          <h3 className="text-lg font-bold text-brand-textDark mt-1">Recent Updates</h3>
        </div>

        {MOCK_NOTIFICATIONS.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-3xl border border-brand-borderLight shadow-sm flex items-start gap-4 hover:border-brand-gold/15 transition-colors"
          >
            <div className={`w-10 h-10 rounded-2xl ${getIconBg(item.type)} border flex items-center justify-center flex-shrink-0`}>
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <h4 className="text-xs font-bold text-brand-textDark truncate">
                  {item.title}
                </h4>
                <span className="text-[8px] text-brand-textGray whitespace-nowrap font-medium font-mono">
                  {item.time}
                </span>
              </div>
              <p className="text-[10px] text-brand-textGray mt-1.5 leading-normal">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsView;
