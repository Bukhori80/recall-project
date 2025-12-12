# Architecture Documentation

## System Overview

RECALL Backend is a comprehensive Node.js-based REST API designed for telco customer retention. The system follows a modular, service-oriented architecture with clear separation of concerns.

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │ ML Services │
│ React + TS  │◄───────►│  Node.js    │◄───────►│   Flask     │
│             │   HTTP  │   Express   │   HTTP  │   Python    │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                               ├─────────► MongoDB Atlas
                               │            (Database)
                               │
                               └─────────► Firebase
                                           (Push Notifications)
```

---

## Technology Stack

### Backend Core
- **Runtime:** Node.js 18+ with ES Modules
- **Framework:** Express.js 5.x
- **Language:** JavaScript (ESM syntax)

### Data Layer
- **Database:** MongoDB (NoSQL, document-based)
- **ODM:** Mongoose 8.x
- **Indexes:** Geospatial (2dsphere), Text, Unique

### Authentication & Security
- **JWT:** jsonwebtoken for stateless authentication
- **Password Hashing:** bcryptjs with salt rounds
- **CORS:** Enabled for cross-origin requests

### External Services
- **Firebase Admin SDK:** Push notifications (FCM)
- **Nodemailer:** Email delivery
- **Axios:** HTTP client for ML service integration

### Development Tools
- **Nodemon:** Auto-reload during development
- **Swagger UI:** Interactive API documentation
- **dotenv:** Environment variable management

---

## Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← Endpoint definitions
│  (auth, customer, product, etc.)    │
├─────────────────────────────────────┤
│      Middleware Layer               │  ← Auth, validation, error handling
├─────────────────────────────────────┤
│     Controller Layer                │  ← Request handling, response formatting
├─────────────────────────────────────┤
│      Service Layer                  │  ← Business logic
├─────────────────────────────────────┤
│       Model Layer                   │  ← Data schemas, database interaction
└─────────────────────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test individual layers
- Maintainable and scalable
- Reusable business logic

### 2. Service-Oriented Design

Each domain (Auth, Customer, Product, Recommendation, etc.) has its own:
- **Routes:** Define HTTP endpoints
- **Controller:** Handle HTTP requests/responses
- **Service:** Contain business logic
- **Model:** Define data structure

### 3. Middleware Pattern

Middleware functions for cross-cutting concerns:
- **Authentication:** JWT verification (`protect`)
- **Authorization:** Role-based access (`adminOnly`, `customerOnly`)
- **Error Handling:** Centralized error responses
- **Request Validation:** Input sanitization

---

## Component Architecture

### Authentication Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /auth/login (email, password)
     ▼
┌──────────────────┐
│ Auth Controller  │
└────┬─────────────┘
     │ 2. Validate credentials
     ▼
┌──────────────────┐
│  Auth Service    │
└────┬─────────────┘
     │ 3. Query database
     ▼
┌──────────────────┐
│   User Model     │
└────┬─────────────┘
     │ 4. bcrypt.compare(password)
     ◄
     │ 5. Generate JWT
     ▼
┌──────────────────┐
│   JWT Token      │─────► Return to client
└──────────────────┘
```

**Subsequent Requests:**
```
Client Request
     │
     ├─ Header: Authorization: Bearer <token>
     ▼
Middleware: protect()
     │
     ├─ Verify JWT signature
     ├─ Decode payload
     ├─ Attach user to req.user
     ▼
Next Middleware / Controller
```

### Recommendation Generation Flow

```
┌────────────┐
│   Admin    │
└─────┬──────┘
      │ POST /recommendations/:customerId/generate-ai
      ▼
┌──────────────────────┐
│ Recommendation       │
│ Controller           │
└─────┬────────────────┘
      │ 1. Get customer profile
      ▼
┌──────────────────────┐
│ Customer Service     │
└─────┬────────────────┘
      │ 2. Extract features
      ▼
┌──────────────────────┐
│ ML Service (Flask)   │◄─── HTTP POST /recommend
│ localhost:5000       │
└─────┬────────────────┘
      │ 3. Return offer_name + confidence
      ▼
┌──────────────────────┐
│ Product Service      │
└─────┬────────────────┘
      │ 4. Find product by ml_label
      ▼
┌──────────────────────┐
│ Create               │
│ Recommendation Doc   │
└─────┬────────────────┘
      │ 5. Save to MongoDB
      ▼
┌──────────────────────┐
│ Return to Client     │
└──────────────────────┘
```

### Notification Flow

```
Admin Triggers Send
      │
      ▼
┌────────────────────────┐
│ Recommendation Service │
└────┬───────────────────┘
     │
     ├──────────────┬──────────────┐
     ▼              ▼              ▼
┌─────────┐   ┌─────────┐   ┌──────────┐
│  Email  │   │  Push   │   │ Update   │
│ Service │   │ Service │   │ Status   │
└─────────┘   └─────────┘   └──────────┘
     │              │              │
     ▼              ▼              ▼
Nodemailer    Firebase FCM    MongoDB
```

---

## Database Schema Design

### Customer Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  password: String (hashed),
  email: String,
  customer_id: String (unique, indexed),
  plan_type: Enum['Prepaid', 'Postpaid'],
  device_brand: String,
  
  location: {                       // GeoJSON for geospatial queries
    type: 'Point',
    coordinates: [longitude, latitude]  // 2dsphere index
  },
  
  profile: {
    avg_data_usage_gb: Number,
    pct_video_usage: Number,
    avg_call_duration: Number,
    sms_freq: Number,
    monthly_spend: Number,
    topup_freq: Number,
    travel_score: Number,
    churn_risk: Number,              // ML prediction
    engagement_score: Number,        // Increments on interactions
    churn_factors: [String]
  },
  
  recommendations: [ObjectId],       // Reference to Recommendation
  fcmToken: String,                  // For push notifications
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `username`: Unique
- `customer_id`: Unique
- `location`: 2dsphere (geospatial)
- `email`: Regular (for faster lookups)

### Product Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: Enum[...],
  price: Number,
  quota_amount: Number,
  validity_days: Number,
  
  ml_label: String (unique, indexed),  // CRITICAL: Maps ML output to product
  
  image_url: String,
  redirect_url: String,
  isActive: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `ml_label`: Unique (essential for ML mapping)
- `category`: Regular (for filtering)
- `isActive`: Regular (for active product queries)

### Recommendation Collection

```javascript
{
  _id: ObjectId,
  customer: ObjectId (ref: Customer),
  
  type: Enum[...categories],          // From ML prediction
  offer_name: String,                 // Product name
  offer_details: String,
  
  image_url: String,
  redirect_url: String,
  
  confidence_score: Number (0-1),     // ML confidence
  
  status: Enum[
    'PENDING',    // Created but not sent
    'SENT',       // Notification delivered
    'CLICKED',    // User viewed
    'ACCEPTED',   // User subscribed
    'REJECTED'    // User dismissed
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `customer`: Regular (for customer-specific queries)
- `status`: Regular (for filtering by status)
- `createdAt`: Descending (for recent recommendations)

### Relationships

```
Customer ─────┐
              │ 1:N
              ▼
         Recommendation ─────┐
                             │ N:1
                             ▼
                          Product
                       (via ml_label)
```

---

## Data Flow Diagrams

### Customer Registration & Profile Creation

```
User Input
    │
    ▼
Validate Data ────► Password Hashing (bcrypt)
    │                      │
    │                      ▼
    │                Save to MongoDB
    │                      │
    │                      ▼
    │              Generate customer_id
    │                      │
    │                      ▼
    └──────────────► Create Profile Document
                           │
                           ▼
                    Generate JWT Token
                           │
                           ▼
                      Return to Client
```

### Churn Prediction & Recommendation Cycle

```
Scheduled Job / Admin Trigger
         │
         ▼
Fetch High-Risk Customers
(churn_risk > 0.6)
         │
         ▼
For Each Customer:
├─ Extract Profile Features
├─ Call ML Service
├─ Get Recommendation
├─ Map to Product (ml_label)
├─ Create Recommendation Doc
└─ Send Adaptive Notification
         │
         ▼
    Update Status
         │
         ▼
Track Engagement (clicks, accepts)
```

---

## Security Architecture

### Authentication

**JWT Token Structure:**
```javascript
{
  header: {
    alg: 'HS256',
    typ: 'JWT'
  },
  payload: {
    userId: '507f1f77bcf86cd799439011',
    role: 'admin' | 'customer',
    iat: 1234567890,
    exp: 1234654290
  },
  signature: HMACSHA256(...)
}
```

**Token Lifecycle:**
1. User logs in
2. Server generates JWT (expires in 1 day by default)
3. Client stores token (localStorage/sessionStorage)
4. Client includes token in Authorization header for each request
5. Server verifies signature and expiration
6. Token expires → User must re-login

### Authorization Levels

```
┌────────────────┐
│  Public Routes │  ← No authentication required
│  - Login       │
│  - Register    │
└────────────────┘

┌────────────────┐
│ Protected      │  ← JWT required
│ (Any Role)     │
│  - Get Profile │
└────────────────┘

┌────────────────┐
│  Admin Only    │  ← JWT + role='admin'
│  - Create      │
│  - Delete      │
│  - Reports     │
└────────────────┘

┌────────────────┐
│ Customer Only  │  ← JWT + role='customer'
│  - Generate AI │
│  - Click Rec   │
└────────────────┘
```

### Password Security

- **Hashing:** bcrypt with auto-generated salt
- **Salt Rounds:** 10 (configurable)
- **Never Stored Plain:** Passwords hashed before saving
- **Comparison:** bcrypt.compare() for login verification

### Environment Variables

Sensitive data stored in `.env` (gitignored):
- `JWT_SECRET`: Token signing key
- `MONGO_URI`: Database connection string
- `EMAIL_PASS`: SMTP password
- `Firebase credentials`: serviceAccountKey.json

---

## Scalability Considerations

### Horizontal Scaling

**Current Architecture:**
- Stateless design (JWT, no sessions)
- Can deploy multiple instances behind load balancer
- MongoDB Atlas handles database scaling

**Load Balancing:**
```
        ┌──────────────┐
        │ Load Balancer│
        └──────┬───────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
    ┌────┐ ┌────┐ ┌────┐
    │ BE1│ │ BE2│ │ BE3│  ← Multiple backend instances
    └────┘ └────┘ └────┘
       │       │       │
       └───────┼───────┘
               ▼
         ┌──────────┐
         │ MongoDB  │
         │  Atlas   │
         └──────────┘
```

### Caching Strategy (Future)

**Recommended Implementation:**
- **Redis:** Cache frequent queries (customer profiles, products)
- **TTL:** 5-15 minutes for dynamic data
- **Invalidation:** On update/delete operations

### Database Optimization

**Current Optimizations:**
- Indexed fields for fast queries
- Geospatial indexes for location queries
- Lean queries (`.lean()`) for read-only operations
- Pagination for large datasets

**Future Enhancements:**
- Read replicas for analytics
- Sharding for massive scale
- Aggregation pipeline optimization

---

## Integration Points

### 1. ML Service (Flask)

**Protocol:** HTTP POST  
**Endpoint:** `http://localhost:5000/recommend`  
**Timeout:** 5 seconds  
**Retry Logic:** None (future: implement retry with exponential backoff)

**Data Flow:**
```
Backend ──► [Customer Profile] ──► ML Service
        ◄── [Recommendation]  ◄──
```

**Error Handling:**
- If ML service is down: Return fallback recommendation
- If timeout: Log error, return default offer

### 2. Firebase (Push Notifications)

**Service:** Firebase Cloud Messaging (FCM)  
**Authentication:** Service Account Key (serviceAccountKey.json)  
**Per-Customer:** FCM token stored in Customer.fcmToken

**Notification Payload:**
```javascript
{
  token: customer.fcmToken,
  notification: {
    title: 'New Offer for You!',
    body: offer_name
  },
  data: {
    recommendationId: '...',
    redirect_url: '...'
  }
}
```

### 3. Email Service (Nodemailer)

**Protocol:** SMTP  
**Development:** Ethereal Email (fake SMTP for testing)  
**Production:** SendGrid / AWS SES / Gmail SMTP

**Email Template:**
```
Subject: Personalized Offer Just for You!

Hi [Customer Name],

Based on your usage, we recommend: [Offer Name]

[Offer Details]

[CTA Button]
```

### 4. Frontend

**Communication:** REST API over HTTP(S)  
**Authentication:** JWT in Authorization header  
**CORS:** Enabled for frontend domain

---

## Error Handling Strategy

### Centralized Error Handler

```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### Error Types

1. **Validation Errors** (400): Invalid input data
2. **Authentication Errors** (401): Missing/invalid JWT
3. **Authorization Errors** (403): Insufficient permissions
4. **Not Found Errors** (404): Resource doesn't exist
5. **Server Errors** (500): Database, ML service, or internal errors

---

## Monitoring & Logging

### Current Implementation

**Console Logging:**
- Server startup
- Database connection status
- Request logs (Express default)
- Error logs

### Recommended for Production

**Application Monitoring:**
- **PM2:** Process management, auto-restart
- **New Relic / Datadog:** Performance monitoring
- **Sentry:** Error tracking and alerting

**Logging:**
- **Winston / Pino:** Structured logging
- **Log Levels:** ERROR, WARN, INFO, DEBUG
- **Log Aggregation:** ELK Stack / CloudWatch

**Metrics to Track:**
- Request rate, response time
- Database query performance
- ML service latency
- Error rate by endpoint
- Active users, churn rate

---

## Future Enhancements

### Planned Features

1. **Caching Layer:** Redis for performance
2. **Message Queue:** RabbitMQ/BullMQ for async tasks
3. **GraphQL:** Alternative to REST for flexible queries
4. **WebSockets:** Real-time updates for dashboard
5. **API Versioning:** Support v2, v3 alongside v1
6. **Rate Limiting:** Prevent API abuse
7. **Audit Logs:** Track all data changes

### Scalability Roadmap

- **Phase 1:** Single instance (current)
- **Phase 2:** Multiple instances + load balancer
- **Phase 3:** Microservices architecture
- **Phase 4:** Event-driven with message queues

---

**Last Updated:** December 2025
