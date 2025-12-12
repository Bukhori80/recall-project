# RECALL Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Recommendation & Churn Analysis Learning Lab** - A comprehensive backend API for the RECALL project, designed to reduce customer churn and increase engagement through personalized recommendations powered by Machine Learning.

> **Project Code:** A25-CS019  
> **Theme:** Telco Customer Retention  
> **Program:** ASAH 2025

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Integration](#integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

RECALL Backend is a Node.js-based REST API that serves as the core backend infrastructure for a telco customer retention system. It provides comprehensive endpoints for customer management, AI-powered product recommendations, adaptive notifications, chatbot interactions, and detailed reporting dashboards.

The system integrates with:
- **ML Services** (Flask API) for intelligent recommendation generation
- **Firebase** for push notifications
- **MongoDB Atlas** for scalable data storage
- **Frontend** (React/TypeScript) for admin dashboard and customer portal

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication for secure API access
- Separate login flows for admin dashboard and customer portal
- Role-based access control (Admin vs Customer)
- Password hashing with bcrypt

### 👥 Customer Management
- Complete CRUD operations for customer data
- Customer profile with usage patterns and behavior metrics
- Search and pagination support
- Customer-specific recommendation history

### 🗺️ Geospatial Features
- Real-time location tracking for customers
- Nearby customers query using MongoDB geospatial indexes
- Roaming detection and roaming customer lists
- Location-based service offerings

### 🎁 Intelligent Recommendation System
- AI-powered recommendation generation via ML service integration
- Manual recommendation creation and management
- Adaptive notification delivery (Email + Push)
- Recommendation status tracking (PENDING → SENT → CLICKED → ACCEPTED/REJECTED)
- Click tracking and engagement scoring

### 💬 Chatbot Interface
- Intelligent chatbot endpoint for customer support
- Context-aware fallback logic
- Pending recommendation detection and surfacing
- Integration-ready for LLM services

### 📊 Reporting & Analytics
- Comprehensive dashboard endpoint aggregating all metrics
- Churn risk reports with detailed analytics
- Recommendation performance tracking
- Customer usage pattern analysis
- Click-through rates and engagement metrics

### 🔔 Adaptive Notifications
- Multi-channel notification system (Email + Push)
- Firebase Cloud Messaging (FCM) integration
- Nodemailer for email delivery
- FCM token management per customer

### 📦 Product Catalog
- Product management with ML label mapping
- Category-based product organization
- Product details with pricing, quotas, and validity
- Image and redirect URL support

---

## 💻 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 18+ (ES Modules) |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Notifications** | Firebase Admin SDK, Nodemailer |
| **API Documentation** | Swagger UI (OpenAPI 3.0) |
| **HTTP Client** | Axios (for ML service integration) |
| **Environment** | dotenv |
| **CORS** | cors middleware |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** Account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- **Git** for version control
- **Firebase** Project with Admin SDK credentials ([Firebase Console](https://console.firebase.google.com/))

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Project-Recall/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`:
- `express`, `mongoose`, `cors`, `dotenv`
- `jsonwebtoken`, `bcryptjs`
- `firebase-admin`, `nodemailer`
- `axios`, `swagger-ui-express`
- `adminjs` and related packages
- `nodemon` (dev dependency)

### 3. Setup Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the backend root directory

```
backend/
├── serviceAccountKey.json  ← Place your Firebase credentials here
├── package.json
└── ...
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3001

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/telcoAsah?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1d

# Email Configuration (Ethereal for testing, use real SMTP in production)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-email@ethereal.email
EMAIL_PASS=your-ethereal-password
```

#### Configuration Details:

**PORT**: The port where the backend server will run (default: 3001)

**MONGO_URI**: Your MongoDB connection string
- For **MongoDB Atlas**: Get from Atlas Dashboard → Clusters → Connect
- Replace `<username>` and `<password>` with your database credentials
- Change database name from `telcoAsah` if needed

**JWT_SECRET**: Secret key for signing JWT tokens
- **CRITICAL**: Change this to a long, random string in production
- Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**JWT_EXPIRES_IN**: Token expiration time (e.g., `1d`, `7d`, `24h`)

**Email Settings**: SMTP configuration for sending emails
- For **testing**: Use [Ethereal Email](https://ethereal.email/) (fake SMTP service)
- For **production**: Use services like SendGrid, AWS SES, or Gmail SMTP

---

## 🚀 Running the Application

### Development Mode (with hot-reload)

```bash
npm run dev
```

Server will start at: **http://localhost:3001**

Output:
```
Server berjalan di http://localhost:3001
MongoDB Connected: cluster0-shard-00-...
```

### Production Mode

```bash
npm start
```

### Seed the Database

Before first use, populate the database with initial data:

```bash
node seeder.js
```

This will create:
- ✅ Admin account (email: `admin@telco.com`, password: `password123`)
- ✅ Sample customers with varied usage patterns
- ✅ Sample products mapped to ML labels
- ✅ Sample recommendations

**⚠️ Important:** The seeder will **clear existing data** before inserting. Use with caution in production.

---

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:

**🔗 http://localhost:3001/api-docs**

### Quick Start with Swagger:

1. Navigate to `/api-docs`
2. Find the **Auth** section
3. Use **POST /api/v1/auth/login** with credentials:
   ```json
   {
     "email": "admin@telco.com",
     "password": "password123"
   }
   ```
4. Copy the returned `token`
5. Click the **🔓 Authorize** button at the top
6. Enter: `Bearer <your-token>`
7. Now you can test all protected endpoints!

### API Base URL

```
http://localhost:3001/api/v1
```

### Endpoint Overview

| Endpoint Group | Base Path | Description |
|---------------|-----------|-------------|
| **Authentication** | `/api/v1/auth` | Login, registration |
| **Customers** | `/api/v1/customers` | Customer CRUD, location, FCM |
| **Products** | `/api/v1/products` | Product catalog management |
| **Recommendations** | `/api/v1/recommendations` | AI recommendations, notifications |
| **Chatbot** | `/api/v1/chatbot` | Chatbot message handling |
| **Reports** | `/api/v1/reports` | Dashboard analytics |

For detailed endpoint documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) or use the Swagger UI.

---

## 📁 Project Structure

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
│   │       ├── routes/          # Route definitions
│   │       │   ├── auth.routes.js
│   │       │   ├── customer.routes.js
│   │       │   ├── product.routes.js
│   │       │   ├── recommendation.routes.js
│   │       │   ├── chatbot.routes.js
│   │       │   ├── report.routes.js
│   │       │   └── index.js
│   │       └── services/        # Business logic
│   │           ├── auth.service.js
│   │           ├── customer.service.js
│   │           ├── product.service.js
│   │           ├── recommendation.service.js
│   │           ├── chatbot.service.js
│   │           └── report.service.js
│   ├── config/                  # Configuration files
│   │   ├── db.js                # MongoDB connection
│   │   └── index.js             # Environment variables
│   ├── models/                  # Mongoose schemas
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Recommendation.js
│   │   └── User.js
│   ├── utils/                   # Utilities
│   └── app.js                   # Express app setup
├── server.js                    # Entry point
├── seeder.js                    # Database seeder
├── seed_products.js             # Product seeder
├── swagger-spec.json            # OpenAPI specification
├── serviceAccountKey.json       # Firebase credentials (gitignored)
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Customer Model

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
    coordinates: [longitude, latitude]  // GeoJSON format
  },
  profile: {
    avg_data_usage_gb: Number,
    pct_video_usage: Number,
    avg_call_duration: Number,
    sms_freq: Number,
    monthly_spend: Number,
    topup_freq: Number,
    travel_score: Number,
    churn_risk: Number,           // ML prediction score
    engagement_score: Number,     // Increases with interactions
    churn_factors: [String]
  },
  recommendations: [ObjectId]     // Ref to Recommendation
}
```

### Product Model

```javascript
{
  name: String (required),
  description: String (required),
  category: Enum[                 // Maps to recommendation types
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
  ml_label: String (unique, required),  // CRITICAL: Maps ML output to product
  image_url: String,
  redirect_url: String,
  isActive: Boolean
}
```

### Recommendation Model

```javascript
{
  customer: ObjectId (ref: Customer),
  type: Enum[...categories],      // From ML prediction
  offer_name: String,
  offer_details: String,
  image_url: String,
  redirect_url: String,
  confidence_score: Number,       // ML confidence (0-1)
  status: Enum[
    'PENDING',    // Just created, not sent
    'SENT',       // Notification sent
    'CLICKED',    // Customer opened
    'ACCEPTED',   // Customer subscribed
    'REJECTED'    // Customer dismissed
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (Admin)

```javascript
{
  email: String (unique, required),
  password: String (hashed),
  role: String (default: 'admin')
}
```

**Indexes:**
- `Customer.location`: 2dsphere index for geospatial queries
- `Customer.username`, `Customer.customer_id`: Unique indexes
- `Product.ml_label`: Unique index for ML mapping

For detailed schema diagrams, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🔗 Integration

### ML Service Integration

The backend communicates with the ML service (Flask API) for generating AI recommendations.

**ML Service Endpoint:**
```
POST http://localhost:5000/recommend
```

**Request Format:**
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

The backend then maps the `offer_name` to a product in the database using the `ml_label` field.

### Frontend Integration

**Admin Dashboard:** Built with React + TypeScript + Vite  
**Customer Portal:** Integrated in the same frontend

**API Communication:**
- Base URL: `http://localhost:3001/api/v1`
- Authentication: Include JWT in Authorization header: `Bearer <token>`
- CORS: Enabled for all origins in development

Example (JavaScript):
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

## 🧪 Testing

### Manual Testing with Swagger

1. Start the server: `npm run dev`
2. Open: http://localhost:3001/api-docs
3. Authenticate using the admin credentials
4. Test endpoints interactively

### Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telco.com","password":"password123"}'
```

**Get All Customers (with authentication):**
```bash
curl -X GET http://localhost:3001/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing Notifications

**Test Email:**
```bash
curl -X POST http://localhost:3001/api/v1/recommendations/:customerId/send-adaptive \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"RECOMMENDATION_ID","channels":["email"]}'
```

Check your Ethereal inbox for the test email.

---

## 🚀 Deployment

### Quick Deployment Options

#### 1. **Railway** (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### 2. **Heroku**
```bash
# Install Heroku CLI and login
heroku login

# Create app and deploy
heroku create recall-backend
git push heroku main
```

#### 3. **DigitalOcean App Platform**
- Connect your GitHub repository
- Configure environment variables in the dashboard
- Deploy with one click

### Environment Variables in Production

Make sure to set all environment variables from `.env` in your deployment platform:
- `PORT` (usually auto-assigned)
- `MONGO_URI`
- `JWT_SECRET` (use a secure, long random string)
- `JWT_EXPIRES_IN`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`

Also upload `serviceAccountKey.json` securely or use environment variable injection.

### Pre-Deployment Checklist

- [ ] Change `JWT_SECRET` to a secure value
- [ ] Use production MongoDB URI (MongoDB Atlas)
- [ ] Use real SMTP service (not Ethereal)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to allow only your frontend domain
- [ ] Enable HTTPS
- [ ] Set up monitoring (PM2, New Relic, or platform-specific tools)
- [ ] Run `node seeder.js` once to populate initial data

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 👥 Team

**Project Code:** A25-CS019

| Name | Role |
|------|------|
| **Alamahul Bayan** | Front-End Web & Back-End with AI |
| **Bubu Bukhori Muslim** | Machine Learning |
| **Muhammad Fahmi Faisal** | Front-End Web & Back-End with AI |
| **Vito Gunawan** | Machine Learning |
| **Vannesa Ayuni Riskita** | Front-End Web & Back-End with AI |

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🤝 Support

### Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) - Comprehensive API reference
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and architecture
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guide](docs/CONTRIBUTING.md) - Development guidelines

### Getting Help

- **Issues:** Check console output for error messages
- **Swagger UI:** Interactive API testing at `/api-docs`
- **Database:** Verify MongoDB connection string and network access
- **ML Service:** Ensure ML service is running at `localhost:5000`

### Common Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

**MongoDB connection error:**
- Check MongoDB Atlas network access (whitelist your IP)
- Verify username and password in `MONGO_URI`
- Ensure database name is correct

**JWT authentication error:**
- Verify token is included in Authorization header
- Check token hasn't expired
- Ensure `JWT_SECRET` matches across restarts

---

## 🌟 Acknowledgments

- **ASAH 2025 Program** for project support
- **MongoDB Atlas** for database hosting
- **Firebase** for push notification infrastructure

---

**Last Updated:** December 2025  
**Version:** 1.0.0

---

Made with ❤️ by Team A25-CS019
