# 🤖 ML Services - Sistem Rekomendasi & Prediksi Churn Telekomunikasi

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-orange.svg)](https://scikit-learn.org/)

Layanan Machine Learning untuk proyek RECALL, menyediakan rekomendasi produk cerdas dan prediksi churn menggunakan model ML yang telah dilatih.

> **Kode Proyek:** A25-CS019  
> **Tema:** Retensi Pelanggan Telekomunikasi  
> **Program:** ASAH 2025

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Menjalankan Layanan](#menjalankan-layanan)
- [API Endpoints](#api-endpoints)
- [Arsitektur Model](#arsitektur-model)
- [Integrasi dengan Backend](#integrasi-dengan-backend)
- [Pengujian](#pengujian)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## 🎯 Gambaran Umum

Komponen ML Services adalah REST API berbasis Flask yang melayani dua model machine learning:

1. **Model Rekomendasi** (`TelcoRecommender`): Memprediksi produk/paket terbaik untuk pelanggan berdasarkan pola penggunaan mereka
2. **Model Prediksi Churn** (`ChurnPredictor`): Menghitung skor risiko churn untuk mengidentifikasi pelanggan berisiko tinggi

Layanan-layanan ini dikonsumsi oleh backend Node.js untuk memberikan pengalaman yang cerdas dan personal untuk pelanggan telco.

---

## ✨ Fitur Utama

### 🎯 Rekomendasi Cerdas
- **Berbasis ML**: Menggunakan pipeline scikit-learn terlatih untuk prediksi akurat
- **Feature Engineering**: Otomatis membuat fitur turunan dari input mentah
- **Skor Confidence**: Menyediakan confidence prediksi (skala 0-1)
- **10 Kategori Produk**: Mencakup semua jenis produk telko utama
- **Inference Cepat**: Prediksi dalam <100ms per request

### 📊 Prediksi Churn
- **Penilaian Risiko**: Menghitung probabilitas churn dari 0-1
- **Kategori Risiko**: Klasifikasi LOW, MEDIUM, HIGH
- **Analisis Multi-Faktor**: Mempertimbangkan penggunaan, pengeluaran, komplain, dan engagement
- **Real-Time**: Prediksi instan via REST API

### ⚡ Performa
- **Caching Model**: Model dimuat sekali saat startup
- **Tanpa Re-Training**: Model pre-trained untuk prediksi instan
- **Ringan**: Total file model ~6MB
- **Scalable**: Desain stateless untuk horizontal scaling

---

## 🔧 Persyaratan Sistem

### Minimum Requirements
- **Python**: 3.8 atau lebih tinggi
- **RAM**: 2GB minimum (4GB direkomendasikan)
- **Storage**: 500MB ruang kosong
- **CPU**: Multi-core direkomendasikan untuk performa lebih baik

### Dependencies

```
flask>=2.0.0
joblib>=1.1.0
pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=1.0.0
gunicorn>=20.0.0 (untuk production)
```

---

## 📦 Instalasi

### Langkah 1: Navigasi ke Direktori ml_services

```bash
cd Project-Recall/ml_services
```

### Langkah 2: Buat Virtual Environment (Direkomendasikan)

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Langkah 3: Install Dependencies

```bash
pip install -r requirements.txt
```

Atau install manual:
```bash
pip install flask pandas numpy scikit-learn joblib gunicorn
```

### Langkah 4: Verifikasi File Model

Pastikan file-file model ini ada di direktori `ml_services`:

```
ml_services/
├── telco_pipeline_model.pkl     (~3.5 MB) ← Model rekomendasi
├── rf_churn_risk_model.pkl      (~2.6 MB) ← Model prediksi churn
├── label_encoders.pkl           (~1 KB)   ← Encoder churn
├── scaler.pkl                   (~1 KB)   ← Scaler churn
└── ...
```

**Jika file model tidak ada**, hubungi tim ML untuk mendapatkan model yang telah dilatih.

---

## 🚀 Menjalankan Layanan

### Mode Development

```bash
python app.py
```

**Output yang Diharapkan:**
```
🚀 API Server Running on port 5000...
✅ Model Pipeline loaded successfully!
   Expecting columns: ['avg_data_usage_gb', 'pct_video_usage', ...]
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

Server akan tersedia di: **http://localhost:5000**

### Mode Production

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Opsi:
- `-w 4`: 4 worker process (sesuaikan dengan CPU cores)
- `-b 0.0.0.0:5000`: Bind ke semua interface di port 5000
- `--timeout 30`: Timeout request (default: 30 detik)

---

## 🔌 API Endpoints

### 1. Rekomendasi Produk

**Endpoint:** `POST /recommend`

**Deskripsi:** Generate rekomendasi produk berdasarkan pola penggunaan pelanggan

**Request Body:**
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

**Response (Sukses - 200):**
```json
{
  "status": "success",
  "offer_name": "Premium Video Streaming",
  "confidence": 0.9245,
  "offer_type": "AUTO_MAPPED"
}
```

**Response (Error - 500):**
```json
{
  "status": "error",
  "message": "Model not loaded"
}
```

**Contoh cURL:**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

### 2. Prediksi Churn

**Endpoint:** `POST /predict`

**Deskripsi:** Prediksi risiko churn pelanggan

**Request Body:**
```json
{
  "username": "customer123",
  "avg_data_usage_gb": 3.2,
  "pct_video_usage": 0.4,
  "avg_call_duration": 15,
  "sms_freq": 20,
  "monthly_spend": 65000,
  "topup_freq": 4,
  "travel_score": 0.1,
  "complaint_count": 2,
  "plan_type": "Prepaid",
  "device_brand": "Other"
}
```

**Response (Sukses - 200):**
```json
{
  "status": "success",
  "prediction": 0,
  "risk_score": 0.3542,
  "risk_category": "MEDIUM",
  "result": {
    "status": "success",
    "prediction": 0,
    "risk_score": 0.3542,
    "risk_category": "MEDIUM"
  }
}
```

**Kategori Risiko:**
- **LOW**: risk_score < 0.3
- **MEDIUM**: 0.3 ≤ risk_score < 0.6
- **HIGH**: risk_score ≥ 0.6

**Contoh cURL:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer123",
    "avg_data_usage_gb": 3.2,
    "pct_video_usage": 0.4,
    "avg_call_duration": 15,
    "sms_freq": 20,
    "monthly_spend": 65000,
    "topup_freq": 4,
    "travel_score": 0.1,
    "complaint_count": 2,
    "plan_type": "Prepaid",
    "device_brand": "Other"
  }'
```

---

## 🧠 Arsitektur Model

### Model Rekomendasi (TelcoRecommender)

**Tipe Model:** Pipeline Scikit-learn dengan RandomForest Classifier

**Tahapan Pipeline:**
1. **Feature Engineering:**
   - `video_data_intensity = avg_data_usage_gb × pct_video_usage`
   - `spend_per_call_unit = monthly_spend / (avg_call_duration + 1)`

2. **Encoding:**
   - `plan_type`: Prepaid=0, Postpaid=1
   - `device_brand`: Label encoded (Apple, Samsung, Other, dll.)

3. **Scaling:** StandardScaler untuk fitur numerik

4. **Classification:** Random Forest dengan hyperparameter tertuning

**Fitur Input (12 total):**
```python
[
  'avg_data_usage_gb',      # Rata-rata penggunaan data bulanan (GB)
  'pct_video_usage',        # Persentase data untuk video (0-1)
  'avg_call_duration',      # Rata-rata durasi call (menit)
  'sms_freq',               # Frekuensi SMS per bulan
  'monthly_spend',          # Pengeluaran bulanan (IDR)
  'topup_freq',             # Frekuensi top-up per bulan
  'travel_score',           # Skor mobilitas (0-1)
  'complaint_count',        # Jumlah komplain pelanggan
  'plan_type',              # Prepaid atau Postpaid (encoded)
  'device_brand',           # Brand device (encoded)
  'video_data_intensity',   # Fitur engineered
  'spend_per_call_unit'     # Fitur engineered
]
```

**Kategori Output (10 produk):**
- Data Booster
- Device Upgrade Offer
- Family Plan Offer
- General Offer
- Retention Offer
- Roaming Pass
- Streaming Partner Pack
- Top-up Promo
- Voice Bundle
- SMS Bundle

---

### Model Prediksi Churn (ChurnPredictor)

**Tipe Model:** Random Forest Classifier

**Fitur:**
- Mirip dengan model rekomendasi
- Fokus pada indikator churn (komplain, penurunan pengeluaran)

**Output:**
- `prediction`: 0 (akan tetap) atau 1 (kemungkinan churn)
- `risk_score`: Probabilitas churn (0-1)
- `risk_category`: LOW, MEDIUM, atau HIGH

---

## 🔗 Integrasi dengan Backend

Backend Node.js memanggil layanan ML ini via HTTP:

### Dari Backend (Node.js):

```javascript
const axios = require('axios');

// Rekomendasi
const getRecommendation = async (customerProfile) => {
  const response = await axios.post('http://localhost:5000/recommend', {
    avg_data_usage_gb: customerProfile.avg_data_usage_gb,
    pct_video_usage: customerProfile.pct_video_usage,
    // ... field lainnya
  });
  
  return response.data; // { offer_name, confidence, ... }
};

// Prediksi Churn
const predictChurn = async (customerProfile) => {
  const response = await axios.post('http://localhost:5000/predict', customerProfile);
  return response.data; // { risk_score, risk_category, ... }
};
```

### Alur Integrasi:

```
Request Frontend
      ↓
Backend Node.js (/api/v1/recommendations/:customerId/generate-ai)
      ↓
Ambil Profil Customer dari MongoDB
      ↓
HTTP POST → ML Services (Flask) /recommend
      ↓
Prediksi Model ML
      ↓
Return { offer_name, confidence }
      ↓
Backend Mapping offer_name ke Product (via ml_label)
      ↓
Simpan Recommendation ke MongoDB
      ↓
Return ke Frontend
```

---

## 🧪 Pengujian

### Menggunakan Test Client

Test client Python tersedia: `test_client.py`

**Jalankan Test:**
```bash
python test_client.py
```

**Output yang Diharapkan:**
```
🧪 Testing Telco Recommendation API
Test 1: Heavy Video Streamer
  ✅ Status: success
  📦 Recommendation: Premium Video Streaming
  📊 Confidence: 92.45%
  ⏱️  Response time: 45ms

Test 2: Frequent Traveler
  ✅ Status: success
  📦 Recommendation: Roaming Pass
  📊 Confidence: 88.12%
  ⏱️  Response time: 52ms

🧪 Testing Churn Prediction API
Test 1: High-Risk Customer
  ✅ Status: success
  📊 Risk Score: 0.7823 (HIGH)
  ⏱️  Response time: 38ms
```

### Pengujian Manual dengan Postman/Insomnia

1. Buat POST request ke `http://localhost:5000/recommend`
2. Set header: `Content-Type: application/json`
3. Tambahkan JSON body dengan data pelanggan
4. Kirim request dan verifikasi response

---

## 🐛 Troubleshooting

### Error: "Model not loaded"

**Penyebab:** File model (`telco_pipeline_model.pkl`) tidak ditemukan atau corrupt

**Solusi:**
```bash
# Cek apakah file ada
ls -l telco_pipeline_model.pkl

# Jika tidak ada, dapatkan dari tim ML
# Jika ada, verifikasi integritas (seharusnya ~3.5 MB)
```

### Error: "ModuleNotFoundError: No module named 'flask'"

**Solusi:**
```bash
pip install -r requirements.txt
```

### Port 5000 Sudah Dipakai

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :5000
kill -9 <PID>
```

Atau ubah port di `app.py`:
```python
app.run(port=5001, debug=True)
```

### Prediksi Lambat (>500ms)

**Penyebab:**
- Model dimuat di setiap request (seharusnya hanya sekali saat startup)
- RAM tidak cukup
- Mode debug aktif

**Solusi:**
- Pastikan model dimuat sekali di scope global
- Gunakan mode production dengan Gunicorn
- Tingkatkan RAM yang tersedia

---

## 🚀 Deployment

### Pertimbangan Production

1. **Gunakan Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 30 app:app
```

2. **Environment Variables:**
```bash
export FLASK_ENV=production
export MODEL_PATH=/path/to/models/
```

3. **Reverse Proxy dengan Nginx:**
```nginx
location /ml/ {
    proxy_pass http://127.0.0.1:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

4. **Deployment Docker:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Scaling

**Horizontal Scaling:**
- Deploy multiple instances di belakang load balancer
- Desain stateless memudahkan replikasi
- Gunakan Docker + Kubernetes untuk orkestrasi

**Tips Performa:**
- Model dimuat sekali (tidak per request)
- Gunakan connection pooling untuk database
- Aktifkan caching untuk prediksi berulang (Redis)

---

## 📊 Metrik Performa

| Metrik | Nilai |
|--------|-------|
| **Startup Time** | ~2-3 detik (loading model) |
| **Inference Time** | 30-100ms per request |
| **Penggunaan Memory** | ~500MB |
| **Ukuran Model** | ~6MB total |
| **Throughput** | 50-100 requests/detik (single instance) |

---

## 📞 Dukungan

### Masalah Umum

- **File Model:** Hubungi tim ML untuk model terlatih terbaru
- **Integrasi:** Lihat dokumentasi backend untuk contoh integrasi
- **Performa:** Monitor logs untuk bottleneck

### Logs

Cek output console untuk:
- Status loading model
- Log request/response
- Error stack traces

---

## 📝 Struktur Proyek

```
ml_services/
├── app.py                          # Flask API server
├── inference_telco.py              # Class model rekomendasi
├── inference_churn.py              # Class model prediksi churn
├── test_client.py                  # Utilitas testing
├── requirements.txt                # Dependencies Python
├── telco_pipeline_model.pkl        # Model rekomendasi terlatih
├── rf_churn_risk_model.pkl         # Model churn terlatih
├── label_encoders.pkl              # Label encoder churn
├── scaler.pkl                      # Feature scaler churn
└── README.md                       # File ini
```

## 👥 TIM

**Kode Tim:** A25-CS019

| Nama | Role |
|------|------|
| **Alamahul Bayan** | Front-End Web & Back-End with AI |
| **Bubu Bukhori Muslim** | Machine Learning |
| **Muhammad Fahmi Faisal** | Front-End Web & Back-End with AI |
| **Vito Gunawan** | Machine Learning |
| **Vannesa Ayuni Riskita** | Front-End Web & Back-End with AI |

---

## 🌟 Acknowledgments

- **Program ASAH 2025** untuk dukungan proyek
- **Scikit-learn** untuk framework ML
- **Flask** untuk framework API ringan

---

**Terakhir Diperbarui:** Desember 2025  
**Versi:** 1.0.0

---

Dibuat dengan ❤️ oleh Tim A25-CS019
