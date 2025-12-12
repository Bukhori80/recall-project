import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// --- Interface Sesuai Contoh Data User ---
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  ml_label: string;      // Label untuk mesin learning
  image_url: string;     // URL Gambar produk
  redirect_url: string;  // URL tujuan saat user klik beli
  isActive: boolean;     // Status produk
}

const AdminProducts: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Data Booster',
    price: 0,
    ml_label: '',
    image_url: '',
    redirect_url: '',
    isActive: true
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/admin/login'); return; }

    try {
      const response = await fetch(`${backendUrl}/api/v1/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setProducts(result.data);
    } catch (error) { 
        console.error("Fetch error:", error); 
    } finally { 
        setIsLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Data Booster',
      price: 0,
      ml_label: '',
      image_url: '',
      redirect_url: '',
      isActive: true
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setFormData(product);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    
    const url = isEditMode 
      ? `${backendUrl}/api/v1/products/${formData._id}` 
      : `${backendUrl}/api/v1/products`;
    
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire('Berhasil!', `Produk berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}`, 'success');
        setShowModal(false);
        fetchProducts();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menyimpan produk');
      }
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
        title: 'Hapus Produk?',
        text: "User tidak akan bisa melihat produk ini lagi.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'Batal'
    });
    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem('accessToken');
    try {
        await fetch(`${backendUrl}/api/v1/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchProducts();
        Swal.fire('Dihapus!', 'Produk telah dihapus.', 'success');
    } catch (e) {
        Swal.fire('Error', 'Gagal menghapus produk.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Katalog Produk</h1>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_box</span> Tambah Produk
        </button>
      </div>

      {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)}
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                  {/* Product Image Preview */}
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                      {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <span className="material-symbols-outlined text-4xl">image</span>
                          </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-blue-600 text-[10px] font-black rounded uppercase shadow-sm">{product.category}</span>
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm ${product.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                  </div>

                  <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{product.name}</h3>
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2 h-8">{product.description}</p>
                      
                      <div className="mt-4 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Harga</p>
                            <p className="font-black text-primary text-xl">Rp {product.price?.toLocaleString('id-ID')}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><span className="material-symbols-outlined">edit</span></button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><span className="material-symbols-outlined">delete</span></button>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
        </div>
      )}

      {/* --- MODAL CRUD PRODUK --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-zoom-in my-auto">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <p className="text-xs text-slate-500">Isi detail produk untuk sistem rekomendasi</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* Row 1: Nama & ML Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</label>
                    <input required className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Paket Super 100GB" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ML Label (AI)</label>
                    <input required className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                           value={formData.ml_label} onChange={e => setFormData({...formData, ml_label: e.target.value})} placeholder="Contoh: Data Booster Premium" />
                </div>
              </div>

              {/* Row 2: Kategori & Harga */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                  <select className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-slate-700" 
                          value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Data Booster">Data Booster</option>
                    <option value="Roaming Pass">Roaming Pass</option>
                    <option value="Streaming Partner Pack">Streaming Partner</option>
                    <option value="Voice Bundle">Voice Bundle</option>
                    <option value="Top-up Promo">Top-up Promo</option>
                    <option value="Retention Offer">Retention Offer</option>
                    <option value="Family Plan Offer">Family Plan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp)</label>
                  <input type="number" required className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                         value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
              </div>

              {/* Row 3: URLs */}
              <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
                  <input className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-slate-700" 
                         value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Redirect URL (Link Beli)</label>
                  <input required className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-slate-700" 
                         value={formData.redirect_url} onChange={e => setFormData({...formData, redirect_url: e.target.value})} placeholder="https://my.telkomsel.com/..." />
              </div>

              {/* Row 4: Desc & Active Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                <textarea rows={2} className="w-full border-slate-200 border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-slate-700" 
                          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" id="isActive" className="w-5 h-5 rounded accent-primary" 
                         checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Produk Aktif (Tampilkan ke User)</label>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors">Batal</button>
              <button disabled={isSubmitting} type="submit" className="px-10 py-2.5 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 transition-all hover:bg-blue-700 disabled:bg-slate-300">
                {isSubmitting ? 'Memproses...' : (isEditMode ? 'SIMPAN PERUBAHAN' : 'TAMBAH PRODUK')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

// contoh input data product
/*
{
  "name": "Paket Super 100GB",
  "description": "Dapatkan kuota 100GB untuk semua jaringan dengan masa aktif 30 hari.",
  "category": "Data Booster",
  "price": 100000,
  "ml_label": "Data Booster Premium",
  "image_url": "https://placehold.co/600x400/red/white?text=Paket+Super+100GB",
  "redirect_url": "https://my.telkomsel.com/purchase/paket-super-100gb",
  "isActive": true
}
*/