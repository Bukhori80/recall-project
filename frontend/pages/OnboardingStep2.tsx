
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const OnboardingStep2: React.FC = () => {
  const { translations } = useLanguage();
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
         <div className="w-full max-w-xs h-80 flex items-center justify-center mb-4">
             <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzr94f5z2MrvyWe8oq1u8XjLZp1f1G9xwP4KvMmnUbGLKTEfcbCheWGqgYEtXvk_a_7W5K_NP7H7tFQKzG4q-LrMeD1fA_N6vwiyMvqyKkNI9H0V0sNSMLRlqOfvoSVc5lHpmYKRYionG3mNEDe7jHDCGSIVF1TRn87nlnY39jlmz-o3L4vH6zeduecB870wIsAUgWvWFmdZFyz_iyPZCNyIjwMdEV58uBkQqx9Jal-OYpUXKNE2H3oz5nw4wo4cbyeLTOq206GYo")'}}></div>
         </div>
         <h1 className="text-4xl font-black text-slate-900 dark:text-white">{translations.onboarding.step2Title}</h1>
         <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl">
             {translations.onboarding.step2Desc}
         </p>
         
         <div className="flex flex-col items-center gap-6 w-full max-w-xs">
            <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-primary rounded-full"></div>
                </div>
                <span className="text-slate-400 font-medium">{translations.common.step} 2 {translations.common.of} 3</span>
            </div>
            <Link to="/onboarding/3" className="w-full h-12 flex items-center justify-center bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                {translations.common.continue}
            </Link>
         </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
