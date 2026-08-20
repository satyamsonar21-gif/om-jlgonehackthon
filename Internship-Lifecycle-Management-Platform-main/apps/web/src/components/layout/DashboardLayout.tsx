import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Role } from './Sidebar';
import { MobileNav } from './MobileNav';
import { MobileBottomNav } from './MobileBottomNav';
import { SidebarProvider } from './SidebarContext';
import { getRoleFromPath, applyTheme, type RoleKey } from '@/design-system/tokens';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DashboardSkeleton } from '@/components/ui/LoadingState';

const CareerAssistant = lazy(() =>
  import('@/components/ai/CareerAssistant').then((m) => ({ default: m.CareerAssistant }))
);

const roleKeyToRole: Record<RoleKey, Role> = {
  student: 'STUDENT',
  faculty: 'FACULTY',
  company: 'COMPANY_MENTOR',
  admin: 'ADMIN',
};

export default function DashboardLayout() {
  const location = useLocation();
  const roleKey = getRoleFromPath(location.pathname);
  const role = roleKeyToRole[roleKey] || 'STUDENT';
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    applyTheme(roleKey);
  }, [roleKey]);

  return (
    <SidebarProvider>
      <div data-role={roleKey} className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar role={role} />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          role={role}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0 pb-16 md:pb-0 transition-all duration-200">
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Outlet context={{ onOpenMobileNav: () => setIsMobileNavOpen(true) }} />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Mobile Bottom Quick-Access Bar */}
        <MobileBottomNav role={role} />

        {/* Floating AI Career Assistant (Lazy Loaded) */}
        <Suspense fallback={null}>
          <CareerAssistant />
        </Suspense>
      </div>
    </SidebarProvider>
  );
}
