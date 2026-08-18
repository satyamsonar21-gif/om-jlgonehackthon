import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically inject stored role and token into request headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ilmp_token');
  const role = localStorage.getItem('ilmp_active_role') || 'student';
  const userId = localStorage.getItem('ilmp_user_id');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (role) {
    config.headers['x-demo-role'] = role;
  }
  if (userId) {
    config.headers['x-demo-user-id'] = userId;
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('ilmp_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('ilmp_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

export const api = {
  // Auth
  login: (data: { email: string; password?: string; role?: string } | string) =>
    typeof data === 'string'
      ? apiClient.post('/auth/login', { email: data })
      : apiClient.post('/auth/login', data),
  registerStudent: (data: any) => apiClient.post('/auth/register/student', data),
  registerFaculty: (data: any) => apiClient.post('/auth/register/faculty', data),
  registerCompany: (data: any) => apiClient.post('/auth/register/company', data),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: { email: string; token: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', data),
  verifyEmail: (data: { email: string; code: string }) => apiClient.post('/auth/verify-email', data),
  resendVerification: (email: string) => apiClient.post('/auth/resend-verification', { email }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/auth/change-password', data),
  getDemoUsers: () => apiClient.get('/auth/demo-users'),
  switchRole: (role: string) => apiClient.post('/auth/switch-role', { role }),
  syncUser: (data: any) => apiClient.post('/auth/sync-user', data),
  getMe: () => apiClient.get('/auth/me'),

  // Students
  getStudents: (params?: any) => apiClient.get('/students', { params }),
  getStudent: (id: string) => apiClient.get(`/students/${id}`),
  updateStudent: (id: string, data: any) => apiClient.patch(`/students/${id}`, data),
  verifyStudentProfile: (id: string, data: any) => apiClient.patch(`/students/${id}/verify`, data),

  // Eligibility
  checkEligibility: (studentId: string, listingId: string) =>
    apiClient.get(`/eligibility/check/${studentId}/${listingId}`),

  // Faculty
  getFaculty: () => apiClient.get('/faculty'),
  getFacultyOne: (id: string) => apiClient.get(`/faculty/${id}`),
  getFacultyStudents: (id: string) => apiClient.get(`/faculty/${id}/students`),

  // Companies
  getCompanies: (params?: any) => apiClient.get('/companies', { params }),
  getCompany: (id: string) => apiClient.get(`/companies/${id}`),
  createCompany: (data: any) => apiClient.post('/companies', data),
  updateCompany: (id: string, data: any) => apiClient.patch(`/companies/${id}`, data),
  verifyCompany: (id: string, data?: any) => apiClient.patch(`/companies/${id}/verify`, data || { status: 'VERIFIED' }),

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
  updateApplicationStatus: (id: string, data: any) => apiClient.patch(`/applications/${id}/status`, data),
  facultyReview: (id: string, data: any) => apiClient.patch(`/applications/${id}/faculty-review`, data),
  facultyReviewApplication: (id: string, data: any) => apiClient.patch(`/applications/${id}/faculty-review`, data),
  companyReview: (id: string, data: any) => apiClient.patch(`/applications/${id}/company-review`, data),
  companyReviewApplication: (id: string, data: any) => apiClient.patch(`/applications/${id}/company-review`, data),

  // Internships
  getInternships: (params?: any) => apiClient.get('/internships', { params }),
  getInternship: (id: string) => apiClient.get(`/internships/${id}`),
  confirmJoining: (id: string, data: any) => apiClient.post(`/internships/${id}/join`, data),
  updateInternship: (id: string, data: any) => apiClient.patch(`/internships/${id}`, data),
  completeInternship: (id: string, data?: any) => apiClient.patch(`/internships/${id}/complete`, data || {}),

  // Attendance
  markAttendance: (data: any) => apiClient.post('/attendance', data),
  getAttendance: (internshipId: string) => apiClient.get(`/attendance/${internshipId}`),
  getAttendanceStats: (internshipId: string) => apiClient.get(`/attendance/${internshipId}/stats`),
  getBatchAttendance: (facultyId?: string, threshold: number = 75.0) =>
    apiClient.get('/attendance/batch/overview', { params: { facultyId, threshold } }),

  // Daily Logs
  createDailyLog: (data: any) => apiClient.post('/daily-logs', data),
  getDailyLogs: (internshipId: string) => apiClient.get(`/daily-logs/${internshipId}`),
  acknowledgeLog: (id: string) => apiClient.patch(`/daily-logs/${id}/acknowledge`),

  // Weekly Reports
  createWeeklyReport: (data: any) => apiClient.post('/weekly-reports', data),
  getWeeklyReports: (internshipId: string) => apiClient.get(`/weekly-reports/${internshipId}`),
  getPendingReports: (facultyId?: string) =>
    facultyId ? apiClient.get(`/weekly-reports/pending/${facultyId}`) : apiClient.get('/weekly-reports/pending'),
  reviewReport: (id: string, data: any) => apiClient.patch(`/weekly-reports/${id}/review`, data),

  // Feedback
  createFeedback: (data: any) => apiClient.post('/feedback', data),
  getFeedback: (internshipId: string) => apiClient.get(`/feedback/${internshipId}`),

  // Tasks
  createTask: (data: any) => apiClient.post('/tasks', data),
  getTasks: (internshipId: string) => apiClient.get(`/tasks/${internshipId}`),
  updateTask: (id: string, data: any) => apiClient.patch(`/tasks/${id}`, data),

  // Certificates
  getCertificates: () => apiClient.get('/certificates'),
  generateCertificate: (internshipId: string, force: boolean = false) =>
    apiClient.post(`/certificates/${internshipId}/generate`, { force }),
  facultyApproveCertificate: (internshipId: string) =>
    apiClient.patch(`/certificates/${internshipId}/faculty-approve`),
  adminApproveCertificate: (internshipId: string) =>
    apiClient.patch(`/certificates/${internshipId}/admin-approve`),
  getCertificate: (internshipId: string) => apiClient.get(`/certificates/${internshipId}`),
  verifyCertificate: (code: string) => apiClient.get(`/certificates/verify/${code}`),
  getPlacementReadiness: (id: string) => apiClient.get(`/students/${id}/placement-readiness`),

  // PPO
  createPPO: (data: any) => apiClient.post('/ppo', data),
  getPPOs: (params?: any) => apiClient.get('/ppo', { params }),
  respondPPO: (id: string, data: any) => apiClient.patch(`/ppo/${id}/respond`, data),

  // Documents & Uploads
  uploadResume: (file: any, studentId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (studentId) formData.append('studentId', studentId);
    return apiClient.post('/uploads/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createDocument: (data: any) => apiClient.post('/uploads/document', data),
  getDocuments: (params?: any) => apiClient.get('/uploads/documents', { params }),
  verifyDocument: (id: string, data: any) => apiClient.patch(`/uploads/documents/${id}/verify`, data),
  getDocumentChecklist: (internshipId: string) => apiClient.get(`/uploads/checklist/${internshipId}`),

  // Analytics
  getAdminAnalytics: () => apiClient.get('/analytics/admin'),
  getStudentAnalytics: (id: string) => apiClient.get(`/analytics/student/${id}`),
  getFacultyAnalytics: (id: string) => apiClient.get(`/analytics/faculty/${id}`),
  getCompanyAnalytics: (id: string) => apiClient.get(`/analytics/company/${id}`),

  // Notifications
  getMyNotifications: (params?: any) => apiClient.get('/notifications', { params }),
  getNotifications: (userId: string, params?: any) => apiClient.get(`/notifications/${userId}`, { params }),
  getUnreadNotificationCount: () => apiClient.get('/notifications/unread-count'),
  getNotificationPreferences: () => apiClient.get('/notifications/preferences'),
  updateNotificationPreferences: (data: any) => apiClient.patch('/notifications/preferences', data),
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: (userId?: string) =>
    userId ? apiClient.patch(`/notifications/${userId}/read-all`) : apiClient.patch('/notifications/read-all'),
  deleteNotification: (id: string) => apiClient.delete(`/notifications/${id}`),

  // AI Innovation
  matchInternships: (studentId?: string) =>
    studentId ? apiClient.get(`/ai/match-internships/${studentId}`) : apiClient.get('/ai/match-internships'),
  analyzeSkillGap: (studentId?: string, listingId?: string) =>
    studentId
      ? apiClient.get(`/ai/skill-gap/${studentId}`, { params: { listingId } })
      : apiClient.get('/ai/skill-gap', { params: { listingId } }),
  aiChat: (message: string, history?: any[]) => apiClient.post('/ai/chat', { message, history }),
  getAiProviderInfo: () => apiClient.get('/ai/provider-info'),
  reviewResume: (resumeText: string) => apiClient.post('/ai/review-resume', { resumeText }),
  summarizeReport: (report: any) => apiClient.post('/ai/summarize-report', { report }),
  placementInsights: (data: any) => apiClient.post('/ai/placement-insights', data),

  // Audit Logs
  getAuditLogs: (params?: any) => apiClient.get('/audit', { params }),
  exportAuditLogsCsv: (params?: any) => apiClient.get('/audit/export', { params }),

  // Reports & CSV Export
  exportCsv: (type: string, params?: any) => apiClient.get(`/reports/export/${type}`, { params }),
};
