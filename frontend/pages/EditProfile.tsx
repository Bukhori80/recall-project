import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Swal from 'sweetalert2';
import { ModernSwal } from '../utils/ModernSwal';

const EditProfile: React.FC = () => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
    const navigate = useNavigate();
    const { translations } = useLanguage();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',       // Field baru
        confirmPassword: '' // Field baru
    });

    const [showPassword, setShowPassword] = useState(false); // Untuk toggle lihat password
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Data Awal (Pre-fill Form)
    useEffect(() => {
        const fetchCurrentProfile = async () => {
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
                    const data = result.data;
                    setFormData(prev => ({
                        ...prev,
                        username: data.username || '',
                        email: data.email || '',
                    }));
                } else {
                    throw new Error(result.message);
                }
            } catch (err: any) {
                console.error("Fetch Profile Error:", err);
                setError(translations.validation.profileFetchError);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentProfile();
    }, [navigate, backendUrl, translations]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Handle Submit (PUT Request)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validasi Password Client-side
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError(translations.validation.passwordMismatch);
            setIsSubmitting(false);
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError(translations.validation.passwordMinLength);
            setIsSubmitting(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        const customerId = localStorage.getItem('customer_id');

        if (!token || !customerId) {
            navigate('/login');
            return;
        }

        try {
            const url = `${backendUrl}/api/v1/customers/${customerId}`;

            // Payload: Kirim data yang diubah
            const payload: any = {
                username: formData.username,
                email: formData.email,
            };

            // Hanya kirim password jika user mengisinya
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                await ModernSwal.success(translations.validation.profileUpdateSuccessTitle, translations.validation.profileUpdateSuccessDesc);
                navigate('/profile');
            } else {
                throw new Error(result.message || translations.validation.profileUpdateErrorDesc);
            }

        } catch (err: any) {
            console.error("Update Error:", err);
            ModernSwal.error(translations.validation.profileUpdateErrorTitle, err.message || translations.validation.profileUpdateErrorDesc);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center py-20">
                <div className="animate-pulse flex flex-col gap-4 w-full max-w-md px-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40">
            <div className="w-full max-w-2xl bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark animate-fade-up">

                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{translations.editProfile.title}</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">{translations.editProfile.subtitle}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Foto Profil */}
                    <div className="flex flex-col items-center sm:flex-row gap-6 mb-6">
                        <div
                            className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-700 bg-cover bg-center border-2 border-slate-200 dark:border-gray-600"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDitfF6HI64zEL-dZoCBG50HbkgEn75X_RUqZFB39RMOtOy2wCgb6MkKT0gLn9duQrdKCY0qDRpWCrFh9cdCaF1MZOG3gPVpZk4n7MLYcZpGbyPtq3UKjBUoRU0RDpwSata0BbkxNHJn7UtVwZMta6OrVK6wfXQvGBvYBX_URMm6rjJRyXDRHXqMpdXO_jsK-hOKnHCNUosYXmE74VVD9tXl293FaxiSxAoJLj9M9S7shdlIVi0hTgfyQsqsJh3mjqgWpURvOPkWxo")' }}
                        ></div>
                        <div className="text-center sm:text-left">
                            <button type="button" className="text-primary font-bold text-sm hover:underline">
                                {translations.editProfile.changePhoto}
                            </button>
                            <p className="text-xs text-slate-400 mt-1">{translations.editProfile.photoInst}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.editProfile.fullName}</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>


                        {/* Email */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.editProfile.email}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        {/* --- PASSWORD SECTION --- */}
                        <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{translations.editProfile.changePasswordTitle}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.editProfile.newPasswordLabel}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder={translations.editProfile.newPasswordPlaceholder}
                                            className="w-full h-12 pl-4 pr-12 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900 dark:text-gray-200">{translations.editProfile.confirmPasswordLabel}</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder={translations.editProfile.confirmPasswordPlaceholder}
                                        className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4 justify-end">
                        <Link to="/profile" className="px-6 py-3 text-center border border-slate-200 dark:border-border-dark text-slate-700 dark:text-gray-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                            {translations.common.cancel}
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? translations.editProfile.saving : translations.common.saveChanges}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;