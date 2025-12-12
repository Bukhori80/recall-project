import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/InteractiveUI';
import { useLanguage } from '../contexts/LanguageContext';

// Helper untuk mapping Judul UI ke Value API Backend
// Pastikan value ini sesuai dengan apa yang ada di Database MongoDB Anda
const getApiCategory = (index: number) => {
    const categories = [
        "General%20Offer",       // index 0
        "Data%20Booster",          // index 1
        "Streaming%20Partner%20Pack",     // index 2
        "Device%20Upgrade%20Offer", // index 3 (VOD)
        "Family%20Plan%20Offer",        // index 4
        "Retention%20Offer",     // index 5
        "Roaming%20Pass",       // index 6
        "Top-up%20Promo",         // index 7
        "Voice%20Bundle"          // index 8
    ];
    return categories[index] || "General%20Offer";
};

const CategoryCard = ({ icon, title, desc, highlight, index }: { icon: string, title: string, desc: string, highlight?: boolean, index: number }) => {
    const apiCategory = getApiCategory(index);

    return (
        // UBAH LINK: Mengirim query param ?category=...
        <Link
            to={`/products?category=${apiCategory}`}
            className={`group flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fade-up ${highlight ? 'bg-primary/5 border-primary ring-1 ring-primary dark:border-primary dark:ring-primary shadow-lg shadow-primary/10' : 'bg-white dark:bg-card-dark border-slate-200 dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50'}`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="text-primary self-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Tooltip content={title}>
                    <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{icon}</span>
                </Tooltip>
            </div>
            <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">{desc}</p>
            </div>
        </Link>
    );
};

const Categories: React.FC = () => {
    const { translations } = useLanguage();
    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40">
            <div className="w-full max-w-[960px] flex flex-col gap-8">
                <div className="space-y-2 animate-fade-up">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white">{translations.categories.title}</h1>
                    <p className="text-slate-500 dark:text-gray-400">{translations.categories.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CategoryCard index={0} icon="star" title={translations.categories.generalOffer} desc={translations.categories.generalOfferDesc} />
                    <CategoryCard index={1} icon="rocket_launch" title={translations.categories.dataBooster} desc={translations.categories.dataBoosterDesc} />
                    <CategoryCard index={2} icon="play_circle" title={translations.categories.streamingPlan} desc={translations.categories.streamingPlanDesc} />
                    {/* Index 3 dilewatkan di kode asli, saya tambahkan placeholder agar urutan array benar */}
                    <CategoryCard index={3} icon="smartphone" title={translations.categories.device} desc={translations.categories.deviceDesc} />
                    <CategoryCard index={4} icon="family_restroom" title={translations.categories.familyPlan} desc={translations.categories.familyPlanDesc} />
                    <CategoryCard index={5} icon="loyalty" title={translations.categories.retention} desc={translations.categories.retentionDesc} />
                    <CategoryCard index={6} icon="flight" title={translations.categories.roamingPass} desc={translations.categories.roamingPassDesc} />
                    <CategoryCard index={7} icon="card_giftcard" title={translations.categories.topupPromo} desc={translations.categories.topupPromoDesc} />
                    <CategoryCard index={8} icon="phone_in_talk" title={translations.categories.voiceBundle} desc={translations.categories.voiceBundleDesc} />
                </div>
            </div>
        </div>
    );
};

export default Categories;