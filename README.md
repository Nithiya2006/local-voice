# 🗣️ LOCALVOICE — Live Location Issue Reporting Platform (MERN Stack)

> **Your Voice. Your Community. Your Change.**  
> A complete full-stack civic technology web application built with **React 19**, **Node.js**, **Express**, **MongoDB / Mongoose**, **JWT Authentication**, and **Leaflet Maps**.

---

## 🌟 1. System Architecture

```text
React Frontend (Vite, Port 5173)
      │
      ▼  (HTTP / REST & Multipart Form-Data with JWT)
Node.js + Express Backend (Port 5000)
      │
      ▼  (Mongoose ODM)
MongoDB Database (mongodb://127.0.0.1:27017/localvoice)
```

---

## 🚀 2. Technology Stack

### Frontend
* **Core Framework**: React 19 + Vite 8
* **Routing**: React Router DOM (v7)
* **HTTP Client**: Axios with JWT request interceptors
* **Map & GIS**: Leaflet 1.9 + React Leaflet 5 + OpenStreetMap tiles
* **Icons**: Lucide React
* **Styling**: Vanilla CSS Design System with dark mode & glassmorphism accents

### Backend
* **Server**: Node.js + Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JWT (JSON Web Tokens) + bcryptjs password hashing
* **File Uploads**: Multer (PNG, JPG, WebP up to 5MB)
* **Geospatial Queries**: MongoDB 2dsphere indexing & `$near` queries
* **CORS**: Cross-Origin Resource Sharing enabled for `http://localhost:5173`

---

## 📁 3. Directory Structure

```text
local voice/
├── public/                     # Static assets & SVG icons (logo.svg, favicon.svg)
├── server/                     # Express & MongoDB Backend
│   ├── config/
│   │   └── db.js               # MongoDB Connection & Auto-Seeding
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Profile & JWT
│   │   ├── issueController.js  # Issue CRUD, Nearby Geospatial, Stats
│   │   ├── notificationController.js # Alerts & Mark Read
│   │   └── supportController.js # Co-sign "+1 I Have the Same Problem"
│   ├── middleware/
│   │   ├── authMiddleware.js   # Protect routes with Bearer Token
│   │   └── uploadMiddleware.js # Multer 5MB JPG/PNG/WebP validation
│   ├── models/
│   │   ├── User.js             # User Schema with bcrypt hashing
│   │   ├── Issue.js            # Issue Schema with 2dsphere index
│   │   ├── Notification.js     # Notification Schema
│   │   └── Support.js          # Unique Compound Index on (issueId, userId)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── issueRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── supportRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/                # Stored Incident Photos
│   ├── .env                    # Environment Variables (MONGO_URI, JWT_SECRET, PORT)
│   ├── package.json
│   └── server.js               # Express Application Entry Point
├── src/                        # React 19 Frontend
│   ├── components/             # Reusable UI & Leaflet Map components
│   ├── context/
│   │   ├── AuthContext.jsx     # Connected to Backend Auth API
│   │   └── IssueContext.jsx    # Connected to Backend Issue & Stats API
│   ├── pages/                  # Route Pages (Home, Nearby, Report, Details, etc.)
│   ├── services/
│   │   └── api.js              # Axios Client & Centralized API Endpoints
│   └── App.jsx
└── package.json
```

---

## ⚡ 4. Quick Start & Setup Instructions

### 1. Start MongoDB
Ensure MongoDB is running locally:
```bash
mongod
# Connection string: mongodb://127.0.0.1:27017/localvoice
```

### 2. Start Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
# Server will run at http://localhost:5000
```
*Note: On initial startup, the backend automatically seeds a default demo user (`alex.morgan@community.org` / `community2026`) and realistic civic issues with geospatial coordinates into MongoDB.*

### 3. Start Frontend (Port 5173)
```bash
npm install
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 📡 5. API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user account with hashed password.
* `POST /api/auth/login` — Authenticate and receive a 30-day JWT.
* `GET /api/auth/me` — Fetch current authenticated citizen profile (Protected).
* `PUT /api/auth/profile` — Update name, phone, city/area, or password (Protected).

### Issues (`/api/issues`)
* `POST /api/issues` — Create report with Multer photo upload and GPS (Protected).
* `GET /api/issues` — List all issues with category/status filters & search query.
* `GET /api/issues/nearby?latitude=...&longitude=...` — MongoDB geospatial `$near` query.
* `GET /api/issues/my-reports` — List current logged-in user's submitted reports (Protected).
* `GET /api/issues/:id` — Get single issue details and timeline.
* `PUT /api/issues/:id` — Update issue status (triggers notification to reporter).
* `DELETE /api/issues/:id` — Delete report (Protected).

### Community Support (`/api/issues/:id/support` & `/api/support`)
* `POST /api/issues/:id/support` — Co-sign "+1 I Have the Same Problem" (prevents duplicate co-signs, updates supportCount).
* `GET /api/support/my-supports` — List all issue IDs supported by the logged-in user.

### Notifications (`/api/notifications`)
* `GET /api/notifications` — Fetch user's status alert notifications.
* `PUT /api/notifications/:id/read` — Mark a single notification as read.
* `PUT /api/notifications/read-all` — Mark all user notifications as read.

### Dashboard Stats (`/api/dashboard`)
* `GET /api/dashboard/stats` — Real-time MongoDB counts (`totalIssues`, `resolvedIssues`, `activeIssues`, `totalUsers`).

---

## 🔒 6. Security Features
* **Bcrypt Password Hashing**: Passwords are salted and hashed before saving.
* **JWT Bearer Auth**: Protected endpoints verify tokens using `authMiddleware`.
* **Upload Sanitization**: Multer restricts formats to JPG/JPEG/PNG/WebP and enforces 5MB limit.
* **Geospatial Indexing**: 2dsphere indexing on `[longitude, latitude]`.
* **CORS Whitelisting**: Allows secure communication with frontend `http://localhost:5173`.
