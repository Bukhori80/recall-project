import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Interface sesuai Dokumen Backend (Diperbarui)
interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    validity_days: number;
    quota_main: number;
    quota_night: number;
    quota_apps: number;
    // Kolom baru sesuai contoh data
    redirect_url?: string; // URL Pembelian
    image_url?: string; // URL Gambar Produk
    isActive?: boolean;
    // Kolom tambahan opsional
    calls_same?: number;
    sms_same?: number;
}

const ProductList: React.FC = () => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category') || 'General'; // Default category
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { translations } = useLanguage();
    const navigate = useNavigate();

    // Format Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                 navigate('/login');
                 return;
            }

            try {
                // Panggil API GET /products dengan query param category
                const url = `${backendUrl}/api/v1/products?category=${categoryQuery}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    setProducts(result.data || []);
                } else {
                    throw new Error(result.message || 'Gagal mengambil daftar produk');
                }

            } catch (err: any) {
                console.error("Fetch Products Error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categoryQuery, navigate, backendUrl]);

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[960px]">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-slate-200 dark:bg-gray-700 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex justify-center items-center py-20">
                <div className="text-center">
                     <span className="material-symbols-outlined text-6xl text-red-400">error</span>
                     <p className="text-slate-600 dark:text-gray-300 mt-2">{error}</p>
                     <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-40">
            <div className="w-full max-w-[960px]">
                <div className="mb-6">
                    <Link to="/categories" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Kategori
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Paket {categoryQuery}</h1>
                    <p className="text-slate-500 dark:text-gray-400">Pilih paket terbaik untuk kebutuhan Anda.</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-gray-800 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Tidak ada produk ditemukan untuk kategori ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Link 
                                to={`/product/${product._id}`} 
                                key={product._id}
                                // Card styling diubah untuk menempatkan gambar di atas
                                className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group relative overflow-hidden"
                            >
                                {/* BAGIAN GAMBAR PRODUK */}
                                <div className="relative w-full h-36 md:h-40 overflow-hidden bg-slate-100 dark:bg-gray-700 rounded-t-xl">
                                    {product.image_url ? (
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            // Fallback image jika URL error
                                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x160?text=No+Image'; }} 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">photo_library</span>
                                        </div>
                                    )}
                                    {/* Category Label Overlay */}
                                    <span className="absolute top-2 left-2 px-3 py-1 text-xs font-bold bg-white/80 backdrop-blur-sm text-slate-800 rounded-full shadow-sm">
                                        {product.category}
                                    </span>
                                </div>

                                {/* KONTEN DETAIL CARD */}
                                <div className="p-4 flex flex-col justify-between flex-grow">
                                    <div>
                                        {/* Hapus bagian yang sebelumnya menampilkan icon/background dummy */}
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 leading-snug line-clamp-2 min-h-[56px]">{product.name}</h3>
                                        
                                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                                        
                                        {/* Benefit Tags */}
                                        <div className="flex gap-2 flex-wrap mb-4 border-t border-slate-100 dark:border-gray-700 pt-3">
                                            {product.quota_main > 0 && (
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">
                                                    <span className='font-bold'>{product.quota_main} GB</span> Utama
                                                </span>
                                            )}
                                            {product.quota_night > 0 && (
                                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-medium">
                                                    {product.quota_night} GB Malam
                                                </span>
                                            )}
                                            {product.validity_days && (
                                                <span className="text-xs bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded text-slate-600 dark:text-gray-300 font-medium">
                                                    {product.validity_days} Hari
                                                </span>
                                            )}
                                            {(product.calls_same && product.calls_same > 0) && (
                                                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium">
                                                    Telp {product.calls_same} Menit
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Price & Action */}
                                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-gray-700 flex justify-between items-center">
                                        <div>
                                            <span className="text-sm text-slate-500 dark:text-gray-400 block leading-none">Mulai dari</span>
                                            <span className="text-2xl font-black text-primary">{formatRupiah(product.price)}</span>
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-auto group-hover:px-4 group-hover:h-10 text-sm font-semibold group-hover:shadow-lg group-hover:shadow-primary/30"
                                        >
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                            <span className="hidden group-hover:block ml-1">Lihat</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;