
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { ModernSwal } from '../utils/ModernSwal';

const Login: React.FC = () => {

  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL;
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    // Validasi input kosong
    if (!payload.username || !payload.password) {
      ModernSwal.warning(translations.validation.inputRequiredTitle, translations.validation.inputRequiredDesc);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(backendUrl + '/api/v1/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: payload.username,
          password: payload.password
        })
      });

      const data = await response.json();
      console.log('Login response data:', data);

      // Validasi error dari backend
      if (!response.ok) {
        ModernSwal.error(translations.validation.loginFailedTitle, data.message || 'Login failed');
        return;
      }

      // Validasi token (HARUS ada)
      if (!data.token) {
        ModernSwal.error(translations.validation.loginFailedTitle, translations.validation.tokenInvalid);
        return;
      }

      // Simpan dan redirect
      localStorage.setItem('accessToken', data.token);
      if (data) {
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('role', 'customer'); // <--- Tambahkan ini
        localStorage.setItem('customer_id', data.data.customer_id);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('churn_risk', data.data.churn_risk); // Store the actual churn risk
      }

      await ModernSwal.success(translations.validation.loginSuccessTitle, translations.validation.loginSuccessDesc);
      navigate('/dashboard');

    } catch (error) {
      console.error('Network error:', error);
      ModernSwal.error(translations.validation.loginNetworkErrorTitle, translations.validation.loginNetworkErrorDesc);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Left Form Section */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-white dark:bg-background-dark transition-colors duration-300 relative animate-fade-up">
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to="/" className="text-primary text-xl font-bold">{translations.common.recall}</Link>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{translations.login.title}</h1>
            <p className="text-slate-500 dark:text-gray-400">{translations.login.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.login.usernameLabel}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">person</span>
                <input
                  name="username" // Added name attribute for form extraction
                  type="text"
                  placeholder={translations.login.usernamePlaceholder}
                  className="w-full h-14 pl-12 pr-4 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-card-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.login.passwordLabel}</label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">{translations.login.forgotPassword}</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">lock</span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={translations.login.passwordPlaceholder}
                  className="w-full h-12 pl-12 pr-12 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-card-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : translations.login.submit}
            </button>
          </form>
          <div className="text-center text-sm font-medium mt-4 text-slate-500 dark:text-gray-400">
            {translations.login.notHaveAccountPrefix}
            <Link
              to="/register"
              className="text-primary hover:underline transition-colors font-bold ml-1">
              {translations.login.notHaveAccountLink}
            </Link>
          </div>
          <div className="text-center text-sm text-slate-500 dark:text-gray-400">
            {translations.login.footerHelp}
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-slate-50 dark:bg-gray-900 relative overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent dark:from-primary/10"></div>
        <div className="relative max-w-lg space-y-6 p-8 bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white dark:border-border-dark transform transition-all duration-300 hover:scale-105">
          <h2 className="text-primary text-3xl font-bold">{translations.common.recall}</h2>
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">{translations.login.promoTitle}</h3>
          <p className="text-slate-500 dark:text-gray-300 text-lg">{translations.login.promoDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
