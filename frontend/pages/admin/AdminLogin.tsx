import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const AdminLogin: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Endpoint sesuai Swagger Page 2: POST /auth/login
      const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('role', 'admin'); // <--- Tambahkan ini
        localStorage.setItem('username', 'Administrator');
        navigate('/admin/dashboard');
    }else {
        throw new Error(result.message || 'Login gagal. Periksa kembali email & password.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <LanguageSwitcher />
      </div>

      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="text-primary w-12 h-12 mb-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">
          Recall Admin
        </h1>
        <p className="text-slate-500 text-sm mt-1">Management Information System</p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-border-dark animate-fade-up">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access</h2>
          <p className="text-sm text-slate-500">Silakan masuk untuk mengelola sistem.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@telco.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-slate-900 dark:bg-primary text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span className="animate-spin material-symbols-outlined">progress_activity</span>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-slate-400 text-xs">
        &copy; 2025 Recall System &bull; Internal Use Only
      </div>
    </div>
  );
};

export default AdminLogin;