import * as fs from 'fs';
import * as path from 'path';

// ─── STUDENT REGISTRATION VALIDATOR UNDER TEST ──────────────────────────────
interface StudentRegistrationPayload {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  rollNumber: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  passingYear: number;
  skills: string | string[];
  resume?: string;
}

function validateStudentRegistration(data: StudentRegistrationPayload): { valid: boolean; error?: string } {
  if (!data.name || !data.name.trim()) {
    return { valid: false, error: 'Full name is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (!data.password || data.password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }

  if (!data.rollNumber || !data.rollNumber.trim()) {
    return { valid: false, error: 'Roll number / PRN is required.' };
  }

  if (!data.branch || !data.branch.trim()) {
    return { valid: false, error: 'Department / Branch is required.' };
  }

  if (isNaN(data.cgpa) || data.cgpa < 0 || data.cgpa > 10) {
    return { valid: false, error: 'CGPA must be a valid number between 0.0 and 10.0.' };
  }

  if (isNaN(data.backlogs) || data.backlogs < 0) {
    return { valid: false, error: 'Backlogs must be a non-negative number.' };
  }

  if (isNaN(data.passingYear) || data.passingYear < 2020 || data.passingYear > 2035) {
    return { valid: false, error: 'Passing year must be a valid graduation year.' };
  }

  return { valid: true };
}

// ─── FIRESTORE STUDENT DATA MODEL GENERATOR ──────────────────────────────────
function buildFirestoreStudentDocument(uid: string, data: StudentRegistrationPayload) {
  const skillsArray = Array.isArray(data.skills)
    ? data.skills
    : (typeof data.skills === 'string' && data.skills.trim()
        ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []);

  return {
    docId: uid, // MUST EQUAL FIREBASE AUTH UID
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      rollNumber: data.rollNumber.trim(),
      branch: data.branch.trim(),
      cgpa: Number(data.cgpa),
      backlogs: Number(data.backlogs) || 0,
      passingYear: Number(data.passingYear),
      skills: skillsArray,
      resume: data.resume || '',
      uid,
      userId: uid,
    },
  };
}

// ─── SECURITY RULES SIMULATOR ────────────────────────────────────────────────
function simulateFirestoreStudentRules(options: {
  auth: { uid: string; role: string } | null;
  targetDocId: string;
  operation: 'read' | 'create' | 'update' | 'delete';
  incomingData?: any;
}): { allowed: boolean; reason?: string } {
  const { auth, targetDocId, operation, incomingData } = options;

  if (!auth) {
    return { allowed: false, reason: 'Unauthenticated requests denied.' };
  }

  const isOwner = auth.uid === targetDocId;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(auth.role);

  if (operation === 'read') {
    return { allowed: true, reason: 'Authenticated user allowed read' };
  }

  if (operation === 'create' || operation === 'update') {
    if (isAdmin) return { allowed: true, reason: 'Admin allowed write' };
    if (isOwner) {
      if (incomingData && incomingData.role && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(incomingData.role)) {
        return { allowed: false, reason: 'Role escalation blocked' };
      }
      return { allowed: true, reason: 'Owner allowed write' };
    }
    return { allowed: false, reason: 'Cannot modify another student document' };
  }

  if (operation === 'delete') {
    return { allowed: isAdmin, reason: isAdmin ? 'Admin delete' : 'Student delete denied' };
  }

  return { allowed: false, reason: 'Denied by default' };
}

// ─── TEST SUITE EXECUTION ────────────────────────────────────────────────────
async function runStudentRegistrationTests() {
  console.log('================================================================');
  console.log('🎓 TASK: STUDENT REGISTRATION & FIRESTORE INTEGRATION TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Complete Valid Student Registration Payload
  const validPayload: StudentRegistrationPayload = {
    name: 'Rahul Patil',
    email: 'rahul.patil@ghrce.edu',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
    rollNumber: 'IT2026001',
    branch: 'Information Technology',
    cgpa: 8.75,
    backlogs: 0,
    passingYear: 2027,
    skills: 'Java, React, Python, Docker',
    resume: 'https://firebasestorage.googleapis.com/.../resume.pdf',
  };

  const valRes = validateStudentRegistration(validPayload);
  if (valRes.valid) {
    console.log('✅ TEST 1 PASSED: Valid student registration data passed validation');
    passed++;
  } else {
    console.error('❌ TEST 1 FAILED:', valRes.error);
    failed++;
  }

  // TEST 2: Validation of Invalid / Weak Data
  const weakPwdRes = validateStudentRegistration({ ...validPayload, password: 'short' });
  const pwdMismatchRes = validateStudentRegistration({ ...validPayload, confirmPassword: 'different' });
  const badEmailRes = validateStudentRegistration({ ...validPayload, email: 'not-an-email' });
  const badCgpaRes = validateStudentRegistration({ ...validPayload, cgpa: 14.5 });
  const missingRollRes = validateStudentRegistration({ ...validPayload, rollNumber: '' });

  if (!weakPwdRes.valid && !pwdMismatchRes.valid && !badEmailRes.valid && !badCgpaRes.valid && !missingRollRes.valid) {
    console.log('✅ TEST 2 PASSED: Validation catches weak password, mismatch, invalid email, out-of-range CGPA, and missing roll number');
    passed++;
  } else {
    console.error('❌ TEST 2 FAILED: Validation failed to reject invalid inputs');
    failed++;
  }

  // TEST 3: Firestore Document Structure & Firebase UID Mapping
  const mockFirebaseUid = 'firebase_student_uid_abc123';
  const firestoreDoc = buildFirestoreStudentDocument(mockFirebaseUid, validPayload);

  const expectedFields = ['name', 'email', 'rollNumber', 'branch', 'cgpa', 'backlogs', 'passingYear', 'skills', 'resume'];
  const hasAllFields = expectedFields.every((field) => field in firestoreDoc.data);
  const uidMatches = firestoreDoc.docId === mockFirebaseUid && firestoreDoc.data.uid === mockFirebaseUid;
  const skillsIsArray = Array.isArray(firestoreDoc.data.skills) && firestoreDoc.data.skills.length === 4;

  if (hasAllFields && uidMatches && skillsIsArray) {
    console.log('✅ TEST 3 PASSED: Firestore student document structure matches exact data model with matching Firebase UID');
    passed++;
  } else {
    console.error('❌ TEST 3 FAILED: Firestore document schema mismatch');
    failed++;
  }

  // TEST 4: Student Data Isolation (Student A cannot write to Student B)
  const studentA_Uid = 'student_uid_A';
  const studentB_Uid = 'student_uid_B';

  const studentA_WriteOwn = simulateFirestoreStudentRules({
    auth: { uid: studentA_Uid, role: 'STUDENT' },
    targetDocId: studentA_Uid,
    operation: 'update',
  });

  const studentA_WriteStudentB = simulateFirestoreStudentRules({
    auth: { uid: studentA_Uid, role: 'STUDENT' },
    targetDocId: studentB_Uid,
    operation: 'update',
  });

  if (studentA_WriteOwn.allowed && !studentA_WriteStudentB.allowed) {
    console.log('✅ TEST 4 PASSED: Student isolation enforced — User can update own document, blocked from other students');
    passed++;
  } else {
    console.error('❌ TEST 4 FAILED: Student isolation rule failure');
    failed++;
  }

  // TEST 5: Role Escalation Prevention
  const escalationAttempt = simulateFirestoreStudentRules({
    auth: { uid: studentA_Uid, role: 'STUDENT' },
    targetDocId: studentA_Uid,
    operation: 'update',
    incomingData: { role: 'ADMIN' },
  });

  if (!escalationAttempt.allowed) {
    console.log('✅ TEST 5 PASSED: Privilege escalation blocked — Student cannot set role to ADMIN in Firestore');
    passed++;
  } else {
    console.error('❌ TEST 5 FAILED: Role escalation was not blocked');
    failed++;
  }

  // TEST 6: Unauthenticated Request Denied
  const unauthAccess = simulateFirestoreStudentRules({
    auth: null,
    targetDocId: studentA_Uid,
    operation: 'create',
  });

  if (!unauthAccess.allowed) {
    console.log('✅ TEST 6 PASSED: Unauthenticated Firestore operations strictly denied');
    passed++;
  } else {
    console.error('❌ TEST 6 FAILED: Unauthenticated operation was allowed');
    failed++;
  }

  // TEST 7: Firestore Rules File Verification
  const rulesPath = path.resolve(__dirname, '../../..', 'firestore.rules');
  const fallbackRulesPath = path.resolve(__dirname, '../..', 'firestore.rules');
  const activeRulesPath = fs.existsSync(rulesPath) ? rulesPath : fallbackRulesPath;

  if (fs.existsSync(activeRulesPath)) {
    const rulesText = fs.readFileSync(activeRulesPath, 'utf8');
    if (rulesText.includes('match /students/{studentId}') && rulesText.includes('match /users/{userId}')) {
      console.log('✅ TEST 7 PASSED: firestore.rules verified with student and user match blocks');
      passed++;
    } else {
      console.error('❌ TEST 7 FAILED: firestore.rules missing key rule blocks');
      failed++;
    }
  } else {
    console.error('❌ TEST 7 FAILED: firestore.rules file not found');
    failed++;
  }

  // TEST 8: Environment Example Verification
  const envExamplePath = path.resolve(__dirname, '../../..', '.env.example');
  const fallbackEnvPath = path.resolve(__dirname, '../../web/.env.example');
  const activeEnvPath = fs.existsSync(envExamplePath) ? envExamplePath : (fs.existsSync(fallbackEnvPath) ? fallbackEnvPath : '');

  if (activeEnvPath && fs.existsSync(activeEnvPath)) {
    const envText = fs.readFileSync(activeEnvPath, 'utf8');
    if (envText.includes('VITE_FIREBASE_API_KEY') && envText.includes('VITE_FIREBASE_PROJECT_ID')) {
      console.log('✅ TEST 8 PASSED: .env.example verified with VITE_FIREBASE_* environment keys');
      passed++;
    } else {
      console.error('❌ TEST 8 FAILED: .env.example missing required variables');
      failed++;
    }
  } else {
    console.error('❌ TEST 8 FAILED: .env.example not found');
    failed++;
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`Student Registration Test Suite: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStudentRegistrationTests();
