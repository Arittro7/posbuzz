# PosBuzz – Internship Technical Assignment

A full-stack Point of Sale (POS) application built to demonstrate clean architecture, production-grade code quality, and the ability to design & deploy a working system.

Live Demo:  
- **Frontend**: https://posbuzz-eight.vercel.app/  
- **Backend API**: https://posbuzz-w5rb.onrender.com/api


### Login Credential

```
Email: test@gmail.com
Password: 123456
```

## Overview

This project was developed as part of an internship technical assignment.  
The goal was to implement as much of the scope as possible with production-level code quality, proper structure, security, and deployment readiness.

**Evaluation focus**:  
Quality, code structure, decision-making, and clarity — not just feature count.

**What I completed**:  
- Full authentication (JWT)  
- Product CRUD with Redis caching  
- Sales with stock deduction + transaction safety  
- Basic frontend (login, products, sales)  
- Deployment (Vercel + Render)  

**What I did not complete**:  
- Advanced UI features (search/filter, sales history list, responsive mobile design)  
- Automated unit/integration tests  

**Why partial**:  
Prioritized core business logic and production quality over non-essential UI polish due to time constraints. The system is fully functional, testable, and extendable.

## Features Implemented

### 1. Authentication
- Email & password signup/login
- JWT-based authentication
- Protected APIs & routes (all product/sales endpoints require token)

### 2. Product Management
- Create, list, update, delete products
- Fields: name, sku, price, stock_quantity
- Redis caching on product list endpoint
- Input validation (DTOs + class-validator)

### 3. Sales
- Create a sale with multiple items
- Real-time stock check + deduction
- Prevent sale if stock is insufficient
- Atomic transaction using Prisma $transaction
- Cache invalidation after sale

### 4. Frontend
- Login page
- Protected dashboard
- Product list + create/edit/delete (modal)
- Sales page (multi-item form with total calculation)

### 5. Deployment & Extras
- Backend: Render.com (Node + PostgreSQL + Redis)
- Frontend: Vercel
- Postman collection for API testing (attached below)

## Technology Stack

**Backend**  
- NestJS (framework)  
- PostgreSQL (Neon.tech – serverless)  
- Prisma (ORM + migrations)  
- Redis (Upstash – caching)  
- JWT (authentication)  
- Class-validator (input validation)

**Frontend**  
- Vite + React + TypeScript  
- Ant Design (UI components)  
- TanStack Query (data fetching/mutations)  
- Axios (HTTP client)  
- React Router (routing)

**Deployment**  
- Backend: Render.com  
- Frontend: Vercel

## API Endpoints (Key Routes)

Base URL: `https://your-backend-url.onrender.com/api` (or `http://localhost:3000/api` locally)

### Authentication
- `POST /auth/signup` → Create user  
- `POST /auth/login` → Login & get JWT token

### Products (protected)
- `POST /products` → Create product  
  Body: `{ "name": "Laptop", "sku": "LAP001", "price": 1200.5, "stock_quantity": 10 }`  
- `GET /products` → List all products (cached)  
- `GET /products/:id` → Get single product  
- `PATCH /products/:id` → Update product  
- `DELETE /products/:id` → Delete product

### Sales (protected)
- `POST /sales` → Create sale  
  Body: `{ "items": [{ "productId": "uuid", "quantity": 3 }] }`

All protected endpoints require `Authorization: Bearer <token>` header.

## Postman Collection for Testing

A full Postman collection is available in the repo:  
`posbuzz.postman_collection.json`

Import it into Postman → set `base_url` & `token` variables → test all flows easily.

## Local Setup

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```
### Frontend
```Bash
cd frontend
npm install
npm run dev
```

## Environment variables (backend):

DATABASE_URL (Neon)
JWT_SECRET
REDIS_URL (Upstash)

# Conclusion
This project demonstrates:

Clean architecture (modular NestJS + Prisma)
Security (JWT + protected routes)
Performance (Redis caching)
Reliability (transactions + stock checks)
Modern frontend (TanStack Query + Ant Design)

Thank you for reviewing!