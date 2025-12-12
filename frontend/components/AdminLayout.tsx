import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menus = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Pelanggan', path: '/admin/customers', icon: 'group' },
    { name: 'Produk', path: '/admin/products', icon: 'inventory_2' },
    { name: 'Analytics & Laporan', path: '/admin/analytics', icon: 'analytics' },
  ];

  const handleLogout = () => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/login');
      localStorage.clear();
      return;
    } else {
      navigate('admin/login');
      localStorage.clear();
      return
    }

  };
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? <span className="text-xl font-bold tracking-wider">RECALL ADMIN</span> : <span className="text-xl font-bold">R</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-4 px-6 py-3 transition-colors ${location.pathname === menu.path ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="material-symbols-outlined">{menu.icon}</span>
              {isSidebarOpen && <span className="font-medium">{menu.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-4 px-2 text-slate-400 hover:text-red-400 transition-colors w-full">
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;