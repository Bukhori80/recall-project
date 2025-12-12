import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ScrollReveal, CountUp, Typewriter, FloatingElement } from '../components/InteractiveUI';
import { useLanguage } from '../contexts/LanguageContext';

const Landing: React.FC = () => {
    const [isDark, setIsDark] = useState(false);
    // State untuk FAQ Accordion
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { translations } = useLanguage();

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
            {/* --- MOUSE TRACKING GRADIENT --- */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-10 dark:opacity-20 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.45), transparent 80%)`
                }}
            />

            {/* --- HEADER --- */}
            <header className="absolute top-0 left-0 right-0 z-50 py-5">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-primary w-8 h-8" aria-hidden="true">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" /></svg>
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recall</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <Link to="/login" className="hidden sm:inline-block px-5 py-2 font-bold text-slate-700 dark:text-white hover:text-primary transition-colors">
                            {translations.common.login}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10">

                {/* --- HERO SECTION --- */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 text-center lg:text-left z-10">
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                                <span className="text-primary text-sm font-bold tracking-wide uppercase">
                                    <Typewriter texts={translations.landing.heroTypewriter} speed={100} pause={2000} />
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6 animate-fade-up">
                                {translations.landing.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                {translations.landing.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.2s' }}>
                                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-xl shadow-primary/30 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    {translations.common.getStarted}
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-card-dark text-slate-700 dark:text-white text-lg font-bold rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all">
                                    {translations.common.login}
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image / Graphic */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-xl relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                            {/* Abstract Card UI */}
                            <FloatingElement depth={2}>
                                <div className="relative bg-white/50 dark:bg-card-dark/50 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-default">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <span className="material-symbols-outlined">savings</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{translations.landing.totalSavings}</h3>
                                            <p className="text-sm text-slate-500">{translations.landing.last30Days}</p>
                                        </div>
                                        <div className="ml-auto font-bold text-green-600 text-xl"><CountUp value="+Rp 50.000" /></div>
                                    </div>
                                    <div className="h-40 bg-slate-100 dark:bg-gray-800 rounded-xl w-full flex items-end justify-between p-4 gap-2">
                                        {[40, 70, 35, 60, 80, 50].map((h, i) => (
                                            <div key={i} className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary hover:scale-y-110 origin-bottom duration-300" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </FloatingElement>
                        </div>
                    </div>
                </div>

                {/* --- STATS BANNER (NEW) --- */}
                <div className="bg-slate-900 text-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
                            <div className="p-4">
                                <h3 className="text-4xl font-black text-primary mb-1"><CountUp value="10k+" /></h3>
                                <p className="text-slate-400">{translations.landing.stats.users}</p>
                            </div>
                            <div className="p-4">
                                <h3 className="text-4xl font-black text-primary mb-1"><CountUp value="30%" /></h3>
                                <p className="text-slate-400">{translations.landing.stats.savings}</p>
                            </div>
                            <div className="p-4">
                                <h3 className="text-4xl font-black text-primary mb-1"><CountUp value="95%" /></h3>
                                <p className="text-slate-400">{translations.landing.stats.accuracy}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FEATURES SECTION --- */}
                <div className="py-20 bg-slate-50 dark:bg-background-dark/50">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <ScrollReveal delay={0} className="h-full">
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-border-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full">
                                    <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">analytics</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{translations.landing.features.analyticsTitle}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                        {translations.landing.features.analyticsDesc}
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Feature 2 */}
                            <ScrollReveal delay={200} className="h-full">
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-border-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full">
                                    <div className="w-14 h-14 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">warning</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{translations.landing.features.churnTitle}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                        {translations.landing.features.churnDesc}
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Feature 3 */}
                            <ScrollReveal delay={400} className="h-full">
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-border-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full">
                                    <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">verified</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{translations.landing.features.offerTitle}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                        {translations.landing.features.offerDesc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>

                {/* --- HOW IT WORKS (NEW) --- */}
                <div className="py-24 container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{translations.landing.howItWorks.title}</h2>
                        <p className="text-slate-600 dark:text-gray-400">{translations.landing.howItWorks.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 dark:bg-gray-700 -z-10"></div>

                        {/* Step 1 */}
                        <ScrollReveal delay={0} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white dark:bg-card-dark border-4 border-slate-100 dark:border-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-primary">person_add</span>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{translations.landing.howItWorks.step1Title}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-xs">{translations.landing.howItWorks.step1Desc}</p>
                        </ScrollReveal>

                        {/* Step 2 */}
                        <ScrollReveal delay={200} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white dark:bg-card-dark border-4 border-slate-100 dark:border-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-primary">edit_note</span>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{translations.landing.howItWorks.step2Title}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-xs">{translations.landing.howItWorks.step2Desc}</p>
                        </ScrollReveal>

                        {/* Step 3 */}
                        <ScrollReveal delay={400} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-white dark:bg-card-dark border-4 border-slate-100 dark:border-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-primary">auto_awesome</span>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{translations.landing.howItWorks.step3Title}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-xs">{translations.landing.howItWorks.step3Desc}</p>
                        </ScrollReveal>
                    </div>
                </div>

                {/* --- FAQ SECTION (NEW) --- */}
                <div className="py-20 bg-slate-50 dark:bg-background-dark/50">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 text-center">{translations.landing.faq.title}</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(num)}
                                        className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                                        aria-expanded={openFaq === num}
                                        aria-controls={`faq-answer-${num}`}
                                    >
                                        <span>{translations.landing.faq[`q${num}`]}</span>
                                        <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === num ? 'rotate-180' : ''}`} aria-hidden="true">expand_more</span>
                                    </button>
                                    <div
                                        id={`faq-answer-${num}`}
                                        className={`transition-all duration-300 ease-in-out ${openFaq === num ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                        aria-hidden={openFaq !== num}
                                    >
                                        <div className="p-5 pt-0 text-slate-600 dark:text-gray-400 leading-relaxed border-t border-slate-100 dark:border-gray-800 mt-2">
                                            {translations.landing.faq[`a${num}`]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM CTA (NEW) --- */}
                <div className="py-24 container mx-auto px-6 text-center">
                    <div className="bg-primary rounded-3xl p-12 relative overflow-hidden shadow-2xl shadow-primary/40 max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10">
                            {translations.landing.ctaBottom.title}
                        </h2>
                        <Link to="/register" className="inline-block px-10 py-4 bg-white text-primary text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-transform relative z-10">
                            {translations.landing.ctaBottom.btn}
                        </Link>
                    </div>
                </div>

            </main>

            <footer className="w-full py-10 text-center text-slate-400 dark:text-gray-600 text-sm border-t border-slate-200 dark:border-gray-800 bg-slate-900 text-white py-12">
                <p>{translations.landing.footer}</p>
            </footer>
        </div>
    );
};

export default Landing;