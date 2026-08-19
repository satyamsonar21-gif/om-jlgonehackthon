# ILMP Project Context & Architecture Reference

---

## 1. Executive Overview

The **Internship Lifecycle Management Platform (ILMP)** is a modern web platform for managing end-to-end university internship lifecycles across Students, Faculty Guides, Industry Supervisors, and University Administrators.

---

## 2. Technical Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19 + Vite 6 + Tailwind CSS v4 + Framer Motion |
| **Backend API** | NestJS 10.4 + TypeScript |
| **ORM & Database** | Prisma 5.22 + SQLite / PostgreSQL |
| **Authentication** | Native Institutional Auth (Scrypt KDF, HttpOnly Cookie Sessions, SHA-256 Tokens) |
| **Security & RBAC** | NestJS `AuthGuard` + `RolesGuard` + Client `ProtectedRoute` Gatekeepers |
| **Testing** | Automated verification test suites with `ts-node` |

---

## 3. Core Authentication & Authorization Invariants

1. **Database as Single Source of Truth**: User identity, roles, and permissions are determined strictly by server sessions stored in the database.
2. **Zero Trust in Client Headers/Parameters**: Headers (`x-role`), body parameters (`{ role: 'ADMIN' }`), and query strings are never used for privilege determination.
3. **No Plaintext Credential Storage**: Passwords are saved as Scrypt hashes (`salt:derivedKey`).
4. **Hashed Single-Use Tokens**: Email verification and password reset tokens are stored as SHA-256 hashes and consumed upon verification.
5. **No Production Demo/Bypass Logins**: All logins require valid user accounts and Scrypt password verification.

---

## 4. Repository Structure

```text
├── apps/
│   ├── web/                     # React 19 + Vite Frontend SPA
│   │   ├── src/
│   │   │   ├── components/      # Sidebar, Header, Layout, UI components
│   │   │   ├── pages/           # Student, Faculty, Company, Admin pages
│   │   │   ├── lib/             # API client, AuthProvider, permissions
│   │   │   ├── App.tsx          # React Router v7 routes & ProtectedRoute guards
│   │   │   └── main.tsx         # Application entry point
│   └── api/                     # NestJS Backend API
│       ├── src/
│       │   ├── common/          # AuthGuard, RolesGuard, decorators
│       │   ├── modules/         # Auth, Students, Faculty, Companies, etc.
│       │   └── main.ts          # NestJS entry point & Swagger docs
│       └── test/                # Automated verification suites
└── packages/
    ├── database/                # Shared Prisma schema & SQLite DB
    └── types/                   # Shared TypeScript interfaces
```
