import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip, CountUp } from '../components/InteractiveUI';
import { useLanguage } from '../contexts/LanguageContext';

// --- INTERFACES ---
interface RecommendationData {
  _id: string;
  offer_name: string;
  type: string;
  offer_details: string;
  redirect_url?: string;
  confidence_score?: number;
  original_ml_output?: string;
}

interface CustomerProfile {
  username: string;
  email: string;
  device_brand: string;
  plan_type: string;
  profile: {
    avg_data_usage_gb: number;
    avg_call_duration: number;
    sms_freq: number;
    travel_score: number;
    monthly_spend: number;
    pct_video_usage?: number;
    topup_freq?: number;
  };
  recommendations: string[]; // Array of ID Strings
}

const SummaryCard = ({ icon, title, value, index }: { icon: string, title: string, value: string, index: number }) => (
  <div 
    className="flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-lg border border-slate-200 dark:border-border-dark shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg animate-fade-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-center gap-3">
        <Tooltip content={title}>
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary cursor-default group">
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">{icon}</span>
            </div>
        </Tooltip>
        <span className="font-medium text-slate-700 dark:text-gray-300">{title}</span>
    </div>
    <span className="text-2xl font-bold text-slate-900 dark:text-white">
        <CountUp value={value} />
    </span>
  </div>
);

const Dashboard: React.FC = () => {
  // Gunakan fallback URL jika env tidak ada
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  
  const [dashboardData, setDashboardData] = useState<CustomerProfile | null>(null);
  const [lastRecommendation, setLastRecommendation] = useState<RecommendationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // 1. Ambil Kredensial (Cek 'token' dulu, fallback ke 'accessToken')
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const customerId = localStorage.getItem('customer_id');

      if (!token || !customerId) {
        navigate('/login'); 
        return;
      }

      try {
        // ---------------------------------------------
        // STEP 1: Fetch Customer Profile
        // ---------------------------------------------
        const profileUrl = `${backendUrl}/api/v1/customers/${customerId}`;
        const profileRes = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileRes.ok) {
          if (profileRes.status === 401) {
            localStorage.clear();
            navigate('/login');
            return;
          }
          throw new Error(`Gagal memuat profil: ${profileRes.statusText}`);
        }

        const profileJson = await profileRes.json();
        const profileData: CustomerProfile = profileJson.data;
        
        console.log("✅ Profile Loaded:", profileData);
        setDashboardData(profileData);

        // ---------------------------------------------
        // STEP 2: Fetch Last Recommendation (If exists)
        // ---------------------------------------------
        // Cek apakah user punya history rekomendasi
        if (profileData.recommendations && profileData.recommendations.length > 0) {
          // Ambil ID terakhir (asumsi index 0 adalah yang terbaru, sesuaikan jika backend berbeda)
          const lastRecId = profileData.recommendations[profileData.recommendations.length - 1]; 
          
          if (lastRecId) {
             const recUrl = `${backendUrl}/api/v1/recommendations/${lastRecId}`;
             const recRes = await fetch(recUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
             });

             if (recRes.ok) {
                const recJson = await recRes.json();
                // console.log("✅ Recommendation Loaded:", recJson.data);
                setLastRecommendation(recJson.data);
             } else {
                console.warn("Gagal memuat detail rekomendasi ID:", lastRecId);
             }
          }
        }

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, backendUrl]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-20 xl:px-40 animate-pulse">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
            <div className="bg-white dark:bg-card-dark p-8 rounded-lg shadow-sm h-32"></div>
            <div className="bg-white dark:bg-card-dark p-8 rounded-lg shadow-sm h-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex justify-center py-20 px-4">
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Terjadi Kesalahan</h2>
              <p className="mt-2 text-slate-600 dark:text-gray-300">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Coba Lagi
              </button>
          </div>
      </div>
    );
  }
  console.log(lastRecommendation)
  return (
    <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-20 xl:px-40">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
            {/* Header / Welcome */}
            <div className="bg-white dark:bg-card-dark p-8 rounded-lg shadow-sm border border-slate-200 dark:border-border-dark transition-all duration-300 hover:shadow-md animate-fade-up">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {translations.dashboard.welcome.replace('[Name]', dashboardData?.username || 'User')}
                </h1>
                <p className="text-lg text-slate-500 dark:text-gray-400">{translations.dashboard.welcomeSub}</p>
            </div>

            {/* Behaviour Summary */}
            <div className="bg-white dark:bg-card-dark p-8 rounded-lg shadow-sm border border-slate-200 dark:border-border-dark space-y-6 transition-all duration-300 hover:shadow-md animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{translations.dashboard.behaviourTitle}</h2>
                    <p className="text-slate-500 dark:text-gray-400">{translations.dashboard.behaviourDesc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <SummaryCard 
                        index={0} icon="signal_cellular_alt" title={translations.dashboard.data} 
                        value={dashboardData?.profile.avg_data_usage_gb ? `${dashboardData.profile.avg_data_usage_gb} GB` : '0 GB'} 
                    />
                    <SummaryCard 
                        index={1} icon="call" title={translations.dashboard.call} 
                        value={dashboardData?.profile.avg_call_duration ? `${dashboardData.profile.avg_call_duration} Mins` : '0 Mins'} 
                    />
                    <SummaryCard 
                        index={2} icon="sms" title={translations.dashboard.sms} 
                        value={dashboardData?.profile.sms_freq ? `${dashboardData.profile.sms_freq} SMS` : '0 SMS'} 
                    />
                    <SummaryCard 
                        index={3} icon="movie" title={translations.dashboard.streaming} 
                        value={dashboardData?.profile.pct_video_usage ? `${Math.round(dashboardData.profile.pct_video_usage * 100)}%` : '0%'} 
                    />
                    <SummaryCard 
                        index={4} icon="public" title={translations.dashboard.roaming} 
                        value={dashboardData?.profile.travel_score ? `${dashboardData.profile.travel_score * 100}` + '%'  : '0%'} 
                    />
                    <SummaryCard 
                        index={5} icon="smartphone" title={translations.dashboard.device} 
                        value={dashboardData?.device_brand || 'Unknown'} 
                    />
                    <SummaryCard 
                        index={6} icon="credit_card" title={translations.dashboard.payment} 
                        value={dashboardData?.plan_type || translations.onboarding.postpaid} 
                    />
                    <SummaryCard 
                        index={7} icon="payments" title={translations.dashboard.expenditure} 
                        value={dashboardData?.profile.monthly_spend ? formatRupiah(dashboardData.profile.monthly_spend) 
                          + '.' : 'IDR 0'} 
                    />
                    <SummaryCard 
                        index={8} icon="autorenew" title={translations.dashboard.topup} 
                        value={dashboardData?.profile.topup_freq ? `${dashboardData.profile.topup_freq}x` : '-'} 
                    />
                </div>

                {/* --- SECTON REKOMENDASI DINAMIS --- */}

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-8 pt-4 border-t border-slate-100 dark:border-border-dark">
                    {translations.dashboard.historyRecomendation}
                </h2>

                {lastRecommendation ? (
                    <div 
                        className="relative p-6 bg-white dark:bg-card-dark rounded-xl border border-primary/20 shadow-xl shadow-primary/10 transition-all duration-500 hover:shadow-2xl animate-fade-up" 
                        style={{ animationDelay: '0.4s' }}
                    >
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* TEXT CONTENT */}
                            <div className="flex-1">
                                {lastRecommendation.type && (
                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                                        {lastRecommendation.type}
                                    </span>
                                )}
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{lastRecommendation.offer_name}</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-4 line-clamp-3">{lastRecommendation.offer_details}</p>
                                
                                <a
                                    href={lastRecommendation.redirect_url || '#'}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 text-center shadow-md transition-transform hover:scale-[1.02]"
                                >
                                    {translations.recommendation.selectPackage}
                                </a>
                                <span className="block text-xs text-slate-400 mt-2">Score Kepercayaan: {(lastRecommendation.confidence_score! * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-slate-50 dark:bg-gray-800 rounded-lg border border-dashed border-slate-300 dark:border-gray-600">
                        <p className="text-slate-500 dark:text-gray-400">Belum ada riwayat rekomendasi. Silakan buat rekomendasi pertama Anda!</p>
                    </div>
                )}

                <div className="pt-2 animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    <Link to="/recommendation" className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        {translations.dashboard.generateRec}
                    </Link>
                </div>
            </div>


        </div>
    </div>
  );
};

export default Dashboard;