# StockFlow

## Deployed URLs

| Service     | URL                                                          |
| ----------- | ------------------------------------------------------------ |
| Frontend    | https://perceptive-nature-production-frontend.up.railway.app |
| Backend API | https://stockflow-production-api.up.railway.app              |

## GitHub Repository

https://github.com/1224ritesh/StockFlow

---

## Tech Stack

**Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcryptjs  
**Frontend:** Next.js 16, React 19, Tailwind CSS 4, Server Actions  
**Deployment:** Railway

---

## Local Development

### Prerequisites

- Node.js 22+
- PostgreSQL database

### Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_API_URL, API_URL
npm install
npm run dev
```

---

## Environment Variables

### Backend

| Variable       | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                                           |
| `JWT_SECRET`   | Secret key for signing JWT tokens                                      |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `https://your-frontend.up.railway.app`) |
| `PORT`         | Server port (default: 8080)                                            |

### Frontend

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `API_URL`             | Backend API URL — used by server actions at runtime |
| `NEXT_PUBLIC_API_URL` | Backend API URL — baked in at build time            |

---

## API Documentation

**Base URL:** `https://stockflow-production-api.up.railway.app/api/v1`

All protected routes require a `Bearer` token in the `Authorization` header obtained from login or signup.

---

### Health Check

```
GET /health
```

**Response**

```json
{ "message": "StockFlow API Running" }
```

---

### Auth

#### Signup

```
POST /api/v1/auth/signup
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "organizationName": "Acme Corp"
}
```

**Response `201`**

```json
{
  "message": "Account created successfully",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "email": "user@example.com" },
    "organization": { "id": "...", "name": "Acme Corp" }
  }
}
```

---

#### Login

```
POST /api/v1/auth/login
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`**

```json
{
  "message": "Logged in successfully",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "email": "user@example.com" },
    "organization": { "id": "...", "name": "Acme Corp" }
  }
}
```

---

#### Get Current User

```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "data": {
    "user": { "id": "...", "email": "user@example.com" },
    "organization": { "id": "...", "name": "Acme Corp" }
  }
}
```

---

### Dashboard

#### Get Dashboard Summary

```
GET /api/v1/dashboard
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "message": "Dashboard fetched successfully",
  "data": {
    "totalProducts": 10,
    "totalQuantityOnHand": 250,
    "defaultLowStockThreshold": 5,
    "lowStockItems": [
      {
        "id": "...",
        "name": "Product A",
        "sku": "SKU-001",
        "quantityOnHand": 2,
        "effectiveLowStockThreshold": 5,
        "isLowStock": true
      }
    ]
  }
}
```

---

### Products

#### List Products

```
GET /api/v1/products
GET /api/v1/products?search=keyword
Authorization: Bearer <token>
```

**Query Params**
| Param | Type | Description |
|---|---|---|
| `search` | string (optional) | Filter by name or SKU |

**Response `200`**

```json
{
  "message": "Products fetched successfully",
  "data": {
    "defaultLowStockThreshold": 5,
    "products": [ { ...product } ]
  }
}
```

---

#### Get Product

```
GET /api/v1/products/:id
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "message": "Product fetched successfully",
  "data": {
    "id": "...",
    "name": "Product A",
    "sku": "SKU-001",
    "description": null,
    "quantityOnHand": 50,
    "costPrice": "10.00",
    "sellingPrice": "19.99",
    "lowStockThreshold": null,
    "effectiveLowStockThreshold": 5,
    "isLowStock": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Create Product

```
POST /api/v1/products
Authorization: Bearer <token>
```

**Body**

```json
{
  "name": "Product A",
  "sku": "SKU-001",
  "description": "Optional description",
  "quantityOnHand": 50,
  "costPrice": 10.0,
  "sellingPrice": 19.99,
  "lowStockThreshold": 10
}
```

> `description`, `costPrice`, `sellingPrice`, `lowStockThreshold` are optional.

**Response `201`**

```json
{
  "message": "Product created successfully",
  "data": { ...product }
}
```

---

#### Update Product

```
PUT /api/v1/products/:id
Authorization: Bearer <token>
```

**Body** — all fields optional, at least one required

```json
{
  "name": "Updated Name",
  "sellingPrice": 24.99
}
```

**Response `200`**

```json
{
  "message": "Product updated successfully",
  "data": { ...product }
}
```

---

#### Delete Product

```
DELETE /api/v1/products/:id
Authorization: Bearer <token>
```

**Response `200`**

```json
{ "message": "Product deleted successfully" }
```

---

#### Adjust Stock

```
POST /api/v1/products/:id/adjust-stock
Authorization: Bearer <token>
```

**Body**

```json
{
  "quantityDelta": 10
}
```

> Use positive values to add stock, negative to remove. Cannot be `0`. Cannot make quantity go below `0`.

**Response `200`**

```json
{
  "message": "Stock updated successfully",
  "data": { ...product }
}
```

---

### Settings

#### Get Settings

```
GET /api/v1/settings
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "message": "Settings fetched successfully",
  "data": {
    "organizationId": "...",
    "defaultLowStockThreshold": 5
  }
}
```

---

#### Update Settings

```
PUT /api/v1/settings
Authorization: Bearer <token>
```

**Body**

```json
{
  "defaultLowStockThreshold": 10
}
```

**Response `200`**

```json
{
  "message": "Settings updated successfully",
  "data": {
    "organizationId": "...",
    "defaultLowStockThreshold": 10
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Human readable message",
  "code": "ERROR_CODE",
  "details": { "fieldName": ["error message"] }
}
```

| Code                  | HTTP Status | Description                    |
| --------------------- | ----------- | ------------------------------ |
| `VALIDATION_ERROR`    | 400         | Invalid request body or params |
| `UNAUTHORIZED`        | 401         | Missing or invalid token       |
| `CONFLICT`            | 409         | Email or SKU already exists    |
| `NOT_FOUND`           | 404         | Resource not found             |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests              |
| `INTERNAL_ERROR`      | 500         | Server error                   |

---

## Rate Limiting

| Route                 | Limit        | Window     |
| --------------------- | ------------ | ---------- |
| `POST /api/v1/auth/*` | 10 requests  | 15 minutes |
| All other routes      | 100 requests | 15 minutes |
