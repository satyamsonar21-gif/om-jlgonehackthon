import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardSkeleton } from './components/ui/LoadingState';

// Layout (synchronous for instant shell rendering)
import DashboardLayout from './components/layout/DashboardLayout';

// Public & Auth Pages (Lazy loaded)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const AccountRecoveryPage = lazy(() => import('./pages/AccountRecoveryPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const SessionExpiredPage = lazy(() => import('./pages/SessionExpiredPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const PendingApprovalPage = lazy(() => import('./pages/PendingApprovalPage'));
const AccountSuspendedPage = lazy(() => import('./pages/AccountSuspendedPage'));
const VerifyCertificatePage = lazy(() => import('./pages/VerifyCertificatePage'));

// Dedicated Login Pages (Lazy loaded)
const StudentLoginPage = lazy(() => import('./pages/login/StudentLoginPage'));
const FacultyLoginPage = lazy(() => import('./pages/login/FacultyLoginPage'));
const CompanyLoginPage = lazy(() => import('./pages/login/CompanyLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/login/AdminLoginPage'));

// Student Portal (Lazy loaded)
const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage'));
const BrowseInternshipsPage = lazy(() => import('./pages/student/BrowseInternshipsPage'));
const InternshipDetailPage = lazy(() => import('./pages/student/InternshipDetailPage'));
const ApplicationsPage = lazy(() => import('./pages/student/ApplicationsPage'));
const ActiveInternshipPage = lazy(() => import('./pages/student/ActiveInternshipPage'));
const DailyLogsPage = lazy(() => import('./pages/student/DailyLogsPage'));
const WeeklyReportsPage = lazy(() => import('./pages/student/WeeklyReportsPage'));
const AttendancePage = lazy(() => import('./pages/student/AttendancePage'));
const TasksPage = lazy(() => import('./pages/student/TasksPage'));
const FeedbackPage = lazy(() => import('./pages/student/FeedbackPage'));
const PlacementScorePage = lazy(() => import('./pages/student/PlacementScorePage'));
const CertificatesPage = lazy(() => import('./pages/student/CertificatesPage'));
const ProfilePage = lazy(() => import('./pages/student/ProfilePage'));

// Faculty Portal (Lazy loaded)
const FacultyDashboardPage = lazy(() => import('./pages/faculty/FacultyDashboardPage'));
const FacultyStudentsPage = lazy(() => import('./pages/faculty/FacultyStudentsPage'));
const FacultyStudentDetailPage = lazy(() => import('./pages/faculty/FacultyStudentDetailPage'));
const FacultyApplicationsPage = lazy(() => import('./pages/faculty/FacultyApplicationsPage'));
const FacultyReportsPage = lazy(() => import('./pages/faculty/FacultyReportsPage'));
const FacultyAnalyticsPage = lazy(() => import('./pages/faculty/FacultyAnalyticsPage'));
const FacultyProfilePage = lazy(() => import('./pages/faculty/FacultyProfilePage'));

// Company Portal (Lazy loaded)
const CompanyDashboardPage = lazy(() => import('./pages/company/CompanyDashboardPage'));
const CompanyListingsPage = lazy(() => import('./pages/company/CompanyListingsPage'));
const NewListingPage = lazy(() => import('./pages/company/NewListingPage'));
const CompanyApplicationsPage = lazy(() => import('./pages/company/CompanyApplicationsPage'));
const CompanyInternsPage = lazy(() => import('./pages/company/CompanyInternsPage'));
const CompanyInternDetailPage = lazy(() => import('./pages/company/CompanyInternDetailPage'));
const CompanyProfilePage = lazy(() => import('./pages/company/CompanyProfilePage'));

// Admin Portal (Lazy loaded)
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminStudentsPage = lazy(() => import('./pages/admin/AdminStudentsPage'));
const AdminFacultyPage = lazy(() => import('./pages/admin/AdminFacultyPage'));
const AdminCompaniesPage = lazy(() => import('./pages/admin/AdminCompaniesPage'));
const AdminInternshipsPage = lazy(() => import('./pages/admin/AdminInternshipsPage'));
const AdminCertificatesPage = lazy(() => import('./pages/admin/AdminCertificatesPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminAuditLogPage = lazy(() => import('./pages/admin/AdminAuditLogPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));
const AdminManagementPage = lazy(() => import('./pages/admin/AdminManagementPage'));
const CreateAdminPage = lazy(() => import('./pages/admin/CreateAdminPage'));

// High-Performance QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

function SuspenseFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-600 animate-spin" />
        <span className="text-xs font-mono text-slate-500 font-medium tracking-wide">
          Loading portal...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Public Authentication & Recovery Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-in/student" element={<StudentLoginPage />} />
              <Route path="/sign-in/faculty" element={<FacultyLoginPage />} />
              <Route path="/sign-in/company" element={<CompanyLoginPage />} />
              <Route path="/sign-in/admin" element={<AdminLoginPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/account-recovery" element={<AccountRecoveryPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/session-expired" element={<SessionExpiredPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/pending-approval" element={<PendingApprovalPage />} />
              <Route path="/account-suspended" element={<AccountSuspendedPage />} />
              <Route path="/verify/:certificateNumber" element={<VerifyCertificatePage />} />

              {/* Authenticated Dashboard Core Layout */}
              <Route element={<DashboardLayout />}>
                {/* Student Portal (Role Guard: STUDENT) */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                  <Route path="/student" element={<StudentDashboardPage />} />
                  <Route path="/student/internships" element={<BrowseInternshipsPage />} />
                  <Route path="/student/internships/:id" element={<InternshipDetailPage />} />
                  <Route path="/student/applications" element={<ApplicationsPage />} />
                  <Route path="/student/active" element={<ActiveInternshipPage />} />
                  <Route path="/student/active/logs" element={<DailyLogsPage />} />
                  <Route path="/student/active/reports" element={<WeeklyReportsPage />} />
                  <Route path="/student/active/attendance" element={<AttendancePage />} />
                  <Route path="/student/active/tasks" element={<TasksPage />} />
                  <Route path="/student/active/feedback" element={<FeedbackPage />} />
                  <Route path="/student/placement-score" element={<PlacementScorePage />} />
                  <Route path="/student/certificates" element={<CertificatesPage />} />
                  <Route path="/student/profile" element={<ProfilePage />} />
                </Route>

                {/* Faculty Portal (Role Guard: FACULTY / FACULTY_MENTOR) */}
                <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'FACULTY_MENTOR']} />}>
                  <Route path="/faculty" element={<FacultyDashboardPage />} />
                  <Route path="/faculty/students" element={<FacultyStudentsPage />} />
                  <Route path="/faculty/students/:id" element={<FacultyStudentDetailPage />} />
                  <Route path="/faculty/applications" element={<FacultyApplicationsPage />} />
                  <Route path="/faculty/reports" element={<FacultyReportsPage />} />
                  <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
                  <Route path="/faculty/profile" element={<FacultyProfilePage />} />
                </Route>

                {/* Company Portal (Role Guard: COMPANY / COMPANY_MENTOR) */}
                <Route element={<ProtectedRoute allowedRoles={['COMPANY', 'COMPANY_MENTOR']} />}>
                  <Route path="/company" element={<CompanyDashboardPage />} />
                  <Route path="/company/listings" element={<CompanyListingsPage />} />
                  <Route path="/company/listings/new" element={<NewListingPage />} />
                  <Route path="/company/applications" element={<CompanyApplicationsPage />} />
                  <Route path="/company/interns" element={<CompanyInternsPage />} />
                  <Route path="/company/interns/:id" element={<CompanyInternDetailPage />} />
                  <Route path="/company/profile" element={<CompanyProfilePage />} />
                </Route>

                {/* Admin Portal (Role Guard: ADMIN / TNP_ADMIN / HOD_ADMIN / SUPER_ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN']} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/students" element={<AdminStudentsPage />} />
                  <Route path="/admin/faculty" element={<AdminFacultyPage />} />
                  <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                  <Route path="/admin/internships" element={<AdminInternshipsPage />} />
                  <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
                  <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                  <Route path="/admin/audit-logs" element={<AdminAuditLogPage />} />
                  <Route path="/admin/audit" element={<AdminAuditLogPage />} />
                  <Route path="/admin/admins" element={<AdminManagementPage />} />
                  <Route path="/admin/admins/new" element={<CreateAdminPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                  <Route path="/admin/profile" element={<AdminProfilePage />} />
                </Route>
              </Route>

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
