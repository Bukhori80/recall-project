import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Swal from 'sweetalert2';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { ModernSwal } from '../utils/ModernSwal';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ------------------ VALIDATION ------------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = translations.validation.usernameRequired;
    }

    // --- EMAIL VALIDATION ---
    if (!formData.email.trim()) {
      newErrors.email = translations.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translations.validation.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = translations.validation.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = translations.validation.passwordMinLength;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = translations.validation.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translations.validation.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ HANDLE INPUT ------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ------------------ SUBMIT ------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      ModernSwal.warning(translations.validation.validationFailedTitle, translations.validation.validationFailedDesc);
      return;
    }

    // PERUBAHAN UTAMA:
    // Alih-alih simpan ke localStorage, kita kirim data ke halaman selanjutnya (RegisterNeeds)
    // menggunakan React Router state.
    navigate('/register-needs', {
      state: {
        accountData: {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-6 mb-8">
        {/* Logo / Header Kecil */}
        <div className="flex items-center gap-3">
          <div className="text-primary w-8 h-8">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold">
            {translations.common.recall}
          </h2>
        </div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark animate-fade-up">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {translations.register.title}
          </h1>
          <p className="text-slate-500 dark:text-gray-400">{translations.register.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
              {translations.register.usernameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={translations.register.usernamePlaceholder}
              className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'
                }`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
              {translations.register.emailLabel} <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={translations.register.emailPlaceholder}
              className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'
                }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
              {translations.register.passwordLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={translations.register.passwordPlaceholder}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
              {translations.register.confirmPasswordLabel} <span className="text-red-500">*</span>
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={translations.register.confirmPasswordPlaceholder}
              className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
            >
              {translations.register.next}
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {translations.register.haveAccount}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
