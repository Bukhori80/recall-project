
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RegisterAccount: React.FC = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- BACKEND INTEGRATION GUIDE ---
    // 1. Gather Basic Info
    // const formData = new FormData(e.target as HTMLFormElement);
    // const payload = {
    //   fullName: formData.get('fullName'),
    //   phone: formData.get('phone'),
    //   password: formData.get('password'),
    //   confirmPassword: formData.get('confirmPassword')
    // };

    // 2. Validate (Frontend)
    // if (payload.password !== payload.confirmPassword) {
    //   alert("Passwords don't match"); return;
    // }

    // 3. Temporary State Storage (or API Step 1)
    // Option A: Store in Context/Redux/LocalStorage to submit everything at Step 3.
    // localStorage.setItem('reg_step1', JSON.stringify(payload));
    
    // Option B: Call API to create a "partial" user
    // const res = await fetch('/api/v1/auth/register-init', { ... });
    
    navigate('/onboarding/3');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center gap-6 mb-8">
         <div className="flex items-center gap-3">
            <div className="text-primary w-8 h-8">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"/></svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold">{translations.common.recall}</h2>
         </div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark animate-fade-up">
        {/* Progress */}
        <div className="flex flex-col gap-2 mb-8">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                {translations.common.step} 1 {translations.common.of} 2
            </p>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-gray-700">
                <div className="h-full w-1/2 rounded-full bg-primary"></div>
            </div>
        </div>

        <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{translations.register.title}</h1>
            <p className="text-slate-500 dark:text-gray-400">{translations.register.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.register.fullNameLabel}</label>
                <input 
                    name="fullName"
                    type="text" 
                    placeholder={translations.register.fullNamePlaceholder} 
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.register.phoneLabel}</label>
                <input 
                    name="phone"
                    type="tel" 
                    placeholder={translations.register.phonePlaceholder} 
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.register.passwordLabel}</label>
                <div className="relative">
                    <input 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder={translations.register.passwordPlaceholder} 
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
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
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{translations.register.passwordHint}</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.register.confirmPasswordLabel}</label>
                <input 
                    name="confirmPassword"
                    type="password" 
                    placeholder={translations.register.confirmPasswordPlaceholder} 
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                />
            </div>

            <div className="pt-4 flex flex-col gap-4">
                <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                    {translations.register.next}
                </button>
                
                <Link to="/login" className="text-center text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                    {translations.register.haveAccount}
                </Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAccount;
