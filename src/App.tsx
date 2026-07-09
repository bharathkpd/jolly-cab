import React, { useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, History, User2 } from 'lucide-react';

import { useAuthStore } from './store/authStore';

// Customer Screens
import { SplashScreen } from './features/customer/SplashScreen';
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
import { ServicesView } from './features/customer/ServicesView';
import { FleetView } from './features/customer/FleetView';
import { OutstationView } from './features/customer/OutstationView';
import { AirportView } from './features/customer/AirportView';
import { SrisailamView } from './features/customer/SrisailamView';
import { ContactView } from './features/customer/ContactView';

// Admin Screens
import { AdminLogin } from './features/admin/AdminLogin';
import { AdminDashboard } from './features/admin/AdminDashboard';

// Shared
import { AppDrawer } from './components/AppDrawer';

// ─── Route Guards ─────────────────────────────────────────────────────────────

const CustomerRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authReady } = useAuthStore();
  if (!authReady) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, authReady } = useAuthStore();
  if (!authReady) return null;
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// ─── Bottom Navigation Bar ────────────────────────────────────────────────────

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const mainRoutes = ['/', '/trips', '/profile'];
  const isMainRoute = mainRoutes.includes(location.pathname);

  if (!isAuthenticated || !isMainRoute) return null;

  const tabs = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/trips', icon: History, label: 'Rides' },
    { path: '/profile', icon: User2, label: 'Profile' }
  ];

  return (
    <div
      className="flex-shrink-0 bg-white border-t border-gray-100 flex items-center justify-around safe-area-bottom"
      style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-all ${
              active ? 'text-[#121212]' : 'text-gray-400'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-all ${
                active ? 'text-[#FFC107] stroke-[2.5]' : 'text-gray-400 stroke-2'
              }`}
            />
            <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#121212]' : 'text-gray-400'}`}>
              {label}
            </span>
            {active && (
              <div className="w-1 h-1 rounded-full bg-[#FFC107] mt-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── Auth Bootstrap ───────────────────────────────────────────────────────────
// Handles the initial routing decision after splash:
//   1. Onboarding (first launch only)
//   2. Auth (not logged in)
//   3. Home (logged in)

const AuthBootstrap = () => {
  const { isAuthenticated, authReady } = useAuthStore();
  const navigate = useNavigate();
  const [onboardingDone] = useState(() =>
    localStorage.getItem('jolly_cabs_onboarding') === 'true'
  );

  useEffect(() => {
    if (!authReady) return;
    if (!onboardingDone) {
      navigate('/onboarding', { replace: true });
    } else if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  }, [authReady, isAuthenticated, onboardingDone, navigate]);

  // Show spinner while Firebase resolves
  return (
    <div className="flex-1 flex items-center justify-center bg-[#FFC107]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#121212] flex items-center justify-center shadow-2xl">
          <span className="font-bold text-2xl text-[#FFC107]" style={{ fontFamily: 'Poppins, sans-serif' }}>JC</span>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-[#121212] border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────

const AppShell = () => {
  const { initializeAuth, authReady } = useAuthStore();
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(() => {
    // Splash only once per session (app launch)
    return sessionStorage.getItem('jolly_cabs_splash_shown') === 'true';
  });

  useEffect(() => {
    // Initialize Firebase auth state listener on app boot
    initializeAuth();
  }, [initializeAuth]);

  const handleSplashFinished = () => {
    sessionStorage.setItem('jolly_cabs_splash_shown', 'true');
    setSplashDone(true);
  };

  return (
    <div
      className="flex flex-col bg-[#F8F8F8]"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {!splashDone ? (
        <SplashScreen onFinished={handleSplashFinished} />
      ) : (
        <>
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <Routes>
              {/* Boot — resolves where to go after splash */}
              <Route path="/boot" element={<AuthBootstrap />} />

              {/* Onboarding — first launch only */}
              <Route
                path="/onboarding"
                element={
                  <Onboarding
                    onComplete={() => {
                      localStorage.setItem('jolly_cabs_onboarding', 'true');
                      // After onboarding, go to auth
                      navigate('/auth', { replace: true });
                    }}
                  />
                }
              />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />

              {/* Customer Home — root */}
              <Route path="/" element={<CustomerRouteGuard><Home /></CustomerRouteGuard>} />

              {/* Booking Flow */}
              <Route path="/booking" element={<CustomerRouteGuard><BookingFlow /></CustomerRouteGuard>} />
              <Route path="/vehicles" element={<CustomerRouteGuard><VehicleSelection /></CustomerRouteGuard>} />
              <Route path="/payment" element={<CustomerRouteGuard><Payment /></CustomerRouteGuard>} />
              <Route path="/success" element={<CustomerRouteGuard><Success /></CustomerRouteGuard>} />
              <Route path="/track/:bookingId" element={<CustomerRouteGuard><Tracking /></CustomerRouteGuard>} />

              {/* Main Tabs */}
              <Route path="/trips" element={<CustomerRouteGuard><Trips /></CustomerRouteGuard>} />
              <Route path="/profile" element={<CustomerRouteGuard><Profile /></CustomerRouteGuard>} />

              {/* Secondary Screens */}
              <Route path="/offers" element={<CustomerRouteGuard><OffersView /></CustomerRouteGuard>} />
              <Route path="/notifications" element={<CustomerRouteGuard><NotificationsView /></CustomerRouteGuard>} />
              <Route path="/packages" element={<CustomerRouteGuard><PackagesView /></CustomerRouteGuard>} />
              <Route path="/services" element={<CustomerRouteGuard><ServicesView /></CustomerRouteGuard>} />
              <Route path="/fleet" element={<CustomerRouteGuard><FleetView /></CustomerRouteGuard>} />
              <Route path="/outstation" element={<CustomerRouteGuard><OutstationView /></CustomerRouteGuard>} />
              <Route path="/airport" element={<CustomerRouteGuard><AirportView /></CustomerRouteGuard>} />
              <Route path="/srisailam" element={<CustomerRouteGuard><SrisailamView /></CustomerRouteGuard>} />
              <Route path="/contact" element={<CustomerRouteGuard><ContactView /></CustomerRouteGuard>} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRouteGuard><AdminDashboard /></AdminRouteGuard>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/boot" replace />} />
            </Routes>
          </div>

          {/* App Drawer (slide-in menu) */}
          <AppDrawer />

          {/* Bottom Nav — only on main tabs */}
          <BottomNavBar />
        </>
      )}
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export const App = () => {
  return (
    <MemoryRouter initialEntries={['/boot']} initialIndex={0}>
      <AppShell />
    </MemoryRouter>
  );
};

export default App;
