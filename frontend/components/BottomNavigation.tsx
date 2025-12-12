import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export function BottomNavigation() {
  const location = useLocation();
  const { translations } = useLanguage();

  // Daftar path di mana BottomNavigation TIDAK boleh muncul
  const hiddenPaths = [
    '/',
    '/login',
    '/register',
    '/onboarding/1',
    '/onboarding/2',
    '/onboarding/3',
    '/register-needs',
    '/registration-success'
  ];

  if (hiddenPaths.includes(location.pathname.toLowerCase())) {
    return null;
  }

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/recommendation') return 'recommendation';
    // Menangani /categories dan /products sebagai tab yang sama (opsional, tapi bagus untuk UX)
    if (path === '/categories' || path.startsWith('/products') || path.startsWith('/product/')) return 'categories';
    if (path === '/profile' || path === '/edit-profile') return 'profile';

    return ''; // Return string kosong jika tidak cocok, jangan default ke dashboard agar tidak salah highlight
  };

  const currentTab = getActiveTab();

  const getLinkClass = (isActive: boolean) =>
    `flex flex-col items-center gap-1 min-w-[60px] transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-border-dark px-4 py-3 lg:hidden z-50 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">

        {/* Dashboard */}
        <Link to="/dashboard" className={getLinkClass(currentTab === 'dashboard')}>
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[10px] font-medium">{translations.common.homeDashboard}</span>
        </Link>

        {/* Rekomendasi */}
        <Link to="/recommendation" className={getLinkClass(currentTab === 'recommendation')}>
          <span className="material-symbols-outlined text-2xl">recommend</span>
          <span className="text-[10px] font-medium">{translations.common.recommendation}</span>
        </Link>

        {/* Paket (Categories) */}
        <Link to="/categories" className={getLinkClass(currentTab === 'categories')}>
          <span className="material-symbols-outlined text-2xl">inventory_2</span>
          <span className="text-[10px] font-medium">{translations.common.packages}</span>
        </Link>

        {/* Profile (TAMBAHAN PENTING) */}
        <Link to="/profile" className={getLinkClass(currentTab === 'profile')}>
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] font-medium">{translations.common.profile}</span>
        </Link>

      </div>
    </div>
  );
}
