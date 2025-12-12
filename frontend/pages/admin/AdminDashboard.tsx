import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Interface sesuai response /reports/dashboard di PDF Hal 44
interface DashboardStats {
  totalCustomers: number;
  totalRecommendations: number;
  highChurnCount: number;
  activeProducts: number;
  recentActivity: any[]; // Opsional jika ada
}

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalRecommendations: 0,
    highChurnCount: 0,
    activeProducts: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return; }

      try {
        // MENGGUNAKAN SUPER-ENDPOINT DARI PDF HALAMAN 44
        const response = await fetch(`${backendUrl}/api/v1/reports/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) { navigate('/login'); return; }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          // Mapping data dari backend ke format UI
          // Asumsi: Backend menghitung total dari array report
          const data = result.data;
          console.log(result.data);
          // Hitung total dari data agregat (karena API mengembalikan array status)
          const churnHigh = data.churnStatus?.find((c: any) => c.segment === 'High')?.count || 0;
          const totalRecs = data.recoStatus?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
          // Anggap total customers didapat dari endpoint lain atau agregat churn (Low + Medium + High)
          const totalCust = data.churnStatus?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

          setStats({
            totalCustomers: totalCust,
            totalRecommendations: totalRecs,
            highChurnCount: churnHigh,
            activeProducts: data.recoType.length || 0, // Jumlah kategori produk aktif
            recentActivity: [] 
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, backendUrl]);

  if (isLoading) return <div className="p-8">Loading Dashboard Data...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      
      {/* Stats Grid */}
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pelanggan" value={stats.totalCustomers} icon="group" color="bg-blue-600" />
        <StatCard title="Rekomendasi Dibuat" value={stats.totalRecommendations} icon="auto_awesome" color="bg-purple-600" />
        <StatCard title="Churn Risk Tinggi" value={stats.highChurnCount} icon="warning" color="bg-red-500" />
        <StatCard title="Kategori Produk" value={stats.activeProducts} icon="inventory_2" color="bg-orange-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg mb-4">Informasi Sistem</h3>
        <p className="text-slate-500 text-sm">Data diambil dari endpoint <code>/reports/dashboard</code> (Swagger Page 44). Menampilkan agregasi real-time dari perilaku pelanggan dan performa rekomendasi.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;