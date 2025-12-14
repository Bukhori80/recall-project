# 🌟 RECALL - Recommendation & Churn Analysis Learning Lab

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**RECALL** adalah sistem retensi pelanggan telekomunikasi komprehensif yang didukung oleh Machine Learning, dirancang untuk mengurangi churn pelanggan dan meningkatkan engagement melalui rekomendasi produk yang cerdas dan personal.

> **Kode Tim:** A25-CS019  
> **Tema:** Retensi Pelanggan Telekomunikasi  
> **Program:** ASAH 2025

> **Link Model Recommendation:** https://s.id/Model_Recommendation

> **Link Model Churn:** https://s.id/8ggdf
 
> **Link Notebook Recommendation:** https://s.id/8DjVj
 
> **Link Notebook Churn:** https://s.id/HQAc3

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Cepat](#panduan-cepat)
- [Struktur Proyek](#struktur-proyek)
- [Dokumentasi Komponen](#dokumentasi-komponen)
- [Deployment](#deployment)
- [Tim](#tim)
- [Lisensi](#lisensi)

---

## 🎯 Gambaran Umum

RECALL adalah aplikasi full-stack yang terdiri dari tiga komponen utama:

1. **Frontend** (React + TypeScript + Vite): Interface web modern untuk pelanggan dan admin
2. **Backend** (Node.js + Express + MongoDB): Server API RESTful untuk logika bisnis dan manajemen data
3. **ML Services** (Flask + scikit-learn): Model machine learning untuk rekomendasi dan prediksi churn

Sistem ini menyediakan:
- 🎯 **Rekomendasi Berbasis AI**: Saran produk cerdas berdasarkan perilaku pelanggan
- 📊 **Prediksi Churn**: Identifikasi pelanggan berisiko sebelum mereka pergi
- 💬 **Chatbot AI**: Dukungan pelanggan cerdas powered by Google Gemini
- 📈 **Dashboard Analitik**: Insight komprehensif untuk admin
- 📱 **Desain Responsif**: Bekerja sempurna di semua perangkat

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      Sistem RECALL                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │◄───────►│   Backend    │◄───────►│ ML Services  │
│ React + TS   │  HTTP   │  Node.js +   │  HTTP   │   Flask +    │
│   + Vite     │         │   Express    │         │ scikit-learn │
│              │         │              │         │              │
│  Port: 3000  │         │  Port: 3001  │         │  Port: 5000  │
└──────────────┘         └───────┬──────┘         └──────────────┘
                                 │
                         ┌───────┴────────┐
                         │                │
                    ┌────▼────┐     ┌────▼────┐
                    │ MongoDB │     │Firebase │
                    │  Atlas  │     │   FCM   │
                    └─────────┘     └─────────┘
```

### Alur Data

1. **Interaksi Pelanggan** → Frontend mengirim request ke Backend
2. **Logika Bisnis** → Backend memproses request, mengelola data
3. **Prediksi ML** → Backend memanggil ML Services untuk rekomendasi
4. **Penyimpanan Data** → Backend menyimpan data di MongoDB
5. **Notifikasi** → Backend mengirim push notification via Firebase
6. **Response** → Backend mengembalikan data ke Frontend

---

## ✨ Fitur Utama

### Untuk Pelanggan

- **Dashboard Personal**: Lihat statistik penggunaan dan rekomendasi
- **Rekomendasi AI**: Dapatkan saran produk berdasarkan perilaku Anda
- **Katalog Produk**: Browse dan eksplorasi paket telko
- **Chatbot AI**: Dapatkan bantuan instan dari asisten cerdas
- **Manajemen Profil**: Update informasi dan preferensi personal

### Untuk Admin

- **Dashboard Analitik**: Monitor metrik dan KPI kunci
- **Manajemen Pelanggan**: Lihat dan kelola database pelanggan
- **Manajemen Produk**: Operasi CRUD untuk produk
- **Pelacakan Rekomendasi**: Monitor performa rekomendasi
- **Laporan**: Generate laporan analitik terperinci

### Fitur Teknis

- **Autentikasi JWT**: Auth berbasis token yang aman
- **Role-Based Access**: Permission Customer vs Admin
- **Query Geospasial**: Cari pelanggan terdekat, deteksi roaming
- **Update Real-time**: Sinkronisasi data live
- **UI Responsif**: Desain mobile-first
- **Dark Mode**: UI glassmorphism modern

---

## 💻 Tech Stack

### Frontend
- **React** 19.2.0 - Library UI
- **TypeScript** 5.8.2 - Type safety
- **Vite** 6.2.0 - Build tool
- **React Router** 7.9.6 - Routing
- **Framer Motion** 12.23.25 - Animasi
- **Recharts** 3.5.1 - Visualisasi data
- **Google Generative AI** 0.24.1 - Chatbot

### Backend
- **Node.js** 18+ - Runtime
- **Express** 5.x - Web framework
- **MongoDB + Mongoose** 8.x - Database
- **JWT** - Autentikasi
- **Firebase Admin** - Push notifications
- **Nodemailer** - Email service
- **Swagger UI** - Dokumentasi API

### ML Services
- **Python** 3.8+
- **Flask** 2.0+ - API server
- **scikit-learn** 1.0+ - Model ML
- **pandas** - Processing data
- **numpy** - Operasi numerik
- **joblib** - Model persistence

---

## 📋 Persyaratan Sistem

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **MongoDB** Account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Firebase** Project ([Firebase Console](https://console.firebase.google.com/))
- **Google Gemini API Key** ([Dapatkan API Key](https://makersuite.google.com/app/apikey))
- **Git** untuk version control

---

## 🚀 Panduan Cepat

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY_ANDA>
cd Project-Recall
```

### 2. Setup Backend

```bash
cd backend
npm install

# Buat file .env
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Seed database
node seeder.js

# Jalankan backend
npm run dev
```

Backend akan berjalan di: **http://localhost:3001**

### 3. Setup ML Services

```bash
cd ../ml_services
python -m venv venv
source venv/bin/activate  # Di Windows: .\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# Jalankan ML service
python app.py
```

ML Services akan berjalan di: **http://localhost:5000**

### 4. Setup Frontend

```bash
cd ../frontend
npm install

# Buat file .env
cp .env.example .env
# Tambahkan GEMINI_API_KEY Anda

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

### 5. Akses Aplikasi

- **Portal Pelanggan**: http://localhost:3000
- **Dashboard Admin**: http://localhost:3000/#/admin/login
- **Dokumentasi API**: http://localhost:3001/api-docs

**Kredensial Admin Default:**
- Email: `admin@telco.com`
- Password: `password123`

---

## 📁 Struktur Proyek

```
Project-Recall/
├── frontend/                  # Frontend React + TypeScript
│   ├── pages/                 # Komponen halaman
│   ├── components/            # Komponen reusable
│   ├── contexts/              # React contexts
│   ├── utils/                 # Utilities
│   ├── package.json
│   ├── vite.config.ts
│   ├── README.md             # Dokumentasi frontend
│   └── README.IDN.md         # Versi Indonesia
│
├── backend/                   # Backend Node.js + Express
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Logika bisnis
│   │   │   ├── routes/       # Definisi route
│   │   │   └── middlewares/  # Auth, validation
│   │   ├── config/           # Konfigurasi
│   │   └── models/           # Schema MongoDB
│   ├── docs/                 # Dokumentasi tambahan
│   │   ├── API_DOCUMENTATION.md
│   │   ├── ARCHITECTURE.md
│   │   ├── DEPLOYMENT.md
│   │   └── CONTRIBUTING.md
│   ├── server.js
│   ├── seeder.js
│   ├── package.json
│   ├── README.md             # Dokumentasi backend
│   └── README.IDN.md         # Versi Indonesia
│
├── ml_services/                                          # Flask ML API
│   ├── app.py                                            # Main Flask app
│   ├── Capstone_ChurnRisk.ipynb                          # Notebook Jupyter untuk model training
│   ├── Capstone_Telco_Recommender_Model_Final.ipynb      # Notebook Jupyter untuk model training
│   ├── inference_telco.py                                # Model rekomendasi
│   ├── inference_churn.py                                # Model prediksi churn
│   ├── test_client.py                                    # Utility testing
│   ├── *.pkl                                             # Model terlatih
│   ├── requirements.txt                                  # Dependencies
│   ├── README.md                                         # Dokumentasi ML Services
│   └── README.IDN.md                                     # Versi Indonesia
│
└── README.md                                             # File ini
```

---

## 📚 Dokumentasi Komponen

Setiap komponen memiliki dokumentasi detail:

### Dokumentasi Backend
- [README.md](backend/README.md) - Dokumentasi utama backend (English)
- [README.IDN.md](backend/README.IDN.md) - Versi Indonesia
- [Dokumentasi API](backend/docs/API_DOCUMENTATION.md) - Referensi API lengkap
- [Arsitektur](backend/docs/ARCHITECTURE.md) - Desain dan pattern sistem
- [Deployment](backend/docs/DEPLOYMENT.md) - Panduan deployment production
- [Contributing](backend/docs/CONTRIBUTING.md) - Guideline development

### Dokumentasi ML Services
- [README.md](ml_services/README.md) - Dokumentasi ML services (English)
- [README.IDN.md](ml_services/README.IDN.md) - Versi Indonesia

### Dokumentasi Frontend
- [README.md](frontend/README.md) - Dokumentasi frontend (English)
- [README.IDN.md](frontend/README.IDN.md) - Versi Indonesia

---

## 🔧 Konfigurasi

### Backend (.env)

```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/telcoAsah
JWT_SECRET=kunci_rahasia_jwt_super_panjang
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=sendgrid_api_key_anda

# Model ML
ML_SERVICE_URL=link produksi ml service kamu
ML_SERVICE_URL_DEV=http://localhost:5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_GEMINI_API_KEY=gemini_api_key_anda
```

### ML Services

Tidak perlu konfigurasi environment. Model dimuat dari file `.pkl`.

---

## 🧪 Pengujian

### Backend
```bash
cd backend
# Gunakan Swagger UI di http://localhost:3001/api-docs
# Atau test dengan cURL/Postman
```

### ML Services
```bash
cd ml_services
python test_client.py
```

### Frontend
```bash
cd frontend
# Testing manual di browser
# Cek browser console untuk errors
```

---

## 🚀 Deployment

### Opsi Deployment Backend
- **Railway** (Direkomendasikan)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2**
- **Google Cloud Platform**

Lihat [Panduan Deployment Backend](backend/docs/DEPLOYMENT.md) untuk instruksi detail.

### Deployment ML Services
```bash
# Production dengan Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Deployment Frontend
```bash
npm run build
# Deploy folder dist/ ke:
# - Vercel (Direkomendasikan)
# - Netlify
# - GitHub Pages
# - Hosting statis lainnya
```

---

## 🔐 Pertimbangan Keamanan

- ✅ Token JWT untuk autentikasi
- ✅ Password hashing dengan bcrypt
- ✅ CORS dikonfigurasi dengan benar
- ✅ Environment variables untuk secrets
- ✅ Validasi input di semua endpoint
- ✅ HTTPS di production
- ✅ Rate limiting (direkomendasikan untuk production)

---

## 📊 Performa

| Komponen | Startup Time | Response Time | Penggunaan Memory |
|----------|-------------|---------------|-------------------|
| **Frontend** | ~1s | Instant | ~100MB |
| **Backend** | ~2-3s | 50-200ms | ~200MB |
| **ML Services** | ~2-3s | 30-100ms | ~500MB |

---

## 🐛 Troubleshooting

### Masalah Umum

**Backend tidak mau start:**
- Cek connection string MongoDB
- Verifikasi environment variables
- Pastikan tidak ada konflik port

**Error ML Services:**
- Verifikasi file model ada
- Cek dependencies Python
- Pastikan versi Python benar

**Masalah koneksi Frontend:**
- Konfirmasi backend berjalan
- Cek VITE_API_URL di .env
- Verifikasi pengaturan CORS

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

## 🤝 Kontribusi

Kami menerima kontribusi! Silakan lihat [CONTRIBUTING.md](backend/docs/CONTRIBUTING.md) untuk panduan.

---

## 📞 Dukungan

Untuk pertanyaan atau masalah:
1. Cek dokumentasi spesifik komponen
2. Review bagian troubleshooting
3. Cek dokumentasi API di `/api-docs`
4. Verifikasi semua service berjalan

---

## 🌟 Acknowledgments

- **Program ASAH 2025** untuk dukungan proyek
- **Google** untuk Gemini AI API
- **MongoDB Atlas** untuk hosting database
- **Firebase** untuk infrastruktur push notification
- Semua proyek open-source yang kami gunakan

---

## 📈 Pengembangan Masa Depan

- [ ] Notifikasi real-time dengan WebSockets
- [ ] Analitik advanced dengan custom metrics
- [ ] A/B testing untuk rekomendasi
- [ ] Mobile app (React Native)
- [ ] Arsitektur microservices
- [ ] Deployment Kubernetes
- [ ] Caching advanced dengan Redis
- [ ] Message queue (RabbitMQ/BullMQ)

---

**Terakhir Diperbarui:** Desember 2025  
**Versi:** 1.0.0

---

Dibuat dengan ❤️ oleh Tim A25-CS019
