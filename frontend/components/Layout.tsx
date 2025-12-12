import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { BottomNavigation } from './BottomNavigation';
import { useLanguage } from '../contexts/LanguageContext';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook untuk redirect

  const [isProfileOpen, setIsProfileOpen] = useState(false); // State untuk dropdown
  const { translations } = useLanguage();

  // Ref untuk mendeteksi klik di luar dropdown (agar menutup otomatis)
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {


    // Event listener untuk menutup dropdown jika klik di luar
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleLogout = () => {
    // 1. Hapus data sesi
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('customer_id');
    localStorage.removeItem('username');

    // 2. Redirect ke login
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-bold' : 'text-slate-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Skip to Content Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-4 z-[100] rounded-lg">
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-border-dark transition-colors duration-300">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="text-primary" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{translations.common.recall}</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            <Link to="/dashboard" className={`text-sm ${isActive('/dashboard')}`}>{translations.common.homeDashboard}</Link>
            <Link to="/recommendation" className={`text-sm ${isActive('/recommendation')}`}>{translations.common.recommendation}</Link>
            <Link to="/categories" className={`text-sm ${isActive('/categories')}`}>{translations.common.packages}</Link>
          </nav>

          <LanguageSwitcher />

          <ThemeSwitcher />

          {/* --- DROPDOWN PROFILE --- */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="focus:outline-none flex items-center"
              aria-label="User Profile Menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDitfF6HI64zEL-dZoCBG50HbkgEn75X_RUqZFB39RMOtOy2wCgb6MkKT0gLn9duQrdKCY0qDRpWCrFh9cdCaF1MZOG3gPVpZk4n7MLYcZpGbyPtq3UKjBUoRU0RDpwSata0BbkxNHJn7UtVwZMta6OrVK6wfXQvGBvYBX_URMm6rjJRyXDRHXqMpdXO_jsK-hOKnHCNUosYXmE74VVD9tXl293FaxiSxAoJLj9M9S7shdlIVi0hTgfyQsqsJh3mjqgWpURvOPkWxo")' }}
                role="img"
                aria-label="Profile Picture"
              ></div>
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-slate-100 dark:border-border-dark py-2 z-50 animate-fade-down origin-top-right"
                role="menu"
              >

                {/* Menu: Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-xl text-slate-400" aria-hidden="true">person</span>
                  {translations.common.profile}
                </Link>

                <div className="h-px bg-slate-100 dark:bg-gray-700 my-1 mx-2" role="separator"></div>

                {/* Menu: Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">logout</span>
                  {translations.common.logout}
                </button>
              </div>
            )}
          </div>
          {/* --- END DROPDOWN --- */}

        </div>
      </header>
      <main id="main-content" className="flex-1 flex flex-col pb-20 lg:pb-0">
        {children}
      </main>

      <BottomNavigation />

      {/* Floating Chat Button */}
      <Link
        to="/chat"
        className="fixed bottom-20 right-6 lg:bottom-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Open Chat Assistant"
      >
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">smart_toy</span>
      </Link>
    </div>
  );
};

export default Layout;