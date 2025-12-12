import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ModernSwal } from '../utils/ModernSwal';

// --- Interfaces ---
interface RecommendationData {
    _id: string;
    offer_name: string;
    type: string;
    offer_details: string;
    redirect_url: string;
    original_ml_output?: string;
    confidence_score?: number;
}

// Interface Preferensi Lengkap (Termasuk Payment & Device)
interface UserPreferences {
    avg_data_usage_gb: number;
    monthly_spend: number;
    pct_video_usage: number;
    travel_score: number;
    avg_call_duration: number;
    sms_freq: number;
    topup_freq: number;
    plan_type: string;    // Baru: Metode Pembayaran
    device_brand: string; // Baru: Merek Perangkat
}

const Recommendation: React.FC = () => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
    const { translations } = useLanguage();
    const navigate = useNavigate();

    // --- States ---
    const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State Form dengan Field Lengkap
    const [preferences, setPreferences] = useState<UserPreferences>({
        avg_data_usage_gb: 0,
        monthly_spend: 0,
        pct_video_usage: 0,
        travel_score: 0,
        avg_call_duration: 0,
        sms_freq: 0,
        topup_freq: 0,
        plan_type: '',
        device_brand: ''
    });

    // ----------------------------------------------------------------
    // LANGKAH 1: Fetch Data Profil saat ini
    // ----------------------------------------------------------------
    const handleOpenPreferenceModal = async () => {
        setIsLoadingData(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        const customerId = localStorage.getItem('customer_id');

        if (!token || !customerId) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/v1/customers/${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (response.ok) {
                const data = result.data;         // Data Akun (device, plan_type)
                const profile = result.data.profile; // Data Perilaku (usage, spend, etc)

                setPreferences({
                    // Data dari sub-object profile
                    avg_data_usage_gb: profile.avg_data_usage_gb || 0,
                    monthly_spend: profile.monthly_spend || 0,
                    pct_video_usage: profile.pct_video_usage || 0,
                    travel_score: profile.travel_score || 0,
                    avg_call_duration: profile.avg_call_duration || 0,
                    sms_freq: profile.sms_freq || 0,
                    topup_freq: profile.topup_freq || 0,
                    // Data dari root object
                    plan_type: data.plan_type || 'Prepaid',
                    device_brand: data.device_brand || 'Samsung'
                });
                setIsModalOpen(true);
            } else {
                throw new Error(result.message || "Gagal mengambil data profil.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoadingData(false);
        }
    };

    // ----------------------------------------------------------------
    // Helper: Handle Input Change (String vs Number)
    // ----------------------------------------------------------------
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setPreferences(prev => {
            // Cek apakah field ini harus string atau number
            const isStringField = name === 'plan_type' || name === 'device_brand';
            return {
                ...prev,
                [name]: isStringField ? value : (parseFloat(value) || 0)
            };
        });
    };

    // ----------------------------------------------------------------
    // LANGKAH 2: Update Profil -> Generate AI
    // ----------------------------------------------------------------
    const handleUpdateAndGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        const customerId = localStorage.getItem('customer_id');

        const updatePayload = {
            plan_type: preferences.plan_type,
            device_brand: preferences.device_brand,
            profile: {
                avg_data_usage_gb: preferences.avg_data_usage_gb,
                monthly_spend: preferences.monthly_spend,
                pct_video_usage: preferences.pct_video_usage,
                travel_score: preferences.travel_score,
                avg_call_duration: preferences.avg_call_duration,
                sms_freq: preferences.sms_freq,
                topup_freq: preferences.topup_freq
            }
        };

        try {
            // A. UPDATE PROFIL (PATCH)
            const updateUrl = `${backendUrl}/api/v1/customers/${customerId}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatePayload)
            });

            if (!updateResponse.ok) {
                throw new Error("Gagal memperbarui data perilaku.");
            }

            // B. GENERATE REKOMENDASI (POST)
            const generateUrl = `${backendUrl}/api/v1/recommendations/${customerId}/generate-ai`;
            const genResponse = await fetch(generateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const genResult = await genResponse.json();

            if (genResponse.ok) {
                setRecommendationData(genResult.data);
                setIsModalOpen(false);
                ModernSwal.success('Berhasil!', 'Rekomendasi paket baru telah dibuat berdasarkan profil terbaru Anda.');
            } else {
                throw new Error(genResult.message || 'Gagal membuat rekomendasi.');
            }

        } catch (err: any) {
            console.error("Process Error:", err);
            setError(err.message || "Terjadi kesalahan.");
        } finally {
            setIsGenerating(false);
        }
    };

    // ----------------------------------------------------------------
    // UI RENDER
    // ----------------------------------------------------------------
    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40">
            <div className="w-full max-w-[960px] flex flex-col gap-8 text-center items-center">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{translations.recommendation.title}</h1>
                    <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {translations.recommendation.subtitle}
                    </p>

                    {/* Tombol Utama */}
                    <button
                        onClick={handleOpenPreferenceModal}
                        disabled={isLoadingData || isGenerating}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-blue-700 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingData ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">auto_awesome</span>
                        )}
                        {recommendationData ? "Sesuaikan & Generate Ulang" : translations.recommendation.generate}
                    </button>

                    {error && !isModalOpen && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-fade-up">
                            <p>Error: {error}</p>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-slate-200 dark:bg-gray-700 my-4"></div>

                {/* --- HASIL REKOMENDASI --- */}
                {recommendationData && (
                    <div 
                        className="relative p-6 bg-white dark:bg-card-dark rounded-xl border border-primary/20 shadow-xl shadow-primary/10 transition-all duration-500 hover:shadow-2xl animate-fade-up" 
                        style={{ animationDelay: '0.4s' }}
                    >
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* TEXT CONTENT */}
                            <div className="flex-1">
                                {recommendationData.type && (
                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                                        {recommendationData.type}
                                    </span>
                                )}
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{recommendationData.offer_name}</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-4 line-clamp-3">{recommendationData.offer_details}</p>
                                
                                <a
                                    href={'/' + recommendationData.redirect_url || '#'}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 text-center shadow-md transition-transform hover:scale-[1.02]"
                                >
                                    {translations.recommendation.selectPackage}
                                </a>
                                <span className="block text-xs text-slate-400 mt-2">Score Kepercayaan: {(recommendationData.confidence_score! * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!recommendationData && !isLoadingData && !isModalOpen && (
                    <div className="text-slate-400 mt-10">
                        <span className="material-symbols-outlined text-6xl opacity-20">dvr</span>
                        <p className="mt-2">Klik tombol di atas untuk menyesuaikan profil & mendapatkan rekomendasi.</p>
                    </div>
                )}

                {/* --- MODAL EDIT PREFERENSI LENGKAP --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-border-dark overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">

                            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex-shrink-0">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sesuaikan Data Perilaku</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                                    Pastikan data ini sesuai agar rekomendasi AI akurat.
                                </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* 1. Data Usage */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.dataUsageLabel} (GB)
                                        </label>
                                        <input
                                            type="number"
                                            name="avg_data_usage_gb"
                                            value={preferences.avg_data_usage_gb}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {/* 2. Monthly Spend */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.monthlySpendLabel} (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            name="monthly_spend"
                                            value={preferences.monthly_spend}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {/* 3. Payment Method (BARU) */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.paymentMethodLabel}
                                        </label>
                                        <select
                                            name="plan_type"
                                            value={preferences.plan_type}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="Prepaid">{translations.onboarding.prepaid}</option>
                                            <option value="Postpaid">{translations.onboarding.postpaid}</option>
                                        </select>
                                    </div>

                                    {/* 4. Device Brand (BARU) */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.deviceBrandLabel}
                                        </label>
                                        <select
                                            name="device_brand"
                                            value={preferences.device_brand}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="Samsung">Samsung</option>
                                            <option value="Apple">Apple</option>
                                            <option value="Xiaomi">Xiaomi</option>
                                            <option value="Oppo">Oppo</option>
                                            <option value="Vivo">Vivo</option>
                                            <option value="Realme">Realme</option>
                                            <option value="Huawei">Huawei</option>
                                            <option value="Other">Lainnya</option>
                                        </select>
                                    </div>

                                    {/* 5. Call Duration */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.callDurationLabel}
                                        </label>
                                        <input
                                            type="number"
                                            name="avg_call_duration"
                                            value={preferences.avg_call_duration}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {/* 6. SMS Frequency */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.smsCountLabel}
                                        </label>
                                        <input
                                            type="number"
                                            name="sms_freq"
                                            value={preferences.sms_freq}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {/* 7. Top-up Frequency */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.topupFreqLabel}
                                        </label>
                                        <select
                                            name="topup_freq"
                                            value={preferences.topup_freq}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1x</option>
                                            <option value="2">2x</option>
                                            <option value="3">3x</option>
                                            <option value="4">4x</option>
                                            <option value="5">5x</option>
                                            <option value="6">6x</option>
                                            <option value="7">7x</option>
                                            <option value="8">8x</option>
                                            <option value="9">9x</option>
                                            <option value="10">10x</option>
                                            <option value="11">11x</option>
                                            <option value="12">12x</option>
                                            <option value="13">&gt; 12x</option>
                                        </select>
                                    </div>

                                    {/* 8. Video Usage */}
                                    <div className="space-y-1 text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.videoUsageLabel}
                                        </label>
                                        <select
                                            name="pct_video_usage"
                                            value={preferences.pct_video_usage}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="0">0%</option>
                                            <option value="0.25">25%</option>
                                            <option value="0.5">50%</option>
                                            <option value="0.75">75%</option>
                                            <option value="1">100%</option>
                                        </select>
                                    </div>

                                    {/* 9. Travel Score */}
                                    <div className="space-y-1 text-left md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {translations.onboarding.travelScoreLabel}
                                        </label>
                                        <select
                                            name="travel_score"
                                            value={preferences.travel_score}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="0">{translations.onboarding.never} (0) </option>
                                            <option value="0.2">{translations.onboarding.often} (0.2)</option>
                                            <option value="0.5">{translations.onboarding.medium} (0.5)</option>
                                            <option value="0.8">{translations.onboarding.rarely} (0.8)</option>
                                            <option value="1">{translations.onboarding.always} (1.0)</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 pt-2 flex gap-3 flex-shrink-0 bg-white dark:bg-card-dark border-t border-slate-100 dark:border-gray-800">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800"
                                >
                                    {translations.common.cancel}
                                </button>
                                <button
                                    onClick={handleUpdateAndGenerate}
                                    disabled={isGenerating}
                                    className="flex-[2] py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                            Generating...
                                        </>
                                    ) : (
                                        translations.common.saveChanges + " & Generate"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Recommendation;