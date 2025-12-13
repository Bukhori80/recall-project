# 🤖 ML Services - Telco Recommendation & Churn Prediction System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-orange.svg)](https://scikit-learn.org/)

Machine Learning services for the RECALL project, providing intelligent product recommendations and churn prediction using trained ML models.

> **Project Code:** A25-CS019  
> **Theme:** Telco Customer Retention  
> **Program:** ASAH 2025

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Model Architecture](#model-architecture)
- [Integration with Backend](#integration-with-backend)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## 🎯 Overview

The ML Services component is a Flask-based REST API that serves two machine learning models:

1. **Recommendation Model** (`TelcoRecommender`): Predicts the best product/package for customers based on their usage patterns
2. **Churn Prediction Model** (`ChurnPredictor`): Calculates churn risk score to identify at-risk customers

These services are consumed by the Node.js backend to provide intelligent, personalized experiences for telco customers.

---

## ✨ Key Features

### 🎯 Smart Recommendations
- **ML-Powered**: Uses trained scikit-learn pipeline for accurate predictions
- **Feature Engineering**: Automatically creates derived features from raw input
- **Confidence Scores**: Provides prediction confidence (0-1 scale)
- **10 Product Categories**: Covers all major telco product types
- **Fast Inference**: Predictions in <100ms per request

### 📊 Churn Prediction
- **Risk Assessment**: Calculates churn probability from 0-1
- **Risk Categories**: LOW, MEDIUM, HIGH classification
- **Multi-Factor Analysis**: Considers usage, spend, complaints, and engagement
- **Real-Time**: Instant prediction via REST API

### ⚡ Performance
- **Model Caching**: Models loaded once at startup
- **No Re-Training**: Pre-trained models for instant predictions
- **Lightweight**: ~6MB model files total
- **Scalable**: Stateless design for horizontal scaling

---

## 🔧 System Requirements

### Minimum Requirements
- **Python**: 3.8 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB free space
- **CPU**: Multi-core recommended for better performance

### Dependencies

```
flask>=2.0.0
joblib>=1.1.0
pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=1.0.0
gunicorn>=20.0.0 (for production)
```

---

## 📦 Installation

### Step 1: Navigate to ml_services Directory

```bash
cd Project-Recall/ml_services
```

### Step 2: Create Virtual Environment (Recommended)

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

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install flask pandas numpy scikit-learn joblib gunicorn
```

### Step 4: Verify Model Files

Ensure these model files exist in the `ml_services` directory:

```
ml_services/
├── telco_pipeline_model.pkl     (~3.5 MB) ← Recommendation model
├── rf_churn_risk_model.pkl      (~2.6 MB) ← Churn prediction model
├── label_encoders.pkl           (~1 KB)   ← Churn encoders
├── scaler.pkl                   (~1 KB)   ← Churn scaler
└── ...
```

**Note:** These model files are **pre-trained and included in the repository**. You do not need to download them from an external link.
- `telco_pipeline_model.pkl`: Recommendation model pipeline
- `rf_churn_risk_model.pkl`: Random Forest churn model
---

## 🚀 Running the Service

### Development Mode

```bash
python app.py
```

**Expected Output:**
```
🚀 APIServer Running on port 5000...
✅ Model Pipeline loaded successfully!
   Expecting columns: ['avg_data_usage_gb', 'pct_video_usage', ...]
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

Server will be available at: **http://localhost:5000**

### Production Mode

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Options:
- `-w 4`: 4 worker processes (adjust based on CPU cores)
- `-b 0.0.0.0:5000`: Bind to all interfaces on port 5000
- `--timeout 30`: Request timeout (default: 30 seconds)

---

## 🔌 API Endpoints

### 1. Product Recommendation

**Endpoint:** `POST /recommend`

**Description:** Generate product recommendation based on customer usage patterns

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

**Response (Success - 200):**
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

**cURL Example:**
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

### 2. Churn Prediction

**Endpoint:** `POST /predict`

**Description:** Predict customer churn risk

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

**Response (Success - 200):**
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

**Risk Categories:**
- **LOW**: risk_score < 0.3
- **MEDIUM**: 0.3 ≤ risk_score < 0.6
- **HIGH**: risk_score ≥ 0.6

**cURL Example:**
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

## 🧠 Model Architecture

### Recommendation Model (TelcoRecommender)

**Model Type:** Scikit-learn Pipeline with RandomForest Classifier

**Pipeline Stages:**
1. **Feature Engineering:**
   - `video_data_intensity = avg_data_usage_gb × pct_video_usage`
   - `spend_per_call_unit = monthly_spend / (avg_call_duration + 1)`

2. **Encoding:**
   - `plan_type`: Prepaid=0, Postpaid=1
   - `device_brand`: Label encoded (Apple, Samsung, Other, etc.)

3. **Scaling:** StandardScaler for numeric features

4. **Classification:** Random Forest with tuned hyperparameters

**Input Features (12 total):**
```python
[
  'avg_data_usage_gb',      # Average monthly data usage (GB)
  'pct_video_usage',        # Percentage of data for video (0-1)
  'avg_call_duration',      # Average call duration (minutes)
  'sms_freq',               # SMS frequency per month
  'monthly_spend',          # Monthly spend (IDR)
  'topup_freq',             # Top-up frequency per month
  'travel_score',           # Mobility score (0-1)
  'complaint_count',        # Customer complaints count
  'plan_type',              # Prepaid or Postpaid (encoded)
  'device_brand',           # Device brand (encoded)
  'video_data_intensity',   # Engineered feature
  'spend_per_call_unit'     # Engineered feature
]
```

**Output Categories (10 products):**
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

### Churn Prediction Model (ChurnPredictor)

**Model Type:** Random Forest Classifier

**Features:**
- Similar to recommendation model
- Focused on churn indicators (complaints, declining spend)

**Output:**
- `prediction`: 0 (will stay) or 1 (likely to churn)
- `risk_score`: Probability of churning (0-1)
- `risk_category`: LOW, MEDIUM, or HIGH

---

## 🔗 Integration with Backend

The Node.js backend calls these ML services via HTTP:

### From Backend (Node.js):

```javascript
const axios = require('axios');

// Recommendation
const getRecommendation = async (customerProfile) => {
  const response = await axios.post('http://localhost:5000/recommend', {
    avg_data_usage_gb: customerProfile.avg_data_usage_gb,
    pct_video_usage: customerProfile.pct_video_usage,
    // ... other fields
  });
  
  return response.data; // { offer_name, confidence, ... }
};

// Churn Prediction
const predictChurn = async (customerProfile) => {
  const response = await axios.post('http://localhost:5000/predict', customerProfile);
  return response.data; // { risk_score, risk_category, ... }
};
```

### Integration Flow:

```
Frontend Request
      ↓
Node.js Backend (/api/v1/recommendations/:customerId/generate-ai)
      ↓
Fetch Customer Profile from MongoDB
      ↓
HTTP POST → ML Services (Flask) /recommend
      ↓
ML Model Prediction
      ↓
Return { offer_name, confidence }
      ↓
Backend Maps offer_name to Product (via ml_label)
      ↓
Save Recommendation to MongoDB
      ↓
Return to Frontend
```

---

## 🧪 Testing

### Using Test Client

A Python test client is provided: `test_client.py`

**Run Tests:**
```bash
python test_client.py
```

**Expected Output:**
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

### Manual Testing with Postman/Insomnia

1. Create POST request to `http://localhost:5000/recommend`
2. Set header: `Content-Type: application/json`
3. Add JSON body with customer data
4. Send request and verify response

---

## 🐛 Troubleshooting

### Error: "Model not loaded"

**Cause:** Model file (`telco_pipeline_model.pkl`) not found or corrupted

**Solution:**
```bash
# Check if file exists
ls -l telco_pipeline_model.pkl

# If missing, obtain from ML team
# If present, verify integrity (should be ~3.5 MB)
```

### Error: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
pip install -r requirements.txt
```

### Port 5000 Already in Use

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

Or change port in `app.py`:
```python
app.run(port=5001, debug=True)
```

### Slow Predictions (>500ms)

**Causes:**
- Large model loading on each request (should only load once at startup)
- Insufficient RAM
- Debug mode enabled

**Solutions:**
- Ensure model is loaded once in global scope
- Use production mode with Gunicorn
- Increase available RAM

---

## 🚀 Deployment

### Production Considerations

1. **Use Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 30 app:app
```

2. **Environment Variables:**
```bash
export FLASK_ENV=production
export MODEL_PATH=/path/to/models/
```

3. **Reverse Proxy with Nginx:**
```nginx
location /ml/ {
    proxy_pass http://127.0.0.1:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

4. **Docker Deployment:**
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
- Deploy multiple instances behind load balancer
- Stateless design allows easy replication
- Use Docker + Kubernetes for orchestration

**Performance Tips:**
- Model loaded once (not per request)
- Use connection pooling for database
- Enable caching for repeated predictions (Redis)

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Startup Time** | ~2-3 seconds (model loading) |
| **Inference Time** | 30-100ms per request |
| **Memory Usage** | ~500MB |
| **Model Size** | ~6MB total |
| **Throughput** | 50-100 requests/second (single instance) |

---

## 📞 Support

### Common Issues

- **Model Files:** Contact ML team for latest trained models
- **Integration:** Refer to backend documentation for integration examples
- **Performance:** Monitor logs for bottlenecks

### Logs

Check console output for:
- Model loading status
- Request/response logs
- Error stack traces

---

## 📝 Project Structure

```
ml_services/
├── app.py                          # Flask API server
├── inference_telco.py              # Recommendation model class
├── inference_churn.py              # Churn prediction model class
├── test_client.py                  # Testing utility
├── requirements.txt                # Python dependencies
├── telco_pipeline_model.pkl        # Trained recommendation model
├── rf_churn_risk_model.pkl         # Trained churn model
├── label_encoders.pkl              # Churn label encoders
├── scaler.pkl                      # Churn feature scaler
└── README.md                       # This file
```

## 👥 Team

**Team Code:** A25-CS019

| Name | Role |
|------|------|
| **Alamahul Bayan** | Front-End Web & Back-End with AI |
| **Bubu Bukhori Muslim** | Machine Learning |
| **Muhammad Fahmi Faisal** | Front-End Web & Back-End with AI |
| **Vito Gunawan** | Machine Learning |
| **Vannesa Ayuni Riskita** | Front-End Web & Back-End with AI |

---

## 🌟 Acknowledgments

- **ASAH 2025 Program** for project support
- **Scikit-learn** for ML framework
- **Flask** for lightweight API framework

---

**Last Updated:** December 2025  
**Version:** 1.0.0

---

Made with ❤️ by Team A25-CS019
