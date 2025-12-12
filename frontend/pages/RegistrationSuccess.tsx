
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const RegistrationSuccess: React.FC = () => {
  const { translations } = useLanguage();
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-card-dark p-12 rounded-xl shadow-lg border border-slate-100 dark:border-border-dark text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{translations.onboarding.successTitle}</h1>
        <p className="text-slate-600 dark:text-gray-300 text-lg mb-2">
            {translations.onboarding.successWelcome.replace('[User Name]', 'Nama Pengguna')}
        </p>
        <p className="text-slate-500 dark:text-gray-400 mb-8">
            {translations.onboarding.successDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                {translations.onboarding.goToDashboard}
            </Link>
            <Link to="/profile" className="px-6 py-3 bg-white dark:bg-background-dark text-primary dark:text-white border border-slate-200 dark:border-border-dark font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                {translations.onboarding.viewProfile}
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
