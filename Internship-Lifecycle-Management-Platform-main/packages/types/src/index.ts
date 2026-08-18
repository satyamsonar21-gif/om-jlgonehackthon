export type Role =
  | 'STUDENT'
  | 'COMPANY'
  | 'COMPANY_MENTOR'
  | 'FACULTY'
  | 'FACULTY_MENTOR'
  | 'TNP_ADMIN'
  | 'HOD_ADMIN'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type InternshipMode = 'REMOTE' | 'ONSITE' | 'HYBRID';

export type ListingStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'OPEN'
  | 'CLOSED'
  | 'CANCELLED'
  | 'COMPLETED';

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CORRECTION_REQUIRED';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'ASSESSMENT'
  | 'SELECTED'
  | 'OFFER_ISSUED'
  | 'OFFER_ACCEPTED'
  | 'TNP_VERIFICATION_PENDING'
  | 'TNP_VERIFIED'
  | 'FACULTY_ASSIGNED'
  | 'JOINING_PENDING'
  | 'JOINED'
  | 'IN_PROGRESS'
  | 'WEEKLY_PROGRESS'
  | 'COMPANY_EVALUATION'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CERTIFICATE_ISSUED'
  | 'PPO_STATUS_UPDATED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CLOSED';

export type OfferStatus = 'PENDING' | 'ISSUED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export type JoiningStatus = 'PENDING' | 'JOINED' | 'NOT_JOINED' | 'DEFERRED';

export type InternshipStatus = 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETION_PENDING' | 'COMPLETED' | 'TERMINATED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type ReportStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';

export type FeedbackType = 'MID_TERM' | 'FINAL';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export type PPOStatus = 'NOT_APPLICABLE' | 'PENDING' | 'RECOMMENDED' | 'OFFERED' | 'ACCEPTED' | 'REJECTED';

export type DocumentType =
  | 'RESUME'
  | 'OFFER_LETTER'
  | 'ACCEPTANCE_LETTER'
  | 'JOINING_LETTER'
  | 'WEEKLY_REPORT_ATTACHMENT'
  | 'COMPLETION_CERTIFICATE'
  | 'PPO_LETTER'
  | 'NOC_DOCUMENT'
  | 'OTHER';

export type DocumentStatus = 'UPLOADED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUIRED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RiskType =
  | 'LOW_ATTENDANCE'
  | 'LATE_REPORT'
  | 'MISSING_REPORT'
  | 'POOR_EVALUATION'
  | 'INACTIVITY';

// ─── DOMAIN INTERFACES ───────────────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string;
  role: Role;
  name: string;
  phone?: string;
  profilePhoto?: string;
  collegeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  studentId: string;
  collegeId: string;
  department: string;
  year: number;
  passingYear?: number;
  cgpa?: number;
  backlogsCount: number;
  activeBacklogs: number;
  tenthMarks?: number;
  twelfthMarks?: number;
  diplomaMarks?: number;
  verificationStatus: VerificationStatus;
  verificationRemarks?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  skills: string[];
  certifications?: string[];
  experience?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number;
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
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationRemarks?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface InternshipListing {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;
  domain: string;
  mode: InternshipMode;
  location?: string;
  stipend?: number;
  openings: number;
  durationWeeks: number;
  startDate: string;
  endDate: string;
  deadline: string;
  status: ListingStatus;
  approvalRemarks?: string;
  
  // Eligibility criteria
  minCgpa: number;
  maxBacklogs: number;
  eligibleDepartments: string[];
  passingYears: string[];
  requiredSkills: string[];
  requiredCertifications?: string[];
  experienceRequirement?: string;
  additionalCriteria?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  student?: Student;
  listingId: string;
  listing?: InternshipListing;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  eligibilitySnapshot?: string;
  companyRemarks?: string;
  submittedAt: string;
  shortlistedAt?: string;
  assessmentDate?: string;
  assessmentNotes?: string;
  selectedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  withdrawnAt?: string;
  offerLetter?: OfferLetter;
  tnpVerification?: TNPVerification;
}

export interface OfferLetter {
  id: string;
  applicationId: string;
  companyId: string;
  studentId: string;
  stipend?: number;
  ctcAnnual?: number;
  designation?: string;
  offerLetterUrl?: string;
  terms?: string;
  joiningDate?: string;
  expiryDate?: string;
  status: OfferStatus;
  studentRemarks?: string;
  respondedAt?: string;
  issuedAt: string;
}

export interface TNPVerification {
  id: string;
  applicationId: string;
  offerLetterId?: string;
  verifiedById?: string;
  verifiedByRole?: string;
  status: VerificationStatus;
  remarks?: string;
  verifiedAt?: string;
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
  actualJoiningDate?: string;
  joiningStatus: JoiningStatus;
  joiningLetterUrl?: string;
  joiningRemarks?: string;
  status: InternshipStatus;
  attendancePercentage: number;
  completionApprovedAt?: string;
  completionRemarks?: string;
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
  skillsUsed?: string;
  acknowledgedAt?: string;
  acknowledgedById?: string;
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
  hoursWorked: number;
  fileUrl?: string;
  status: ReportStatus;
  facultyComments?: string;
  reviewedById?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export interface MentorFeedback {
  id: string;
  internshipId: string;
  mentorId: string;
  evaluatorRole: 'COMPANY_MENTOR' | 'FACULTY_MENTOR';
  type: FeedbackType;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  punctuality: number;
  teamwork: number;
  professionalism: number;
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
  verificationHash: string;
  issuedAt: string;
  pdfUrl?: string;
  qrCode: string;
  isRevoked: boolean;
  revocationReason?: string;
}

export interface PPO {
  id: string;
  internshipId: string;
  studentId: string;
  companyId: string;
  status: PPOStatus;
  packageLpa?: number;
  designation?: string;
  offerLetterUrl?: string;
  remarks?: string;
  offeredAt?: string;
  respondedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  status: DocumentStatus;
  remarks?: string;
  uploadedById: string;
  studentId?: string;
  companyId?: string;
  internshipId?: string;
  verifiedById?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface RiskAlert {
  id: string;
  internshipId: string;
  studentId: string;
  facultyMentorId: string;
  riskLevel: RiskLevel;
  riskType: RiskType;
  description: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedRemarks?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  metadata?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  studentId: string;
  listingId: string;
  matchScore: number;
  eligibilityScore: number;
  skillMatchScore: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  explanation: string;
  recommendations?: string[];
}

export interface EligibilityCheckItem {
  criterion: string;
  required: string | number;
  actual: string | number;
  passed: boolean;
  warning?: boolean;
  notes?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  overallScore: number;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'CONDITIONAL';
  checks: {
    cgpa: EligibilityCheckItem;
    backlogs: EligibilityCheckItem;
    department: EligibilityCheckItem;
    passingYear: EligibilityCheckItem;
    skills: EligibilityCheckItem;
    certifications?: EligibilityCheckItem;
    experience?: EligibilityCheckItem;
  };
  passedChecks: number;
  totalChecks: number;
  reasons: string[];
  suggestions: string[];
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
  funnel: {
    applied: number;
    shortlisted: number;
    selected: number;
    joined: number;
    completed: number;
    ppo: number;
  };
  conversionRates: {
    applyToSelect: number;
    selectToJoin: number;
    joinToComplete: number;
    completeToPPO: number;
  };
  departmentStats: Array<{
    department: string;
    totalStudents: number;
    activeInternships: number;
    completedInternships: number;
    placementRate: number;
  }>;
  stipendStats: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
  skillGaps: Array<{
    skill: string;
    marketDemand: number;
    studentSupply: number;
    gapSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}
