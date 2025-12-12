import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Swal from 'sweetalert2';
import { ModernSwal } from '../utils/ModernSwal';

const RegisterNeeds: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translations } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dataUsage: '',
    callDuration: '',
    smsCount: '',
    topupFrequency: '',
    deviceBrand: '',
    monthlySpend: '',
    paymentMethod: '',
    videoUsagePct: '', // Ditambahkan sesuai HTML
    travelScore: ''    // Ditambahkan sesuai HTML
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cek apakah ada data akun dari halaman sebelumnya
  const accountData = location.state?.accountData;

  useEffect(() => {
    // Jika user langsung akses URL ini tanpa lewat Register, kembalikan ke Register
    if (!accountData) {
      navigate('/register');
    }
  }, [accountData, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.dataUsage) newErrors.dataUsage = 'Penggunaan data wajib dipilih';
    if (!formData.callDuration) newErrors.callDuration = 'Durasi telepon wajib dipilih';
    if (!formData.smsCount) newErrors.smsCount = 'Jumlah SMS wajib dipilih';
    if (!formData.topupFrequency) newErrors.topupFrequency = 'Frekuensi top-up wajib dipilih';
    if (!formData.deviceBrand) newErrors.deviceBrand = 'Merek device wajib dipilih';
    if (!formData.monthlySpend) newErrors.monthlySpend = 'Pengeluaran bulanan wajib dipilih';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      ModernSwal.warning('Validasi Gagal', 'Mohon lengkapi semua field yang wajib diisi.');
      return;
    }
    setIsSubmitting(true);

    // 1. Siapkan Body Request sesuai spesifikasi Backend/HTML
    const requestBody = {
      username: accountData.username,
      password: accountData.password,
      email: accountData.email,
      device_brand: formData.deviceBrand,
      plan_type: formData.paymentMethod,
      avg_data_usage_gb: parseInt(formData.dataUsage),
      monthly_spend: parseFloat(formData.monthlySpend), // parseFloat karena HTML parse int tapi uang bisa besar
      pct_video_usage: parseFloat(formData.videoUsagePct),
      travel_score: parseFloat(formData.travelScore),
      avg_call_duration: parseInt(formData.callDuration),
      sms_freq: parseInt(formData.smsCount),
      topup_freq: parseInt(formData.topupFrequency),
      complaint_count: 0, // Default value
    };

    try {
      const backendUrl = import.meta.env.VITE_API_BACKEND_URL;
      const url = `${backendUrl}/api/v1/auth/customer/register`;

      console.log("Sending Register Data:", requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registrasi gagal');
      }

      // SUKSES
      console.log("Registration Success:", result);
      // SUKSES
      console.log("Registration Success:", result);
      await ModernSwal.success('Pendaftaran Berhasil!', 'Akun Anda telah berhasil dibuat. Silakan login.');
      navigate('/login');

    } catch (error: any) {
      console.error("Register Error:", error);
      ModernSwal.error('Pendaftaran Gagal', error.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark animate-fade-up mt-12">

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-bold">Register Needs</span>
            <div className="w-24 h-2 bg-slate-100 dark:bg-gray-700 rounded-full">
              <div className="w-full h-full bg-primary rounded-full"></div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {translations.onboarding.step3Title}
          </h1>
          <p className="text-slate-500 dark:text-gray-400">
            {translations.onboarding.step3Desc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* DATA USAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.dataUsageLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="dataUsage"
                value={formData.dataUsage}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.dataUsage ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.dataUsagePlaceholder}</option>
                <option value="1">&lt; 1 GB</option>
                <option value="5"> 5 GB</option>
                <option value="10">10 GB</option>
                <option value="20"> 20 GB</option>
                <option value="30"> 30 GB</option>
                <option value="50">&gt; 30 GB</option>
              </select>
              {errors.dataUsage && <p className="text-red-500 text-xs mt-1">{errors.dataUsage}</p>}
            </div>

            {/* CALL DURATION */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.callDurationLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="callDuration"
                value={formData.callDuration}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.callDuration ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.callDurationPlaceholder}</option>
                <option value="5">&lt; 5 Menit</option>
                <option value="10">10 Menit</option>
                <option value="15">15 Menit</option>
                <option value="20">20 Menit</option>
                <option value="25">25 Menit</option>
                <option value="30">30 Menit</option>
                <option value="35">35 Menit</option>
                <option value="60">&gt; 35 Menit</option>
              </select>
              {errors.callDuration && <p className="text-red-500 text-xs mt-1">{errors.callDuration}</p>}
            </div>

            {/* SMS COUNT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.smsCountLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="smsCount"
                value={formData.smsCount}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.smsCount ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.smsCountPlaceholder}</option>
                <option value="5">&lt; 5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">&gt; 30</option>
              </select>
              {errors.smsCount && <p className="text-red-500 text-xs mt-1">{errors.smsCount}</p>}
            </div>

            {/* TOPUP FREQUENCY */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.topupFreqLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="topupFrequency"
                value={formData.topupFrequency}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.topupFrequency ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.topupFreqPlaceholder}</option>
                <option value="1">1 kali</option>
                <option value="2">2 kali</option>
                <option value="3">3 kali</option>
                <option value="4">4 kali</option>
                <option value="5">5 kali</option>
                <option value="6">6 kali</option>
                <option value="7">7 kali</option>
                <option value="8">8 kali</option>
                <option value="9">9 kali</option>
                <option value="10">10 kali</option>
                <option value="12">&gt; 10 kali</option>
              </select>
              {errors.topupFrequency && <p className="text-red-500 text-xs mt-1">{errors.topupFrequency}</p>}
            </div>

            {/* DEVICE BRAND */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.deviceBrandLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="deviceBrand"
                value={formData.deviceBrand}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.deviceBrand ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.deviceBrandPlaceholder}</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Oppo">Oppo</option>
                <option value="Vivo">Vivo</option>
                <option value="Realme">Realme</option>
                <option value="Huawei">Huawei</option>
              </select>
              {errors.deviceBrand && <p className="text-red-500 text-xs mt-1">{errors.deviceBrand}</p>}
            </div>

            {/* MONTHLY SPEND */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                {translations.onboarding.monthlySpendLabel} <span className="text-red-500">*</span>
              </label>
              <select
                name="monthlySpend"
                value={formData.monthlySpend}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.monthlySpend ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">{translations.onboarding.monthlySpendPlaceholder}</option>
                <option value="50000">&lt; 50.000</option>
                <option value="100000">100.000</option>
                <option value="150000">150.000</option>
                <option value="200000">200.000</option>
                <option value="250000">250.000</option>
                <option value="300000">300.000</option>
                <option value="350000">350.000</option>
                <option value="400000">400.000</option>
                <option value="450000">450.000</option>
                <option value="500000">&gt; 500.000</option>
              </select>
              {errors.monthlySpend && <p className="text-red-500 text-xs mt-1">{errors.monthlySpend}</p>}
            </div>

            {/* TRAVEL SCORE (NEW) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                Frekuensi Travel Luar Negeri <span className="text-red-500">*</span>
              </label>
              <select
                name="travelScore"
                value={formData.travelScore}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.travelScore ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">Pilih Frekuensi</option>
                <option value="0">Tidak Pernah (0)</option>
                <option value="0.2">Jarang (0.1 - 0.3)</option>
                <option value="0.5">Kadang-kadang (0.4 - 0.6)</option>
                <option value="0.8">Sering (0.7 - 0.9)</option>
                <option value="1.0">Sangat Sering (1.0)</option>
              </select>
              {errors.travelScore && <p className="text-red-500 text-xs mt-1">{errors.travelScore}</p>}
            </div>

            {/* VIDEO USAGE PCT (NEW) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
                Persentasi Streaming Video <span className="text-red-500">*</span>
              </label>
              <select
                name="videoUsagePct"
                value={formData.videoUsagePct}
                onChange={handleSelectChange}
                className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
                text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
                ${errors.videoUsagePct ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
              >
                <option value="">Pilih Persentase</option>
                <option value="0">0%</option>
                <option value="0.25">25%</option>
                <option value="0.50">50%</option>
                <option value="0.75">75%</option>
                <option value="1.00">100%</option>
              </select>
              {errors.videoUsagePct && <p className="text-red-500 text-xs mt-1">{errors.videoUsagePct}</p>}
            </div>

          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">
              {translations.onboarding.paymentMethodLabel} <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleSelectChange}
              className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark 
              text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all 
              ${errors.paymentMethod ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}
            >
              <option value="">{translations.onboarding.paymentMethodPlaceholder}</option>
              <option value="Prepaid">{translations.onboarding.prepaid}</option>
              <option value="Postpaid">{translations.onboarding.postpaid}</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
          </div>

          {/* TERMS */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 text-primary border-slate-300 dark:border-gray-600 dark:bg-background-dark rounded focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-slate-500 dark:text-gray-400">
              {translations.onboarding.terms}
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mendaftarkan...' : translations.onboarding.createAccount}
          </button>
        </form>

      </div>
    </div>
  );
};

export default RegisterNeeds;
