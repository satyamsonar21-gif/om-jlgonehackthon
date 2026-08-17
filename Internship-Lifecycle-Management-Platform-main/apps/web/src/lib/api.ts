import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

export const api = {
  // Auth
  syncUser: (data: any) => apiClient.post('/auth/sync-user', data),
  getMe: () => apiClient.get('/auth/me'),

  // Students
  getStudents: () => apiClient.get('/students'),
  getStudent: (id: string) => apiClient.get(`/students/${id}`),
  updateStudent: (id: string, data: any) => apiClient.patch(`/students/${id}`, data),

  // Faculty
  getFaculty: () => apiClient.get('/faculty'),
  getFacultyStudents: (id: string) => apiClient.get(`/faculty/${id}/students`),

  // Companies
  getCompanies: () => apiClient.get('/companies'),
  getCompany: (id: string) => apiClient.get(`/companies/${id}`),
  createCompany: (data: any) => apiClient.post('/companies', data),
  verifyCompany: (id: string) => apiClient.patch(`/companies/${id}/verify`),

  // Listings
  getListings: (params?: any) => apiClient.get('/listings', { params }),
  getListing: (id: string) => apiClient.get(`/listings/${id}`),
  createListing: (data: any) => apiClient.post('/listings', data),
  updateListing: (id: string, data: any) => apiClient.patch(`/listings/${id}`, data),
  deleteListing: (id: string) => apiClient.delete(`/listings/${id}`),

  // Applications
  createApplication: (data: any) => apiClient.post('/applications', data),
  getApplications: (params?: any) => apiClient.get('/applications', { params }),
  getApplication: (id: string) => apiClient.get(`/applications/${id}`),
  facultyReview: (id: string, data: any) => apiClient.patch(`/applications/${id}/faculty-review`, data),
  companyReview: (id: string, data: any) => apiClient.patch(`/applications/${id}/company-review`, data),

  // Internships
  getInternships: (params?: any) => apiClient.get('/internships', { params }),
  getInternship: (id: string) => apiClient.get(`/internships/${id}`),
  completeInternship: (id: string) => apiClient.patch(`/internships/${id}/complete`),

  // Attendance
  markAttendance: (data: any) => apiClient.post('/attendance', data),
  getAttendance: (internshipId: string) => apiClient.get(`/attendance/${internshipId}`),
  getAttendanceStats: (internshipId: string) => apiClient.get(`/attendance/${internshipId}/stats`),

  // Daily Logs
  createDailyLog: (data: any) => apiClient.post('/daily-logs', data),
  getDailyLogs: (internshipId: string) => apiClient.get(`/daily-logs/${internshipId}`),
  acknowledgelog: (id: string) => apiClient.patch(`/daily-logs/${id}/acknowledge`),

  // Weekly Reports
  createWeeklyReport: (data: any) => apiClient.post('/weekly-reports', data),
  getWeeklyReports: (internshipId: string) => apiClient.get(`/weekly-reports/${internshipId}`),
  getPendingReports: (facultyId: string) => apiClient.get(`/weekly-reports/pending/${facultyId}`),
  reviewReport: (id: string, data: any) => apiClient.patch(`/weekly-reports/${id}/review`, data),

  // Feedback
  createFeedback: (data: any) => apiClient.post('/feedback', data),
  getFeedback: (internshipId: string) => apiClient.get(`/feedback/${internshipId}`),

  // Tasks
  createTask: (data: any) => apiClient.post('/tasks', data),
  getTasks: (internshipId: string) => apiClient.get(`/tasks/${internshipId}`),
  updateTask: (id: string, data: any) => apiClient.patch(`/tasks/${id}`, data),

  // Certificates
  generateCertificate: (internshipId: string) => apiClient.post(`/certificates/${internshipId}/generate`),
  getCertificate: (internshipId: string) => apiClient.get(`/certificates/${internshipId}`),
  verifyCertificate: (code: string) => apiClient.get(`/certificates/verify/${code}`),

  // Analytics
  getAdminAnalytics: () => apiClient.get('/analytics/admin'),
  getStudentAnalytics: (id: string) => apiClient.get(`/analytics/student/${id}`),
  getFacultyAnalytics: (id: string) => apiClient.get(`/analytics/faculty/${id}`),
  getCompanyAnalytics: (id: string) => apiClient.get(`/analytics/company/${id}`),

  // Notifications
  getNotifications: (userId: string) => apiClient.get(`/notifications/${userId}`),
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: (userId: string) => apiClient.patch(`/notifications/${userId}/read-all`),

  // AI
  reviewResume: (resumeText: string) => apiClient.post('/ai/review-resume', { resumeText }),
  summarizeReport: (report: any) => apiClient.post('/ai/summarize-report', { report }),
  placementInsights: (data: any) => apiClient.post('/ai/placement-insights', data),
};
