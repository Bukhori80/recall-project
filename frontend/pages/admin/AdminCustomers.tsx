import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Customer {
  _id: string;
  customer_id: string;
  username: string;
  email: string;
  plan_type: string;
  device_brand: string;
  profile: {
    avg_data_usage_gb: number;
    monthly_spend: number;
    churn_risk: number;
  };
}

const AdminCustomers: React.FC = () => {
  const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/admin/login'); return; }

    try {
      const response = await fetch(`${backendUrl}/api/v1/customers?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setCustomers(result.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Hapus Pelanggan?',
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem('accessToken');
    console.log(token)
    try {
      const response = await fetch(`${backendUrl}/api/v1/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        Swal.fire('Terhapus!', 'Pelanggan telah dihapus.', 'success');
        fetchCustomers();
      }
    } catch (error) { console.error(error); }
  };

  const handleEditClick = (cust: Customer) => {
    setSelectedCustomer(cust);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${backendUrl}/api/v1/customers/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          plan_type: selectedCustomer.plan_type,
          device_brand: selectedCustomer.device_brand,
          profile: {
            avg_data_usage_gb: selectedCustomer.profile.avg_data_usage_gb,
            monthly_spend: selectedCustomer.profile.monthly_spend
          }
        })
      });

      if (response.ok) {
        Swal.fire('Berhasil!', 'Data pelanggan diperbarui.', 'success');
        setShowEditModal(false);
        fetchCustomers();
      }
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pelanggan</h1>
        <button onClick={fetchCustomers} className="bg-white border p-2 rounded-lg hover:bg-slate-50">
            <span className="material-symbols-outlined text-slate-600">refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Churn Risk</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((cust) => (
              <tr key={cust._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{cust.username}</td>
                <td className="p-4 text-slate-500">{cust.email}</td>
                <td className="p-4 text-xs text-slate-500 font-bold uppercase">{cust.plan_type}</td>
                <td className="p-4 text-slate-500">{cust.profile?.avg_data_usage_gb} GB</td>
                <td className="p-4 text-slate-500">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                    (cust.profile?.churn_risk || 0) > 0.7 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {((cust.profile?.churn_risk || 0) * 100).toFixed(0)}% Risk
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEditClick(cust)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(cust.customer_id)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT PELANGGAN */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-up">
            <div className="p-6 border-b bg-slate-50">
              <h3 className="text-xl font-bold">Edit Pelanggan: {selectedCustomer.username}</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipe Plan</label>
                <select 
                  className="w-full text-slate-500 border p-2 rounded-lg"
                  value={selectedCustomer.plan_type}
                  onChange={e => setSelectedCustomer({...selectedCustomer, plan_type: e.target.value})}
                >
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Merek Device</label>
                <input 
                  className="w-full border p-2 rounded-lg text-slate-500"
                  value={selectedCustomer.device_brand}
                  onChange={e => setSelectedCustomer({...selectedCustomer, device_brand: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Rata-rata Kuota (GB)</label>
                <input 
                  type="number"
                  className="w-full border p-2 rounded-lg text-slate-500"
                  value={selectedCustomer.profile.avg_data_usage_gb}
                  onChange={e => setSelectedCustomer({
                    ...selectedCustomer, 
                    profile: { ...selectedCustomer.profile, avg_data_usage_gb: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Pengeluaran (Rp)</label>
                <input 
                  type="number"
                  className="w-full border p-2 rounded-lg text-slate-500"
                  value={selectedCustomer.profile.monthly_spend}
                  onChange={e => setSelectedCustomer({
                    ...selectedCustomer, 
                    profile: { ...selectedCustomer.profile, monthly_spend: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-500">Batal</button>
              <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;