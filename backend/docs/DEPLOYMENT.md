# Deployment Guide

This guide covers deploying the RECALL Backend API to production environments.

---

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Platform-Specific Guides](#platform-specific-guides)
  - [Railway](#railway-recommended)
  - [Heroku](#heroku)
  - [DigitalOcean App Platform](#digitalocean-app-platform)
  - [AWS EC2](#aws-ec2)
  - [Google Cloud Platform](#google-cloud-platform)
- [Database Setup](#database-setup)
- [Firebase Configuration](#firebase-configuration)
- [SSL/HTTPS](#sslhttps)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have completed:

- [ ] **Code Review:** All code is reviewed and tested
- [ ] **Environment Variables:** All required variables are documented
- [ ] **Database:** MongoDB Atlas cluster created and configured
- [ ] **Firebase:** Project created, service account key generated
- [ ] **Email Service:** Production SMTP configured (not Ethereal)
- [ ] **Security:** `JWT_SECRET` is a strong, random string
- [ ] **Dependencies:** All packages in `package.json` are up to date
- [ ] **Tests:** All endpoints tested manually or with automated tests
- [ ] **Documentation:** API documentation is current
- [ ] **ML Service:** ML service endpoint is accessible from production

---

## Environment Setup

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **Node Environment** | `development` | `production` |
| **Debug Mode** | Enabled | Disabled |
| **CORS** | Allow all origins | Specific frontend domain |
| **Logging** | Verbose console | Structured files |
| **HTTPS** | Optional | Required |
| **Error Details** | Stack traces shown | Generic messages |

### Required Environment Variables

Create a `.env` file or set environment variables in your platform:

```env
# === Server ===
NODE_ENV=production
PORT=3001

# === Database ===
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/telcoAsah?retryWrites=true&w=majority

# === Authentication ===
JWT_SECRET=your_super_secure_random_string_min_32_chars
JWT_EXPIRES_IN=7d

# === Email (Production SMTP) ===
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.your_sendgrid_api_key

# === Optional ===
FRONTEND_URL=https://your-frontend-domain.com
ML_SERVICE_URL=http://ml-service-url:5000
```

### Generating Secure JWT_SECRET

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -base64 64
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/64

---

## Platform-Specific Guides

### Railway (Recommended)

Railway provides simple deployment with automatic HTTPS and great developer experience.

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login
```bash
railway login
```

#### Step 3: Initialize Project
```bash
cd backend
railway init
```

#### Step 4: Set Environment Variables
```bash
railway variables set MONGO_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set EMAIL_HOST="smtp.sendgrid.net"
railway variables set EMAIL_PORT="587"
railway variables set EMAIL_USER="apikey"
railway variables set EMAIL_PASS="your_sendgrid_key"
```

#### Step 5: Deploy
```bash
railway up
```

Railway will automatically:
- Detect Node.js project
- Install dependencies (`npm install`)
- Run start script (`npm start`)
- Assign a public URL with HTTPS

#### Step 6: Add Service Account Key

In Railway dashboard:
1. Go to your service
2. Click **Variables** tab
3. Upload `serviceAccountKey.json` as a file or paste contents as variable

---

### Heroku

#### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Login
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
heroku create recall-backend
```

#### Step 4: Set Environment Variables
```bash
heroku config:set MONGO_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set EMAIL_HOST="smtp.sendgrid.net"
heroku config:set EMAIL_PORT="587"
heroku config:set EMAIL_USER="apikey"
heroku config:set EMAIL_PASS="your_sendgrid_key"
heroku config:set NODE_ENV="production"
```

#### Step 5: Add Firebase Credentials

**Option A:** Environment Variable
```bash
heroku config:set FIREBASE_SERVICE_ACCOUNT="$(cat serviceAccountKey.json)"
```

Then modify your code to use:
```javascript
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
```

**Option B:** Buildpack
Use the Firebase buildpack: https://github.com/timanovsky/subdir-heroku-buildpack

#### Step 6: Deploy
```bash
git push heroku main
```

#### Step 7: Run Seeder (One-Time)
```bash
heroku run node seeder.js
```

---

### DigitalOcean App Platform

#### Step 1: Connect GitHub Repository

1. Go to [DigitalOcean](https://cloud.digitalocean.com/)
2. Create new App → **GitHub** source
3. Select your repository and branch

#### Step 2: Configure Build Settings

- **Source Directory:** `backend`
- **Build Command:** `npm install`
- **Run Command:** `npm start`
- **HTTP Port:** 3001 (or auto-detected)

#### Step 3: Set Environment Variables

In the App Settings, add:
```
MONGO_URI = mongodb+srv://...
JWT_SECRET = your_secret
EMAIL_HOST = smtp.sendgrid.net
EMAIL_PORT = 587
EMAIL_USER = apikey
EMAIL_PASS = SG.xxx
NODE_ENV = production
```

#### Step 4: Deploy

Click **Deploy** button. DigitalOcean will:
- Build your app
- Deploy to containers
- Assign public URL with SSL

---

### AWS EC2

For more control, deploy on AWS EC2 instance.

#### Step 1: Launch EC2 Instance

1. AMI: Ubuntu 22.04 LTS
2. Instance Type: t2.small or larger
3. Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (App)

#### Step 2: SSH into Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### Step 4: Clone Repository
```bash
git clone https://github.com/your-repo/recall-backend.git
cd recall-backend/backend
```

#### Step 5: Install Dependencies
```bash
npm install --production
```

#### Step 6: Set Environment Variables
```bash
nano .env
# Paste your production environment variables
```

#### Step 7: Start with PM2
```bash
pm2 start server.js --name recall-backend
pm2 save
pm2 startup
```

#### Step 8: Setup Nginx as Reverse Proxy
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/recall
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/recall /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 9: Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Google Cloud Platform

#### Using App Engine

1. Install Google Cloud SDK
2. Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard
instance_class: F2

env_variables:
  NODE_ENV: "production"
  MONGO_URI: "your_mongodb_uri"
  JWT_SECRET: "your_secret"
```

3. Deploy:
```bash
gcloud app deploy
```

---

## Database Setup

### MongoDB Atlas

#### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free tier cluster (M0) or paid tier
3. Choose region closest to your backend server

#### Step 2: Database User

1. Database Access → Add New Database User
2. Choose **Password** authentication
3. Save username and password

#### Step 3: Network Access

1. Network Access → Add IP Address
2. **For Development:** Add your current IP
3. **For Production:** Add backend server IP or **Allow Access from Anywhere** (0.0.0.0/0)

#### Step 4: Get Connection String

1. Clusters → Connect → Connect your application
2. Copy connection string:
```
mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/telcoAsah?retryWrites=true&w=majority
```
3. Replace `<password>` with your database user password
4. Replace `telcoAsah` with your database name

#### Step 5: Seed Database (One-Time)
```bash
node seeder.js
```

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or use existing
3. No need for Analytics

### Step 2: Generate Service Account Key

1. Project Settings → Service Accounts
2. Click **Generate New Private Key**
3. Save as `serviceAccountKey.json`

### Step 3: Deploy Service Account Key

**Option 1: File Upload** (Railway, DigitalOcean)
- Upload `serviceAccountKey.json` to platform

**Option 2: Environment Variable** (Heroku, AWS)
```bash
export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

Modify code:
```javascript
import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

---

## SSL/HTTPS

### Automatic SSL (Recommended)

Most platforms (Railway, Heroku, DigitalOcean) provide automatic HTTPS.

### Manual SSL (EC2, Custom Server)

Use Let's Encrypt with Certbot:
```bash
sudo certbot --nginx -d api.your-domain.com
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## Environment Variables

### Complete List

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment | `production` |
| `PORT` | No | Server port | `3001` (often auto-assigned) |
| `MONGO_URI` | Yes | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | JWT signing key | `(64+ char random string)` |
| `JWT_EXPIRES_IN` | No | Token expiration | `7d` |
| `EMAIL_HOST` | Yes | SMTP host | `smtp.sendgrid.net` |
| `EMAIL_PORT` | Yes | SMTP port | `587` |
| `EMAIL_USER` | Yes | SMTP username | `apikey` |
| `EMAIL_PASS` | Yes | SMTP password | `SG.xxx` |
| `FRONTEND_URL` | No | Frontend domain for CORS | `https://app.example.com` |
| `ML_SERVICE_URL` | No | ML service URL | `http://ml.example.com:5000` |

---

## Post-Deployment

### 1. Verify Deployment

```bash
curl https://your-app-url.com/
```

Expected response:
```json
{
  "status": "success",
  "message": "Selamat datang di RECALL Project API v1!",
  "docs": "/api-docs"
}
```

### 2. Test Authentication

```bash
curl -X POST https://your-app-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telco.com","password":"password123"}'
```

### 3. Check Swagger Documentation

Visit: `https://your-app-url.com/api-docs`

### 4. Update Frontend Configuration

In your frontend `.env`:
```
VITE_API_URL=https://your-backend-url.com/api/v1
```

---

## Monitoring

### Application Monitoring

**PM2 (EC2/VPS):**
```bash
pm2 monit
pm2 logs recall-backend
pm2 status
```

**Platform Dashboards:**
- Railway: Built-in metrics
- Heroku: Heroku Metrics addon
- DigitalOcean: App Platform metrics

### External Monitoring Services

**Recommended:**
- **New Relic:** APM, error tracking
- **Datadog:** Full-stack monitoring
- **Sentry:** Error tracking and performance
- **UptimeRobot:** Uptime monitoring (free)

### Health Check Endpoint

Add to your backend:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

Monitor: `https://your-app-url.com/health`

---

## Backup & Recovery

### Database Backups

**MongoDB Atlas:**
- Automatic backups enabled by default
- Restore from Atlas dashboard
- Download backup snapshots

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

**Automated Backups:**
- Set up cron job for daily backups
- Store in S3 or Google Cloud Storage

### Application Backups

**Git Repository:**
- Always push code to Git (GitHub/GitLab)
- Tag releases: `git tag v1.0.0`

**Environment Variables:**
- Document all variables in `.env.example`
- Store securely in password manager

---

## Troubleshooting

### Application Won't Start

**Check Logs:**
```bash
# PM2
pm2 logs recall-backend

# Heroku
heroku logs --tail

# Railway
railway logs
```

**Common Issues:**
- Missing environment variables
- MongoDB connection error
- Port conflict
- Node.js version mismatch

### Database Connection Error

**Verify:**
1. MongoDB URI is correct
2. Database user exists with correct password
3. Network access allows backend IP
4. Database name exists

**Test Connection:**
```javascript
// test-db.js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected!');
```

### JWT Errors

**Issues:**
- Invalid signature → `JWT_SECRET` mismatch
- Token expired → User needs to re-login
- No token → Client not sending Authorization header

**Debug:**
```javascript
console.log('Received token:', req.headers.authorization);
console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 10) + '...');
```

### Email Not Sending

**Check:**
1. Email service credentials are correct
2. Email host/port are accessible
3. Firewall isn't blocking SMTP port
4. Using production SMTP (not Ethereal)

**Test SMTP:**
Use online SMTP tester or `nodemailer` test script

---

## Security Best Practices

### Production Checklist

- [ ] `JWT_SECRET` is strong and unique
- [ ] MongoDB uses strong password
- [ ] HTTPS is enabled
- [ ] CORS is restricted to frontend domain only
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] `serviceAccountKey.json` is gitignored
- [ ] Environment variables are encrypted at rest
- [ ] Regular security updates (`npm audit`)

### CORS Configuration

**Development:**
```javascript
app.use(cors()); // Allow all origins
```

**Production:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.com',
  credentials: true
}));
```

---

## Performance Optimization

### Production Optimizations

1. **Enable Compression:**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Use Production DB:**
   - Use MongoDB Atlas M2+ tier for better performance
   - Enable connection pooling

3. **Caching:**
   - Implement Redis for frequently accessed data
   - Cache product catalog, customer profiles

4. **CDN:**
   - Use CDN for static assets
   - CloudFlare for DDoS protection

---

**Last Updated:** December 2025

For questions or issues, refer to [README.md](../README.md) or [ARCHITECTURE.md](./ARCHITECTURE.md).
