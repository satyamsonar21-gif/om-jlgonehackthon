import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from './api';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';

interface AuthContextType {
  activeRole: RoleKey;
  user: any | null;
  loading: boolean;
  switchRole: (role: RoleKey) => Promise<void>;
  login: (email: string) => Promise<void>;
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

  const fetchCurrentUser = async (roleToUse: RoleKey) => {
    try {
      const res = await api.switchRole(roleToUse);
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.token) {
          setAuthToken(res.data.token);
        }
        localStorage.setItem('ilmp_active_role', roleToUse);
        localStorage.setItem('ilmp_user_id', res.data.user.id);
      }
    } catch {
      // Offline fallback mock user
      setUser({
        name: roleToUse === 'student' ? 'Aarav Patil' : roleToUse === 'faculty' ? 'Dr. Rajesh Kumar' : roleToUse === 'company' ? 'Vikram Nair' : 'Prof. Sanjay Verma',
        role: roleToUse.toUpperCase(),
        email: `${roleToUse}@ghrce.edu`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser(activeRole);
  }, []);

  const switchRole = async (newRole: RoleKey) => {
    setLoading(true);
    setActiveRole(newRole);
    localStorage.setItem('ilmp_active_role', newRole);
    await fetchCurrentUser(newRole);
    toast.success(`Switched role to ${newRole.toUpperCase()} mode`);
  };

  const login = async (email: string) => {
    setLoading(true);
    try {
      const res = await api.login(email);
      if (res.data?.user) {
        setUser(res.data.user);
        setAuthToken(res.data.token);
        const role = res.data.user.role.toLowerCase() as RoleKey;
        const normalizedRole: RoleKey = role === 'company_mentor' as any ? 'company' : role === 'faculty_mentor' as any ? 'faculty' : role === 'tnp_admin' as any ? 'admin' : (role as RoleKey);
        setActiveRole(normalizedRole);
        localStorage.setItem('ilmp_active_role', normalizedRole);
        localStorage.setItem('ilmp_user_id', res.data.user.id);
        toast.success(`Signed in as ${res.data.user.name}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('ilmp_user_id');
    toast.info('Logged out');
  };

  const refreshUser = async () => {
    await fetchCurrentUser(activeRole);
  };

  return (
    <AuthContext.Provider
      value={{
        activeRole,
        user,
        loading,
        switchRole,
        login,
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
