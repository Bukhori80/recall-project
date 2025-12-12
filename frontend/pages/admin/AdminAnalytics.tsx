import React, { useState, useEffect, forwardRef } from 'react';
import { 
   Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Line, ComposedChart 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- Interface Data Dashboard (Lama) ---
// ... (Bagian ini bisa dipertahankan atau digabung)

// --- Interface Data AI Performance (Baru) ---
interface AIPerformanceData {
  summary: {
    total_users: number;
    total_recommendations: number;
    high_risk_users: number;
    avg_model_confidence: string; // "0.46%"
    projected_monthly_revenue: number;
  };
  category_breakdown: Array<{
    category: string;
    count: number;
    avg_confidence: string; // "0.5%"
  }>;
  top_products: Array<{
    _id: string; // Product Name
    count: number;
    category: string;
  }>;
}

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

const StatCard = ({ title, value, icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 mb-1 font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-${color.replace('bg-', '')}/30`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
);

const AdminAnalytics: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  
  const [aiData, setAiData] = useState<AIPerformanceData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]); // Data olahan untuk grafik gabungan
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { navigate('/login'); return; }

        try {
            // Panggil API AI Performance
            const response = await fetch(`${backendUrl}/api/v1/reports/ai-performance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.status === 'success' && result.data) {
                setAiData(result.data);

                // --- DATA PROCESSING UNTUK GRAFIK ---
                // Kita perlu mengubah string "0.5%" menjadi angka float 0.5 agar bisa digrafikkan
                const processedChartData = result.data.category_breakdown.map((item: any) => ({
                    name: item.category,
                    count: item.count,
                    // Hapus tanda % dan parse ke float
                    confidence: (parseFloat(item.avg_confidence.replace('%', ''))* 100)
                }));
                
                // Urutkan berdasarkan jumlah rekomendasi terbanyak
                processedChartData.sort((a: any, b: any) => b.count - a.count);
                
                setChartData(processedChartData);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [navigate, backendUrl]);

  if (isLoading) return (
      <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Laporan Kinerja AI & Pendapatan</h1>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Live Data</span>
      </div>

      {/* --- SECTION 1: KPI CARDS --- */}
      {aiData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Proyeksi Pendapatan" 
                value={formatRupiah(aiData.summary.projected_monthly_revenue)} 
                icon="payments" 
                color="bg-green-600"
                subtext="Est. Pendapatan Bulanan dari Rekomendasi"
            />
            <StatCard 
                title="Rata-rata Confidence" 
                value={parseFloat(aiData.summary.avg_model_confidence) * 100 + '%'}
                icon="psychology" 
                color="bg-purple-600"
                subtext="Tingkat Keyakinan Model AI"
            />
            <StatCard 
                title="Total Rekomendasi" 
                value={aiData.summary.total_recommendations} 
                icon="recommend" 
                color="bg-blue-600"
                subtext={`Untuk ${aiData.summary.total_users} Pengguna Aktif`}
            />
            <StatCard 
                title="User Risiko Tinggi" 
                value={aiData.summary.high_risk_users} 
                icon="warning" 
                color="bg-red-500"
                subtext="Perlu penanganan segera (Churn Risk)"
            />
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* --- SECTION 2: GRAFIK GABUNGAN (Bar + Line) --- */}
        {/* Visualisasi ini menjawab request: Proyeksi vs Confidence */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-2 text-slate-800">Performa Kategori: Volume vs Tingkat Kepercayaan</h3>
            <p className="text-sm text-slate-500 mb-6">Membandingkan jumlah rekomendasi dengan tingkat keyakinan AI per kategori.</p>
            
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 0, right: 10, bottom: 20, left: 0 }}>
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 11}} />
                        {/* Y Axis Kiri untuk Jumlah (Bar) */}
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{fontSize: 11}} />
                        {/* Y Axis Kanan untuk Confidence (Line) */}
                        <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" unit="%" tick={{fontSize: 11}} />
                        
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(value: any, name: any) => {
                                if (name === "Avg Confidence") return [`${value}%`, name];
                                return [value, name];
                            }}
                        />
                        <Legend />
                        
                        <Bar yAxisId="left" dataKey="count" name="Jumlah Rekomendasi" barSize={30} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" type="monotone" dataKey="confidence" name="Avg Confidence" barSize={30} fill="#7b82f6" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

       

      </div>
       {/* --- SECTION 3: TOP PRODUCTS --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-lg mb-6 text-slate-800">Top 5 Produk Direkomendasikan</h3>
            <div className="flex-1 overflow-y-auto pr-2">
                {aiData?.top_products.map((product, idx) => (
                    <div key={idx} className="mb-5 last:mb-0 group">
                        <div className="flex justify-between items-end mb-1">
                            <span className="font-semibold text-sm text-slate-700 group-hover:text-primary transition-colors">
                                {idx + 1}. {product._id}
                            </span>
                            <span className="text-xs font-bold text-slate-500">{product.count} Recs</span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${(product.count / (aiData.top_products[0]?.count || 1)) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{product.category}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Produk Aktif</span>
                    <span className="font-bold text-slate-800">{aiData?.top_products.length} Items</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminAnalytics;