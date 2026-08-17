import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';

// Login pages
import StudentLoginPage from './pages/login/StudentLoginPage';
import FacultyLoginPage from './pages/login/FacultyLoginPage';
import CompanyLoginPage from './pages/login/CompanyLoginPage';
import AdminLoginPage from './pages/login/AdminLoginPage';

import DashboardLayout from './components/layout/DashboardLayout';

// Student
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import BrowseInternshipsPage from './pages/student/BrowseInternshipsPage';
import InternshipDetailPage from './pages/student/InternshipDetailPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import ActiveInternshipPage from './pages/student/ActiveInternshipPage';
import DailyLogsPage from './pages/student/DailyLogsPage';
import WeeklyReportsPage from './pages/student/WeeklyReportsPage';
import AttendancePage from './pages/student/AttendancePage';
import TasksPage from './pages/student/TasksPage';
import FeedbackPage from './pages/student/FeedbackPage';
import PlacementScorePage from './pages/student/PlacementScorePage';
import CertificatesPage from './pages/student/CertificatesPage';
import ProfilePage from './pages/student/ProfilePage';

// Faculty
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';
import FacultyStudentsPage from './pages/faculty/FacultyStudentsPage';
import FacultyStudentDetailPage from './pages/faculty/FacultyStudentDetailPage';
import FacultyReportsPage from './pages/faculty/FacultyReportsPage';
import FacultyAnalyticsPage from './pages/faculty/FacultyAnalyticsPage';

// Company
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyListingsPage from './pages/company/CompanyListingsPage';
import NewListingPage from './pages/company/NewListingPage';
import CompanyApplicationsPage from './pages/company/CompanyApplicationsPage';
import CompanyInternsPage from './pages/company/CompanyInternsPage';
import CompanyInternDetailPage from './pages/company/CompanyInternDetailPage';

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminFacultyPage from './pages/admin/AdminFacultyPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminInternshipsPage from './pages/admin/AdminInternshipsPage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-in/student" element={<StudentLoginPage />} />
        <Route path="/sign-in/faculty" element={<FacultyLoginPage />} />
        <Route path="/sign-in/company" element={<CompanyLoginPage />} />
        <Route path="/sign-in/admin" element={<AdminLoginPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/verify/:code" element={<VerifyCertificatePage />} />
        
        <Route element={<DashboardLayout />}>
          {/* Student */}
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
          <Route path="/student/placement" element={<PlacementScorePage />} />
          <Route path="/student/certificates" element={<CertificatesPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          
          {/* Faculty */}
          <Route path="/faculty" element={<FacultyDashboardPage />} />
          <Route path="/faculty/students" element={<FacultyStudentsPage />} />
          <Route path="/faculty/students/:id" element={<FacultyStudentDetailPage />} />
          <Route path="/faculty/reports" element={<FacultyReportsPage />} />
          <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
          
          {/* Company */}
          <Route path="/company" element={<CompanyDashboardPage />} />
          <Route path="/company/listings" element={<CompanyListingsPage />} />
          <Route path="/company/listings/new" element={<NewListingPage />} />
          <Route path="/company/applications" element={<CompanyApplicationsPage />} />
          <Route path="/company/interns" element={<CompanyInternsPage />} />
          <Route path="/company/interns/:id" element={<CompanyInternDetailPage />} />
          
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/faculty" element={<AdminFacultyPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/internships" element={<AdminInternshipsPage />} />
          <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
