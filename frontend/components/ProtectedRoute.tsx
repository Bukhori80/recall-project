import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLanguage } from '../contexts/LanguageContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: 'admin' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Konfigurasi pesan berdasarkan bahasa
  const messages = {
    id: {
      title: 'Akses Ditolak!',
      text: requiredRole === 'admin' 
        ? 'Halaman ini hanya untuk Administrator.' 
        : 'Silakan login terlebih dahulu untuk mengakses fitur ini.',
      confirm: 'Masuk Sekarang'
    },
    en: {
      title: 'Access Denied!',
      text: requiredRole === 'admin' 
        ? 'This page is for Administrators only.' 
        : 'Please login first to access this feature.',
      confirm: 'Login Now'
    }
  };

  const activeMsg = language === 'id' ? messages.id : messages.en;

  useEffect(() => {
    // Jika tidak ada token ATAU role tidak sesuai
    if (!token || userRole !== requiredRole) {
      Swal.fire({
        title: activeMsg.title,
        text: activeMsg.text,
        icon: 'error',
        confirmButtonColor: '#1B57F1', // Warna primer Recall
        confirmButtonText: activeMsg.confirm,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Tentukan arah login
          const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login';
          navigate(loginPath, { replace: true, state: { from: location } });
        }
      });
    }
  }, [token, userRole, requiredRole, navigate, location, activeMsg]);

  // Jika otorisasi belum valid, jangan render children dulu (biarkan kosong sampai redirect)
  if (!token || userRole !== requiredRole) {
    return <div className="min-h-screen bg-background-light dark:bg-background-dark" />;
  }

  return children;
};

export default ProtectedRoute;