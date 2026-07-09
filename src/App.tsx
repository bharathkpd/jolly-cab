import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home as HomeIcon, History, User2 } from 'lucide-react';

import { useAuthStore } from './store/authStore';
import { MobileContainer } from './components/MobileContainer';

// Customers Features
import { Onboarding } from './features/customer/Onboarding';
import { Auth } from './features/customer/Auth';
import { Home } from './features/customer/Home';
import { BookingFlow } from './features/customer/BookingFlow';
import { VehicleSelection } from './features/customer/VehicleSelection';
import { Payment } from './features/customer/Payment';
import { Success } from './features/customer/Success';
import { Tracking } from './features/customer/Tracking';
import { Trips } from './features/customer/Trips';
import { Profile } from './features/customer/Profile';
import { OffersView } from './features/customer/OffersView';
import { NotificationsView } from './features/customer/NotificationsView';
import { PackagesView } from './features/customer/PackagesView';

// Website Pages Implemented Inside App
import { ServicesView } from './features/customer/ServicesView';
import { FleetView } from './features/customer/FleetView';
import { OutstationView } from './features/customer/OutstationView';
import { AirportView } from './features/customer/AirportView';
import { SrisailamView } from './features/customer/SrisailamView';
import { ContactView } from './features/customer/ContactView';

// App Drawer
import { AppDrawer } from './components/AppDrawer';

// Splash Screen
import { SplashScreen } from './features/customer/SplashScreen';

// Admin Features
import { AdminLogin } from './features/admin/AdminLogin';
import { AdminDashboard } from './features/admin/AdminDashboard';

// Root controller to check onboarding, auth, and home state
const CustomerAppController = () => {
  const { isAuthenticated } = useAuthStore();
  const [completedOnboarding, setCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('jolly_cabs_onboarding') === 'true';
  });

  if (!completedOnboarding) {
    return (
      <Onboarding 
        onComplete={() => {
          localStorage.setItem('jolly_cabs_onboarding', 'true');
          setCompletedOnboarding(true);
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <Home />;
};

// Route guards
const CustomerRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuthStore();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// Bottom Navigation Bar for customer app pages
const BottomNavBar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  // Hide on onboarding, login, success, track pages, or admin views
  const hideOnPaths = ['/success', '/admin', '/track'];
  const shouldHide = 
    hideOnPaths.some(p => location.pathname.startsWith(p)) ||
    !isAuthenticated ||
    localStorage.getItem('jolly_cabs_onboarding') !== 'true';

  if (shouldHide) return null;

  return (
    <div className="h-16 bg-white border-t border-brand-borderLight flex items-center justify-around z-40 shadow-premium select-none flex-shrink-0 relative">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
          location.pathname === '/' ? 'text-brand-dark scale-105' : 'text-brand-textGray hover:text-brand-textDark'
        }`}
      >
        <HomeIcon className={`w-5 h-5 ${location.pathname === '/' ? 'text-brand-gold stroke-[2.5]' : 'text-brand-textGray'}`} />
        <span>Home</span>
      </Link>
      
      <Link 
        to="/trips" 
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
          location.pathname === '/trips' ? 'text-brand-dark scale-105' : 'text-brand-textGray hover:text-brand-textDark'
        }`}
      >
        <History className={`w-5 h-5 ${location.pathname === '/trips' ? 'text-brand-gold stroke-[2.5]' : 'text-brand-textGray'}`} />
        <span>Rides</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
          location.pathname === '/profile' ? 'text-brand-dark scale-105' : 'text-brand-textGray hover:text-brand-textDark'
        }`}
      >
        <User2 className={`w-5 h-5 ${location.pathname === '/profile' ? 'text-brand-gold stroke-[2.5]' : 'text-brand-textGray'}`} />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <MobileContainer>
        <div className="flex-1 flex flex-col relative h-full overflow-hidden min-h-0">
          {showSplash ? (
            <SplashScreen onFinished={() => setShowSplash(false)} />
          ) : (
            <>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerAppController />} />
                <Route path="/booking" element={<CustomerRouteGuard><BookingFlow /></CustomerRouteGuard>} />
                <Route path="/vehicles" element={<CustomerRouteGuard><VehicleSelection /></CustomerRouteGuard>} />
                <Route path="/payment" element={<CustomerRouteGuard><Payment /></CustomerRouteGuard>} />
                <Route path="/success" element={<CustomerRouteGuard><Success /></CustomerRouteGuard>} />
                <Route path="/track/:bookingId" element={<CustomerRouteGuard><Tracking /></CustomerRouteGuard>} />
                <Route path="/trips" element={<CustomerRouteGuard><Trips /></CustomerRouteGuard>} />
                <Route path="/profile" element={<CustomerRouteGuard><Profile /></CustomerRouteGuard>} />
                <Route path="/offers" element={<CustomerRouteGuard><OffersView /></CustomerRouteGuard>} />
                <Route path="/notifications" element={<CustomerRouteGuard><NotificationsView /></CustomerRouteGuard>} />
                <Route path="/packages" element={<CustomerRouteGuard><PackagesView /></CustomerRouteGuard>} />

                {/* Website Subpages */}
                <Route path="/services" element={<CustomerRouteGuard><ServicesView /></CustomerRouteGuard>} />
                <Route path="/fleet" element={<CustomerRouteGuard><FleetView /></CustomerRouteGuard>} />
                <Route path="/outstation" element={<CustomerRouteGuard><OutstationView /></CustomerRouteGuard>} />
                <Route path="/airport" element={<CustomerRouteGuard><AirportView /></CustomerRouteGuard>} />
                <Route path="/srisailam" element={<CustomerRouteGuard><SrisailamView /></CustomerRouteGuard>} />
                <Route path="/contact" element={<CustomerRouteGuard><ContactView /></CustomerRouteGuard>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRouteGuard><AdminDashboard /></AdminRouteGuard>} />
                
                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <AppDrawer />
              <BottomNavBar />
            </>
          )}
        </div>
      </MobileContainer>
    </Router>
  );
};

export default App;
