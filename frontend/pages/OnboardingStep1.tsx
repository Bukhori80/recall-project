import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const OnboardingStep1: React.FC = () => {
  const { translations } = useLanguage();
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
         <div className="w-full max-w-xs h-80 flex items-center justify-center mb-4">
             <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8FGEjvvoxj0p0ENZ4HMxR_Fxzq6T6G5PHhUW4cC1R7IF96raMQXimsQD57B7ECGQ58HdDkhiRrOHYHW-9ZmLBKewVZRep43GAVZ2WeWgmQnjOjsleKjog4Nau-PEzCxOhksS0SMqphCN_esTDN-jGeKwBUqLGdP4_wEXRdJw4ZPrrB0acdYO3efw6R9-k4_166nYt1kq_UQBdilpSTDBpG4dYfGjDhFBsdFm4Swvrg0iNpgdpz3h63eNUaqPA5-4jQZKQ0tOZCSc")'}}></div>
         </div>
         <h1 className="text-4xl font-black text-slate-900 dark:text-white">{translations.onboarding.step1Title}</h1>
         <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl">
             {translations.onboarding.step1Desc}
         </p>

         <div className="flex flex-col items-center gap-6 w-full max-w-xs">
            <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-slate-400 font-medium">{translations.common.step} 1 {translations.common.of} 3</span>
            </div>
            <Link to="/onboarding/2" className="w-full h-12 flex items-center justify-center bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                {translations.common.next}
            </Link>
         </div>
      </div>
    </div>
  );
};

export default OnboardingStep1;
