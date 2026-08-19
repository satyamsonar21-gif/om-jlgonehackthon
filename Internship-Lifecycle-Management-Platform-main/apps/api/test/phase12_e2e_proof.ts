import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const authService = new AuthService(prisma as any);
const authController = new AuthController(authService);
const reflector = new Reflector();
const authGuard = new AuthGuard(prisma as any, reflector);

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, errMsg?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    results.push({ suite, name, passed: true });
  } else {
    console.error(`  ❌ FAIL: ${name} — ${errMsg || 'Assertion failed'}`);
    results.push({ suite, name, passed: false, error: errMsg });
  }
}

// Mock HTTP response for controller tests
function createMockResponse() {
  const cookies: Record<string, { value: string; options: any }> = {};
  const clearedCookies: string[] = [];
  return {
    cookie: (name: string, value: string, options: any) => {
      cookies[name] = { value, options };
    },
    clearCookie: (name: string) => {
      clearedCookies.push(name);
      delete cookies[name];
    },
    cookies,
    clearedCookies,
  };
}

async function runPhase12E2EProofSuite() {
  console.log('================================================================');
  console.log('🚀 ILMP PHASE 12: END-TO-END AUTHENTICATION PROOF TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const defaultPassword = 'SecureStudentPass#2026';
  const facultyPassword = 'SecureFacultyPass#2026';
  const companyPassword = 'SecureCompanyPass#2026';
  const adminPassword = 'SuperAdminSecret#2026';

  // ─── SETUP FRESH COLLEGE ENVIRONMENT ────────────────────────────────────────
  console.log('🔹 Setup: Initializing test institutional anchor...');
  const college = await prisma.college.upsert({
    where: { code: `P12_${timestamp}` },
    update: {},
    create: {
      code: `P12_${timestamp}`,
      name: 'Phase 12 Institute of Technology',
      address: 'Nagpur, Maharashtra',
    },
  });
  console.log('  ✅ Institutional anchor provisioned.\n');

  // ─── TEST SUITE 1: STUDENT FULL LIFECYCLE ───────────────────────────────────
  console.log('🔹 Test Suite 1: Student Registration, Email Verification, Session & Login');
  let studentUser: any = null;
  let studentSessionToken: string = '';
  {
    const suite = 'Student Lifecycle';
    const studentEmail = `student_${timestamp}@p12.edu`;

    // 1. Register Student
    const regResult = await authService.registerStudent({
      firstName: 'Kavya',
      lastName: 'Deshmukh',
      email: studentEmail,
      phone: '+91 98111 22334',
      enrollmentNumber: `ENR_${timestamp}`,
      department: 'Computer Engineering',
      year: 3,
      semester: 5,
      password: defaultPassword,
      confirmPassword: defaultPassword,
      collegeId: college.id,
    });

    studentUser = regResult.user;
    assert(regResult.success === true, suite, 'Student registration succeeds with 201 Created');
    assert(studentUser.role === 'STUDENT', suite, 'Student role is strictly STUDENT');
    assert(studentUser.isEmailVerified === false, suite, 'Newly registered student emailVerified is false');

    // 2. Retrieve verification code from database and verify email
    const studentDbUser = await prisma.user.findUnique({
      where: { id: studentUser.id },
    });
    assert(studentDbUser?.emailVerificationCode !== null, suite, 'Email verification code stored on user record');

    const verifyRes = await authService.verifyEmail({
      email: studentEmail,
      code: studentDbUser?.emailVerificationCode || undefined,
    });
    assert(verifyRes.success === true, suite, 'Email verified successfully via verification token');

    const verifiedUser = await prisma.user.findUnique({ where: { id: studentUser.id } });
    assert(verifiedUser?.isEmailVerified === true, suite, 'User isEmailVerified is now true in database');

    // 3. Login
    const mockRes = createMockResponse();
    const loginResult = await authController.login(
      { email: studentEmail, password: defaultPassword },
      { ipAddress: '127.0.0.1', headers: { 'user-agent': 'P12 Test Agent' } } as any,
      mockRes as any,
    );

    studentSessionToken = loginResult.token;
    assert(loginResult.success === true, suite, 'Student login succeeds with valid credentials');
    assert(Boolean(mockRes.cookies['ilmp_session']?.value), suite, 'HttpOnly session cookie attached to response');
    assert(mockRes.cookies['ilmp_session']?.options.httpOnly === true, suite, 'Session cookie has httpOnly: true');
    assert(loginResult.user.passwordHash === undefined, suite, 'Login response strictly omits passwordHash');

    // 4. Access Student Portal / GET /auth/me
    const meResult = await authController.getMe(loginResult.user);
    assert(meResult.authenticated === true, suite, 'GET /auth/me returns authenticated status');
    assert(meResult.user.email === studentEmail, suite, 'GET /auth/me returns accurate student identity');
    assert(meResult.user.role === 'STUDENT', suite, 'GET /auth/me returns STUDENT role');

    // 5. Browser Refresh simulation (validating session token)
    const sessionValidation = await authService.validateSession(studentSessionToken);
    assert(sessionValidation !== null && sessionValidation.user.id === studentUser.id, suite, 'Session remains valid on page refresh / subsequent requests');

    // 6. Logout
    const logoutRes = createMockResponse();
    const logoutResult = await authController.logout(
      { cookies: { ilmp_session: studentSessionToken }, headers: {} } as any,
      logoutRes as any,
    );
    assert(logoutResult.success === true, suite, 'Logout successfully revokes active session');
    assert(logoutRes.clearedCookies.includes('ilmp_session'), suite, 'Logout clears ilmp_session cookie');

    // 7. Confirm session is revoked after logout
    const postLogoutSession = await authService.validateSession(studentSessionToken);
    assert(postLogoutSession === null, suite, 'Revoked session is strictly rejected upon subsequent API calls');

    // 8. Login again after logout
    const reLoginResult = await authController.login(
      { email: studentEmail, password: defaultPassword },
      { ipAddress: '127.0.0.1', headers: {} } as any,
      createMockResponse() as any,
    );
    assert(reLoginResult.success === true, suite, 'Student can log in again and obtain a fresh session');
    studentSessionToken = reLoginResult.token;
  }

  // ─── TEST SUITE 2: FACULTY FULL LIFECYCLE ───────────────────────────────────
  console.log('\n🔹 Test Suite 2: Faculty Registration, Verification, Login & Clearance');
  let facultyUser: any = null;
  let facultySessionToken: string = '';
  {
    const suite = 'Faculty Lifecycle';
    const facultyEmail = `faculty_${timestamp}@p12.edu`;

    // 1. Register Faculty
    const regResult = await authService.registerFaculty({
      firstName: 'Dr. Suresh',
      lastName: 'Verma',
      email: facultyEmail,
      phone: '+91 98222 33445',
      employeeId: `EMP_${timestamp}`,
      department: 'Computer Engineering',
      designation: 'Associate Professor',
      password: facultyPassword,
      confirmPassword: facultyPassword,
      collegeId: college.id,
    });

    facultyUser = regResult.user;
    assert(regResult.success === true, suite, 'Faculty registration succeeds with 201 Created');
    assert(facultyUser.role === 'FACULTY_MENTOR', suite, 'Faculty role is strictly FACULTY_MENTOR');
    assert(facultyUser.status === 'PENDING_APPROVAL', suite, 'Faculty account initial status is PENDING_APPROVAL');

    // 2. Email Verification
    const facultyDbUser = await prisma.user.findUnique({
      where: { id: facultyUser.id },
    });
    if (facultyDbUser?.emailVerificationCode) {
      await authService.verifyEmail({ email: facultyEmail, code: facultyDbUser.emailVerificationCode });
    }

    // 3. Login
    const loginResult = await authController.login(
      { email: facultyEmail, password: facultyPassword },
      { ipAddress: '127.0.0.1', headers: {} } as any,
      createMockResponse() as any,
    );
    facultySessionToken = loginResult.token;
    assert(loginResult.success === true, suite, 'Faculty login succeeds');
    assert(loginResult.user.role === 'FACULTY_MENTOR', suite, 'Faculty user role is FACULTY_MENTOR');

    // 4. Access Faculty Portal GET /auth/me
    const meResult = await authController.getMe(loginResult.user);
    assert(meResult.user.email === facultyEmail, suite, 'GET /auth/me returns faculty profile');

    // 5. Logout
    await authController.logout(
      { cookies: { ilmp_session: facultySessionToken }, headers: {} } as any,
      createMockResponse() as any,
    );
    const postLogout = await authService.validateSession(facultySessionToken);
    assert(postLogout === null, suite, 'Faculty session invalidated upon logout');
  }

  // ─── TEST SUITE 3: COMPANY MENTOR FULL LIFECYCLE ────────────────────────────
  console.log('\n🔹 Test Suite 3: Company Mentor Registration, Verification, Login & Clearance');
  let companyUser: any = null;
  let companySessionToken: string = '';
  {
    const suite = 'Company Mentor Lifecycle';
    const companyEmail = `mentor_${timestamp}@technova.com`;

    // 1. Register Company Mentor
    const regResult = await authService.registerCompany({
      firstName: 'Rohit',
      lastName: 'Menon',
      email: companyEmail,
      phone: '+91 98333 44556',
      company: `TechNova_${timestamp}`,
      designation: 'Principal Architect',
      industry: 'Enterprise Software',
      password: companyPassword,
      confirmPassword: companyPassword,
    });

    companyUser = regResult.user;
    assert(regResult.success === true, suite, 'Company Mentor registration succeeds with 201 Created');
    assert(companyUser.role === 'COMPANY_MENTOR', suite, 'Company Mentor role is strictly COMPANY_MENTOR');
    assert(companyUser.status === 'PENDING_APPROVAL', suite, 'Company account initial status is PENDING_APPROVAL');

    // 2. Email Verification
    const companyDbUser = await prisma.user.findUnique({
      where: { id: companyUser.id },
    });
    if (companyDbUser?.emailVerificationCode) {
      await authService.verifyEmail({ email: companyEmail, code: companyDbUser.emailVerificationCode });
    }

    // 3. Login
    const loginResult = await authController.login(
      { email: companyEmail, password: companyPassword },
      { ipAddress: '127.0.0.1', headers: {} } as any,
      createMockResponse() as any,
    );
    companySessionToken = loginResult.token;
    assert(loginResult.success === true, suite, 'Company Mentor login succeeds');
    assert(loginResult.user.role === 'COMPANY_MENTOR', suite, 'Company Mentor user role is COMPANY_MENTOR');

    // 4. Access Company Portal GET /auth/me
    const meResult = await authController.getMe(loginResult.user);
    assert(meResult.user.email === companyEmail, suite, 'GET /auth/me returns company mentor profile');

    // 5. Logout
    await authController.logout(
      { cookies: { ilmp_session: companySessionToken }, headers: {} } as any,
      createMockResponse() as any,
    );
    const postLogout = await authService.validateSession(companySessionToken);
    assert(postLogout === null, suite, 'Company Mentor session invalidated upon logout');
  }

  // ─── TEST SUITE 4: SECURE ADMINISTRATOR PROVISIONING & CLEARANCE ────────────
  console.log('\n🔹 Test Suite 4: Secure Administrator Provisioning & Access');
  let adminUser: any = null;
  let adminSessionToken: string = '';
  {
    const suite = 'Admin Provisioning & Clearance';
    const adminEmail = `admin_${timestamp}@p12.edu`;

    // Secure administrator provisioning with Scrypt password hashing
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: authService.hashPassword(adminPassword),
        name: 'Institutional Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        emailVerified: new Date(),
        collegeId: college.id,
      },
    });

    assert(adminUser !== null && adminUser.role === 'ADMIN', suite, 'Administrator securely provisioned in database');

    // Login as Admin
    const loginResult = await authController.login(
      { email: adminEmail, password: adminPassword },
      { ipAddress: '127.0.0.1', headers: {} } as any,
      createMockResponse() as any,
    );
    adminSessionToken = loginResult.token;
    assert(loginResult.success === true, suite, 'Administrator login succeeds with Scrypt hash verification');
    assert(loginResult.user.role === 'ADMIN', suite, 'Administrator authenticated with ADMIN privileges');

    // Access Admin GET /auth/me
    const meResult = await authController.getMe(loginResult.user);
    assert(meResult.user.email === adminEmail, suite, 'GET /auth/me confirms ADMIN institutional clearance');
  }

  // ─── TEST SUITE 5: COMPREHENSIVE NEGATIVE TESTS ─────────────────────────────
  console.log('\n🔹 Test Suite 5: Comprehensive Security Negative Testing');
  {
    const suite = 'Negative Security Tests';

    // 1. Wrong Password
    let wrongPassError: any = null;
    try {
      await authService.login({ email: studentUser.email, password: 'WrongPassword#123' });
    } catch (err: any) {
      wrongPassError = err;
    }
    assert(wrongPassError !== null && wrongPassError.status === 401, suite, 'Wrong password rejected with 401 Unauthorized');

    // 2. Wrong Email
    let wrongEmailError: any = null;
    try {
      await authService.login({ email: `nonexistent_${timestamp}@unknown.com`, password: defaultPassword });
    } catch (err: any) {
      wrongEmailError = err;
    }
    assert(wrongEmailError !== null && wrongEmailError.status === 401, suite, 'Non-existent email rejected with 401 Unauthorized');

    // 3. Duplicate Email Registration
    let dupEmailError: any = null;
    try {
      await authService.registerStudent({
        firstName: 'Duplicate',
        lastName: 'User',
        email: studentUser.email,
        enrollmentNumber: `DUP_${timestamp}`,
        department: 'CSE',
        year: 2,
        password: defaultPassword,
        confirmPassword: defaultPassword,
      });
    } catch (err: any) {
      dupEmailError = err;
    }
    assert(dupEmailError !== null && dupEmailError.status === 409, suite, 'Duplicate email registration rejected with 409 Conflict');

    // 4. Password Mismatch on Registration
    let mismatchError: any = null;
    try {
      await authService.registerStudent({
        firstName: 'Mismatch',
        lastName: 'User',
        email: `mismatch_${timestamp}@test.edu`,
        enrollmentNumber: `MIS_${timestamp}`,
        department: 'CSE',
        year: 2,
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      });
    } catch (err: any) {
      mismatchError = err;
    }
    assert(mismatchError !== null && mismatchError.status === 400, suite, 'Password confirmation mismatch rejected with 400 BadRequest');

    // 5. Weak Password
    let weakPassError: any = null;
    try {
      await authService.registerStudent({
        firstName: 'Weak',
        lastName: 'User',
        email: `weak_${timestamp}@test.edu`,
        enrollmentNumber: `WEAK_${timestamp}`,
        department: 'CSE',
        year: 2,
        password: '123',
        confirmPassword: '123',
      });
    } catch (err: any) {
      weakPassError = err;
    }
    assert(weakPassError !== null && weakPassError.status === 400, suite, 'Weak password under 8 characters rejected with 400 BadRequest');

    // 6. Inactive Account Login Rejection
    const inactiveUser = await prisma.user.create({
      data: {
        email: `inactive_p12_${timestamp}@test.edu`,
        passwordHash: authService.hashPassword(defaultPassword),
        name: 'Inactive User',
        role: 'STUDENT',
        status: 'PENDING_APPROVAL',
        isActive: false,
      },
    });
    let inactiveError: any = null;
    try {
      await authService.login({ email: inactiveUser.email, password: defaultPassword });
    } catch (err: any) {
      inactiveError = err;
    }
    assert(inactiveError !== null && inactiveError.status === 401, suite, 'Inactive user login attempt rejected with 401 Unauthorized');

    // 7. Suspended Account Login Rejection
    const suspendedUser = await prisma.user.create({
      data: {
        email: `suspended_p12_${timestamp}@test.edu`,
        passwordHash: authService.hashPassword(defaultPassword),
        name: 'Suspended User',
        role: 'STUDENT',
        status: 'SUSPENDED',
        isActive: true,
      },
    });
    let suspendedError: any = null;
    try {
      await authService.login({ email: suspendedUser.email, password: defaultPassword });
    } catch (err: any) {
      suspendedError = err;
    }
    assert(suspendedError !== null && suspendedError.status === 403, suite, 'Suspended user login attempt rejected with 403 Forbidden');

    // 8. Expired Verification Token
    const expiredVerToken = crypto.randomBytes(32).toString('hex');
    const expiredVerHash = crypto.createHash('sha256').update(expiredVerToken).digest('hex');
    await prisma.emailVerificationToken.create({
      data: {
        userId: studentUser.id,
        tokenHash: expiredVerHash,
        expiresAt: new Date(Date.now() - 1000 * 60), // Expired 1 min ago
      },
    });
    let expVerError: any = null;
    try {
      await authService.verifyEmail({ token: expiredVerToken });
    } catch (err: any) {
      expVerError = err;
    }
    assert(expVerError !== null && expVerError.status === 400, suite, 'Expired email verification token rejected with 400 BadRequest');

    // 9. Expired Password Reset Token
    const expiredResetToken = crypto.randomBytes(32).toString('hex');
    const expiredResetHash = crypto.createHash('sha256').update(expiredResetToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: studentUser.id,
        tokenHash: expiredResetHash,
        expiresAt: new Date(Date.now() - 1000 * 60),
      },
    });
    let expResetError: any = null;
    try {
      await authService.resetPassword({ token: expiredResetToken, newPassword: 'NewPassword#2026' });
    } catch (err: any) {
      expResetError = err;
    }
    assert(expResetError !== null && expResetError.status === 400, suite, 'Expired password reset token rejected with 400 BadRequest');

    // 10. Reused (Already Used) Password Reset Token
    const usedResetToken = crypto.randomBytes(32).toString('hex');
    const usedResetHash = crypto.createHash('sha256').update(usedResetToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: studentUser.id,
        tokenHash: usedResetHash,
        expiresAt: new Date(Date.now() + 1000 * 3600),
        usedAt: new Date(Date.now() - 1000 * 60), // Already marked used
      },
    });
    let usedResetError: any = null;
    try {
      await authService.resetPassword({ token: usedResetToken, newPassword: 'NewPassword#2026' });
    } catch (err: any) {
      usedResetError = err;
    }
    assert(usedResetError !== null && usedResetError.status === 400, suite, 'Already-used password reset token rejected with 400 BadRequest');

    // 11. Direct Unauthenticated API Access
    let directUnauthedError: any = null;
    try {
      await authGuard.canActivate({
        switchToHttp: () => ({ getRequest: () => ({ headers: {}, cookies: {} }) }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as any);
    } catch (err: any) {
      directUnauthedError = err;
    }
    assert(directUnauthedError !== null && directUnauthedError.status === 401, suite, 'Direct unauthenticated API access blocked with 401');

    // 12. Frontend Role Tampering in Client Header
    const studentWithAdminHeader: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: studentUser,
          headers: { 'x-role': 'ADMIN' },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    const adminGuard = new RolesGuard({
      getAllAndOverride: () => ['ADMIN'],
    } as any);

    let spoofError: any = null;
    try {
      adminGuard.canActivate(studentWithAdminHeader);
    } catch (err: any) {
      spoofError = err;
    }
    assert(spoofError !== null && spoofError.status === 403, suite, 'Spoofed client header role blocked with 403 Forbidden');
  }

  // ─── TEST SUITE 6: RBAC AUTHORIZATION MATRIX ────────────────────────────────
  console.log('\n🔹 Test Suite 6: Complete 10-Point RBAC Authorization Matrix');
  {
    const suite = 'RBAC Matrix';

    const checkAccess = (user: any, requiredRoles: string[]): boolean => {
      const guard = new RolesGuard({
        getAllAndOverride: () => requiredRoles,
      } as any);
      try {
        return guard.canActivate({
          switchToHttp: () => ({ getRequest: () => ({ user }) }),
          getHandler: () => ({}),
          getClass: () => ({}),
        } as any);
      } catch {
        return false;
      }
    };

    // Matrix checks
    assert(checkAccess(studentUser, ['STUDENT']) === true, suite, 'Student → Student API: PASS');
    assert(checkAccess(studentUser, ['FACULTY_MENTOR']) === false, suite, 'Student → Faculty API: FAIL (403)');
    assert(checkAccess(studentUser, ['COMPANY_MENTOR']) === false, suite, 'Student → Company API: FAIL (403)');
    assert(checkAccess(studentUser, ['ADMIN']) === false, suite, 'Student → Admin API: FAIL (403)');

    assert(checkAccess(facultyUser, ['FACULTY_MENTOR']) === true, suite, 'Faculty → Faculty API: PASS');
    assert(checkAccess(facultyUser, ['ADMIN']) === false, suite, 'Faculty → Admin API: FAIL (403)');

    assert(checkAccess(companyUser, ['COMPANY_MENTOR']) === true, suite, 'Company → Company API: PASS');
    assert(checkAccess(companyUser, ['ADMIN']) === false, suite, 'Company → Admin API: FAIL (403)');

    assert(checkAccess(adminUser, ['ADMIN']) === true, suite, 'Admin → Admin API: PASS');
    assert(checkAccess(adminUser, ['FACULTY_MENTOR']) === true, suite, 'Admin → Faculty API: PASS (Institutional Oversight)');
    assert(checkAccess(adminUser, ['COMPANY_MENTOR']) === true, suite, 'Admin → Company API: PASS (Institutional Oversight)');
  }

  // ─── TEST SUITE 7: PASSWORD RESET & MULTI-SESSION INVALIDATION ──────────────
  console.log('\n🔹 Test Suite 7: Password Reset & Concurrent Session Revocation');
  {
    const suite = 'Password Reset & Invalidation';

    // 1. Create two concurrent active sessions for student
    const { rawToken: sess1 } = await authService.createSession(studentUser.id);
    const { rawToken: sess2 } = await authService.createSession(studentUser.id);

    assert((await authService.validateSession(sess1)) !== null, suite, 'Session 1 is active');
    assert((await authService.validateSession(sess2)) !== null, suite, 'Session 2 is active');

    // 2. Request Password Reset
    await authService.forgotPassword({ email: studentUser.email });
    const studentDbReset = await prisma.user.findUnique({
      where: { id: studentUser.id },
    });

    assert(studentDbReset?.resetToken !== null, suite, 'Password reset token created on user record');

    // 3. Reset password with code
    const newStudentPassword = 'BrandNewPassword#2026';
    const resetResult = await authService.resetPassword({
      email: studentUser.email,
      code: studentDbReset?.resetToken || undefined,
      newPassword: newStudentPassword,
      confirmPassword: newStudentPassword,
    });
    assert(resetResult.success === true, suite, 'Password successfully reset with verification code');

    // 4. Old password must fail
    let oldPassLoginError: any = null;
    try {
      await authService.login({ email: studentUser.email, password: defaultPassword });
    } catch (err: any) {
      oldPassLoginError = err;
    }
    assert(oldPassLoginError !== null && oldPassLoginError.status === 401, suite, 'Old password fails authentication after reset');

    // 5. New password must work
    const newPassLogin = await authService.login({ email: studentUser.email, password: newStudentPassword });
    assert(newPassLogin.success === true, suite, 'New password successfully authenticates user');

    // 6. Old concurrent sessions must be invalidated
    const sess1PostReset = await authService.validateSession(sess1);
    const sess2PostReset = await authService.validateSession(sess2);
    assert(sess1PostReset === null, suite, 'Session 1 revoked upon password reset');
    assert(sess2PostReset === null, suite, 'Session 2 revoked upon password reset');
  }

  // ─── CLEANUP FIXTURES ───────────────────────────────────────────────────────
  console.log('\n🧹 Cleaning up Phase 12 test fixtures...');
  const userIds = [studentUser.id, facultyUser.id, companyUser.id, adminUser.id];
  await prisma.session.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.emailVerificationToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.student.deleteMany({ where: { userId: studentUser.id } });
  await prisma.faculty.deleteMany({ where: { userId: facultyUser.id } });
  await prisma.companyMentor.deleteMany({ where: { userId: companyUser.id } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.company.deleteMany({ where: { name: `TechNova_${timestamp}` } });
  await prisma.college.deleteMany({ where: { code: `P12_${timestamp}` } });
  console.log('✅ Phase 12 test fixtures cleaned up successfully.');

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n================================================================');
  console.log(`📊 PHASE 12 E2E PROOF SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase12E2EProofSuite()
  .catch((err) => {
    console.error('Fatal error during Phase 12 E2E proof run:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
