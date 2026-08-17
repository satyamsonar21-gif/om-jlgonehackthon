# 🧠 PROJECT CONTEXT — AI Session Recovery Guide
# Internship Lifecycle Management Platform (ILMP)
#
# ⚠️  READ THIS FILE FIRST IN EVERY NEW SESSION.
# ⚠️  UPDATE THIS FILE AFTER EVERY SIGNIFICANT CHANGE.
# Last Updated: 2026-08-17T17:49:00+05:30

---

## 1. What Is This Project?

An **Internship Lifecycle Management Platform** for colleges/universities.
It digitizes the full internship pipeline: discovery → application → tracking → evaluation → certification.

**4 stakeholder portals**: Student, Faculty Mentor, Company Mentor, College Administrator.

---

## 2. Repository Location & Structure

```
d:/ghr/internship-platform/
├── apps/
│   ├── web/                  # React 19 + Vite 6 + React Router DOM v7 (SPA frontend)
│   └── api/                  # NestJS 10 backend (TypeScript, Prisma ORM) — PROTOTYPE ONLY
├── packages/
│   ├── database/             # Prisma schema (schema.prisma) — shared DB models
│   ├── types/                # Shared TypeScript interfaces
│   └── config/               # Shared config
├── README.md
├── docker-compose.yml
├── PROJECT_CONTEXT.md        # ← THIS FILE (AI memory)
└── PHASES.md                 # ← Implementation phases & checklist
```

---

## 3. Current State of Each Component

### 3A. Frontend — `apps/web/` ✅ BUILT (Demo UI)

| Detail | Value |
|---|---|
| Framework | React 19 + Vite 6.4 + TypeScript 5.7 |
| Routing | React Router DOM v7 (`src/App.tsx`) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + custom `globals.css` |
| UI Libraries | Framer Motion, Lucide React, Radix UI primitives, Recharts |
| State | Zustand, TanStack React Query |
| API Client | Axios (`src/lib/api.ts`) pointing to `http://localhost:3001` |
| Auth Stub | Demo mode role-selector (no real Clerk integration yet) |
| Build | `npm run dev` → `http://localhost:3000` |
| Build Check | `tsc && vite build` passes with 0 errors |

**Key files:**
- Entry: `src/main.tsx` → `src/App.tsx`
- Routes: 36 routes defined in `src/App.tsx`
- Layout: `src/components/layout/DashboardLayout.tsx` (Sidebar + Header + Outlet)
- Pages: `src/pages/student/` (13), `src/pages/faculty/` (5), `src/pages/company/` (6), `src/pages/admin/` (8), plus 4 public pages

**⚠️ Current limitation:** All pages use **hardcoded mock data**. No real API calls to backend yet.

---

### 3B. Backend (NestJS) — `apps/api/` ⚠️ PROTOTYPE (Scaffolded, Not Production)

| Detail | Value |
|---|---|
| Framework | NestJS 10.4 + TypeScript |
| ORM | Prisma Client 5.22 (reads from `packages/database/schema.prisma`) |
| Auth | Clerk Backend SDK (JWT verification guard) |
| Swagger | `@nestjs/swagger` at `http://localhost:3001/docs` |
| Build | `nest build` passes with 0 errors |

**17 modules scaffolded** under `apps/api/src/modules/`:
ai, analytics, applications, attendance, auth, certificates, companies, daily-logs, faculty, feedback, internships, listings, notifications, students, tasks, uploads, weekly-reports

**⚠️ Current limitation:** Backend requires PostgreSQL + `prisma generate` + `prisma db push` before it can start. Services return mock/placeholder data — real business logic is NOT fully implemented.

---

### 3C. Database — `packages/database/` ✅ LIVE WITH SEED DATA

**Engine**: SQLite (file-based, zero server setup) — `packages/database/dev.db`

14 data models defined with proper relations:
`College`, `Company`, `User`, `Student`, `Faculty`, `CompanyMentor`, `FacultyStudentAssignment`, `InternshipListing`, `Application`, `Internship`, `AttendanceRecord`, `DailyLog`, `WeeklyReport`, `MentorFeedback`, `Task`, `Certificate`, `Notification`

10 enums (stored as strings for SQLite): `Role`, `InternshipMode`, `ListingStatus`, `ApplicationStatus`, `InternshipStatus`, `AttendanceStatus`, `ReportStatus`, `FeedbackType`, `TaskStatus`, `NotificationType`

**Seed data** (via `packages/database/seed.ts`): 1 college, 1 company, 7 users (3 students, 2 faculty, 1 mentor, 1 admin), 3 internship listings, 2 applications, 1 active internship with attendance/logs/reports/feedback/tasks, 5 notifications.

**Browse data**: `npx prisma studio` → `http://localhost:5555`

⚠️ Note: Original schema was PostgreSQL. Migrated to SQLite by removing `@db.Text`, replacing `String[]` with comma-separated `String?`, and replacing Prisma enums with string defaults.

---

### 3D. Java Backend — NOT YET CREATED

A full enterprise Java 21 + Spring Boot 3 backend architecture has been **designed** (see `java_backend_architecture.md` artifact) but **no code has been generated yet**.

This is the **planned production backend** to eventually replace or coexist with the NestJS prototype.

---

## 4. Tech Stack Summary

| Layer | Current | Planned Production |
|---|---|---|
| Frontend | React 19 + Vite 6 + Tailwind v4 | Same |
| Backend | NestJS 10 (prototype) | Java 21 + Spring Boot 3 |
| Database | PostgreSQL via Prisma | PostgreSQL via Spring Data JPA / Hibernate |
| Cache | — | Redis 7.2 |
| Message Queue | — | RabbitMQ |
| Auth | Clerk (demo stub) | JWT + Spring Security |
| AI | — | Spring AI / OpenAI / Gemini |
| Monitoring | — | Prometheus + Grafana |
| File Storage | — | Cloudinary |
| Containerization | Docker Compose (basic) | Docker + CI/CD |

---

## 5. Port Assignments

| Service | Port |
|---|---|
| Frontend (Vite dev) | `http://localhost:3000` |
| NestJS API (prototype) | `http://localhost:3001` |
| Java Spring Boot API (planned) | `http://localhost:8080` |
| PostgreSQL | `5432` |
| Prisma Studio | `http://localhost:5555` |
| RabbitMQ (planned) | `5672` (AMQP), `15672` (management) |

---

## 6. Design Decisions & Constraints

1. **Frontend is demo-only**: All data is hardcoded. No real API integration exists yet.
2. **NestJS backend is a prototype**: It was scaffolded quickly for Swagger docs and structure, but the production backend is planned to be **Java 21 + Spring Boot 3**.
3. **Clerk auth is stubbed**: The sign-in page is a demo role-selector. Real Clerk integration was removed during Next.js → Vite migration.
4. **Database**: Migrated from PostgreSQL to **SQLite** for zero-install local development. The `dev.db` file lives at `packages/database/dev.db`. If switching back to PostgreSQL for production, change the `datasource` provider and re-add `@db.Text` / `String[]` / enum types.
5. **No `@clerk/nextjs` anywhere**: All Next.js dependencies have been fully purged. Use `@clerk/clerk-react` if re-enabling auth.

---

## 7. Known Issues & Bugs

1. ~~`src/lib/lib/api.ts` — duplicate nested folder~~ → **FIXED** (deleted)
2. ~~`@clerk/nextjs` import in `src/lib/api.ts`~~ → **FIXED** (removed, using `import.meta.env`)
3. ~~Missing `src/vite-env.d.ts`~~ → **FIXED** (created with `/// <reference types="vite/client" />`)
4. ~~`postcss.config.mjs` referencing `@tailwindcss/postcss`~~ → **FIXED** (deleted, using `@tailwindcss/vite` plugin)
5. ~~`process.env` / `require()` in SignInPage.tsx~~ → **FIXED** (rewritten as pure React)
6. ~~Missing imports in `VerifyCertificatePage.tsx`~~ → **FIXED**
7. ~~`CompanyInternDetailPage.tsx` using Next.js `params` prop~~ → **FIXED** (uses `useParams`)

---

## 8. File Quick Reference (Most Important Files)

| Purpose | File Path |
|---|---|
| Frontend entry | `apps/web/src/main.tsx` |
| All routes | `apps/web/src/App.tsx` |
| Vite config | `apps/web/vite.config.ts` |
| Global CSS | `apps/web/src/globals.css` |
| API client (axios) | `apps/web/src/lib/api.ts` |
| Sidebar navigation | `apps/web/src/components/layout/Sidebar.tsx` |
| Dashboard layout | `apps/web/src/components/layout/DashboardLayout.tsx` |
| Prisma schema | `packages/database/schema.prisma` |
| NestJS entry | `apps/api/src/main.ts` |
| NestJS app module | `apps/api/src/app.module.ts` |
| Docker compose | `docker-compose.yml` |
| Seed script | `packages/database/seed.ts` |
| SQLite database file | `packages/database/dev.db` |
| This context file | `PROJECT_CONTEXT.md` |
| Phase plan | `PHASES.md` |

---

## 9. Commands Cheat Sheet

```powershell
# Frontend
cd d:/ghr/internship-platform/apps/web
npm install
npm run dev          # → http://localhost:3000
npm run build        # tsc && vite build (verify no errors)

# NestJS Backend (prototype)
cd d:/ghr/internship-platform/apps/api
npm install
npm run dev          # → http://localhost:3001 (needs DB)
npm run build        # nest build

# Database
cd d:/ghr/internship-platform/packages/database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Create/update SQLite tables
npx prisma db seed   # Seed with sample data
npx prisma studio    # Browse data at http://localhost:5555

# Docker (PostgreSQL)
cd d:/ghr/internship-platform
docker compose up -d
```

---

## 10. What To Do When Starting a New Session

1. **Read this file first**: `d:/ghr/internship-platform/PROJECT_CONTEXT.md`
2. **Check the phase plan**: `d:/ghr/internship-platform/PHASES.md`
3. **Check current phase status** — look for `[/]` (in-progress) items
4. **Continue from where the last session left off**
5. **After making changes, UPDATE this file** — especially sections 3, 7, and the "Last Updated" timestamp at the top

---
