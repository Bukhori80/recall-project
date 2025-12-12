import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Swal from 'sweetalert2';
import { ModernSwal } from '../utils/ModernSwal';

// Interface Data Profile dari API
interface CustomerProfileData {
  username: string;
  email: string;
  device_brand: string;
  plan_type: string;
  profile: {
    avg_data_usage_gb: number;
    monthly_spend: number;
    topup_freq: number;
    avg_call_duration: number;
    sms_freq: number;
  };
}

const Profile: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const [profileData, setProfileData] = useState<CustomerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper Format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const customerId = localStorage.getItem('customer_id');

      if (!token || !customerId) {
        navigate('/login');
        return;
      }

      try {
        const url = `${backendUrl}/api/v1/customers/${customerId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        const result = await response.json();

        if (response.ok) {
          setProfileData(result.data);
        } else {
          throw new Error(result.message || "Gagal memuat profil");
        }

      } catch (err: any) {
        console.error("Fetch Profile Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, backendUrl]);

  const handleLogout = () => {
    ModernSwal.confirm(
      translations.common.logout + '?',
      "Anda yakin ingin keluar dari aplikasi?",
      'Ya, Keluar',
      'Batal',
      'warning'
    ).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear(); // Hapus semua data sesi
        ModernSwal.success('Berhasil Keluar').then(() => {
          navigate('/login');
        });
      }
    });
  };

  // Data Mock untuk Grafik (Karena backend hanya kirim usage rata-rata, kita asumsikan kuota 50GB untuk visualisasi)
  const usageValue = profileData?.profile.avg_data_usage_gb || 0;
  const totalQuota = 50;
  const remaining = Math.max(0, totalQuota - usageValue);

  const chartData = [
    { name: 'Used', value: usageValue },
    { name: 'Remaining', value: remaining },
  ];
  const COLORS = ['#1B57F1', '#E2E8F0'];

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 animate-pulse">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="h-32 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200 rounded-lg"></div>
            <div className="h-64 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Profile Content */}
          <div className="flex-1 w-full space-y-6">

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col sm:flex-row items-center gap-6 animate-fade-up">
              <div
                className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-slate-50 dark:border-gray-700 shadow-md"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDitfF6HI64zEL-dZoCBG50HbkgEn75X_RUqZFB39RMOtOy2wCgb6MkKT0gLn9duQrdKCY0qDRpWCrFh9cdCaF1MZOG3gPVpZk4n7MLYcZpGbyPtq3UKjBUoRU0RDpwSata0BbkxNHJn7UtVwZMta6OrVK6wfXQvGBvYBX_URMm6rjJRyXDRHXqMpdXO_jsK-hOKnHCNUosYXmE74VVD9tXl293FaxiSxAoJLj9M9S7shdlIVi0hTgfyQsqsJh3mjqgWpURvOPkWxo")' }}
              ></div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData?.username}</h1>
                <p className="text-slate-500 dark:text-gray-400">{profileData?.email}</p>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{profileData?.customer_id || "-"}</p>
                <div className="pt-3 flex gap-3 justify-center sm:justify-start">
                  <Link to="/edit-profile" className="px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors">
                    {translations.common.editProfile}
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    {translations.common.logout}
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;