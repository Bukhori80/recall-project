# 🚀 RECALL Frontend

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

Modern, responsive frontend application for RECALL (Recommendation & Churn Analysis Learning Lab) - built with React, TypeScript, and Vite.

> **Tim Code:** A25-CS019  
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
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Components](#components)
- [API Integration](#api-integration)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## 🎯 Overview

RECALL Frontend is a modern web application that provides two main interfaces:

1. **Customer Portal**: Personalized dashboard for telco customers to view recommendations, chat with AI, manage profiles, and browse products
2. **Admin Dashboard**: Comprehensive admin panel for managing customers, products, viewing analytics, and monitoring system health

The application features beautiful UI/UX with smooth animations, responsive design, and real-time data visualization.

---

## ✨ Key Features

### 🏠 Customer Portal

- **Landing Page**: Beautiful hero section with feature highlights
- **Dashboard**: Personalized customer dashboard with usage statistics
- **AI-Powered Recommendations**: Smart product suggestions based on usage patterns
- **Product Catalog**: Browse and explore telco products
- **AI Chatbot**: Intelligent chatbot powered by Google Gemini AI
- **Profile Management**: Update personal information and preferences
- **Authentication**: Secure login and registration system

### 👨‍💼 Admin Dashboard

- **Analytics Overview**: Comprehensive dashboard with key metrics
- **Customer Management**: View, search, and manage customers
- **Product Management**: CRUD operations for products
- **Recommendation Tracking**: Monitor recommendation performance
- **Reports**: Detailed analytics and reporting

### 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Ready**: Modern glassmorphism UI
- **Smooth Animations**: Powered by Framer Motion
- **Interactive Charts**: Data visualization with Recharts
- **Loading States**: Elegant skeleton loaders and transitions
- **Alert System**: Beautiful notifications with SweetAlert2

---

## 💻 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool & dev server |
| **React Router** | 7.9.6 | Client-side routing |
| **Framer Motion** | 12.23.25 | Animations |
| **Recharts** | 3.5.1 | Charts & data visualization |
| **Google Generative AI** | 0.24.1 | AI chatbot integration |
| **SweetAlert2** | 11.26.4 | Beautiful alerts |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Backend API**: Running at `http://localhost:3001` (see backend documentation)
- **ML Services**: Running at `http://localhost:5000` (optional, for AI recommendations)
- **Google Gemini API Key**: For AI chatbot functionality

---

## 📦 Installation

### Step 1: Navigate to Frontend Directory

```bash
cd Project-Recall/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React and React DOM
- TypeScript and type definitions
- Vite and React plugin
- React Router DOM for routing
- Framer Motion for animations
- Recharts for charts
- Google Generative AI SDK
- SweetAlert2 for alerts

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the frontend root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1

# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting Gemini API Key:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it in your `.env` file

**Important Notes:**
- Never commit `.env` to version control
- Use different API keys for development and production
- The backend API must be running for the frontend to work properly

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

**Expected Output:**
```
  VITE v6.2.0  ready in 350 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

**Features in Development Mode:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh on file changes
- ✅ Source maps for debugging
- ✅ TypeScript type checking

### Preview Production Build

```bash
npm run build
npm run preview
```

Preview will be available at: **http://localhost:4173** (or similar)

---

## 📁 Project Structure

```
frontend/
├── public/                       # Static assets
│   ├── logo.png                  
│   ├── favicon.ico               
│   └── ...
├── pages/                        # Page components
│   ├── Landing.tsx               # Landing page
│   ├── Login.tsx                 # Customer login
│   ├── Register.tsx              # Customer registration
│   ├── Dashboard.tsx             # Customer dashboard
│   ├── Recommendation.tsx        # Recommendations page
│   ├── ProductList.tsx           # Product catalog
│   ├── ProductDetail.tsx         # Product details
│   ├── Chat.tsx                  # AI chatbot
│   ├── Profile.tsx               # User profile
│   ├── EditProfile.tsx           # Edit profile
│   └── admin/                    # Admin pages
│       ├── AdminDashboard.tsx    
│       ├── CustomerManagement.tsx
│       ├── ProductManagement.tsx 
│       ├── RecommendationTracking.tsx
│       └── Reports.tsx           
├── components/                   # Reusable components
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer
│   ├── ProductCard.tsx           # Product card component
│   ├── StatCard.tsx              # Statistics card
│   ├── ChartComponents.tsx       # Chart wrappers
│   ├── LoadingSpinner.tsx        # Loading states
│   └── ...
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── utils/                        # Utility functions
│   └── api.ts                    # API client
├── src/                          # Additional source files
├── App.tsx                       # Main app component
├── index.tsx                     # Entry point
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 📄 Available Pages

### Customer Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Home page with features overview |
| **Login** | `/login` | Customer login form |
| **Register** | `/register` | Multi-step registration |
| **Dashboard** | `/dashboard` | Personalized customer dashboard |
| **Recommendations** | `/recommendations` | AI-powered product suggestions |
| **Products** | `/products` | Browse product catalog |
| **Product Detail** | `/products/:id` | Detailed product information |
| **Chat** | `/chat` | AI chatbot interface |
| **Profile** | `/profile` | View user profile |
| **Edit Profile** | `/edit-profile` | Update profile information |

### Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| **Admin Dashboard** | `/admin/dashboard` | Analytics and overview |
| **Customer Management** | `/admin/customers` | Manage customers |
| **Product Management** | `/admin/products` | Manage products |
| **Recommendation Tracking** | `/admin/recommendations` | Track recommendations |
| **Reports** | `/admin/reports` | View detailed reports |

---

## 🧩 Components

### Core Components

**Navbar**
- Responsive navigation with mobile menu
- Authentication state management
- Dynamic links based on user role

**Footer**
- Company information
- Quick links
- Social media links

**ProductCard**
- Displays product information
- Price, quota, validity
- Action buttons (View Details, Subscribe)

**StatCard**
- Statistical information display
- Icons and animations
- Used in dashboards

### Feature Components

**AI Chatbot**
- Powered by Google Gemini
- Conversational interface
- Context-aware responses
- Message history

**Charts**
- Line charts (usage trends)
- Bar charts (comparisons)
- Pie charts (distributions)
- Built with Recharts

**Authentication Forms**
- Form validation
- Error handling
- Loading states
- Success feedback

---

## 🔗 API Integration

### API Client (`utils/api.ts`)

The application uses a centralized API client for all backend communication:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Example: Fetch customers
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

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Token included in all subsequent requests
5. Protected routes check for valid token

### Key Endpoints Used

- `POST /auth/customer/login` - Customer login
- `POST /auth/customer/register` - Customer registration
- `GET /customers/:id` - Get customer profile
- `GET /products` - Fetch products
- `GET /recommendations` - Get recommendations
- `POST /recommendations/:customerId/generate-ai` - Generate AI recommendation
- `POST /chatbot/message` - Send chatbot message

For complete API documentation, see [Backend API Documentation](../backend/docs/API_DOCUMENTATION.md).

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # JavaScript bundle
│   ├── index-[hash].css     # CSS bundle
│   └── ...
└── ...
```

**Build Optimizations:**
- ✅ Code minification
- ✅ Tree shaking (removes unused code)
- ✅ Asset optimization
- ✅ Code splitting
- ✅ Lazy loading for routes

### Deploy the Build

**Option 1: Vercel** (Recommended for React apps)
```bash
npm install -g vercel
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: Static Server**
```bash
npm install -g serve
serve -s dist -l 3000
```

**Option 4: Nginx**
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

### Complete List

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:3001/api/v1` |
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key | `AIzaSy...` |

**Environment-Specific Configurations:**

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

**Important:** Vite only exposes variables prefixed with `VITE_` to the client. The `GEMINI_API_KEY` is accessed via `process.env` in `vite.config.ts`.

---

## 🎨 Customization

### Styling

The application uses inline styles and CSS for styling. Main style patterns:

**Colors:**
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

## 🧪 Testing

### Manual Testing Checklist

**Customer Flow:**
- [ ] Landing page loads correctly
- [ ] User can register with valid data
- [ ] User can log in with credentials
- [ ] Dashboard displays user data
- [ ] Recommendations are generated
- [ ] Products can be browsed and viewed
- [ ] Chatbot responds to messages
- [ ] Profile can be updated

**Admin Flow:**
- [ ] Admin can log in
- [ ] Dashboard shows analytics
- [ ] Customers can be viewed and searched
- [ ] Products can be created/edited/deleted
- [ ] Recommendations are tracked
- [ ] Reports display correctly

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Change port in vite.config.ts
server: {
  port: 3001,
  // ...
}
```

### API Connection Error

**Error:** `Failed to fetch` or `Network Error`

**Check:**
1. Backend is running at `http://localhost:3001`
2. `VITE_API_URL` in `.env` is correct
3. CORS is enabled in backend
4. No firewall blocking the connection

### Build Errors

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript configuration
npx tsc --noEmit
```

### Blank Page After Build

**Cause:** Router base path issue

**Solution:**
Ensure `base: './'` in `vite.config.ts` for relative paths.

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts Documentation](https://recharts.org/)

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

## 🤝 Support

For issues or questions:
- Check console for error messages
- Verify backend and ML services are running
- Review environment variable configuration
- Check network requests in browser DevTools

---

## 🌟 Acknowledgments

- **ASAH 2025 Program** for project support
- **React Team** for the amazing UI library
- **Vite Team** for lightning-fast build tool
- **Google** for Gemini AI API

---

**Last Updated:** December 2025  
**Version:** 1.0.0

---

Made with ❤️ by Team A25-CS019
