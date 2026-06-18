# Classic Records — Backend

RESTful API backend for **Classic Records**, an e-commerce platform specializing in vinyl records, CDs, and music merchandise.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Feature Overview](#4-feature-overview)
5. [Security](#5-security)
6. [Performance](#6-performance)
7. [Database Design](#7-database-design)
8. [Folder Structure](#8-folder-structure)
9. [Environment Variables](#9-environment-variables)
10. [API Overview](#10-api-overview)
11. [Running Locally](#11-running-locally)
12. [Docker](#12-docker)
13. [Scripts](#13-scripts)
14. [Known Limitations](#14-known-limitations)
15. [Future Improvements](#15-future-improvements)

---

## 1. Project Overview

Classic Records is an online record store selling vinyl, CDs, and music merchandise. The backend serves as the central API layer providing:

- **User authentication** with email-based OTP verification and password reset flows
- **Product catalog management** with category filtering and Redis-backed caching
- **Order processing** with transactional stock management and checkout
- **Admin dashboard APIs** for user, order, and product management
- **Business analytics** with revenue, order, product, user, and inventory statistics
- **AI-powered chatbot** integration via DeepSeek API with role-based tool execution

The system supports both guest and authenticated checkout, role-based access control (USER / ADMIN), and is designed for deployment via Docker Compose behind an Nginx API gateway.

---

## 2. Tech Stack

| Category          | Technology                                          |
| ----------------- | --------------------------------------------------- |
| **Runtime**       | Node.js 20 (Alpine)                                 |
| **Language**      | TypeScript 6.x (strict mode)                        |
| **Framework**     | Express 5                                           |
| **ORM**           | Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`) |
| **Database**      | PostgreSQL 15                                       |
| **Cache**         | Redis (via `ioredis`)                               |
| **Authentication**| JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)           |
| **Validation**    | Custom service-layer validation                     |
| **Email**         | Nodemailer (Gmail SMTP)                             |
| **File Upload**   | Multer (disk storage)                               |
| **Rate Limiting** | `express-rate-limit`                                |
| **AI Integration**| DeepSeek API (function-calling / tool-use)           |
| **Testing**       | Jest + ts-jest                                      |
| **Dev Tooling**   | nodemon, tsx                                        |
| **CI/CD**         | Jenkinsfile, GitLab CI                              |
| **Deployment**    | Docker + Docker Compose + Nginx reverse proxy       |

---

## 3. Architecture

### Layered Architecture

The backend follows a **four-layer modular architecture** where each domain feature is self-contained under `src/modules/<domain>/`:

```
Client Request
  → Routes          (Express Router — URL mapping, middleware binding)
  → Controller      (HTTP concern — parse request, format response)
  → Service          (Business logic — validation, orchestration, caching)
  → Repository       (Data access — Prisma queries, transactions)
  → Database         (PostgreSQL via Prisma ORM)
```

An optional **Cache layer** sits alongside the service for read-heavy paths (products).

### Why This Architecture?

- **Separation of concerns** — Controllers never touch the database; repositories never know about HTTP status codes.
- **Testability** — Services can be unit-tested by mocking repositories (as demonstrated in `__tests__/`).
- **Maintainability** — Adding a new domain (e.g., `reviews`) is a self-contained operation: create a folder under `modules/` with routes, controller, service, and repository files.
- **Cache transparency** — The cache layer is decoupled from business logic. If Redis is down, the service gracefully falls back to PostgreSQL with no user impact.

### Request Flow Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Client  │────▸│ Nginx (8080) │────▸│ Express (3000)│
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                        Rate Limiter    CORS / JSON     Static Files
                              │              │          (/uploads)
                              ▼              │
                         Auth Middleware     │
                         (JWT verify)       │
                              │              │
                              ▼              ▼
                    ┌─────────────────────────────┐
                    │       Module Router          │
                    │  (auth / products / orders   │
                    │   admin / statistics / chat) │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────────┐
                    │       Controller            │
                    │  (parse req → call service) │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────────┐
                    │        Service              │
                    │  (business logic + cache)   │
                    └────────────┬────────────────┘
                                 │
               ┌─────────────────┼──────────────────┐
               ▼                                     ▼
        ┌──────────┐                          ┌──────────┐
        │  Redis   │                          │ Prisma   │
        │  Cache   │                          │ (PG)     │
        └──────────┘                          └──────────┘
```

---

## 4. Feature Overview

### Authentication (`/api/auth`)

**Purpose:** Complete user identity lifecycle — registration, login, email verification, password management.

**Key functionality:**
- Register with email + password → OTP is sent via email → user verifies OTP to activate account
- Login returns a JWT (7-day expiry) with user profile data
- Unverified accounts are re-usable (credentials updated if re-registered)
- Forgot/reset password flows with OTP verification
- Profile update (name, phone, address) and password change for authenticated users

**Notable details:**
- OTP is generated using `crypto.randomInt()` for cryptographic security, then bcrypt-hashed before storage
- OTP cooldown (60s between sends) and rate limiting (5/hour per email) to prevent abuse
- Forgot-password returns a generic response regardless of email existence to prevent user enumeration

---

### Products (`/api/products`)

**Purpose:** Product catalog management (vinyl records, CDs, merchandise).

**Key functionality:**
- Public endpoints: list all products (optionally filter by category), get product by ID
- Admin-only endpoints: create, update, and delete products
- Redis caching for product listings and individual products (1-hour TTL)
- Input validation for title, artist, price, stock, category, and image URL

**Notable details:**
- Deletion is blocked if the product has existing order items — admin is advised to set stock to 0 instead
- Cache invalidation is triggered on every write operation (create, update, delete)
- Three valid categories: `vinyl`, `cd`, `merch`

---

### Orders (`/api/orders`)

**Purpose:** Checkout and order history for customers.

**Key functionality:**
- Checkout endpoint supports both guest and authenticated users
- Transactional stock validation and decrement — if any item is out of stock, the entire order rolls back
- Captures price-at-time to preserve historical pricing
- Authenticated users can view their own order history with product details
- Auto-fills user profile (name, phone, address) from checkout data if empty

**Notable details:**
- The checkout operation is wrapped in `withRetry()` (3 attempts, exponential backoff) to handle transient DB failures
- Redis cache for ordered products is invalidated post-checkout to reflect updated stock

---

### Admin (`/api/admin`)

**Purpose:** Back-office management for administrators.

**Key functionality:**
- Dashboard statistics: user count, product count, order count, total revenue (from completed orders)
- User management: list users (paginated), update user roles
- Order management: list all orders (paginated with user/product details), update order status
- File upload: admin-only image upload endpoint for product images

**Notable details:**
- All admin routes are protected by the `verifyAdmin` middleware (JWT + role check)
- Pagination is optional — omitting `page`/`limit` returns all records

---

### Statistics (`/api/admin/statistics`)

**Purpose:** Business intelligence and reporting for admin dashboards.

**Key functionality:**
- **Revenue stats:** total revenue, completed orders, average order value, daily chart data
- **Order stats:** order counts by status, daily trend chart, recent orders list
- **Product stats:** top-selling products, sales by category
- **User stats:** new user registrations over time, top customers by spend
- **Inventory stats:** total stock value, low-stock alerts (≤ 5 units), out-of-stock products, category breakdown
- **Export endpoints:** JSON data exports for all five domains (frontend generates Excel)

**Notable details:**
- All stats support period-based filtering: `today`, `week`, `month`, `year`, `custom` (with date range)
- Revenue is calculated only from `COMPLETED` orders

---

### Chat (`/api/chat`)

**Purpose:** AI-powered customer support chatbot with tool-calling capabilities.

**Key functionality:**
- Integrates with DeepSeek API for natural language understanding
- Role-based tool access: Guests get product search/details/add-to-cart; Users additionally get order history; Admins get full order management and statistics
- Multi-hop tool execution loop (up to 5 hops per request)
- Cart operations return action payloads that the frontend can execute
- Graceful fallback to keyword-based product search when AI service is unavailable

**Notable details:**
- User context (role, userId) is resolved from the JWT in the Authorization header
- Destructive operations (delete order, update status) require explicit `confirmed: true` from the AI
- Conversation history is limited to the last 8 messages for context window efficiency

---

## 5. Security

| Mechanism               | Implementation                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| **JWT Authentication**  | Bearer tokens with 7-day expiry. User is re-fetched from DB on every request to ensure account still exists. |
| **OTP Verification**    | 6-digit codes generated via `crypto.randomInt()`. Hashed with bcrypt before storage. 5-minute expiry. |
| **Password Hashing**    | bcrypt with cost factor 10. Enforced min 8 / max 128 character length.         |
| **Rate Limiting**       | Three tiers: general (100 req/10s), strict (10 req/10s for login/checkout), OTP (15 req/10s). |
| **Role-Based Access**   | `verifyUser` and `verifyAdmin` middleware. Admin routes are fully isolated.     |
| **Input Validation**    | Service-layer validation for all user inputs: length limits, format checks (phone regex), category whitelist. |
| **User Enumeration Prevention** | Forgot-password always returns a generic success message.              |
| **File Upload Safety**  | MIME-type whitelist (JPEG, PNG, GIF, WebP), 5 MB size limit.                   |
| **Proxy Trust**         | `trust proxy` is set for correct client IP detection behind Nginx.             |
| **Anti-Enumeration (OTP)** | Cooldown (60s) and hourly limit (5/email) on OTP sends.                     |

---

## 6. Performance

| Strategy                  | Details                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Redis Caching**         | Product listings and individual products cached with 1-hour TTL. Cache-aside pattern. |
| **Cache Invalidation**    | Write operations (create/update/delete product, checkout) invalidate relevant cache keys immediately. |
| **Graceful Degradation**  | `isRedisConnected()` check before every cache operation. If Redis is down, all reads fall back to PostgreSQL transparently. |
| **Retry with Backoff**    | `withRetry()` utility: 3 attempts, exponential backoff (500ms → 1s → 2s, max 8s). Skips retries for application-level errors (e.g., "not found", "out of stock"). |
| **Database Transactions** | Checkout uses `prisma.$transaction()` to atomically validate stock, decrement inventory, and create order + items. |
| **Connection Pooling**    | PostgreSQL connections managed via `pg.Pool` through Prisma's PG adapter.     |
| **Redis Reconnection**    | Exponential backoff retry strategy (500ms → 10s cap). Reconnects on `READONLY`, `ECONNRESET`, `ECONNREFUSED`. |

---

## 7. Database Design

### Entity Relationship Overview

```
┌──────────┐       ┌──────────┐       ┌───────────┐       ┌──────────┐
│   User   │──1:N──│  Order   │──1:N──│ OrderItem │──N:1──│ Product  │
│          │       │          │       │           │       │          │
│ id (UUID)│       │ id (UUID)│       │ id (auto) │       │ id (auto)│
│ email  ◄─┼─ uniq │ userId?  │       │ orderId   │       │ title    │
│ password │       │ status   │       │ productId │       │ artist   │
│ role     │       │ total    │       │ quantity  │       │ price    │
│ isVerif. │       │ created  │       │ priceTime │       │ category │
└──────────┘       └──────────┘       └───────────┘       │ stock    │
                                                          └──────────┘
┌──────────┐
│   Otp    │
│ id (auto)│
│ email  ◄─┼─ index
│ code     │  (bcrypt hash)
│ expiresAt│
└──────────┘
```

### Entities

| Entity       | Purpose                                    | Key Fields                                       |
| ------------ | ------------------------------------------ | ------------------------------------------------ |
| **User**     | Customer and admin accounts                | UUID PK, unique email, bcrypt password, role (USER/ADMIN), isVerified flag |
| **Otp**      | Temporary verification codes               | Auto-increment PK, indexed by email, bcrypt-hashed code, 5-min expiry |
| **Product**  | Catalog items (vinyl, CD, merch)           | Auto-increment PK, title, artist, price, category, stock count |
| **Order**    | Purchase records                           | UUID PK, optional userId (supports guest checkout), status (PENDING/COMPLETED/CANCELLED), totalAmount |
| **OrderItem**| Line items within an order                 | Links Order ↔ Product, stores quantity and `priceAtTime` for historical pricing |

### Business Rules

- Users can exist in an **unverified** state until OTP confirmation
- Orders support **guest checkout** (`userId` is nullable)
- `priceAtTime` on OrderItem preserves the price at purchase time, decoupling from future product price changes
- Products with existing order items **cannot be deleted** (referential integrity enforcement at the application layer)

---

## 8. Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema (5 models)
├── prisma.config.ts           # Prisma CLI configuration
├── src/
│   ├── index.ts               # Server bootstrap (listen on PORT)
│   ├── app.ts                 # Express app setup (middleware, routes)
│   ├── seed.ts                # Database seeder (28 products, 20 users, 30 orders)
│   ├── check.ts               # Dev utility — list users via raw SQL
│   ├── check_db.ts            # Dev utility — test DB connection and list products
│   ├── config/
│   │   ├── env.ts             # Centralized environment variable access with validation
│   │   ├── prisma.ts          # Singleton PrismaClient with PG adapter
│   │   ├── redis.ts           # Redis client with retry/reconnection strategy
│   │   └── mail.ts            # Nodemailer transporter + HTML email templates (OTP, password reset)
│   ├── middlewares/
│   │   ├── auth.ts            # JWT verification: verifyUser, verifyAdmin
│   │   ├── rateLimit.ts       # Rate limiters: general, strict, OTP
│   │   └── upload.ts          # Multer config: disk storage, MIME whitelist, 5 MB limit
│   ├── modules/
│   │   ├── auth/              # Registration, login, OTP, password management
│   │   ├── products/          # CRUD + Redis cache layer
│   │   ├── orders/            # Checkout (transactional) + order history
│   │   ├── admin/             # Dashboard stats, user/order management, file upload
│   │   ├── statistics/        # Revenue, order, product, user, inventory analytics
│   │   └── chat/              # AI chatbot with DeepSeek function-calling
│   ├── types/
│   │   └── auth.ts            # AuthenticatedRequest interface
│   ├── utils/
│   │   └── retry.ts           # Generic retry-with-backoff utility
│   └── __tests__/
│       ├── auth.service.test.ts   # Auth service unit tests (9 test cases)
│       └── order.service.test.ts  # Order service unit tests
├── uploads/                   # Uploaded product images (disk storage)
├── Dockerfile                 # Production container image
├── package.json
├── tsconfig.json
└── jest.config.js
```

Each module follows a consistent file convention:

| File              | Responsibility                                                |
| ----------------- | ------------------------------------------------------------- |
| `*.routes.ts`     | Express Router — endpoint definitions, middleware binding      |
| `*.controller.ts` | HTTP layer — request parsing, response formatting, error mapping |
| `*.service.ts`    | Business logic — validation, orchestration, caching decisions  |
| `*.repository.ts` | Data access — Prisma queries, transactions                     |
| `*.cache.ts`      | Cache operations (products module only)                        |

---

## 9. Environment Variables

| Variable           | Description                                         | Required |
| ------------------ | --------------------------------------------------- | -------- |
| `DATABASE_URL`     | PostgreSQL connection string                        | ✅ Yes    |
| `JWT_SECRET`       | Secret key for signing JWT tokens                   | ✅ Yes    |
| `PORT`             | HTTP server port                                    | No (default: `3000`) |
| `REDIS_URL`        | Redis connection URL                                | No (default: `redis://localhost:6379`) |
| `SMTP_USER`        | Gmail address for sending OTP emails                | No (emails will fail silently) |
| `SMTP_PASS`        | Gmail App Password for SMTP authentication          | No (emails will fail silently) |
| `DEEPSEEK_API_KEY` | DeepSeek API key for AI chatbot                     | No (chatbot falls back to keyword search) |
| `DEEPSEEK_API_URL` | DeepSeek API endpoint                               | No (default: `https://api.deepseek.com/chat/completions`) |
| `DEEPSEEK_MODEL`   | DeepSeek model identifier                           | No (default: `deepseek-chat`) |
| `GEMINI_API_KEY`   | Google Gemini API key (reserved for future use)     | No |
| `HF_API_TOKEN`     | Hugging Face API token (reserved for future use)    | No |
| `HF_MODEL`         | Hugging Face model name (reserved for future use)   | No (default: `google/flan-t5-base`) |

**Example `.env` file:**

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/record_store?schema=public"
PORT=3000
JWT_SECRET="your-secret-key-here"
REDIS_URL="redis://localhost:6379"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
DEEPSEEK_API_KEY="your-deepseek-key"
```

> **Note:** `DATABASE_URL` and `JWT_SECRET` will cause a fatal startup error if not defined. All other variables have fallback defaults.

---

## 10. API Documentation

### Swagger UI URLs
An interactive Swagger UI is served in non-production environments to allow quick API discovery and testing:
- **Direct Backend URL:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Nginx API Gateway URL:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **Raw Spec JSON:** [http://localhost:3000/api-docs/spec.json](http://localhost:3000/api-docs/spec.json)

---

### Using Swagger UI

Follow these steps to authenticate and test protected API endpoints:

1. **Obtain a JWT Token:**
   - Locate the **`POST /api/auth/login`** endpoint in Swagger.
   - Click **Try it out** and replace the request body with one of the pre-seeded account credentials listed in [Demo Accounts](#demo-accounts).
   - Click **Execute** and copy the resulting string returned inside the `"token"` field in the response JSON.
2. **Authorize Swagger UI:**
   - Click the green **Authorize** button (lock icon) on the top-right of the Swagger page.
   - Paste the **raw JWT token string** directly into the Value field.
   - > [!IMPORTANT]
     > Do **NOT** prepend `Bearer ` to the token. Since the security scheme is configured as standard HTTP Bearer (`BearerAuth`), Swagger UI automatically prepends the `Bearer ` prefix before transmitting headers. Adding it manually will cause double-prefix headers (`Bearer Bearer <token>`) which will be rejected by the Express `verifyUser` middleware as an `Invalid or expired token` error (401).
   - Click **Authorize** and then click **Close**.
3. **Execute Protected Endpoints:**
   - You can now expand any protected endpoint (indicated by a closed padlock icon, e.g. `GET /api/orders/my-orders` or `GET /api/admin/stats`), click **Try it out**, fill in parameters, and click **Execute** to see live database responses.

---

### Demo Accounts

The database seeder prepares the following active accounts for local testing:

| Role | Email | Password | Status |
|------|-------|----------|--------|
| **ADMIN** | `admin@gmail.com` | `admin123` | Active & Verified |
| **USER** (Customer) | `user@gmail.com` | `user123456` | Active & Verified |

---

### Authentication & Authorization Architecture

- **JWT Authentication:** Stateful user session management is handled via stateless JWTs. The token payload contains the user's database ID (`{ userId: string }`) and is signed using `JWT_SECRET` with a lifespan of **7 days**.
- **Role-Based Access Control (RBAC):**
  - **`GUEST` (Unauthenticated):** Allowed to browse public catalog (`GET /api/products`), view individual products, interact with the AI chatbot, and perform checkout (`POST /api/orders/checkout`).
  - **`USER` (Verified Customer):** Allowed all guest actions, plus modifying personal profile (`PUT /api/auth/profile`), changing password (`PUT /api/auth/password`), and viewing personal order history (`GET /api/orders/my-orders`).
  - **`ADMIN` (Store Administrator):** Allowed all user actions, plus user role promotion (`PUT /api/admin/users/:id/role`), system-wide order status updates (`PUT /api/admin/orders/:id`), product CRUD operations (`POST/PUT/DELETE /api/products`), product image uploads (`POST /api/admin/upload`), and access to the complete Statistics dashboard.

---

### Common API Flows

#### 1. Customer Registration & Verification
```mermaid
sequenceDiagram
    participant C as Customer (Client)
    participant S as Express Server
    participant DB as PostgreSQL
    participant E as Nodemailer (SMTP)

    C->>S: POST /api/auth/register (email, password)
    S->>DB: Create user (isVerified: false)
    S->>S: Generate 6-digit OTP & bcrypt hash
    S->>DB: Save hashed OTP (expires in 5 min)
    S->>E: Send OTP code email (Console log fallback)
    S-->>C: Response (requireOtp: true, message: OTP Sent)
    
    C->>S: POST /api/auth/verify-otp (email, code)
    S->>DB: Verify OTP matches hash & not expired
    S->>DB: Set User isVerified = true
    S-->>C: Response (JWT Token, User profile)
```

#### 2. Catalog Browsing & E-Commerce Checkout
```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant RC as Redis Cache
    participant DB as PostgreSQL

    C->>S: GET /api/products
    S->>RC: Check cache (products:all)
    alt Cache Hit
        RC-->>S: Return cached products list
    else Cache Miss / Redis Down
        S->>DB: Query products
        S->>RC: Cache products (TTL 1h)
        DB-->>S: Return products list
    end
    S-->>C: JSON list of products

    C->>S: POST /api/orders/checkout (items, address)
    Note over S, DB: Runs in single Prisma $transaction with retry
    S->>DB: Verify product stock availability
    S->>DB: Decrement product stock
    S->>DB: Create Order & OrderItem records
    S->>RC: Invalidate products cache (flushall)
    S-->>C: HTTP 201 Created (Order details)
```

#### 3. Admin Product Management
```mermaid
sequenceDiagram
    participant A as Admin Client
    participant S as Server
    participant C as Cloudinary (Image Host)
    participant RC as Redis Cache
    participant DB as PostgreSQL

    A->>S: POST /api/admin/upload (multipart image)
    S->>C: Upload file
    C-->>S: Return Cloudinary CDN URL
    S-->>A: HTTP 200 (imgUrl)

    A->>S: POST /api/products (title, price, imgUrl, stock)
    S->>DB: Insert product
    S->>RC: Invalidate products cache (flushall)
    S-->>A: HTTP 201 Created (Product details)
```

---

### API Payload Examples

#### 1. Registration
- **Request:** `POST /api/auth/register`
  ```json
  {
    "email": "newuser@example.com",
    "password": "SecureP@ssword123",
    "fullName": "Nguyen Van A"
  }
  ```
- **Response:** `HTTP 201 Created`
  ```json
  {
    "requireOtp": true,
    "email": "newuser@example.com",
    "message": "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP."
  }
  ```

#### 2. OTP Verification
- **Request:** `POST /api/auth/verify-otp`
  ```json
  {
    "email": "newuser@example.com",
    "code": "583921"
  }
  ```
- **Response:** `HTTP 200 OK`
  ```json
  {
    "message": "Xác thực tài khoản thành công!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "bd7bb11a-acac-4556-b758-2b95c3d2b25a",
      "email": "newuser@example.com",
      "fullName": "Nguyen Van A",
      "phone": null,
      "address": null,
      "role": "USER"
    }
  }
  ```

#### 3. Login
- **Request:** `POST /api/auth/login`
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin123"
  }
  ```
- **Response:** `HTTP 200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a050d004-4212-42cb-9131-e1264471116e",
      "email": "admin@gmail.com",
      "fullName": "System Admin",
      "phone": null,
      "address": null,
      "role": "ADMIN"
    }
  }
  ```

#### 4. Browse Products
- **Request:** `GET /api/products?category=vinyl`
- **Response:** `HTTP 200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "Abbey Road",
      "artist": "The Beatles",
      "price": 29.99,
      "imgUrl": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop",
      "category": "vinyl",
      "stock": 5,
      "description": "Remastered 180g vinyl pressing."
    }
  ]
  ```

#### 5. E-Commerce Checkout
- **Request:** `POST /api/orders/checkout`
  ```json
  {
    "customerEmail": "user@gmail.com",
    "customerPhone": "0901234567",
    "customerName": "Normal User",
    "shippingAddr": "789 Hai Ba Trung, Q3, TP.HCM",
    "items": [
      {
        "id": 1,
        "quantity": 1
      }
    ]
  }
  ```
- **Response:** `HTTP 201 Created`
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "userId": "3d91a551-e3ef-4281-903e-e3aa442ba4d0",
      "customerEmail": "user@gmail.com",
      "customerPhone": "0901234567",
      "shippingAddr": "789 Hai Ba Trung, Q3, TP.HCM",
      "totalAmount": 29.99,
      "status": "PENDING",
      "createdAt": "2026-06-18T15:05:00.000Z",
      "orderItems": [
        {
          "id": 482,
          "orderId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          "productId": 1,
          "quantity": 1,
          "priceAtTime": 29.99
        }
      ]
    }
  }
  ```

#### 6. Admin Image Upload
- **Request:** `POST /api/admin/upload` (Form-data)
  - Key: `image`, Value: `album_cover.png` (binary file)
- **Response:** `HTTP 200 OK`
  ```json
  {
    "imgUrl": "https://res.cloudinary.com/dgtsbqngb/image/upload/v1718000000/record-store/1718000000-album.png"
  }
  ```

---

## 11. Running Locally

### Prerequisites

- Node.js ≥ 20
- PostgreSQL 15+
- Redis

### Installation

```bash
cd backend
npm install
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations (create tables)
npx prisma migrate deploy

# Seed sample data (28 products, 20 users, 30 orders)
npm run seed
```

### Development Mode

```bash
npm run dev
```

Starts the server with `nodemon` watching `src/` for `.ts` file changes. Auto-restarts on save.

### Production Mode

```bash
npm run start
```

Runs the server directly with `tsx` (no file watching).

---

## 12. Docker

### Dockerfile

The backend Dockerfile uses a single-stage build on `node:20-alpine`:

1. Copies `package*.json` and installs dependencies
2. Copies the Prisma schema and generates the Prisma client
3. Copies the remaining source code
4. Exposes port 3000
5. Starts via `npm run start` (tsx)

### Docker Compose Integration

The full-stack `docker-compose.yml` at the project root orchestrates five services:

| Service          | Image / Build Context | Port  | Health Check                        |
| ---------------- | --------------------- | ----- | ----------------------------------- |
| **api-gateway**  | `nginx:alpine`        | 8080  | Depends on frontend + backend       |
| **frontend**     | `./frontend`          | 80    | `wget http://localhost:80`          |
| **backend**      | `./backend`           | 3000  | `wget http://localhost:3000/api/products` |
| **postgres**     | `postgres:15-alpine`  | 5432  | `pg_isready`                        |
| **redis**        | `redis:alpine`        | 6379  | `redis-cli ping`                    |

**Volumes:**
- `pgdata` — persistent PostgreSQL data
- `backend_uploads` — persistent file uploads

**Service Dependencies:** `backend` waits for `postgres` and `redis` to be healthy before starting. `frontend` waits for `backend`. `api-gateway` waits for both `frontend` and `backend`.

```bash
# Start everything
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

---

## 13. Scripts

| Script              | Command                                             | Purpose                                                |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `npm run dev`       | `nodemon --watch src --ext ts --exec tsx src/index.ts` | Start dev server with hot-reload on file changes     |
| `npm run start`     | `tsx src/index.ts`                                  | Start production server (no file watching)              |
| `npm run seed`      | `tsx src/seed.ts`                                   | Seed database with sample data and flush Redis cache    |
| `npm test`          | `jest`                                              | Run all unit tests once                                 |
| `npm run test:watch` | `jest --watch`                                     | Run tests in watch mode (re-run on file changes)        |
| `npm run test:coverage` | `jest --coverage`                              | Run tests and generate coverage report                  |

---

## 14. Known Limitations

| Area                  | Limitation                                                                        |
| --------------------- | --------------------------------------------------------------------------------- |
| **Payment**           | No payment gateway integration — orders are created directly without payment processing. |
| **Session Invalidation** | Password change and password reset do not invalidate existing JWT tokens. A compromised token remains valid until natural expiry (7 days). |
| **File Storage**      | Product images are stored on local disk (`uploads/`). Not suitable for horizontal scaling or CDN-backed delivery. |
| **Image URLs**        | Upload endpoint generates `http://localhost:PORT/uploads/...` URLs, which won't work in production without URL rewriting. |
| **Search**            | Product search (in chat) uses in-memory string matching on full product list. No full-text search index. |
| **Email Provider**    | Hardcoded to Gmail SMTP (`smtp.gmail.com:465`). Switching providers requires code changes. |
| **No Pagination on Products** | The `GET /api/products` endpoint returns all products without pagination. |
| **CORS**              | `cors()` is called with no origin restrictions — all origins are allowed.          |
| **Error Handling**    | Error classification relies on string matching of error messages rather than typed error classes. |
| **No Migration Files**| The repository does not include migration history files in the `prisma/` directory. |
| **Uploaded Files Cleanup** | No mechanism to clean up orphaned uploaded images that are no longer referenced by any product. |

---

## 15. Future Improvements

| Priority | Improvement                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------- |
| 🔴 High  | **Payment integration** — Integrate Stripe or VNPay for real payment processing.                 |
| 🔴 High  | **Token revocation** — Implement a token blacklist (Redis-backed) to invalidate sessions on password change/reset. |
| 🔴 High  | **CORS hardening** — Restrict allowed origins to the actual frontend domain.                     |
| 🟡 Med   | **Cloud file storage** — Migrate uploads to S3/GCS with signed URLs for CDN delivery.            |
| 🟡 Med   | **Full-text search** — Add PostgreSQL `tsvector` or Elasticsearch for product search.            |
| 🟡 Med   | **Product pagination** — Add cursor or offset-based pagination to the products endpoint.          |
| 🟡 Med   | **Typed errors** — Replace string-matching error handling with a custom error class hierarchy.    |
| 🟡 Med   | **Email provider abstraction** — Use a provider-agnostic email interface (e.g., SendGrid, AWS SES) configurable via env. |
| 🟡 Med   | **Request validation library** — Adopt Zod or Joi for declarative schema validation.              |
| 🟢 Low   | **API documentation** — Generate OpenAPI/Swagger spec from routes.                                |
| 🟢 Low   | **Logging** — Replace `console.log/warn/error` with a structured logger (Pino or Winston).       |
| 🟢 Low   | **Integration tests** — Add Supertest-based API tests with a test database.                      |
| 🟢 Low   | **Health check endpoint** — Add a dedicated `/health` endpoint for monitoring.                   |
| 🟢 Low   | **Graceful shutdown** — Handle `SIGTERM` to drain connections before exit.                        |

---

*Last updated: June 2026*
