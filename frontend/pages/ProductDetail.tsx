import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../contexts/LanguageContext';
import { ModernSwal } from '../utils/ModernSwal';

// --- Interfaces (Diperbarui) ---
interface ProductDetailData {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    validity_days: number;
    quota_main: number;
    quota_night: number;
    quota_apps: number;
    calls_same?: number;
    sms_same?: number;
    // Kolom baru sesuai contoh data
    // ml_label DIHAPUS
    redirect_url?: string; 
    image_url?: string; // URL Gambar Produk
}

// Komponen UI Kecil (TIDAK BERUBAH)
const BenefitItem = ({ icon, title, subtitle }: { icon: string, title: string, subtitle: string }) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">{subtitle}</p>
        </div>
    </div>
);

const ProductDetail: React.FC = () => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { translations, language } = useLanguage();

    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- AI States ---
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    // 1. Fetch Product Detail
    useEffect(() => {
        const fetchProductDetail = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const url = `${backendUrl}/api/v1/products/${id}`;
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
                    setProduct(result.data);
                    setAiInsight(null); // Reset insight saat ganti produk
                } else {
                    throw new Error(result.message || 'Produk tidak ditemukan');
                }
            } catch (err: any) {
                console.error("Fetch Detail Error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id, navigate, backendUrl]);

    // 2. Fungsi Agentic AI: Analisis Kecocokan (TIDAK BERUBAH)
    const handleAnalyzeSuitability = async () => {
        if (!product || !geminiApiKey) return;

        setIsAnalyzing(true);
        const token = localStorage.getItem('accessToken');
        const customerId = localStorage.getItem('customer_id');

        try {
            // A. Ambil Data Profil User (Behavior)
            const profileRes = await fetch(`${backendUrl}/api/v1/customers/${customerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const profileJson = await profileRes.json();
            const userProfile = profileJson.data.profile; // Data: usage, spend, video_pct, dll.

            // B. Panggil Gemini
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.5-preview" }); 

            const prompt = `
            Bertindaklah sebagai Konsultan Analis Telekomunikasi yang jujur dan personal bernama "Recall AI".
            
            Tugasmu: Analisis apakah produk ini cocok untuk pengguna berdasarkan data perilaku mereka.
            
            DATA PENGGUNA:
            - Rata-rata Kuota: ${userProfile.avg_data_usage_gb} GB/bulan
            - Budget Bulanan: Rp ${userProfile.monthly_spend}
            - Kebiasaan Video: ${(userProfile.pct_video_usage * 100).toFixed(0)}% dari penggunaan
            - Travel Score: ${userProfile.travel_score} (0=Jarang, 1=Sering)
            
            DATA PRODUK YANG DILIHAT:
            - Nama: ${product.name}
            - Deskripsi: ${product.description}
            - Harga: Rp ${product.price}
            - Kategori: ${product.category}
            
            INSTRUKSI OUTPUT:
            1. Berikan analisis singkat (maksimal 3 kalimat) kenapa cocok atau tidak.
            2. Jika user boros (harga produk > budget) atau kuota kurang, peringatkan dengan sopan.
            3. Gunakan bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'}.
            4. Dorong agar menggunakan fitur rekomendasi dari platform kami.
            5. Jaga nada bicara yang ramah dan profesional.
        `;

            const result = await model.generateContent(prompt);
            const response = result.response.text();

            setAiInsight(response);
            ModernSwal.success("Analisis Selesai", "Rekomendasi kecocokan telah berhasil dibuat untuk Anda.", 3000);

        } catch (err) {
            console.error("AI Error:", err);
            setAiInsight("Maaf, AI sedang sibuk. Gagal menganalisis kecocokan saat ini.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- RENDER ---

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center py-8 px-4 animate-pulse">
                <div className="w-full max-w-6xl flex flex-col gap-6">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-64 bg-slate-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex-1 flex justify-center items-center py-20">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Produk Tidak Ditemukan</h2>
                    <Link to="/categories" className="px-4 py-2 bg-primary text-white rounded-lg mt-4 inline-block">Kembali</Link>
                </div>
            </div>
        );
    }
    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10">
            <div className="w-full max-w-6xl flex flex-col gap-6">

                {/* Breadcrumb - Modern Style */}
                <div className="flex gap-2 text-sm text-slate-500 dark:text-gray-400 items-center animate-fade-up">
                    <Link to="/categories" className="hover:text-primary transition-colors">Kategori</Link>
                    <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                    <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* KOLOM KIRI: Detail Produk */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>

                        {/* Header Section */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 p-8 sm:p-10 text-white shadow-xl shadow-blue-900/20">
                            
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className='flex items-center gap-3 mb-4'>
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {product.category}
                                    </span>
                                    {/* Hapus tampilan ML Label */}
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">{product.name}</h1>
                                <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">{product.description}</p>
                            </div>
                        </div>

                        {/* Product Image Section (NEW) */}
                        {product.image_url && (
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 shadow-lg border border-slate-200 dark:border-border-dark">
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="w-full h-40 object-cover rounded-lg"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>

                    {/* KOLOM KANAN: Sidebar & AI Insight (Tidak Berubah) */}
                    <div className="flex flex-col gap-6 animate-fade-up sticky top-6" style={{ animationDelay: '200ms' }}>

                        {/* Card Harga & Beli */}
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="text-center mb-6">
                                <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wide">Harga Paket</p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{formatRupiah(product.price)}</p>
                            </div>

                            <div className="space-y-3">
                                {product.redirect_url ? (
                                    <a
                                        href={product.redirect_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-14 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <span>Beli Sekarang di Partner</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">open_in_new</span>
                                    </a>
                                ) : (
                                    <button
                                        className="w-full h-14 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group"
                                        onClick={() => ModernSwal.warning('Informasi', 'Redirect URL untuk pembelian paket ini belum tersedia.')}
                                    >
                                        <span>Beli Sekarang (Offline)</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* --- AI AGENTIC INSIGHT SECTION (TIDAK BERUBAH) --- */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-900/20">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 p-[2px] shadow-lg">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl text-blue-400">psychology</span>
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-white mb-1">Recall AI Advisor</h4>
                                <p className="text-sm text-indigo-200 mb-6">Analisis kecocokan cerdas berdasarkan pola penggunaan Anda.</p>

                                {!aiInsight && !isAnalyzing && (
                                    <button
                                        onClick={handleAnalyzeSuitability}
                                        className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Cek Kecocokan
                                    </button>
                                )}

                                {isAnalyzing && (
                                    <div className="flex items-center gap-3 text-indigo-200">
                                        <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                                        <span className="text-sm">Sedang menganalisis...</span>
                                    </div>
                                )}

                                {aiInsight && !isAnalyzing && (
                                    <div className="animate-fade-up w-full">
                                        <div className="text-sm text-indigo-100 leading-relaxed text-left bg-white/5 p-4 rounded-xl border border-white/10 mb-4 h-max max-h-60 overflow-y-auto scrollbar-thin">
                                            {aiInsight}
                                        </div>
                                        <button
                                            onClick={handleAnalyzeSuitability}
                                            className="text-xs text-indigo-300 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                            Analisis Ulang
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* --- END AI SECTION --- */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;