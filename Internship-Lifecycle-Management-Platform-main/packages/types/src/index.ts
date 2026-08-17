export type Role = 'STUDENT' | 'FACULTY' | 'COMPANY_MENTOR' | 'ADMIN' | 'PLACEMENT_CELL';
export type InternshipMode = 'REMOTE' | 'ONSITE' | 'HYBRID';
export type ListingStatus = 'DRAFT' | 'OPEN' | 'CLOSED';
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'FACULTY_APPROVED'
  | 'FACULTY_REJECTED'
  | 'UNDER_REVIEW'
  | 'SELECTED'
  | 'REJECTED';
export type InternshipStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
export type ReportStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
export type FeedbackType = 'MID_TERM' | 'FINAL';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  role: Role;
  name: string;
  phone?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  studentId: string;
  collegeId: string;
  department: string;
  year: number;
  cgpa?: number;
  skills: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  placementReadinessScore?: number;
}

export interface Faculty extends User {
  facultyId: string;
  collegeId: string;
  department: string;
  designation: string;
}

export interface CompanyMentor extends User {
  companyId: string;
  designation?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address?: string;
  logoUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  isVerified: boolean;
}

export interface InternshipListing {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;
  domain: string;
  requiredSkills: string[];
  mode: InternshipMode;
  startDate: string;
  endDate: string;
  stipend?: number;
  openings: number;
  deadline: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  student?: Student;
  listingId: string;
  listing?: InternshipListing;
  status: ApplicationStatus;
  coverLetter?: string;
  submittedAt: string;
  facultyApprovedAt?: string;
  selectedAt?: string;
}

export interface Internship {
  id: string;
  applicationId: string;
  studentId: string;
  student?: Student;
  companyId: string;
  company?: Company;
  facultyMentorId: string;
  facultyMentor?: Faculty;
  companyMentorId: string;
  companyMentor?: CompanyMentor;
  startDate: string;
  endDate: string;
  status: InternshipStatus;
  attendancePercentage: number;
  placementReadinessScore?: number;
  listing?: InternshipListing;
}

export interface AttendanceRecord {
  id: string;
  internshipId: string;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  notes?: string;
}

export interface DailyLog {
  id: string;
  internshipId: string;
  date: string;
  tasksCompleted: string;
  hoursWorked: number;
  challengesFaced?: string;
  plansForTomorrow?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface WeeklyReport {
  id: string;
  internshipId: string;
  weekNumber: number;
  summary: string;
  keyLearnings: string;
  issuesFaced?: string;
  nextWeekGoals: string;
  fileUrl?: string;
  status: ReportStatus;
  facultyComments?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export interface MentorFeedback {
  id: string;
  internshipId: string;
  mentorId: string;
  type: FeedbackType;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  punctuality: number;
  teamwork: number;
  overallRating: number;
  comments?: string;
  submittedAt: string;
}

export interface Task {
  id: string;
  internshipId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  assignedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  internshipId: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl?: string;
  qrCode: string;
  isRevoked: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StudentAnalytics {
  attendancePercentage: number;
  reportSubmissionRate: number;
  taskCompletionRate: number;
  logsSubmitted: number;
  reportsSubmitted: number;
  reportsApproved: number;
  placementReadinessScore: number;
}

export interface AdminAnalytics {
  totalStudents: number;
  activeInternships: number;
  completedInternships: number;
  totalCompanies: number;
  pendingApplications: number;
  reportSubmissionRate: number;
  avgAttendance: number;
  placementReadinessAvg: number;
}
