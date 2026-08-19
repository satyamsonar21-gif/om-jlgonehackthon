# ILMP Frontend Web Application

> React 19 + Vite 6 + Tailwind CSS v4 Frontend Single Page Application for the University Internship Lifecycle Management Platform.

---

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔐 Authentication & Session Handling

- The application uses `AuthProvider` (`src/lib/auth.tsx`) with HttpOnly session cookies.
- Authentication state is resolved on startup via `GET /auth/me`.
- Route access is governed by `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`) with strict client-side clearance checks matching backend RBAC policies.
