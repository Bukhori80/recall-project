# 🚀 RECALL Frontend

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

Aplikasi frontend modern dan responsif untuk RECALL (Recommendation & Churn Analysis Learning Lab) - dibangun dengan React, TypeScript, dan Vite.

> **Kode Proyek:** A25-CS019  
> **Tema:** Retensi Pelanggan Telekomunikasi  
> **Program:** ASAH 2025

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Halaman yang Tersedia](#halaman-yang-tersedia)
- [Komponen](#komponen)
- [Integrasi API](#integrasi-api)
- [Build untuk Production](#build-untuk-production)
- [Environment Variables](#environment-variables)
- [Tim](#tim)

---

## 🎯 Gambaran Umum

RECALL Frontend adalah aplikasi web modern yang menyediakan dua interface utama:

1. **Portal Pelanggan**: Dashboard personal untuk pelanggan telco melihat rekomendasi, chat dengan AI, mengelola profil, dan browse produk
2. **Dashboard Admin**: Panel admin komprehensif untuk mengelola pelanggan, produk, melihat analitik, dan monitoring sistem

Aplikasi ini menampilkan UI/UX yang indah dengan animasi halus, desain responsif, dan visualisasi data real-time.

---

## ✨ Fitur Utama

### 🏠 Portal Pelanggan

- **Landing Page**: Halaman hero yang indah dengan highlight fitur
- **Dashboard**: Dashboard personal pelanggan dengan statistik penggunaan
- **Rekomendasi AI**: Saran produk cerdas berdasarkan pola penggunaan
- **Katalog Produk**: Browse dan eksplorasi produk telco
- **Chatbot AI**: Chatbot cerdas powered by Google Gemini AI
- **Manajemen Profil**: Update informasi dan preferensi personal
- **Autentikasi**: Sistem login dan registrasi yang aman

### 👨‍💼 Dashboard Admin

- **Overview Analitik**: Dashboard komprehensif dengan metrik kunci
- **Manajemen Pelanggan**: Lihat, cari, dan kelola pelanggan
- **Manajemen Produk**: Operasi CRUD untuk produk
- **Pelacakan Rekomendasi**: Monitor performa rekomendasi
- **Laporan**: Analitik dan pelaporan terperinci

### 🎨 Fitur UI/UX

- **Desain Responsif**: Bekerja sempurna di desktop, tablet, dan mobile
- **Dark Mode Ready**: UI glassmorphism modern
- **Animasi Halus**: Powered by Framer Motion
- **Chart Interaktif**: Visualisasi data dengan Recharts
- **Loading States**: Skeleton loader dan transisi elegant
- **Sistem Alert**: Notifikasi cantik dengan SweetAlert2

---

## 💻 Teknologi yang Digunakan

| Teknologi | Versi | Tujuan |
|-----------|-------|--------|
| **React** | 19.2.0 | Library UI |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool & dev server |
| **React Router** | 7.9.6 | Client-side routing |
| **Framer Motion** | 12.23.25 | Animasi |
| **Recharts** | 3.5.1 | Charts & visualisasi data |
| **Google Generative AI** | 0.24.1 | Integrasi chatbot AI |
| **SweetAlert2** | 11.26.4 | Alert cantik |

---

## 📋 Persyaratan Sistem

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js**: v18 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm**: v9 atau lebih tinggi (sudah termasuk dengan Node.js)
- **Backend API**: Berjalan di `http://localhost:3001` (lihat dokumentasi backend)
- **ML Services**: Berjalan di `http://localhost:5000` (opsional, untuk rekomendasi AI)
- **Google Gemini API Key**: Untuk fungsionalitas chatbot AI

---

## 📦 Instalasi

### Langkah 1: Navigasi ke Direktori Frontend

```bash
cd Project-Recall/frontend
```

### Langkah 2: Install Dependencies

```bash
npm install
```

Ini akan menginstal semua package yang diperlukan:
- React dan React DOM
- TypeScript dan type definitions
- Vite dan React plugin
- React Router DOM untuk routing
- Framer Motion untuk animasi
- Recharts untuk charts
- Google Generative AI SDK
- SweetAlert2 untuk alerts

---

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` di direktori root frontend:

```env
# Konfigurasi API
VITE_API_URL=http://localhost:3001/api/v1

# Konfigurasi Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Mendapatkan Gemini API Key:**

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Buat API key baru
3. Copy dan paste di file `.env` Anda

**Catatan Penting:**
- Jangan commit `.env` ke version control
- Gunakan API key berbeda untuk development dan production
- Backend API harus berjalan agar frontend dapat berfungsi dengan baik

---

## 🚀 Menjalankan Aplikasi

### Mode Development

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

**Output yang Diharapkan:**
```
  VITE v6.2.0  ready in 350 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

**Fitur di Mode Development:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh saat file berubah
- ✅ Source maps untuk debugging
- ✅ TypeScript type checking

### Preview Build Production

```bash
npm run build
npm run preview
```

Preview akan tersedia di: **http://localhost:4173** (atau serupa)

---

## 📁 Struktur Proyek

```
frontend/
├── public/                       # Asset statis
│   ├── logo.png                  
│   ├── favicon.ico               
│   └── ...
├── pages/                        # Komponen halaman
│   ├── Landing.tsx               # Landing page
│   ├── Login.tsx                 # Login pelanggan
│   ├── Register.tsx              # Registrasi pelanggan
│   ├── Dashboard.tsx             # Dashboard pelanggan
│   ├── Recommendation.tsx        # Halaman rekomendasi
│   ├── ProductList.tsx           # Katalog produk
│   ├── ProductDetail.tsx         # Detail produk
│   ├── Chat.tsx                  # Chatbot AI
│   ├── Profile.tsx               # Profil user
│   ├── EditProfile.tsx           # Edit profil
│   └── admin/                    # Halaman admin
│       ├── AdminDashboard.tsx    
│       ├── CustomerManagement.tsx
│       ├── ProductManagement.tsx 
│       ├── RecommendationTracking.tsx
│       └── Reports.tsx           
├── components/                   # Komponen reusable
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer
│   ├── ProductCard.tsx           # Komponen product card
│   ├── StatCard.tsx              # Card statistik
│   ├── ChartComponents.tsx       # Wrapper chart
│   ├── LoadingSpinner.tsx        # Loading states
│   └── ...
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Context autentikasi
├── utils/                        # Fungsi utility
│   └── api.ts                    # API client
├── src/                          # File source tambahan
├── App.tsx                       # Komponen app utama
├── index.tsx                     # Entry point
├── vite.config.ts                # Konfigurasi Vite
├── tsconfig.json                 # Konfigurasi TypeScript
├── package.json                  # Dependencies dan scripts
└── README.md                     # File ini
```

---

## 📄 Halaman yang Tersedia

### Halaman Pelanggan

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| **Landing** | `/` | Home page dengan overview fitur |
| **Login** | `/login` | Form login pelanggan |
| **Register** | `/register` | Registrasi multi-step |
| **Dashboard** | `/dashboard` | Dashboard personal pelanggan |
| **Recommendations** | `/recommendations` | Saran produk berbasis AI |
| **Products** | `/products` | Browse katalog produk |
| **Product Detail** | `/products/:id` | Informasi produk detail |
| **Chat** | `/chat` | Interface chatbot AI |
| **Profile** | `/profile` | Lihat profil user |
| **Edit Profile** | `/edit-profile` | Update informasi profil |

### Halaman Admin

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| **Admin Dashboard** | `/admin/dashboard` | Analitik dan overview |
| **Customer Management** | `/admin/customers` | Kelola pelanggan |
| **Product Management** | `/admin/products` | Kelola produk |
| **Recommendation Tracking** | `/admin/recommendations` | Lacak rekomendasi |
| **Reports** | `/admin/reports` | Lihat laporan detail |

---

## 🧩 Komponen

### Komponen Inti

**Navbar**
- Navigasi responsif dengan menu mobile
- Manajemen state autentikasi
- Link dinamis berdasarkan peran user

**Footer**
- Informasi perusahaan
- Quick links
- Link media sosial

**ProductCard**
- Menampilkan informasi produk
- Harga, kuota, masa berlaku
- Tombol aksi (Lihat Detail, Subscribe)

**StatCard**
- Menampilkan informasi statistik
- Icon dan animasi
- Digunakan di dashboard

### Komponen Fitur

**Chatbot AI**
- Powered by Google Gemini
- Interface percakapan
- Response context-aware
- Riwayat pesan

**Charts**
- Line charts (trend penggunaan)
- Bar charts (perbandingan)
- Pie charts (distribusi)
- Dibangun dengan Recharts

**Form Autentikasi**
- Validasi form
- Error handling
- Loading states
- Feedback sukses

---

## 🔗 Integrasi API

### API Client (`utils/api.ts`)

Aplikasi menggunakan API client terpusat untuk semua komunikasi backend:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Contoh: Fetch customers
const getCustomers = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/customers`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

### Alur Autentikasi

1. User login via `/login`
2. Backend mengembalikan JWT token
3. Token disimpan di `localStorage`
4. Token disertakan di semua request berikutnya
5. Protected routes mengecek token yang valid

### Endpoint Utama yang Digunakan

- `POST /auth/customer/login` - Login pelanggan
- `POST /auth/customer/register` - Registrasi pelanggan
- `GET /customers/:id` - Ambil profil pelanggan
- `GET /products` - Fetch produk
- `GET /recommendations` - Ambil rekomendasi
- `POST /recommendations/:customerId/generate-ai` - Generate rekomendasi AI
- `POST /chatbot/message` - Kirim pesan chatbot

Untuk dokumentasi API lengkap, lihat [Dokumentasi API Backend](../backend/docs/API_DOCUMENTATION.md).

---

## 🏗️ Build untuk Production

### Build Aplikasi

```bash
npm run build
```

Ini membuat build production yang dioptimasi di folder `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Bundle JavaScript
│   ├── index-[hash].css     # Bundle CSS
│   └── ...
└── ...
```

**Optimasi Build:**
- ✅ Minifikasi code
- ✅ Tree shaking (hapus code yang tidak digunakan)
- ✅ Optimasi asset
- ✅ Code splitting
- ✅ Lazy loading untuk routes

### Deploy Build

**Opsi 1: Vercel** (Direkomendasikan untuk React apps)
```bash
npm install -g vercel
vercel --prod
```

**Opsi 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Opsi 3: Static Server**
```bash
npm install -g serve
serve -s dist -l 3000
```

**Opsi 4: Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔐 Environment Variables

### Daftar Lengkap

| Variable | Required | Deskripsi | Contoh |
|----------|----------|-----------|--------|
| `VITE_API_URL` | Ya | URL base backend API | `http://localhost:3001/api/v1` |
| `GEMINI_API_KEY` | Ya | Google Gemini AI API key | `AIzaSy...` |

**Konfigurasi Spesifik Environment:**

**Development (`.env`):**
```env
VITE_API_URL=http://localhost:3001/api/v1
GEMINI_API_KEY=your_dev_api_key
```

**Production (`.env.production`):**
```env
VITE_API_URL=https://api.your-production-domain.com/api/v1
GEMINI_API_KEY=your_prod_api_key
```

**Penting:** Vite hanya mengekspos variabel dengan prefix `VITE_` ke client. `GEMINI_API_KEY` diakses via `process.env` di `vite.config.ts`.

---

## 🎨 Kustomisasi

### Styling

Aplikasi menggunakan inline styles dan CSS untuk styling. Pattern style utama:

**Warna:**
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)

**Glassmorphism:**
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

## 🧪 Pengujian

### Checklist Testing Manual

**Alur Pelanggan:**
- [ ] Landing page load dengan benar
- [ ] User bisa register dengan data valid
- [ ] User bisa login dengan kredensial
- [ ] Dashboard menampilkan data user
- [ ] Rekomendasi di-generate
- [ ] Produk bisa di-browse dan dilihat
- [ ] Chatbot merespon pesan
- [ ] Profil bisa diupdate

**Alur Admin:**
- [ ] Admin bisa login
- [ ] Dashboard menunjukkan analitik
- [ ] Pelanggan bisa dilihat dan dicari
- [ ] Produk bisa dibuat/edit/dihapus
- [ ] Rekomendasi dilacak
- [ ] Laporan ditampilkan dengan benar

---

## 🐛 Troubleshooting

### Port 3000 Sudah Digunakan

**Error:** `Port 3000 is already in use`

**Solusi:**
```bash
# Ubah port di vite.config.ts
server: {
  port: 3001,
  // ...
}
```

### Error Koneksi API

**Error:** `Failed to fetch` atau `Network Error`

**Cek:**
1. Backend berjalan di `http://localhost:3001`
2. `VITE_API_URL` di `.env` sudah benar
3. CORS diaktifkan di backend
4. Tidak ada firewall yang memblokir koneksi

### Error Build

**Error:** Error kompilasi TypeScript

**Solusi:**
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install

# Cek konfigurasi TypeScript
npx tsc --noEmit
```

### Halaman Blank Setelah Build

**Penyebab:** Masalah base path router

**Solusi:**
Pastikan `base: './'` di `vite.config.ts` untuk relative paths.

---

## 📚 Resource Tambahan

- [Dokumentasi React](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Panduan Vite](https://vitejs.dev/guide/)
- [Dokumentasi React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Dokumentasi Recharts](https://recharts.org/)

---

## 👥 Tim

**Kode Tim:** A25-CS019

| Nama | Role |
|------|------|
| **Alamahul Bayan** | Front-End Web & Back-End with AI |
| **Bubu Bukhori Muslim** | Machine Learning |
| **Muhammad Fahmi Faisal** | Front-End Web & Back-End with AI |
| **Vito Gunawan** | Machine Learning |
| **Vannesa Ayuni Riskita** | Front-End Web & Back-End with AI |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.

---

## 🤝 Dukungan

Untuk masalah atau pertanyaan:
- Cek console untuk pesan error
- Verifikasi backend dan ML services berjalan
- Review konfigurasi environment variable
- Cek network requests di browser DevTools

---

## 🌟 Acknowledgments

- **Program ASAH 2025** untuk dukungan proyek
- **Tim React** untuk library UI yang luar biasa
- **Tim Vite** untuk build tool yang super cepat
- **Google** untuk Gemini AI API

---

**Terakhir Diperbarui:** Desember 2025  
**Versi:** 1.0.0

---

Dibuat dengan ❤️ oleh Tim A25-CS019
