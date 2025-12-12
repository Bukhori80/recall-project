
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Landing from './pages/Landing';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/AnimatedPage';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import OnboardingStep3 from './pages/OnboardingStep3';
import Register from './pages/Register';
import RegisterNeeds from './pages/RegisterNeeds';
import RegisterAccount from './pages/RegisterAccount';
import RegistrationSuccess from './pages/RegistrationSuccess';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Recommendation from './pages/Recommendation';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Chat from './pages/Chat';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';


import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Wrapper to conditionally render Layout
const LayoutWrapper = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Paths that do not have the main dashboard header
  const noLayoutPaths = [
    '/',
    '/login',
    '/onboarding/1',
    '/onboarding/2',
    '/onboarding/3',
    '/register',
    '/register-needs',
    '/registration-success',
    '/admin/login',
    '/admin/dashboard',
    '/admin/customers',
    '/admin/products',
    '/admin/analytics'
  ];
  console.log("url: ", location);
  const showLayout = !noLayoutPaths.includes(location.pathname);

  if (showLayout) {
    return <Layout>{children}</Layout>;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <LayoutWrapper>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/onboarding/1" element={<AnimatedPage><OnboardingStep1 /></AnimatedPage>} />
          <Route path="/onboarding/2" element={<AnimatedPage><OnboardingStep2 /></AnimatedPage>} />
          <Route path="/onboarding/3" element={<AnimatedPage><OnboardingStep3 /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />

          <Route path="/register-needs" element={<AnimatedPage><RegisterNeeds /></AnimatedPage>} />

          <Route path="/register-account" element={<AnimatedPage><RegisterAccount /></AnimatedPage>} />

          <Route path="/registration-success" element={<AnimatedPage><RegistrationSuccess /></AnimatedPage>} />

          <Route path="/dashboard" element={
            <AnimatedPage>
              <ProtectedRoute requiredRole="customer">
                <Dashboard />
              </ProtectedRoute>
            </AnimatedPage>} />
          <Route path="/categories" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <Categories />
            </ProtectedRoute>
          </AnimatedPage>} />
          <Route path="/products" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <ProductList />
            </ProtectedRoute>
          </AnimatedPage>} />
          <Route path="/product/:id" element={
            <AnimatedPage>
              <ProtectedRoute requiredRole="customer">
                <ProductDetail />
              </ProtectedRoute>
            </AnimatedPage>} />
          <Route path="/recommendation" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <Recommendation />
            </ProtectedRoute>
          </AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <Profile />
            </ProtectedRoute>
          </AnimatedPage>} />
          <Route path="/edit-profile" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <EditProfile />
            </ProtectedRoute>
          </AnimatedPage>} />
          <Route path="/chat" element={<AnimatedPage>
            <ProtectedRoute requiredRole="customer">
              <Chat />
            </ProtectedRoute>
          </AnimatedPage>} />

          <Route path="/admin/login" element={
            <AnimatedPage>
              <AdminLogin />
            </AnimatedPage>} />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* AdminLayout harus memiliki <Outlet /> di dalamnya */}
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </LayoutWrapper>
  );
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Check local storage or system preference for theme
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
