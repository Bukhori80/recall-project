
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors text-sm font-bold text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600"
      aria-label={`Current language: ${language === 'id' ? 'Indonesian' : 'English'}. Click to switch.`}
    >
      <span className={`px-1.5 rounded-sm ${language === 'id' ? 'text-primary' : 'text-slate-400 dark:text-gray-500'}`}>ID</span>
      <span className="w-px h-3 bg-slate-300 dark:bg-gray-600"></span>
      <span className={`px-1.5 rounded-sm ${language === 'en' ? 'text-primary' : 'text-slate-400 dark:text-gray-500'}`}>EN</span>
    </button>
  );
};

export default LanguageSwitcher;
