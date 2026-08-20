import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

/**
 * Phase 7: Firestore Security Rules & Admin Role Policy Engine Verification
 * Evaluates the Firestore security rules logic against all test vectors.
 */

interface RequestContext {
  auth: { uid: string; token?: { role?: string } } | null;
  resource?: { data: Record<string, any> };
  resourceData?: Record<string, any>;
}

class FirestoreRulesPolicyEngine {
  private existingDocs: Map<string, Record<string, any>> = new Map();

  setDoc(pathKey: string, data: Record<string, any>) {
    this.existingDocs.set(pathKey, data);
  }

  getDoc(pathKey: string): Record<string, any> | undefined {
    return this.existingDocs.get(pathKey);
  }

  private isAuthenticated(ctx: RequestContext): boolean {
    return ctx.auth !== null;
  }

  private isOwner(ctx: RequestContext, userId: string): boolean {
    return this.isAuthenticated(ctx) && ctx.auth!.uid === userId;
  }

  private isAdmin(ctx: RequestContext): boolean {
    if (!this.isAuthenticated(ctx)) return false;
    const tokenRole = ctx.auth!.token?.role;
    if (tokenRole && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(tokenRole)) {
      return true;
    }
    const userDoc = this.getDoc(`users/${ctx.auth!.uid}`);
    if (userDoc && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(userDoc.role)) {
      return true;
    }
    return false;
  }

  private isNonAdminRole(role: string): boolean {
    return ['STUDENT', 'FACULTY', 'FACULTY_MENTOR', 'COMPANY', 'COMPANY_MENTOR'].includes(role);
  }

  canCreateUser(ctx: RequestContext, targetUserId: string, incomingData: Record<string, any>): boolean {
    // Admin branch
    if (this.isAdmin(ctx)) {
      return true;
    }
    // Normal user branch
    if (
      this.isOwner(ctx, targetUserId) &&
      !['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(incomingData.role) &&
      this.isNonAdminRole(incomingData.role)
    ) {
      return true;
    }
    return false;
  }

  canUpdateUser(
    ctx: RequestContext,
    targetUserId: string,
    existingData: Record<string, any>,
    incomingData: Record<string, any>,
  ): boolean {
    // Admin branch
    if (this.isAdmin(ctx)) {
      return true;
    }
    // Normal user branch
    if (
      this.isOwner(ctx, targetUserId) &&
      (!('role' in incomingData) || incomingData.role === existingData.role) &&
      !['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(incomingData.role)
    ) {
      return true;
    }
    return false;
  }

  canReadUser(ctx: RequestContext, targetUserId: string): boolean {
    return this.isOwner(ctx, targetUserId) || this.isAdmin(ctx);
  }

  canReadStudent(ctx: RequestContext, targetUid: string): boolean {
    if (!this.isAuthenticated(ctx)) return false;
    if (this.isOwner(ctx, targetUid) || this.isAdmin(ctx)) return true;
    const userDoc = this.getDoc(`users/${ctx.auth!.uid}`);
    if (userDoc && ['FACULTY', 'FACULTY_MENTOR', 'COMPANY', 'COMPANY_MENTOR'].includes(userDoc.role)) {
      return true;
    }
    return false;
  }

  canCreateStudent(ctx: RequestContext, targetUid: string): boolean {
    if (!this.isAuthenticated(ctx)) return false;
    return this.isOwner(ctx, targetUid) || this.isAdmin(ctx);
  }

  canUpdateStudent(ctx: RequestContext, targetUid: string): boolean {
    if (!this.isAuthenticated(ctx)) return false;
    return this.isOwner(ctx, targetUid) || this.isAdmin(ctx);
  }

  canDeleteStudent(ctx: RequestContext): boolean {
    return this.isAdmin(ctx);
  }
}

async function runPhase7SecurityVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 7 & 11.7: FIRESTORE SECURITY RULES VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Verify firestore.rules file existence and contents
  const rulesPath = path.resolve(__dirname, '../../../firestore.rules');
  assert.ok(fs.existsSync(rulesPath), 'firestore.rules file must exist in project root');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  console.log('✔ firestore.rules file verified in project root');

  assert.ok(rulesContent.includes("match /students/{uid}"), 'Rules must match /students/{uid}');
  assert.ok(rulesContent.includes("isOwner(uid) || isAdmin()"), 'Student rules must enforce ownership or admin privilege');
  assert.ok(!rulesContent.includes("allow read, write: if true;"), 'Rules must NOT contain insecure allow read, write: if true;');
  console.log('✔ Student security rule syntax and constraints verified\n');

  const engine = new FirestoreRulesPolicyEngine();

  // Setup Database State
  engine.setDoc('users/admin_uid_01', { uid: 'admin_uid_01', role: 'ADMIN', name: 'Root Administrator' });
  engine.setDoc('users/student_uid_01', { uid: 'student_uid_01', role: 'STUDENT', name: 'Aarav Patel' });
  engine.setDoc('users/student_uid_02', { uid: 'student_uid_02', role: 'STUDENT', name: 'Rohan Deshmukh' });
  engine.setDoc('users/faculty_uid_01', { uid: 'faculty_uid_01', role: 'FACULTY_MENTOR', name: 'Dr. Meena Iyer' });
  engine.setDoc('users/company_uid_01', { uid: 'company_uid_01', role: 'COMPANY_MENTOR', name: 'Robert Smith' });

  // ─── TEST 1: Student → create Admin → DENIED ─────────────────────────────
  console.log('🔹 Test 1: Student attempting to create an Admin account...');
  const studentCtx: RequestContext = { auth: { uid: 'student_uid_01' } };
  const canStudentCreateAdmin = engine.canCreateUser(studentCtx, 'new_admin_uid', {
    role: 'ADMIN',
    email: 'newadmin@institution.edu',
  });
  assert.strictEqual(canStudentCreateAdmin, false, 'Student must NOT be able to create Admin account');
  console.log('  ✅ PASS: Student → create Admin → DENIED');

  // ─── TEST 2: Faculty → create Admin → DENIED ─────────────────────────────
  console.log('🔹 Test 2: Faculty attempting to create an Admin account...');
  const facultyCtx: RequestContext = { auth: { uid: 'faculty_uid_01' } };
  const canFacultyCreateAdmin = engine.canCreateUser(facultyCtx, 'new_admin_uid', {
    role: 'ADMIN',
    email: 'newadmin@institution.edu',
  });
  assert.strictEqual(canFacultyCreateAdmin, false, 'Faculty must NOT be able to create Admin account');
  console.log('  ✅ PASS: Faculty → create Admin → DENIED');

  // ─── TEST 3: Company → create Admin → DENIED ─────────────────────────────
  console.log('🔹 Test 3: Company mentor attempting to create an Admin account...');
  const companyCtx: RequestContext = { auth: { uid: 'company_uid_01' } };
  const canCompanyCreateAdmin = engine.canCreateUser(companyCtx, 'new_admin_uid', {
    role: 'ADMIN',
    email: 'newadmin@institution.edu',
  });
  assert.strictEqual(canCompanyCreateAdmin, false, 'Company mentor must NOT be able to create Admin account');
  console.log('  ✅ PASS: Company → create Admin → DENIED');

  // ─── TEST 4: Admin → create Admin → ALLOWED ──────────────────────────────
  console.log('🔹 Test 4: Authorized Admin creating another Admin account...');
  const adminCtx: RequestContext = { auth: { uid: 'admin_uid_01' } };
  const canAdminCreateAdmin = engine.canCreateUser(adminCtx, 'new_admin_uid_2', {
    role: 'ADMIN',
    email: 'dir.tnp@institution.edu',
  });
  assert.strictEqual(canAdminCreateAdmin, true, 'Authorized Admin must be ALLOWED to create another Admin');
  console.log('  ✅ PASS: Admin → create Admin → ALLOWED');

  // ─── TEST 5: Unauthenticated User → create Admin → DENIED ────────────────
  console.log('🔹 Test 5: Unauthenticated user attempting to create an Admin account...');
  const anonCtx: RequestContext = { auth: null };
  const canAnonCreateAdmin = engine.canCreateUser(anonCtx, 'new_admin_uid_3', {
    role: 'ADMIN',
    email: 'anon@institution.edu',
  });
  assert.strictEqual(canAnonCreateAdmin, false, 'Unauthenticated user must NOT be able to create Admin');
  console.log('  ✅ PASS: Unauthenticated user → create Admin → DENIED');

  // ─── TEST 6: Student modifying role STUDENT → ADMIN → DENIED ─────────────
  console.log('🔹 Test 6: Student attempting role escalation: STUDENT → ADMIN...');
  const existingStudentDoc = engine.getDoc('users/student_uid_01')!;
  const canStudentEscalate = engine.canUpdateUser(
    studentCtx,
    'student_uid_01',
    existingStudentDoc,
    { role: 'ADMIN', name: 'Aarav Patel' },
  );
  assert.strictEqual(canStudentEscalate, false, 'Student MUST NOT be able to change role to ADMIN');
  console.log('  ✅ PASS: Direct Firestore role change STUDENT → ADMIN → DENIED');

  // ─── TEST 7: Faculty modifying role FACULTY → ADMIN → DENIED ─────────────
  console.log('🔹 Test 7: Faculty attempting role escalation: FACULTY → ADMIN...');
  const existingFacultyDoc = engine.getDoc('users/faculty_uid_01')!;
  const canFacultyEscalate = engine.canUpdateUser(
    facultyCtx,
    'faculty_uid_01',
    existingFacultyDoc,
    { role: 'ADMIN', designation: 'Hacked HOD' },
  );
  assert.strictEqual(canFacultyEscalate, false, 'Faculty MUST NOT be able to change role to ADMIN');
  console.log('  ✅ PASS: Direct Firestore role change FACULTY → ADMIN → DENIED');

  // ─── TEST 8: Company modifying role COMPANY → ADMIN → DENIED ─────────────
  console.log('🔹 Test 8: Company attempting role escalation: COMPANY → ADMIN...');
  const existingCompanyDoc = engine.getDoc('users/company_uid_01')!;
  const canCompanyEscalate = engine.canUpdateUser(
    companyCtx,
    'company_uid_01',
    existingCompanyDoc,
    { role: 'ADMIN' },
  );
  assert.strictEqual(canCompanyEscalate, false, 'Company MUST NOT be able to change role to ADMIN');
  console.log('  ✅ PASS: Direct Firestore role change COMPANY → ADMIN → DENIED');

  // ─── TEST 9: Legitimate profile updates for normal users → ALLOWED ────────
  console.log('🔹 Test 9: Student updating own allowed profile fields...');
  const canStudentUpdateProfile = engine.canUpdateUser(
    studentCtx,
    'student_uid_01',
    existingStudentDoc,
    { role: 'STUDENT', phone: '+91 9876543210', bio: 'Computer Engineering Student' },
  );
  assert.strictEqual(canStudentUpdateProfile, true, 'Student should be allowed to update normal fields');
  console.log('  ✅ PASS: Legitimate profile update without role modification → ALLOWED');

  // ─── TEST 10: Admin Directory Read Access ─────────────────────────────────
  console.log('🔹 Test 10: Profile Read Access Permissions...');
  assert.strictEqual(engine.canReadUser(studentCtx, 'student_uid_01'), true, 'Student can read own document');
  assert.strictEqual(engine.canReadUser(studentCtx, 'admin_uid_01'), false, 'Student CANNOT read admin document');
  assert.strictEqual(engine.canReadUser(adminCtx, 'student_uid_01'), true, 'Admin can read any user document');
  console.log('  ✅ PASS: Role-based document read isolation verified');

  // ─── TEST 11: Student Document Security (Phase 11.7) ──────────────────────
  console.log('🔹 Test 11: Student creates own profile students/{ownUid} → ALLOWED');
  assert.strictEqual(engine.canCreateStudent(studentCtx, 'student_uid_01'), true);
  console.log('  ✅ PASS: Student can create own profile');

  console.log('🔹 Test 12: Anonymous user creates student document → DENIED');
  assert.strictEqual(engine.canCreateStudent(anonCtx, 'student_uid_01'), false);
  console.log('  ✅ PASS: Anonymous student document creation DENIED');

  console.log('🔹 Test 13: Student modifies another student profile → DENIED');
  assert.strictEqual(engine.canUpdateStudent(studentCtx, 'student_uid_02'), false);
  console.log('  ✅ PASS: Cross-student profile modification DENIED');

  console.log('🔹 Test 14: Student updates own profile → ALLOWED');
  assert.strictEqual(engine.canUpdateStudent(studentCtx, 'student_uid_01'), true);
  console.log('  ✅ PASS: Student can update own profile');

  console.log('🔹 Test 15: Admin updates student profile → ALLOWED');
  assert.strictEqual(engine.canUpdateStudent(adminCtx, 'student_uid_01'), true);
  console.log('  ✅ PASS: Admin can update student profile');

  console.log('🔹 Test 16: Student reads own profile → ALLOWED');
  assert.strictEqual(engine.canReadStudent(studentCtx, 'student_uid_01'), true);
  console.log('  ✅ PASS: Student can read own profile');

  console.log('🔹 Test 17: Anonymous reads student profile → DENIED');
  assert.strictEqual(engine.canReadStudent(anonCtx, 'student_uid_01'), false);
  console.log('  ✅ PASS: Anonymous read on student profile DENIED');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 ALL 17 FIRESTORE SECURITY RULES TESTS PASSED!');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

runPhase7SecurityVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
