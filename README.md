# 🌟 RECALL - Recommendation & Churn Analysis Learning Lab

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**RECALL** is a comprehensive telco customer retention system powered by Machine Learning, designed to reduce customer churn and increase engagement through intelligent, personalized product recommendations.

> **Team Code:** A25-CS019  
> **Theme:**  Telco - Product Recommendation Offer based on Customer Behaviour 
> **Program:** Asah led by Dicoding
> **Link Model:** https://s.id/Model_Recommendation

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

---

## 🎯 Overview

RECALL is a full-stack application consisting of three main components:

1. **Frontend** (React + TypeScript + Vite): Modern web interface for customers and admins
2. **Backend** (Node.js + Express + MongoDB): RESTful API server for business logic and data management
3. **ML Services** (Flask + scikit-learn): Machine learning models for recommendations and churn prediction

The system provides:
- 🎯 **AI-Powered Recommendations**: Smart product suggestions based on customer behavior
- 📊 **Churn Prediction**: Identify at-risk customers before they leave
- 💬 **AI Chatbot**: Intelligent customer support powered by Google Gemini
- 📈 **Analytics Dashboard**: Comprehensive insights for admins
- 📱 **Responsive Design**: Works seamlessly on all devices

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         RECALL System                       │
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

### Data Flow

1. **Customer Interaction** → Frontend sends requests to Backend
2. **Business Logic** → Backend processes requests, manages data
3. **ML Prediction** → Backend calls ML Services for recommendations
4. **Data Storage** → Backend stores data in MongoDB
5. **Notifications** → Backend sends push notifications via Firebase
6. **Response** → Backend returns data to Frontend

---

## ✨ Key Features

### For Customers

- **Personalized Dashboard**: View usage statistics and recommendations
- **AI Recommendations**: Get product suggestions based on your behavior
- **Product Catalog**: Browse and explore telco packages
- **AI Chatbot**: Get instant help from intelligent assistant
- **Profile Management**: Update personal information and preferences

### For Admins

- **Analytics Dashboard**: Monitor key metrics and KPIs
- **Customer Management**: View and manage customer database
- **Product Management**: CRUD operations for products
- **Recommendation Tracking**: Monitor recommendation performance
- **Reports**: Generate detailed analytics reports

### Technical Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Customer vs Admin permissions
- **Geospatial Queries**: Find nearby customers, detect roaming
- **Real-time Updates**: Live data synchronization
- **Responsive UI**: Mobile-first design
- **Dark Mode**: Modern glassmorphism UI

---

## 💻 Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** 5.8.2 - Type safety
- **Vite** 6.2.0 - Build tool
- **React Router** 7.9.6 - Routing
- **Framer Motion** 12.23.25 - Animations
- **Recharts** 3.5.1 - Data visualization
- **Google Generative AI** 0.24.1 - Chatbot

### Backend
- **Node.js** 18+ - Runtime
- **Express** 5.x - Web framework
- **MongoDB + Mongoose** 8.x - Database
- **JWT** - Authentication
- **Firebase Admin** - Push notifications
- **Nodemailer** - Email service
- **Swagger UI** - API documentation

### ML Services
- **Python** 3.8+
- **Flask** 2.0+ - API server
- **scikit-learn** 1.0+ - ML models
- **pandas** - Data processing
- **numpy** - Numerical operations
- **joblib** - Model persistence

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **MongoDB** Account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Firebase** Project ([Firebase Console](https://console.firebase.google.com/))
- **Google Gemini API Key** ([Get API Key](https://makersuite.google.com/app/apikey))
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Project-Recall
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Seed database
node seeder.js

# Start backend
npm run dev
```

Backend will run at: **http://localhost:3001**

### 3. Setup ML Services

```bash
cd ../ml_services
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# Start ML service
python app.py
```

ML Services will run at: **http://localhost:5000**

### 4. Setup Frontend

```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY

# Start frontend
npm run dev
```

Frontend will run at: **http://localhost:3000**

### 5. Access the Application

- **Customer Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/#/admin/login
- **API Documentation**: http://localhost:3001/api-docs

**Default Admin Credentials:**
- Email: `admin@telco.com`
- Password: `password123`

---

## 📁 Project Structure

```
Project-Recall/
├── frontend/                  # React + TypeScript frontend
│   ├── pages/                 # Page components
│   ├── components/            # Reusable components
│   ├── contexts/              # React contexts
│   ├── utils/                 # Utilities
│   ├── package.json
│   ├── vite.config.ts
│   ├── README.md             # Frontend documentation
│   └── README.IDN.md         # Indonesian version
│
├── backend/                   # Node.js + Express backend
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── routes/       # Route definitions
│   │   │   └── middlewares/  # Auth, validation
│   │   ├── config/           # Configuration
│   │   └── models/           # MongoDB schemas
│   ├── docs/                 # Additional documentation
│   │   ├── API_DOCUMENTATION.md
│   │   ├── ARCHITECTURE.md
│   │   ├── DEPLOYMENT.md
│   │   └── CONTRIBUTING.md
│   ├── server.js
│   ├── seeder.js
│   ├── package.json
│   ├── README.md             # Backend documentation
│   └── README.IDN.md         # Indonesian version
│
├── ml_services/              # Flask ML API
│   ├── app.py                # Main Flask app
│   ├── inference_telco.py    # Recommendation model
│   ├── inference_churn.py    # Churn prediction model
│   ├── test_client.py        # Testing utility
│   ├── *.pkl                 # Trained models
│   ├── requirements.txt
│   ├── README.md             # ML Services documentation
│   └── README.IDN.md         # Indonesian version
│
└── README.md                 # This file
```

---

## 📚 Component Documentation

Each component has detailed documentation:

### Backend Documentation
- [README.md](backend/README.md) - Main backend documentation (English)
- [README.IDN.md](backend/README.IDN.md) - Indonesian version
- [API Documentation](backend/docs/API_DOCUMENTATION.md) - Complete API reference
- [Architecture](backend/docs/ARCHITECTURE.md) - System design and patterns
- [Deployment](backend/docs/DEPLOYMENT.md) - Production deployment guide
- [Contributing](backend/docs/CONTRIBUTING.md) - Development guidelines

### ML Services Documentation
- [README.md](ml_services/README.md) - ML services documentation (English)
- [README.IDN.md](ml_services/README.IDN.md) - Indonesian version

### Frontend Documentation
- [README.md](frontend/README.md) - Frontend documentation (English)
- [README.IDN.md](frontend/README.IDN.md) - Indonesian version

---

## 🔧 Configuration

### Backend (.env)

```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/telcoAsah
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key

# Model ML
ML_SERVICE_URL=your_production_ml_services_link
ML_SERVICE_URL_DEV=http://localhost:5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### ML Services

No environment configuration needed. Models are loaded from `.pkl` files.

---

## 🧪 Testing

### Backend
```bash
cd backend
# Use Swagger UI at http://localhost:3001/api-docs
# Or test with cURL/Postman
```

### ML Services
```bash
cd ml_services
python test_client.py
```

### Frontend
```bash
cd frontend
# Manual testing in browser
# Check browser console for errors
```

---

## 🚀 Deployment

### Backend Deployment Options
- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2**
- **Google Cloud Platform**

See [Backend Deployment Guide](backend/docs/DEPLOYMENT.md) for detailed instructions.

### ML Services Deployment
```bash
# Production with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to:
# - Vercel (Recommended)
# - Netlify
# - GitHub Pages
# - Any static hosting
```

---

## 🔐 Security Considerations

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configured properly
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ HTTPS in production
- ✅ Rate limiting (recommended for production)

---

## 📊 Performance

| Component | Startup Time | Response Time | Memory Usage |
|-----------|-------------|---------------|--------------|
| **Frontend** | ~1s | Instant | ~100MB |
| **Backend** | ~2-3s | 50-200ms | ~200MB |
| **ML Services** | ~2-3s | 30-100ms | ~500MB |

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string
- Verify environment variables
- Ensure no port conflicts

**ML Services errors:**
- Verify model files exist
- Check Python dependencies
- Ensure correct Python version

**Frontend connection issues:**
- Confirm backend is running
- Check VITE_API_URL in .env
- Verify CORS settings

---

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

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](backend/docs/CONTRIBUTING.md) for guidelines.

---

## 📞 Support

For questions or issues:
1. Check component-specific documentation
2. Review troubleshooting sections
3. Check API documentation at `/api-docs`
4. Verify all services are running

---

## 🌟 Acknowledgments

- **ASAH 2025 Program** for project support
- **Google** for Gemini AI API
- **MongoDB Atlas** for database hosting
- **Firebase** for push notification infrastructure
- All open-source projects we depend on

---

## 📈 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics with custom metrics
- [ ] A/B testing for recommendations
- [ ] Mobile app (React Native)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching with Redis
- [ ] Message queue (RabbitMQ/BullMQ)

---

**Last Updated:** December 2025  
**Version:** 1.0.0

---

Made with ❤️ by Team A25-CS019
