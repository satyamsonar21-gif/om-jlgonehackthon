import React, { createContext, useContext, useState, useEffect } from 'react';
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
  login: (credentials: { email: string; password?: string; role?: string }) => Promise<any>;
  registerStudent: (data: any) => Promise<any>;
  registerFaculty: (data: any) => Promise<any>;
  registerCompany: (data: any) => Promise<any>;
  switchRole: (role: RoleKey) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleKey>(() => {
    return (localStorage.getItem('ilmp_active_role') as RoleKey) || 'student';
  });
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const initSession = async () => {
    const token = localStorage.getItem('ilmp_token');
    const savedRole = (localStorage.getItem('ilmp_active_role') as RoleKey) || 'student';

    if (token) {
      setAuthToken(token);
      try {
        const res = await api.getMe();
        if (res.data) {
          setUser(res.data);
          const normalized = normalizeRoleToKey(res.data.role);
          setActiveRole(normalized);
          localStorage.setItem('ilmp_active_role', normalized);
          localStorage.setItem('ilmp_user_id', res.data.id);
          setLoading(false);
          return;
        }
      } catch {
        // Token invalid or expired
        localStorage.removeItem('ilmp_token');
      }
    }

    // Default demo session fallback
    try {
      const res = await api.switchRole(savedRole);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        localStorage.setItem('ilmp_active_role', savedRole);
        localStorage.setItem('ilmp_user_id', res.data.user.id);
      }
    } catch {
      setUser({
        name: savedRole === 'student' ? 'Aarav Patil' : savedRole === 'faculty' ? 'Dr. Rajesh Kumar' : savedRole === 'company' ? 'Vikram Nair' : 'Prof. Sanjay Verma',
        role: savedRole.toUpperCase(),
        email: `${savedRole}@ghrce.edu`,
        status: 'ACTIVE',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSession();
  }, []);

  const login = async (credentials: { email: string; password?: string; role?: string }) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      if (res.data?.user) {
        const authedUser = res.data.user;
        setUser(authedUser);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        const normalized = normalizeRoleToKey(authedUser.role);
        setActiveRole(normalized);
        localStorage.setItem('ilmp_active_role', normalized);
        localStorage.setItem('ilmp_user_id', authedUser.id);
        toast.success(`Welcome back, ${authedUser.name}!`);
        return res.data;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerStudent(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        setActiveRole('student');
        localStorage.setItem('ilmp_active_role', 'student');
        localStorage.setItem('ilmp_user_id', res.data.user.id);
        toast.success('Student account created successfully!');
        return res.data;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Student registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerFaculty = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerFaculty(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        setActiveRole('faculty');
        localStorage.setItem('ilmp_active_role', 'faculty');
        localStorage.setItem('ilmp_user_id', res.data.user.id);
        toast.info(res.data.message || 'Faculty registration submitted. Pending admin approval.');
        return res.data;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Faculty registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerCompany = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerCompany(data);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        setActiveRole('company');
        localStorage.setItem('ilmp_active_role', 'company');
        localStorage.setItem('ilmp_user_id', res.data.user.id);
        toast.info(res.data.message || 'Company registration submitted. Pending institutional verification.');
        return res.data;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Company registration failed';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole: RoleKey) => {
    setLoading(true);
    try {
      const res = await api.switchRole(newRole);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        setActiveRole(newRole);
        localStorage.setItem('ilmp_active_role', newRole);
        localStorage.setItem('ilmp_user_id', res.data.user.id);
        toast.success(`Active profile switched to ${newRole.toUpperCase()}`);
      }
    } catch {
      setActiveRole(newRole);
      localStorage.setItem('ilmp_active_role', newRole);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('ilmp_token');
    localStorage.removeItem('ilmp_user_id');
    toast.info('You have been signed out.');
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.data) {
        setUser(res.data);
      }
    } catch {
      // Ignored
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
        switchRole,
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

