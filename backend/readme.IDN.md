# RECALL Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Recommendation & Churn Analysis Learning Lab** - Backend API komprehensif untuk proyek RECALL, dirancang untuk mengurangi churn pelanggan dan meningkatkan engagement melalui rekomendasi personal berbasis Machine Learning.

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
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Proyek](#struktur-proyek)
- [Skema Database](#skema-database)
- [Integrasi](#integrasi)
- [Pengujian](#pengujian)
- [Deployment](#deployment)
- [Tim](#tim)
- [Lisensi](#lisensi)
- [Dukungan](#dukungan)

---

## 🎯 Gambaran Umum

RECALL Backend adalah REST API berbasis Node.js yang berfungsi sebagai infrastruktur backend utama untuk sistem retensi pelanggan telekomunikasi. API ini menyediakan endpoint komprehensif untuk manajemen pelanggan, rekomendasi produk berbasis AI, notifikasi adaptif, interaksi chatbot, dan dashboard pelaporan terperinci.

Sistem ini terintegrasi dengan:
- **ML Services** (Flask API) untuk menghasilkan rekomendasi cerdas
- **Firebase** untuk push notification
- **MongoDB Atlas** untuk penyimpanan data yang scalable
- **Frontend** (React/TypeScript) untuk admin dashboard dan portal pelanggan

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Autentikasi berbasis JWT untuk akses API yang aman
- Alur login terpisah untuk admin dashboard dan portal pelanggan
- Kontrol akses berbasis peran (Admin vs Customer)
- Password hashing menggunakan bcrypt

### 👥 Manajemen Pelanggan
- Operasi CRUD lengkap untuk data pelanggan
- Profil pelanggan dengan pola penggunaan dan metrik perilaku
- Dukungan pencarian dan pagination
- Riwayat rekomendasi per pelanggan

### 🗺️ Fitur Geospasial
- Pelacakan lokasi real-time untuk pelanggan
- Query pelanggan terdekat menggunakan MongoDB geospatial indexes
- Deteksi roaming dan daftar pelanggan roaming
- Penawaran layanan berbasis lokasi

### 🎁 Sistem Rekomendasi Cerdas
- Pembuatan rekomendasi berbasis AI via integrasi ML service
- Pembuatan dan manajemen rekomendasi manual
- Pengiriman notifikasi adaptif (Email + Push)
- Pelacakan status rekomendasi (PENDING → SENT → CLICKED → ACCEPTED/REJECTED)
- Pelacakan klik dan skor engagement

### 💬 Antarmuka Chatbot
- Endpoint chatbot cerdas untuk dukungan pelanggan
- Logika fallback yang context-aware
- Deteksi dan penampilan rekomendasi pending
- Siap integrasi dengan layanan LLM

### 📊 Pelaporan & Analitik
- Endpoint dashboard komprehensif yang mengagregasi semua metrik
- Laporan risiko churn dengan analitik terperinci
- Pelacakan performa rekomendasi
- Analisis pola penggunaan pelanggan
- Click-through rates dan metrik engagement

### 🔔 Notifikasi Adaptif
- Sistem notifikasi multi-channel (Email + Push)
- Integrasi Firebase Cloud Messaging (FCM)
- Nodemailer untuk pengiriman email
- Manajemen token FCM per pelanggan

### 📦 Katalog Produk
- Manajemen produk dengan mapping label ML
- Organisasi produk berbasis kategori
- Detail produk dengan harga, kuota, dan masa berlaku
- Dukungan untuk gambar dan URL redirect

---

## 💻 Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| **Runtime** | Node.js 18+ (ES Modules) |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB + Mongoose ODM |
| **Autentikasi** | JWT (jsonwebtoken), bcryptjs |
| **Notifikasi** | Firebase Admin SDK, Nodemailer |
| **Dokumentasi API** | Swagger UI (OpenAPI 3.0) |
| **HTTP Client** | Axios (untuk integrasi ML service) |
| **Environment** | dotenv |
| **CORS** | cors middleware |

---

## 📋 Persyaratan Sistem

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** v18 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** v9 atau lebih tinggi (sudah termasuk dalam Node.js)
- **MongoDB** Account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) direkomendasikan)
- **Git** untuk version control
- **Firebase** Project dengan kredensial Admin SDK ([Firebase Console](https://console.firebase.google.com/))

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY_ANDA>
cd Project-Recall/backend
```

### 2. Install Dependencies

```bash
npm install
```

Perintah ini akan menginstal semua package yang diperlukan sesuai `package.json`:
- `express`, `mongoose`, `cors`, `dotenv`
- `jsonwebtoken`, `bcryptjs`
- `firebase-admin`, `nodemailer`
- `axios`, `swagger-ui-express`
- `adminjs` dan package terkait
- `nodemon` (dev dependency)

### 3. Setup Kredensial Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru atau gunakan yang sudah ada
3. Navigasi ke **Project Settings** → **Service Accounts**
4. Klik **Generate New Private Key**
5. Simpan file JSON yang didownload sebagai `serviceAccountKey.json` di direktori root backend

```
backend/
├── serviceAccountKey.json  ← Letakkan kredensial Firebase Anda di sini
├── package.json
└── ...
```

---

## ⚙️ Konfigurasi

### Variabel Environment

Buat file `.env` di direktori root backend:

```bash
# Copy file contoh
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
# Konfigurasi Server
PORT=3001

# Koneksi MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/telcoAsah?retryWrites=true&w=majority

# Konfigurasi JWT
JWT_SECRET=kunci_rahasia_jwt_super_panjang_ganti_ini_di_production
JWT_EXPIRES_IN=1d

# Konfigurasi Email (Ethereal untuk testing, gunakan SMTP asli di production)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=email-ethereal-anda@ethereal.email
EMAIL_PASS=password-ethereal-anda
```

#### Detail Konfigurasi:

**PORT**: Port dimana backend server akan berjalan (default: 3001)

**MONGO_URI**: Connection string MongoDB Anda
- Untuk **MongoDB Atlas**: Dapatkan dari Atlas Dashboard → Clusters → Connect
- Ganti `<username>` dan `<password>` dengan kredensial database Anda
- Ubah nama database dari `telcoAsah` jika diperlukan

**JWT_SECRET**: Kunci rahasia untuk signing JWT tokens
- **PENTING**: Ganti dengan string random yang panjang di production
- Generate dengan: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**JWT_EXPIRES_IN**: Waktu kadaluarsa token (misalnya `1d`, `7d`, `24h`)

**Pengaturan Email**: Konfigurasi SMTP untuk mengirim email
- Untuk **testing**: Gunakan [Ethereal Email](https://ethereal.email/) (SMTP palsu)
- Untuk **production**: Gunakan layanan seperti SendGrid, AWS SES, atau Gmail SMTP

---

## 🚀 Menjalankan Aplikasi

### Mode Development (dengan hot-reload)

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3001**

Output:
```
Server berjalan di http://localhost:3001
MongoDB Connected: cluster0-shard-00-...
```

### Mode Production

```bash
npm start
```

### Populate Database (Seeding)

Sebelum penggunaan pertama kali, isi database dengan data awal:

```bash
node seeder.js
```

Ini akan membuat:
- ✅ Akun admin (email: `admin@telco.com`, password: `password123`)
- ✅ Sample pelanggan dengan berbagai pola penggunaan
- ✅ Sample produk yang mapped ke label ML
- ✅ Sample rekomendasi

**⚠️ Penting:** Seeder akan **menghapus data yang ada** sebelum insert. Gunakan dengan hati-hati di production.

---

## 📚 Dokumentasi API

### Swagger UI

Dokumentasi API interaktif tersedia di:

**🔗 http://localhost:3001/api-docs**

### Panduan Cepat dengan Swagger:

1. Buka `/api-docs`
2. Temukan bagian **Auth**
3. Gunakan **POST /api/v1/auth/login** dengan kredensial:
   ```json
   {
     "email": "admin@telco.com",
     "password": "password123"
   }
   ```
4. Copy `token` yang dikembalikan
5. Klik tombol **🔓 Authorize** di bagian atas
6. Masukkan: `Bearer <token-anda>`
7. Sekarang Anda bisa test semua endpoint yang terproteksi!

### URL Base API

```
http://localhost:3001/api/v1
```

### Ringkasan Endpoint

| Grup Endpoint | Base Path | Deskripsi |
|--------------|-----------|-----------|
| **Authentication** | `/api/v1/auth` | Login, registrasi |
| **Customers** | `/api/v1/customers` | CRUD pelanggan, lokasi, FCM |
| **Products** | `/api/v1/products` | Manajemen katalog produk |
| **Recommendations** | `/api/v1/recommendations` | Rekomendasi AI, notifikasi |
| **Chatbot** | `/api/v1/chatbot` | Penanganan pesan chatbot |
| **Reports** | `/api/v1/reports` | Analitik dashboard |

Untuk dokumentasi endpoint detail, lihat [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) atau gunakan Swagger UI.

---

## 📁 Struktur Proyek

```
backend/
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── controllers/     # Request handlers
│   │       │   ├── auth.controller.js
│   │       │   ├── customer.controller.js
│   │       │   ├── product.controller.js
│   │       │   ├── recommendation.controller.js
│   │       │   ├── chatbot.controller.js
│   │       │   └── report.controller.js
│   │       ├── middlewares/     # Auth, validation, error handling
│   │       │   └── auth.middleware.js
│   │       ├── routes/          # Definisi route
│   │       │   ├── auth.routes.js
│   │       │   ├── customer.routes.js
│   │       │   ├── product.routes.js
│   │       │   ├── recommendation.routes.js
│   │       │   ├── chatbot.routes.js
│   │       │   ├── report.routes.js
│   │       │   └── index.js
│   │       └── services/        # Logika bisnis
│   │           ├── auth.service.js
│   │           ├── customer.service.js
│   │           ├── product.service.js
│   │           ├── recommendation.service.js
│   │           ├── chatbot.service.js
│   │           └── report.service.js
│   ├── config/                  # File konfigurasi
│   │   ├── db.js                # Koneksi MongoDB
│   │   └── index.js             # Environment variables
│   ├── models/                  # Mongoose schemas
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Recommendation.js
│   │   └── User.js
│   ├── utils/                   # Utilities
│   └── app.js                   # Setup Express app
├── server.js                    # Entry point
├── seeder.js                    # Database seeder
├── seed_products.js             # Product seeder
├── swagger-spec.json            # Spesifikasi OpenAPI
├── serviceAccountKey.json       # Kredensial Firebase (gitignored)
├── .env                         # Variabel environment (gitignored)
├── .env.example                 # Template environment
├── package.json
└── README.md
```

---

## 🗄️ Skema Database

### Model Customer

```javascript
{
  username: String (unique, required),
  password: String (hashed),
  email: String,
  customer_id: String (unique),
  plan_type: Enum['Prepaid', 'Postpaid'],
  device_brand: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]  // Format GeoJSON
  },
  profile: {
    avg_data_usage_gb: Number,
    pct_video_usage: Number,
    avg_call_duration: Number,
    sms_freq: Number,
    monthly_spend: Number,
    topup_freq: Number,
    travel_score: Number,
    churn_risk: Number,           // Skor prediksi ML
    engagement_score: Number,     // Bertambah dengan interaksi
    churn_factors: [String]
  },
  recommendations: [ObjectId]     // Ref ke Recommendation
}
```

### Model Product

```javascript
{
  name: String (required),
  description: String (required),
  category: Enum[                 // Mapping ke tipe rekomendasi
    'Data Booster',
    'Device Upgrade Offer',
    'Family Plan Offer',
    'General Offer',
    'Retention Offer',
    'Roaming Pass',
    'Streaming Partner Pack',
    'Top-up Promo',
    'Voice Bundle',
    'SMS Bundle'
  ],
  price: Number,
  quota_amount: Number (GB),
  validity_days: Number,
  ml_label: String (unique, required),  // PENTING: Mapping output ML ke produk
  image_url: String,
  redirect_url: String,
  isActive: Boolean
}
```

### Model Recommendation

```javascript
{
  customer: ObjectId (ref: Customer),
  type: Enum[...categories],      // Dari prediksi ML
  offer_name: String,
  offer_details: String,
  image_url: String,
  redirect_url: String,
  confidence_score: Number,       // Confidence ML (0-1)
  status: Enum[
    'PENDING',    // Baru dibuat, belum dikirim
    'SENT',       // Notifikasi terkirim
    'CLICKED',    // Pelanggan membuka
    'ACCEPTED',   // Pelanggan berlangganan
    'REJECTED'    // Pelanggan menolak
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Model User (Admin)

```javascript
{
  email: String (unique, required),
  password: String (hashed),
  role: String (default: 'admin')
}
```

**Indexes:**
- `Customer.location`: 2dsphere index untuk query geospasial
- `Customer.username`, `Customer.customer_id`: Unique indexes
- `Product.ml_label`: Unique index untuk mapping ML

Untuk diagram skema detail, lihat [ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🔗 Integrasi

### Integrasi ML Service

Backend berkomunikasi dengan ML service (Flask API) untuk menghasilkan rekomendasi AI.

**Endpoint ML Service:**
```
POST http://localhost:5000/recommend
```

**Format Request:**
```json
{
  "avg_data_usage_gb": 6.5,
  "pct_video_usage": 0.75,
  "avg_call_duration": 8,
  "sms_freq": 5,
  "monthly_spend": 95000,
  "topup_freq": 3,
  "travel_score": 0.2,
  "complaint_count": 0,
  "plan_type": "Postpaid",
  "device_brand": "Samsung"
}
```

**Response:**
```json
{
  "status": "success",
  "offer_name": "Premium Video Streaming",
  "confidence": 0.9245,
  "offer_type": "AUTO_MAPPED"
}
```

Backend kemudian memetakan `offer_name` ke produk di database menggunakan field `ml_label`.

### Integrasi Frontend

**Admin Dashboard:** Dibangun dengan React + TypeScript + Vite  
**Portal Pelanggan:** Terintegrasi dalam frontend yang sama

**Komunikasi API:**
- Base URL: `http://localhost:3001/api/v1`
- Autentikasi: Sertakan JWT di Authorization header: `Bearer <token>`
- CORS: Enabled untuk semua origin di development

Contoh (JavaScript):
```javascript
const response = await fetch('http://localhost:3001/api/v1/customers', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

## 🧪 Pengujian

### Pengujian Manual dengan Swagger

1. Jalankan server: `npm run dev`
2. Buka: http://localhost:3001/api-docs
3. Autentikasi menggunakan kredensial admin
4. Test endpoint secara interaktif

### Pengujian dengan cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telco.com","password":"password123"}'
```

**Get All Customers (dengan autentikasi):**
```bash
curl -X GET http://localhost:3001/api/v1/customers \
  -H "Authorization: Bearer TOKEN_ANDA_DI_SINI"
```

### Pengujian Notifikasi

**Test Email:**
```bash
curl -X POST http://localhost:3001/api/v1/recommendations/:customerId/send-adaptive \
  -H "Authorization: Bearer TOKEN_ANDA" \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"RECOMMENDATION_ID","channels":["email"]}'
```

Cek inbox Ethereal Anda untuk email test.

---

## 🚀 Deployment

### Opsi Deployment Cepat

#### 1. **Railway** (Direkomendasikan)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login dan deploy
railway login
railway init
railway up
```

#### 2. **Heroku**
```bash
# Install Heroku CLI dan login
heroku login

# Buat app dan deploy
heroku create recall-backend
git push heroku main
```

#### 3. **DigitalOcean App Platform**
- Hubungkan repository GitHub Anda
- Konfigurasi environment variables di dashboard
- Deploy dengan satu klik

### Variabel Environment di Production

Pastikan untuk set semua environment variables dari `.env` di platform deployment Anda:
- `PORT` (biasanya auto-assigned)
- `MONGO_URI`
- `JWT_SECRET` (gunakan string random yang panjang dan aman)
- `JWT_EXPIRES_IN`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`

Juga upload `serviceAccountKey.json` dengan aman atau gunakan environment variable injection.

### Checklist Pre-Deployment

- [ ] Ganti `JWT_SECRET` ke nilai yang aman
- [ ] Gunakan MongoDB URI production (MongoDB Atlas)
- [ ] Gunakan layanan SMTP asli (bukan Ethereal)
- [ ] Set `NODE_ENV=production`
- [ ] Konfigurasi CORS untuk hanya mengizinkan domain frontend Anda
- [ ] Aktifkan HTTPS
- [ ] Setup monitoring (PM2, New Relic, atau tools platform-specific)
- [ ] Jalankan `node seeder.js` sekali untuk populate data awal

Untuk instruksi deployment detail, lihat [DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 👥 Tim

**Kode Proyek:** A25-CS019

| Nama | Peran |
|------|-------|
| **Alamahul Bayan** | Front-End Web & Back-End with AI |
| **Bubu Bukhori Muslim** | Machine Learning |
| **Muhammad Fahmi Faisal** | Front-End Web & Back-End with AI |
| **Vito Gunawan** | Machine Learning |
| **Vannesa Ayuni Riskita** | Front-End Web & Back-End with AI |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail.

---

## 🤝 Dukungan

### Dokumentasi

- [Dokumentasi API](docs/API_DOCUMENTATION.md) - Referensi API komprehensif
- [Panduan Arsitektur](docs/ARCHITECTURE.md) - Desain dan arsitektur sistem
- [Panduan Deployment](docs/DEPLOYMENT.md) - Instruksi deployment production
- [Panduan Kontribusi](docs/CONTRIBUTING.md) - Guideline development

### Mendapatkan Bantuan

- **Issues:** Cek output console untuk pesan error
- **Swagger UI:** Testing API interaktif di `/api-docs`
- **Database:** Verifikasi connection string MongoDB dan network access
- **ML Service:** Pastikan ML service berjalan di `localhost:5000`

### Masalah Umum

**Port sudah digunakan:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

**Error koneksi MongoDB:**
- Cek MongoDB Atlas network access (whitelist IP Anda)
- Verifikasi username dan password di `MONGO_URI`
- Pastikan nama database benar

**Error autentikasi JWT:**
- Verifikasi token disertakan di Authorization header
- Cek token belum expired
- Pastikan `JWT_SECRET` sama di semua restart

---

## 🌟 Acknowledgments

- **Program ASAH 2025** untuk dukungan proyek
- **MongoDB Atlas** untuk hosting database
- **Firebase** untuk infrastruktur push notification

---

**Terakhir Diperbarui:** Desember 2025  
**Versi:** 1.0.0

---

Dibuat dengan ❤️ oleh Tim A25-CS019
