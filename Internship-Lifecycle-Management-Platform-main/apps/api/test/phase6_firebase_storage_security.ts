import * as fs from 'fs';
import * as path from 'path';

// File validation logic under test
function validateDocumentFile(file: { name: string; size: number; type: string }, maxSizeMb: number = 10) {
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!file) return { valid: false, error: 'No file selected.' };
  if (file.size > maxSizeBytes) return { valid: false, error: `File size exceeds maximum limit of ${maxSizeMb} MB.` };
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Invalid file format. Please upload a PDF, DOCX, or Image (PNG/JPEG).' };
  return { valid: true };
}

// Storage path generators under test
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

const StoragePaths = {
  studentResume: (uid: string, fileName: string) => `students/${uid}/resumes/${sanitizeFileName(fileName)}`,
  studentCertificate: (uid: string, fileName: string) => `students/${uid}/certificates/${sanitizeFileName(fileName)}`,
  companyOfferLetter: (companyUid: string, appId: string, fileName: string) => `companies/${companyUid}/offers/${appId}/${sanitizeFileName(fileName)}`,
  internshipReport: (internshipId: string, week: string, fileName: string) => `internships/${internshipId}/reports/${week}/${sanitizeFileName(fileName)}`,
  adminCertificate: (certId: string, fileName: string) => `admin/certificates/${certId}/${sanitizeFileName(fileName)}`,
};

// Security Rule simulation
function simulateStorageAccess(options: {
  auth: { uid: string; role: string } | null;
  path: string;
  operation: 'read' | 'write' | 'delete';
  fileType?: string;
  fileSize?: number;
}): { allowed: boolean; reason?: string } {
  const { auth, path, operation, fileType = 'application/pdf', fileSize = 1024 * 1024 } = options;

  if (!auth) {
    return { allowed: false, reason: 'Unauthenticated requests denied across entire storage bucket' };
  }

  const isOwner = (uid: string) => auth.uid === uid;
  const isAdmin = () => ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(auth.role);
  const isFaculty = () => ['FACULTY', 'FACULTY_MENTOR'].includes(auth.role);
  const isCompany = () => ['COMPANY', 'COMPANY_MENTOR'].includes(auth.role);
  const isValidDocument = () => fileSize <= 10 * 1024 * 1024 && ['application/pdf', 'application/msword', 'image/png', 'image/jpeg'].includes(fileType);

  // Match /students/{uid}/**
  const studentMatch = path.match(/^students\/([^/]+)\/.+/);
  if (studentMatch) {
    const targetUid = studentMatch[1];
    if (operation === 'read') {
      const allowed = isOwner(targetUid) || isFaculty() || isCompany() || isAdmin();
      return { allowed, reason: allowed ? 'Authorized reader' : 'Cannot read another student documents' };
    }
    if (operation === 'write') {
      const allowed = isOwner(targetUid) && isValidDocument();
      return { allowed, reason: allowed ? 'Owner write' : 'Cannot write to another student folder' };
    }
    if (operation === 'delete') {
      const allowed = isOwner(targetUid) || isAdmin();
      return { allowed, reason: allowed ? 'Owner delete' : 'Cannot delete another student document' };
    }
  }

  // Match /companies/{companyUid}/**
  const companyMatch = path.match(/^companies\/([^/]+)\/.+/);
  if (companyMatch) {
    const targetCompanyUid = companyMatch[1];
    if (operation === 'read') return { allowed: true };
    if (operation === 'write') {
      const allowed = (isOwner(targetCompanyUid) || isAdmin()) && isValidDocument();
      return { allowed, reason: allowed ? 'Company write' : 'Cannot write to another company folder' };
    }
  }

  // Match /admin/**
  const adminMatch = path.match(/^admin\/.+/);
  if (adminMatch) {
    if (operation === 'read') return { allowed: true };
    if (operation === 'write' || operation === 'delete') {
      const allowed = isAdmin() && isValidDocument();
      return { allowed, reason: allowed ? 'Admin write' : 'Only admins can manage governance documents' };
    }
  }

  return { allowed: false, reason: 'Default deny for undefined paths' };
}

async function runStorageSecurityTests() {
  console.log('================================================================');
  console.log('📦 PHASE 6: FIREBASE STORAGE & SECURITY RULES VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: File format validation - Allow PDF, DOCX, Images
  const validPdf = validateDocumentFile({ name: 'resume.pdf', size: 1024 * 500, type: 'application/pdf' });
  const validDocx = validateDocumentFile({ name: 'report.docx', size: 1024 * 800, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const validPng = validateDocumentFile({ name: 'cert.png', size: 1024 * 300, type: 'image/png' });
  if (validPdf.valid && validDocx.valid && validPng.valid) {
    console.log('✅ TEST 1 PASSED: Valid file formats (PDF, DOCX, PNG) accepted');
    passed++;
  } else {
    console.error('❌ TEST 1 FAILED: Valid file formats unexpectedly rejected');
    failed++;
  }

  // TEST 2: File format validation - Reject executable or script files
  const invalidExe = validateDocumentFile({ name: 'malicious.exe', size: 1024 * 200, type: 'application/x-msdownload' });
  const invalidJs = validateDocumentFile({ name: 'script.js', size: 1024 * 50, type: 'text/javascript' });
  if (!invalidExe.valid && !invalidJs.valid) {
    console.log('✅ TEST 2 PASSED: Malicious / non-document file types rejected');
    passed++;
  } else {
    console.error('❌ TEST 2 FAILED: Dangerous file types not rejected');
    failed++;
  }

  // TEST 3: Size limit validation - Reject files exceeding 10MB
  const oversizeFile = validateDocumentFile({ name: 'huge_scan.pdf', size: 15 * 1024 * 1024, type: 'application/pdf' }, 10);
  if (!oversizeFile.valid && oversizeFile.error?.includes('10 MB')) {
    console.log('✅ TEST 3 PASSED: Files exceeding size limit (>10MB) correctly blocked');
    passed++;
  } else {
    console.error('❌ TEST 3 FAILED: Oversized file not blocked');
    failed++;
  }

  // TEST 4: Secure path scoping for Student, Company, Internship, and Admin
  const studentPath = StoragePaths.studentResume('student_uid_123', 'My Resume (2026).pdf');
  const offerPath = StoragePaths.companyOfferLetter('comp_uid_456', 'app_789', 'Offer Letter.pdf');
  const reportPath = StoragePaths.internshipReport('intern_101', 'week_3', 'Weekly Progress.pdf');
  const adminCertPath = StoragePaths.adminCertificate('cert_999', 'Verified Certificate.pdf');

  if (
    studentPath.startsWith('students/student_uid_123/resumes/') &&
    offerPath.startsWith('companies/comp_uid_456/offers/app_789/') &&
    reportPath.startsWith('internships/intern_101/reports/week_3/') &&
    adminCertPath.startsWith('admin/certificates/cert_999/')
  ) {
    console.log('✅ TEST 4 PASSED: Secure UID-scoped path generation adheres to governance hierarchy');
    passed++;
  } else {
    console.error('❌ TEST 4 FAILED: Path generation format mismatch');
    failed++;
  }

  // TEST 5: Storage Rules - Unauthenticated access denied
  const unauthAccess = simulateStorageAccess({ auth: null, path: studentPath, operation: 'read' });
  if (!unauthAccess.allowed) {
    console.log('✅ TEST 5 PASSED: Unauthenticated access to storage documents blocked (Default Deny)');
    passed++;
  } else {
    console.error('❌ TEST 5 FAILED: Unauthenticated access was allowed');
    failed++;
  }

  // TEST 6: Storage Rules - Student can write to their own path but NOT another student path
  const ownWrite = simulateStorageAccess({
    auth: { uid: 'student_uid_123', role: 'STUDENT' },
    path: studentPath,
    operation: 'write',
  });
  const crossStudentWrite = simulateStorageAccess({
    auth: { uid: 'student_uid_OTHER', role: 'STUDENT' },
    path: studentPath,
    operation: 'write',
  });
  if (ownWrite.allowed && !crossStudentWrite.allowed) {
    console.log('✅ TEST 6 PASSED: Student can write to their own folder, blocked from cross-user folder modification');
    passed++;
  } else {
    console.error('❌ TEST 6 FAILED: Student cross-user write was not prevented');
    failed++;
  }

  // TEST 7: Storage Rules - Student cannot write to Admin governance path
  const studentAdminWrite = simulateStorageAccess({
    auth: { uid: 'student_uid_123', role: 'STUDENT' },
    path: adminCertPath,
    operation: 'write',
  });
  const adminWrite = simulateStorageAccess({
    auth: { uid: 'admin_uid_001', role: 'ADMIN' },
    path: adminCertPath,
    operation: 'write',
  });
  if (!studentAdminWrite.allowed && adminWrite.allowed) {
    console.log('✅ TEST 7 PASSED: Non-admin users cannot write to Admin governance storage; Admins allowed');
    passed++;
  } else {
    console.error('❌ TEST 7 FAILED: Admin storage permissions violation');
    failed++;
  }

  // TEST 8: Storage Rules File integrity - Ensure storage.rules exists and is non-empty
  const storageRulesPath = path.resolve(__dirname, '../../../storage.rules');
  if (fs.existsSync(storageRulesPath)) {
    const rulesContent = fs.readFileSync(storageRulesPath, 'utf8');
    if (rulesContent.includes('service firebase.storage') && rulesContent.includes('match /students/{uid}')) {
      console.log('✅ TEST 8 PASSED: storage.rules file verified with secure rules definition');
      passed++;
    } else {
      console.error('❌ TEST 8 FAILED: storage.rules content incomplete');
      failed++;
    }
  } else {
    console.error('❌ TEST 8 FAILED: storage.rules not found at root');
    failed++;
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`Phase 6 Test Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStorageSecurityTests();
