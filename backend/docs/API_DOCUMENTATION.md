# API Documentation

## Base URL

```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

1. Login using the authentication endpoint
2. Receive a JWT token in the response
3. Include this token in subsequent requests

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## Endpoints

### Authentication

#### Admin Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate admin user and receive JWT token

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@telco.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@telco.com",
      "role": "admin"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telco.com","password":"password123"}'
```

---

#### Customer Registration

**Endpoint:** `POST /auth/customer/register`

**Description:** Register a new customer account

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword",
  "email": "john@example.com",
  "plan_type": "Prepaid",
  "device_brand": "Samsung",
  "profile": {
    "avg_data_usage_gb": 5.2,
    "pct_video_usage": 0.6,
    "avg_call_duration": 15,
    "sms_freq": 20,
    "monthly_spend": 75000,
    "topup_freq": 2,
    "travel_score": 0.3
  }
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "customer": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "customer_id": "C00123",
      "email": "john@example.com"
    }
  }
}
```

---

#### Customer Login

**Endpoint:** `POST /auth/customer/login`

**Description:** Authenticate customer and receive JWT token

**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "customer": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "customer_id": "C00123",
      "role": "customer"
    }
  }
}
```

---

### Customers

#### Get All Customers

**Endpoint:** `GET /customers`

**Description:** Retrieve all customers with pagination and search support

**Access:** Protected (Admin & Customer)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by username, email, or customer_id

**Request:**
```bash
GET /customers?page=1&limit=10&search=john
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "johndoe",
        "customer_id": "C00123",
        "email": "john@example.com",
        "plan_type": "Prepaid",
        "device_brand": "Samsung",
        "profile": {
          "avg_data_usage_gb": 5.2,
          "churn_risk": 0.35,
          "engagement_score": 15
        },
        "location": {
          "type": "Point",
          "coordinates": [106.8456, -6.2088]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3001/api/v1/customers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### Get Customer by ID

**Endpoint:** `GET /customers/:customerId`

**Description:** Retrieve a specific customer's full details

**Access:** Protected (Admin & Customer - customers can only view their own)

**URL Parameters:**
- `customerId`: Customer ID (e.g., "C00123")

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "johndoe",
    "customer_id": "C00123",
    "email": "john@example.com",
    "plan_type": "Prepaid",
    "device_brand": "Samsung",
    "profile": {
      "avg_data_usage_gb": 5.2,
      "pct_video_usage": 0.6,
      "avg_call_duration": 15,
      "sms_freq": 20,
      "monthly_spend": 75000,
      "topup_freq": 2,
      "travel_score": 0.3,
      "churn_risk": 0.35,
      "engagement_score": 15,
      "churn_factors": ["Low engagement", "High data usage"]
    },
    "recommendations": [...]
  }
}
```

---

#### Create Customer

**Endpoint:** `POST /customers`

**Description:** Create a new customer (admin only, for testing)

**Access:** Protected (Admin Only)

**Request Body:** Same as customer registration

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "johndoe",
    "customer_id": "C00123",
    ...
  }
}
```

---

#### Update Customer

**Endpoint:** `PATCH /customers/:customerId`

**Description:** Update customer information

**Access:** Protected (Admin & Customer - customers can only update their own)

**URL Parameters:**
- `customerId`: Customer ID

**Request Body (partial update):**
```json
{
  "email": "newemail@example.com",
  "profile": {
    "monthly_spend": 85000
  }
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "newemail@example.com",
    ...
  }
}
```

---

#### Delete Customer

**Endpoint:** `DELETE /customers/:customerId`

**Description:** Delete a customer

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Customer deleted successfully"
}
```

---

#### Update Customer Location

**Endpoint:** `PATCH /customers/:customerId/location`

**Description:** Update customer's geographic location (for geospatial features)

**Access:** Protected

**Request Body:**
```json
{
  "longitude": 106.8456,
  "latitude": -6.2088
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "customer_id": "C00123",
    "location": {
      "type": "Point",
      "coordinates": [106.8456, -6.2088]
    }
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3001/api/v1/customers/C00123/location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"longitude":106.8456,"latitude":-6.2088}'
```

---

#### Find Nearby Customers

**Endpoint:** `GET /customers/nearby`

**Description:** Find customers within a specified radius (for geomap features)

**Access:** Protected (Admin Only)

**Query Parameters:**
- `longitude` (required): Center longitude
- `latitude` (required): Center latitude
- `maxDistance` (optional): Maximum distance in meters (default: 5000)

**Request:**
```bash
GET /customers/nearby?longitude=106.8456&latitude=-6.2088&maxDistance=10000
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "customer_id": "C00123",
      "username": "johndoe",
      "location": {
        "coordinates": [106.8456, -6.2088]
      },
      "distance": 1250
    }
  ]
}
```

---

#### Get Roaming Customers

**Endpoint:** `GET /customers/roaming-list`

**Description:** Get list of customers currently roaming (travel_score > threshold)

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "customer_id": "C00125",
      "username": "traveler1",
      "profile": {
        "travel_score": 0.85
      },
      "location": {
        "coordinates": [107.6191, -6.9175]
      }
    }
  ]
}
```

---

#### Register FCM Token

**Endpoint:** `PATCH /customers/:customerId/register-fcm`

**Description:** Register Firebase Cloud Messaging token for push notifications

**Access:** Protected (Admin Only)

**Request Body:**
```json
{
  "fcmToken": "fL4P9xG2Qz6R..."
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "FCM token registered successfully"
}
```

---

### Products

#### Get All Products

**Endpoint:** `GET /products`

**Description:** Retrieve all active products

**Access:** Protected

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "name": "Premium Video Streaming Package",
      "description": "Unlimited streaming for Netflix, YouTube, Disney+",
      "category": "Streaming Partner Pack",
      "price": 99000,
      "quota_amount": 30,
      "validity_days": 30,
      "ml_label": "Premium Video Streaming",
      "image_url": "https://example.com/image.jpg",
      "redirect_url": "https://example.com/subscribe",
      "isActive": true
    }
  ]
}
```

---

#### Get Product by ID

**Endpoint:** `GET /products/:id`

**Description:** Retrieve a specific product

**Access:** Protected

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "Premium Video Streaming Package",
    ...
  }
}
```

---

#### Create Product

**Endpoint:** `POST /products`

**Description:** Create a new product

**Access:** Protected (Admin Only)

**Request Body:**
```json
{
  "name": "Premium Video Streaming Package",
  "description": "Unlimited streaming for Netflix, YouTube, Disney+",
  "category": "Streaming Partner Pack",
  "price": 99000,
  "quota_amount": 30,
  "validity_days": 30,
  "ml_label": "Premium Video Streaming",
  "image_url": "https://example.com/image.jpg",
  "redirect_url": "https://example.com/subscribe"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "Premium Video Streaming Package",
    ...
  }
}
```

---

#### Update Product

**Endpoint:** `PATCH /products/:id`

**Description:** Update product details

**Access:** Protected (Admin Only)

**Request Body (partial):**
```json
{
  "price": 89000,
  "isActive": true
}
```

---

#### Delete Product

**Endpoint:** `DELETE /products/:id`

**Description:** Delete a product

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

### Recommendations

#### Generate AI Recommendation

**Endpoint:** `POST /recommendations/:customerId/generate-ai`

**Description:** Generate product recommendation using ML service based on customer profile

**Access:** Protected (Customer Only)

**URL Parameters:**
- `customerId`: Customer ID

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "707f1f77bcf86cd799439011",
    "customer": "507f1f77bcf86cd799439012",
    "type": "Streaming Partner Pack",
    "offer_name": "Premium Video Streaming",
    "offer_details": "Perfect for your heavy video usage",
    "confidence_score": 0.9245,
    "status": "PENDING",
    "image_url": "https://example.com/image.jpg",
    "redirect_url": "https://example.com/subscribe"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/recommendations/C00123/generate-ai \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### Create Recommendation (Manual)

**Endpoint:** `POST /recommendations`

**Description:** Manually create a recommendation (admin only, for testing)

**Access:** Protected (Admin Only)

**Request Body:**
```json
{
  "customerId": "C00123",
  "type": "Data Booster",
  "offer_name": "10GB Data Booster",
  "offer_details": "Extra 10GB for weekend streaming",
  "confidence_score": 0.85
}
```

---

#### Send Adaptive Recommendation

**Endpoint:** `POST /recommendations/:customerId/send-adaptive`

**Description:** Send pending recommendations to customer via email and/or push notification

**Access:** Protected (Admin Only)

**URL Parameters:**
- `customerId`: Customer ID

**Request Body:**
```json
{
  "recommendationId": "707f1f77bcf86cd799439011",
  "channels": ["email", "push"]
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Recommendation sent successfully",
  "data": {
    "emailSent": true,
    "pushSent": true
  }
}
```

---

#### Get Recommendation

**Endpoint:** `GET /recommendations/:recommendationId`

**Description:** Get recommendation details

**Access:** Protected (Customer Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "707f1f77bcf86cd799439011",
    "offer_name": "Premium Video Streaming",
    "offer_details": "Perfect for your heavy video usage",
    "confidence_score": 0.9245,
    "status": "SENT",
    ...
  }
}
```

---

#### Click Recommendation

**Endpoint:** `POST /recommendations/:recommendationId/click`

**Description:** Record that customer clicked/viewed the recommendation (updates engagement score)

**Access:** Protected (Customer Only)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Recommendation clicked",
  "data": {
    "status": "CLICKED",
    "engagement_score": 20
  }
}
```

---

### Chatbot

#### Send Message

**Endpoint:** `POST /chatbot/message`

**Description:** Send message to chatbot and receive intelligent response

**Access:** Protected

**Request Body:**
```json
{
  "customerId": "C00123",
  "message": "What are my pending offers?"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "response": "You have 2 pending offers: Premium Video Streaming and Data Booster 10GB",
    "recommendations": [
      {
        "_id": "707f1f77bcf86cd799439011",
        "offer_name": "Premium Video Streaming",
        "status": "PENDING"
      }
    ]
  }
}
```

---

### Reports

#### Get Dashboard Report

**Endpoint:** `GET /reports/dashboard`

**Description:** Get comprehensive dashboard analytics (super-endpoint with all metrics)

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "totalCustomers": 1250,
      "activeCustomers": 980,
      "churnRiskCustomers": 125,
      "avgChurnRisk": 0.32
    },
    "churnAnalysis": {
      "highRisk": 125,
      "mediumRisk": 350,
      "lowRisk": 775
    },
    "recommendationMetrics": {
      "totalRecommendations": 3200,
      "pending": 450,
      "sent": 1800,
      "clicked": 750,
      "accepted": 200,
      "clickThroughRate": 0.42
    },
    "usagePatterns": {
      "avgDataUsage": 6.8,
      "avgMonthlySpend": 85000
    }
  }
}
```

---

#### Get Churn Report

**Endpoint:** `GET /reports/churn`

**Description:** Get detailed churn risk analysis

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "highRisk": 125,
      "mediumRisk": 350,
      "lowRisk": 775
    },
    "customers": [
      {
        "customer_id": "C00150",
        "username": "user150",
        "churn_risk": 0.85,
        "churn_factors": ["Low engagement", "Declining spend"],
        "recommendations_sent": 3,
        "last_interaction": "2025-12-01"
      }
    ]
  }
}
```

---

#### Get Recommendation Report

**Endpoint:** `GET /reports/recommendations`

**Description:** Get recommendation performance metrics

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalRecommendations": 3200,
    "byStatus": {
      "PENDING": 450,
      "SENT": 1800,
      "CLICKED": 750,
      "ACCEPTED": 200,
      "REJECTED": 0
    },
    "clickThroughRate": 0.42,
    "acceptanceRate": 0.27
  }
}
```

---

#### Get Usage Report

**Endpoint:** `GET /reports/usage`

**Description:** Get customer usage pattern analytics

**Access:** Protected (Admin Only)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "avgDataUsage": 6.8,
    "avgVideoUsage": 0.65,
    "avgCallDuration": 12.5,
    "avgMonthlySpend": 85000,
    "distributionByPlanType": {
      "Prepaid": 750,
      "Postpaid": 500
    }
  }
}
```

---

## Integration Examples

### JavaScript (Fetch API)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data.data.token;
};

// Get customers with auth
const getCustomers = async (token) => {
  const response = await fetch('http://localhost:3001/api/v1/customers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const customers = await api.get('/customers');
const customer = await api.get('/customers/C00123');
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:3001/api/v1"

# Login
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@telco.com", "password": "password123"}
)
token = response.json()["data"]["token"]

# Get customers
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/customers", headers=headers)
customers = response.json()["data"]
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

---

## Swagger Documentation

Interactive API documentation with try-it-out functionality is available at:

**http://localhost:3001/api-docs**

The Swagger UI provides:
- Complete endpoint reference
- Request/response schemas
- Interactive testing
- Authentication support

---

**Last Updated:** December 2025
