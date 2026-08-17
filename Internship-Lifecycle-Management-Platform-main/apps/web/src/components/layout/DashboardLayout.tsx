import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Role } from './Sidebar';
import { getRoleFromPath, applyTheme, type RoleKey } from '@/design-system/tokens';
import { useEffect } from 'react';

const roleKeyToRole: Record<RoleKey, Role> = {
  student: 'STUDENT',
  faculty: 'FACULTY', 
  company: 'COMPANY_MENTOR',
  admin: 'ADMIN',
};

export default function DashboardLayout() {
  const location = useLocation();
  const roleKey = getRoleFromPath(location.pathname);
  const role = roleKeyToRole[roleKey];

  useEffect(() => {
    applyTheme(roleKey);
  }, [roleKey]);

  return (
    <div data-role={roleKey} className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
