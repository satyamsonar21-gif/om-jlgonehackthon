# 🎓 Internship Lifecycle Management Platform (ILMP)

> A comprehensive, AI-powered platform to digitize, monitor, and manage the complete internship lifecycle across Educational Institutions, Students, Faculty Mentors, and Partner Companies.

---

## 🌟 Executive Summary

**ILMP** is an enterprise-grade platform designed to streamline internship operations for colleges and universities. It replaces fragmented spreadsheets, manual email approvals, and unverified paper certificates with a unified, real-time ecosystem.

### Key Features by Portal:
- 🎓 **Student Portal**: Discover AI-matched internship opportunities, track applications, log daily work, submit weekly reports, monitor attendance, and view real-time placement readiness scores.
- 👩‍🏫 **Faculty Portal**: Monitor assigned students, review and approve/reject weekly reports, track batch attendance, and receive automated risk alerts for struggling students.
- 🏢 **Company Mentor Portal**: Post new internship listings, evaluate candidate applications, assign tasks, track intern progress, and submit final performance feedback.
- 🛡️ **Administrator Console**: Full institutional oversight, company verification, student directory management, bulk certificate generation, and batch-wide analytics.
- 🔍 **Public Certificate Verifier**: Tamper-proof, QR code-backed digital certificate verification endpoint (`/verify/:code`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router DOM v7, Tailwind CSS v4, Framer Motion |
| **Backend API** | NestJS 10, TypeScript, OpenAPI / Swagger |
| **Database & ORM** | PostgreSQL, Prisma ORM 5 |
| **Authentication** | Clerk Auth (with local fallback demo mode) |
| **Icons & UI** | Lucide React, Glassmorphism 2.0 design system |

---

## 📁 Repository Structure

```text
d:/ghr/internship-platform/
├── apps/
│   ├── web/                     # React 19 + Vite Frontend SPA
│   │   ├── src/
│   │   │   ├── components/      # Sidebar, Header, Layout components
│   │   │   ├── pages/           # Student, Faculty, Company, Admin pages
│   │   │   ├── lib/             # API client, utilities, Clerk helpers
│   │   │   ├── App.tsx          # React Router v7 routes
│   │   │   └── main.tsx         # Application entry point
│   │   ├── index.html           # Single Page Application HTML
│   │   └── vite.config.ts       # Vite configuration
│   └── api/                     # NestJS Backend API
│       └── src/
│           ├── modules/         # Auth, Students, Faculty, Companies, etc.
│           └── main.ts          # NestJS entry point & Swagger docs
└── packages/
    ├── database/                # Shared Prisma schema & migrations
    └── types/                   # Shared TypeScript interface definitions
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20+
- **npm**: v10+

---

### 1. Database Setup (Choose One)

#### Option A: Local Docker PostgreSQL (Recommended)
```powershell
docker compose up -d
```

#### Option B: Free Cloud PostgreSQL (Neon / Supabase)
Set `DATABASE_URL` in `apps/api/.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/ilmp_dev?sslmode=require"
```

Generate Prisma Client & Sync Schema:
```powershell
cd packages/database
npx prisma db push
```

---

### 2. Start the Frontend (Vite + React)

```powershell
cd apps/web
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser to access the frontend platform.

---

### 3. Start the Backend API (NestJS)

```powershell
cd apps/api
npm install
npm run dev
```

Open **`http://localhost:3001/docs`** for interactive Swagger API documentation.

---

## 🌐 Portal Navigation Map

| Stakeholder Portal / Service | URL |
| :--- | :--- |
| 🏠 **Landing Page** | [http://localhost:3000](http://localhost:3000) |
| 🔑 **Sign In / Portal Selector** | [http://localhost:3000/sign-in](http://localhost:3000/sign-in) |
| 🎓 **Student Portal** | [http://localhost:3000/student](http://localhost:3000/student) |
| 👩‍🏫 **Faculty Portal** | [http://localhost:3000/faculty](http://localhost:3000/faculty) |
| 🏢 **Company Portal** | [http://localhost:3000/company](http://localhost:3000/company) |
| 🛡️ **Admin Console** | [http://localhost:3000/admin](http://localhost:3000/admin) |
| 🔍 **Certificate Verifier** | [http://localhost:3000/verify/CERT-1722031234-A1B2C3](http://localhost:3000/verify/CERT-1722031234-A1B2C3) |
| 📖 **NestJS Swagger API Docs** | [http://localhost:3001/docs](http://localhost:3001/docs) |

---

## 📄 License
This project is proprietary and confidential. Created for ILMP Educational Infrastructure.
