import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAuthToken } from './api';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';

export function normalizeRoleToKey(role: string): RoleKey {
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return 'student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return 'faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return 'company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return 'admin';
  return 'student';
}

export function getRoleDashboardPath(role: string, status?: string): string {
  if (status === 'PENDING_APPROVAL') {
    return '/pending-approval';
  }
  if (status === 'SUSPENDED') {
    return '/account-suspended';
  }
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return '/student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return '/faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return '/company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return '/admin';
  return '/student';
}

interface AuthContextType {
  activeRole: RoleKey;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<any>;
  registerStudent: (data: any) => Promise<any>;
  registerFaculty: (data: any) => Promise<any>;
  registerCompany: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── INITIALIZATION: REAL GET /auth/me ON STARTUP ───────────────────────────
  const initSession = useCallback(async () => {
    try {
      // Send credentialed request (reads HttpOnly session cookie automatically)
      const res = await api.getMe();
      if (res.data && res.data.id) {
        setUser(res.data);
        const normalized = normalizeRoleToKey(res.data.role);
        setActiveRole(normalized);
      } else {
        setUser(null);
      }
    } catch {
      // 401 / unauthenticated: show public routes without crashing
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // ─── REAL LOGIN (POST /auth/login) ──────────────────────────────────────────
  const login = async (credentials: { email: string; password?: string }) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      if (res.data?.user) {
        const authedUser = res.data.user;
        setUser(authedUser);
        if (res.data.sessionToken) {
          setAuthToken(res.data.sessionToken);
        } else if (res.data.token) {
          setAuthToken(res.data.token);
        }
        const normalized = normalizeRoleToKey(authedUser.role);
        setActiveRole(normalized);
        toast.success(`Welcome back, ${authedUser.name || authedUser.firstName || 'User'}!`);
        return res.data;
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL STUDENT REGISTRATION (POST /auth/register/student) ────────────────
  const registerStudent = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerStudent(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.sessionToken || res.data.token) {
          setAuthToken(res.data.sessionToken || res.data.token);
        }
        setActiveRole('student');
        toast.success(res.data.message || 'Student account created successfully!');
        return res.data;
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Student registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL FACULTY REGISTRATION (POST /auth/register/faculty) ────────────────
  const registerFaculty = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerFaculty(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.sessionToken || res.data.token) {
          setAuthToken(res.data.sessionToken || res.data.token);
        }
        setActiveRole('faculty');
        toast.info(res.data.message || 'Faculty registration submitted. Pending administrative review.');
        return res.data;
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Faculty registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL COMPANY REGISTRATION (POST /auth/register/company) ────────────────
  const registerCompany = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerCompany(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.sessionToken || res.data.token) {
          setAuthToken(res.data.sessionToken || res.data.token);
        }
        setActiveRole('company');
        toast.info(res.data.message || 'Company registration submitted. Pending institutional verification.');
        return res.data;
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Company registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL LOGOUT (POST /auth/logout) ────────────────────────────────────────
  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Safe cleanup regardless of server response
    } finally {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('ilmp_token');
      localStorage.removeItem('ilmp_active_role');
      localStorage.removeItem('ilmp_user_id');
      toast.info('You have been signed out.');
    }
  };

  // ─── REFRESH USER IDENTITY (GET /auth/me) ───────────────────────────────────
  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.data && res.data.id) {
        setUser(res.data);
        setActiveRole(normalizeRoleToKey(res.data.role));
      }
    } catch {
      // If session expired
      setUser(null);
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        activeRole,
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        registerStudent,
        registerFaculty,
        registerCompany,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
