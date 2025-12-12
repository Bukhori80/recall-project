
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const OnboardingStep1: React.FC = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    dataUsage: '',
    callDuration: '',
    smsCount: '',
    topupFrequency: '',
    deviceBrand: '',
    monthlySpend: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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
    // Clear error when user selects
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
      return;
    }

    // --- BACKEND INTEGRATION GUIDE ---
    // 1. Gather all form data
    // const preferences = {
    //   dataUsage: formData.dataUsage,
    //   callDuration: formData.callDuration,
    //   smsCount: formData.smsCount,
    //   topupFrequency: formData.topupFrequency,
    //   deviceBrand: formData.deviceBrand,
    //   monthlySpend: formData.monthlySpend,
    //   paymentMethod: formData.paymentMethod
    // };

    // 2. Combine with user data from Register step
    // const userData = JSON.parse(localStorage.getItem('user') || '{}');

    // 3. Construct Final Payload
    // const payload = {
    //   ...userData,
    //   preferences: preferences
    // };

    // 4. Send to Backend
    // try {
    //   const response = await fetch('/api/v1/auth/complete-registration', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    //   });

    //   if (response.ok) {
    //     const user = await response.json();
    //     localStorage.setItem('user', JSON.stringify(user));
    //     navigate('/registration-success');
    //   }
    // } catch (err) { ... }

    // For now, simulate success
    navigate('/onboarding/2');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark animate-fade-up">
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                 <span className="text-primary font-bold">{translations.common.step} 1 {translations.common.of} 3</span>
                 <div className="w-24 h-2 bg-slate-100 dark:bg-gray-700 rounded-full">
                     <div className="w-1/3 h-full bg-primary rounded-full"></div>
                 </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{translations.onboarding.step3Title}</h1>
            <p className="text-slate-500 dark:text-gray-400">{translations.onboarding.step3Desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.dataUsageLabel} <span className="text-red-500">*</span></label>
                    <select name="dataUsage" value={formData.dataUsage} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.dataUsage ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.dataUsagePlaceholder}</option>
                        <option value="1">&lt; 5 GB</option>
                        <option value="2">5 - 20 GB</option>
                        <option value="3">&gt; 20 GB</option>
                    </select>
                    {errors.dataUsage && <p className="text-red-500 text-xs mt-1">{errors.dataUsage}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.callDurationLabel} <span className="text-red-500">*</span></label>
                    <select name="callDuration" value={formData.callDuration} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.callDuration ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.callDurationPlaceholder}</option>
                        <option value="1">&lt; 100 {translations.onboarding.minutes}</option>
                        <option value="2">100 - 300 {translations.onboarding.minutes}</option>
                        <option value="3">&gt; 300 {translations.onboarding.minutes}</option>
                    </select>
                    {errors.callDuration && <p className="text-red-500 text-xs mt-1">{errors.callDuration}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.smsCountLabel} <span className="text-red-500">*</span></label>
                    <select name="smsCount" value={formData.smsCount} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.smsCount ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.smsCountPlaceholder}</option>
                        <option value="1">{translations.onboarding.rarely}</option>
                        <option value="2">{translations.onboarding.medium}</option>
                        <option value="3">{translations.onboarding.often}</option>
                    </select>
                    {errors.smsCount && <p className="text-red-500 text-xs mt-1">{errors.smsCount}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.topupFreqLabel} <span className="text-red-500">*</span></label>
                    <select name="topupFrequency" value={formData.topupFrequency} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.topupFrequency ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.topupFreqPlaceholder}</option>
                        <option value="1">{translations.onboarding.weekly}</option>
                        <option value="2">{translations.onboarding.monthly}</option>
                    </select>
                    {errors.topupFrequency && <p className="text-red-500 text-xs mt-1">{errors.topupFrequency}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.deviceBrandLabel} <span className="text-red-500">*</span></label>
                    <select name="deviceBrand" value={formData.deviceBrand} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.deviceBrand ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.deviceBrandPlaceholder}</option>
                        <option value="Samsung">Samsung</option>
                        <option value="iPhone">iPhone</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Oppo">Oppo</option>
                    </select>
                    {errors.deviceBrand && <p className="text-red-500 text-xs mt-1">{errors.deviceBrand}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.monthlySpendLabel} <span className="text-red-500">*</span></label>
                    <select name="monthlySpend" value={formData.monthlySpend} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.monthlySpend ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                        <option value="">{translations.onboarding.monthlySpendPlaceholder}</option>
                        <option value="1">&lt; 50.000</option>
                        <option value="2">50.000 - 150.000</option>
                        <option value="3">&gt; 150.000</option>
                    </select>
                    {errors.monthlySpend && <p className="text-red-500 text-xs mt-1">{errors.monthlySpend}</p>}
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.onboarding.paymentMethodLabel} <span className="text-red-500">*</span></label>
                 <select name="paymentMethod" value={formData.paymentMethod} onChange={handleSelectChange} className={`w-full h-12 px-4 rounded-lg border bg-slate-50 dark:bg-background-dark text-slate-700 dark:text-gray-200 outline-none focus:ring-primary/20 transition-all ${errors.paymentMethod ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-border-dark focus:border-primary'}`}>
                    <option value="">{translations.onboarding.paymentMethodPlaceholder}</option>
                    <option value="Prabayar">{translations.onboarding.prepaid}</option>
                    <option value="Pascabayar">{translations.onboarding.postpaid}</option>
                 </select>
                 {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="terms" className="w-4 h-4 text-primary border-slate-300 dark:border-gray-600 dark:bg-background-dark rounded focus:ring-primary" />
                <label htmlFor="terms" className="text-sm text-slate-500 dark:text-gray-400">
                    {translations.onboarding.terms}
                </label>
            </div>

            <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                {translations.onboarding.createAccount}
            </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingStep3;
