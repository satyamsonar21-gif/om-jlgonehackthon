# 🎓 Internship Lifecycle Management Platform (ILMP)

> An enterprise-grade, multi-stakeholder platform to digitize, monitor, and manage the complete university internship lifecycle across Educational Institutions, Students, Faculty Mentors, and Partner Companies.

---

## 🌟 Executive Overview

**ILMP** replaces fragmented spreadsheets, manual email chains, and unverified paper certificates with a unified, auditable, and cryptographically secure university ecosystem.

### Stakeholder Portals:
- 🎓 **Student Portal**: Discover opportunities, track applications, log daily work, submit weekly progress reports, track attendance, and monitor placement readiness.
- 👩‍🏫 **Faculty Portal**: Guide assigned cohorts, review and approve/reject weekly reports, track batch attendance, and monitor automated student risk alerts.
- 🏢 **Company Mentor Portal**: Post internship listings, evaluate applicants, assign tasks, track intern progress, and submit final performance evaluations.
- 🛡️ **Administrator Console**: Institutional oversight, partner company verification, student directory management, bulk certificate generation, and batch-wide analytics.
- 🔍 **Public Certificate Verifier**: Tamper-proof, QR code-backed digital certificate verification endpoint (`/verify/:code`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router DOM v7, Tailwind CSS v4, Framer Motion |
| **Backend API** | NestJS 10, TypeScript, OpenAPI / Swagger |
| **Database & ORM** | PostgreSQL / SQLite, Prisma ORM 5.22 |
| **Authentication** | Native Institutional Auth (Scrypt KDF, HttpOnly Cookie Sessions, SHA-256 Tokens) |
| **Security & RBAC** | NestJS `AuthGuard` + `RolesGuard`, Client `ProtectedRoute` Gatekeepers, Sliding-Window `RateLimitGuard` |
| **Icons & UI** | Lucide React, Radix UI primitives, Sonner notifications |

---

## 📁 Repository Structure

```text
├── apps/
│   ├── web/                     # React 19 + Vite Frontend SPA
│   │   ├── src/
│   │   │   ├── components/      # Layout, Header, Sidebar, ProtectedRoute, UI
│   │   │   ├── pages/           # Student, Faculty, Company, Admin pages
│   │   │   ├── lib/             # API client (withCredentials), AuthProvider, permissions
│   │   │   ├── App.tsx          # React Router v7 routes & guards
│   │   │   └── main.tsx         # Application entry point
│   │   ├── index.html           # Single Page Application HTML
│   │   └── vite.config.ts       # Vite configuration
│   └── api/                     # NestJS Backend API
│       ├── src/
│       │   ├── common/          # AuthGuard, RolesGuard, RateLimitGuard, decorators
│       │   ├── modules/         # Auth, Students, Faculty, Companies, etc.
│       │   └── main.ts          # NestJS entry point & Swagger docs
│       └── test/                # Automated verification suites
└── packages/
    ├── database/                # Shared Prisma schema, dev.db & migrations
    └── types/                   # Shared TypeScript interfaces
```

---

## ⚙️ Installation & Environment Configuration

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v9.0.0` or higher (recommended) or `npm v10+`

### 1. Configure Environment Variables

Create `apps/api/.env` (based on `apps/api/.env.example`):

```env
# Database Configuration
DATABASE_URL="file:../../packages/database/dev.db"

# Server & Client URLs
PORT=3001
APP_URL="http://localhost:3000"

# Optional Cloud Storage & AI Integrations
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
GEMINI_API_KEY="your_gemini_api_key"

# Email Verification & Notifications (Resend or SMTP)
RESEND_API_KEY="re_your_resend_api_key"
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
SMTP_FROM="no-reply@ilmp.edu"
```

---

## 🗄️ Database Setup & Migrations

```powershell
# 1. Navigate to database package
cd packages/database

# 2. Generate Prisma Client
npx prisma generate

# 3. Synchronize Schema with Database
npx prisma db push
```

---

## 🚀 Running the Development Servers

```powershell
# Start both Frontend and Backend concurrently from root:
pnpm run dev

# Or run individually:
# Backend API (runs on http://localhost:3001)
pnpm --filter @ilmp/api dev

# Frontend Web Application (runs on http://localhost:3000)
pnpm --filter web dev
```

Interactive OpenAPI Swagger Documentation is available at **`http://localhost:3001/docs`**.

---

## 🔐 Authentication & Security Architecture

### 1. User Registration Workflows
The platform enforces role assignment strictly on the server:
- **Student**: `POST /auth/register/student` creates `User` + `StudentProfile` within a Prisma transaction (`role: STUDENT`, `isEmailVerified: false`).
- **Faculty Guide**: `POST /auth/register/faculty` registers faculty guide (`role: FACULTY_MENTOR`, `status: PENDING_APPROVAL`).
- **Company Mentor**: `POST /auth/register/company` registers corporate partner mentor (`role: COMPANY_MENTOR`, `status: PENDING_APPROVAL`).
- **Public Admin Registration**: Prohibited by security policy (`403 Forbidden`).

### 2. Password Security & Cryptography
- Passwords are encrypted using Node.js native **Scrypt Key Derivation** (`scryptSync` with a 16-byte cryptographically random salt).
- Comparison is performed using constant-time `crypto.timingSafeEqual`.
- Minimum 8 characters with complexity constraints (letters, digits) enforced on all DTOs.
- Zero plaintext password storage in database or logs.

### 3. Session Management & HttpOnly Cookies
- Database-backed `Session` model stores SHA-256 token hashes at rest (`sessionTokenHash`).
- Transmitted in production via secure `ilmp_session` cookies:
  - `httpOnly: true` (inaccessible to JavaScript)
  - `secure: process.env.NODE_ENV === 'production'`
  - `sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'`
  - `maxAge: 7 days`
- Concurrent multi-session invalidation upon password reset/change.

### 4. Role-Based Access Control (RBAC)
- Backend `RolesGuard` evaluates user permissions strictly from the server database session.
- Client headers (`x-role`), request bodies, and query parameters are completely ignored for authorization.

---

## 👑 Secure Administrator Provisioning

Administrator accounts are never registered through public endpoints. To provision the initial institutional administrator in a fresh production deployment:

```powershell
# Run the administrator provisioning script from the repository root:
pnpm --filter @ilmp/api exec ts-node -e "
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
const prisma = new PrismaClient();

async function provisionAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@university.edu';
  const rawPassword = process.env.ADMIN_PASSWORD || 'ChangeThisAdminPassword2026!';
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(rawPassword, salt, 64);
  const passwordHash = 'scrypt:' + salt + ':' + derivedKey.toString('hex');

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', status: 'ACTIVE', isActive: true, isEmailVerified: true },
    create: {
      email,
      name: 'System Administrator',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
      isEmailVerified: true,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Institutional Administrator provisioned for: ' + email);
}
provisionAdmin().finally(() => prisma.\$disconnect());
"
```

---

## 🧪 Running Automated Test Suites

```powershell
# Run complete test verification suite across all phases:
pnpm --filter @ilmp/api test

# Run individual verification suites:
pnpm --filter @ilmp/api exec ts-node test/phase3_auth_verification.ts
pnpm --filter @ilmp/api exec ts-node test/phase4_registration_verification.ts
pnpm --filter @ilmp/api exec ts-node test/phase5_email_verification.ts
pnpm --filter @ilmp/api exec ts-node test/phase6_password_recovery.ts
pnpm --filter @ilmp/api exec ts-node test/phase7_rbac_verification.ts
pnpm --filter @ilmp/api exec ts-node test/phase9_routing_verification.ts
pnpm --filter @ilmp/api exec ts-node test/phase11_security_hardening.ts
pnpm --filter @ilmp/api exec ts-node test/phase12_e2e_proof.ts
```

---

## 🚢 Production Deployment

### 1. Production Build
```powershell
# Typecheck & Build API and Frontend SPA
pnpm --filter @ilmp/api exec tsc --noEmit
pnpm --filter web exec tsc --noEmit

pnpm --filter @ilmp/api build
pnpm --filter web build
```

### 2. Reverse Proxy & HTTPS Configuration (Nginx / Caddy)
Ensure reverse proxy forwards standard client identity headers:
```nginx
location /api {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 🌐 Portal Navigation Map

| Stakeholder Portal / Service | URL | Clearance Required |
| :--- | :--- | :--- |
| 🏠 **Landing Page** | [http://localhost:3000](http://localhost:3000) | Public |
| 🔑 **Sign In** | [http://localhost:3000/sign-in](http://localhost:3000/sign-in) | Public |
| 📝 **Register Account** | [http://localhost:3000/sign-up](http://localhost:3000/sign-up) | Public |
| 🎓 **Student Portal** | [http://localhost:3000/student](http://localhost:3000/student) | `STUDENT` |
| 👩‍🏫 **Faculty Portal** | [http://localhost:3000/faculty](http://localhost:3000/faculty) | `FACULTY_MENTOR` |
| 🏢 **Company Portal** | [http://localhost:3000/company](http://localhost:3000/company) | `COMPANY_MENTOR` |
| 🛡️ **Admin Console** | [http://localhost:3000/admin](http://localhost:3000/admin) | `ADMIN` / `SUPER_ADMIN` |
| 🔍 **Certificate Verifier** | [http://localhost:3000/verify/CERT-2026-001](http://localhost:3000/verify/CERT-2026-001) | Public |
| 📖 **NestJS Swagger API Docs** | [http://localhost:3001/docs](http://localhost:3001/docs) | Public |

---

## 📄 License
This project is proprietary and confidential. Created for ILMP Educational Infrastructure.
