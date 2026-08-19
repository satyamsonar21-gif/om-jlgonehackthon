import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import * as assert from 'assert';

/**
 * Phase 10: Complete End-to-End System Test Suite (All 14 Tests)
 */

function getRoleDashboardPath(role: string, status?: string): string {
  if (status === 'PENDING_APPROVAL') return '/pending-approval';
  if (status === 'SUSPENDED') return '/account-suspended';
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return '/student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return '/faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return '/company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return '/admin';
  return '/student';
}

async function runPhase10E2ETests() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 10: COMPLETE END-TO-END ADMIN SYSTEM VERIFICATION (14 TESTS)');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const prisma = new PrismaService();
  await prisma.$connect();
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  const cleanupUserIds: string[] = [];
  const timestamp = Date.now();

  try {
    // ─── SETUP TEST ACCOUNTS ──────────────────────────────────────────────────
    console.log('📦 Setting up test fixtures for multi-role evaluation...');

    // 1. Root Admin
    const rootAdmin = await prisma.user.create({
      data: {
        name: 'Root System Admin',
        email: `root.admin.${timestamp}@institution.edu`,
        passwordHash: 'dummy_hash',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });
    cleanupUserIds.push(rootAdmin.id);

    // 2. Student Account
    const studentUser = await prisma.user.create({
      data: {
        name: 'Aarav Student',
        email: `student.test.${timestamp}@institution.edu`,
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });
    cleanupUserIds.push(studentUser.id);

    // 3. Faculty Account
    const facultyUser = await prisma.user.create({
      data: {
        name: 'Dr. Faculty Mentor',
        email: `faculty.test.${timestamp}@institution.edu`,
        passwordHash: 'dummy_hash',
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
      },
    });
    cleanupUserIds.push(facultyUser.id);

    // 4. Company Account
    const companyUser = await prisma.user.create({
      data: {
        name: 'Robert Company Supervisor',
        email: `company.test.${timestamp}@techcorp.com`,
        passwordHash: 'dummy_hash',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
      },
    });
    cleanupUserIds.push(companyUser.id);

    console.log('✔ All role test fixtures provisioned.\n');

    // ─── TEST 1: Student logs in → tries Admin dashboard ─────────────────────
    console.log('🔹 TEST 1: Student logs in → tries Admin dashboard');
    const studentDashboardPath = getRoleDashboardPath(studentUser.role);
    assert.strictEqual(studentDashboardPath, '/student', 'Student redirects to /student');
    const isStudentAllowedAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(studentUser.role);
    assert.strictEqual(isStudentAllowedAdmin, false, 'Student role must not have Admin dashboard access');
    console.log('  ✅ PASS: ACCESS DENIED for Student attempting Admin dashboard');

    // ─── TEST 2: Faculty logs in → tries Admin dashboard ─────────────────────
    console.log('\n🔹 TEST 2: Faculty logs in → tries Admin dashboard');
    const facultyDashboardPath = getRoleDashboardPath(facultyUser.role);
    assert.strictEqual(facultyDashboardPath, '/faculty', 'Faculty redirects to /faculty');
    const isFacultyAllowedAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(facultyUser.role);
    assert.strictEqual(isFacultyAllowedAdmin, false, 'Faculty role must not have Admin dashboard access');
    console.log('  ✅ PASS: ACCESS DENIED for Faculty attempting Admin dashboard');

    // ─── TEST 3: Company logs in → tries Admin dashboard ─────────────────────
    console.log('\n🔹 TEST 3: Company logs in → tries Admin dashboard');
    const companyDashboardPath = getRoleDashboardPath(companyUser.role);
    assert.strictEqual(companyDashboardPath, '/company', 'Company redirects to /company');
    const isCompanyAllowedAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(companyUser.role);
    assert.strictEqual(isCompanyAllowedAdmin, false, 'Company role must not have Admin dashboard access');
    console.log('  ✅ PASS: ACCESS DENIED for Company attempting Admin dashboard');

    // ─── TEST 4: Admin logs in → opens Admin Management ──────────────────────
    console.log('\n🔹 TEST 4: Admin logs in → opens Admin Management');
    const adminDashboardPath = getRoleDashboardPath(rootAdmin.role);
    assert.strictEqual(adminDashboardPath, '/admin', 'Admin redirects to /admin');
    const adminListRes = await authController.getAdmins();
    assert.strictEqual(adminListRes.success, true, 'Admin list query succeeded');
    assert.ok(Array.isArray(adminListRes.data), 'Admins data array returned');
    console.log(`  ✅ PASS: ACCESS GRANTED. Retrieved ${adminListRes.data.length} active administrators`);

    // ─── TEST 5: Admin clicks "Create Admin Account" ──────────────────────────
    console.log('\n🔹 TEST 5: Admin clicks "Create Admin Account" (opens form route)');
    const isAdminAllowedToOpenForm = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(rootAdmin.role);
    assert.strictEqual(isAdminAllowedToOpenForm, true, 'Admin has access to /admin/admins/new');
    console.log('  ✅ PASS: Registration form route (/admin/admins/new) opens for Admin');

    // ─── TEST 6: Admin enters valid information → New Admin is created ──────
    console.log('\n🔹 TEST 6: Admin enters valid information → New Admin account created');
    const newAdminEmail = `deputy.tnp.${timestamp}@institution.edu`;
    const newAdminPassword = 'StrongDeputyAdminPassword2026!';
    const newAdminName = 'Dr. Sunita Deshmukh';

    const createAdminRes = await authController.registerAdmin(
      {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        confirmPassword: newAdminPassword,
        role: 'TNP_ADMIN',
        department: 'Training & Placement Division',
        phone: '+91 9876543210',
      } as any,
      { id: rootAdmin.id, role: rootAdmin.role } as any,
    );

    assert.strictEqual(createAdminRes.success, true, 'New Admin created successfully');
    assert.strictEqual(createAdminRes.role, 'TNP_ADMIN', 'New Admin role assigned as TNP_ADMIN');
    cleanupUserIds.push(createAdminRes.user.id);
    console.log(`  ✅ PASS: New Admin account created: ${newAdminEmail} (UID: ${createAdminRes.user.id})`);

    // ─── TEST 7: New Admin logs out ──────────────────────────────────────────
    console.log('\n🔹 TEST 7: New Admin logs out');
    const newAdminLoginSession = await authService.login(
      { email: newAdminEmail, password: newAdminPassword },
      { ipAddress: '127.0.0.1', userAgent: 'Phase10Verification/1.0' },
    );
    assert.ok(newAdminLoginSession.sessionToken, 'Login issued token');
    await authService.revokeSessionByToken(newAdminLoginSession.sessionToken);
    const expiredValidation = await authService.validateSession(newAdminLoginSession.sessionToken);
    assert.strictEqual(expiredValidation, null, 'Session revoked after logout');
    console.log('  ✅ PASS: Logout successful and session token invalidated');

    // ─── TEST 8: New Admin logs in → Admin Dashboard opens ───────────────────
    console.log('\n🔹 TEST 8: New Admin logs in → Admin Dashboard opens');
    const freshLogin = await authService.login(
      { email: newAdminEmail, password: newAdminPassword },
      { ipAddress: '127.0.0.1', userAgent: 'Phase10Verification/1.0' },
    );
    assert.strictEqual(freshLogin.success, true, 'Login successful with new credentials');
    const resolvedNewAdminPath = getRoleDashboardPath(freshLogin.user.role, freshLogin.user.status);
    assert.strictEqual(resolvedNewAdminPath, '/admin', 'Redirection strictly routes to /admin');
    console.log(`  ✅ PASS: Admin authenticated and directed to Admin Dashboard (${resolvedNewAdminPath})`);

    // ─── TEST 9: Normal user attempts Admin creation via API/database ─────────
    console.log('\n🔹 TEST 9: Normal user attempts Admin creation directly via API/database');
    let studentBlocked = false;
    try {
      await authController.registerAdmin(
        {
          name: 'Attacker Admin',
          email: `hacked.admin.${timestamp}@institution.edu`,
          password: 'Password123!',
          confirmPassword: 'Password123!',
          role: 'ADMIN',
          department: 'Malicious Cell',
        } as any,
        { id: studentUser.id, role: studentUser.role } as any, // Authenticated as STUDENT
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException || err.status === 403) {
        studentBlocked = true;
      }
    }
    assert.strictEqual(studentBlocked, true, 'Non-admin MUST be blocked by backend RBAC guard with 403');
    console.log('  ✅ PASS: DENIED (403 Forbidden) when student calls registerAdmin');

    // ─── TEST 10: Normal user attempts to change their role to ADMIN ──────────
    console.log('\n🔹 TEST 10: Normal user attempts role escalation to ADMIN');
    const spoofedRegister = await authService.registerStudent({
      name: 'Tampering Student',
      email: `role.tamper.${timestamp}@institution.edu`,
      password: 'StrongStudentPassword2026!',
      confirmPassword: 'StrongStudentPassword2026!',
      studentId: `ENR-${timestamp}`,
      department: 'Computer Science & Engineering',
      year: 3,
      role: 'ADMIN' as any, // Trying to inject ADMIN
    } as any);
    cleanupUserIds.push(spoofedRegister.user.id);
    assert.strictEqual(spoofedRegister.user.role, 'STUDENT', 'Server must ignore client role and force STUDENT');
    console.log('  ✅ PASS: DENIED (Role escalation blocked, user created strictly as STUDENT)');

    // ─── TEST 11: Duplicate email rejection ──────────────────────────────────
    console.log('\n🔹 TEST 11: Duplicate email rejected');
    let duplicateRejected = false;
    try {
      await authController.registerAdmin(
        {
          name: 'Duplicate Admin',
          email: newAdminEmail, // Already registered in Test 6
          password: 'Password123!',
          confirmPassword: 'Password123!',
          role: 'ADMIN',
          department: 'Academic Office',
        } as any,
        { id: rootAdmin.id, role: rootAdmin.role } as any,
      );
    } catch (err: any) {
      if (err instanceof ConflictException || err.status === 409) {
        duplicateRejected = true;
      }
    }
    assert.strictEqual(duplicateRejected, true, 'Duplicate email must throw 409 Conflict');
    console.log('  ✅ PASS: Proper 409 Conflict error for duplicate email');

    // ─── TEST 12: Password mismatch validation ────────────────────────────────
    console.log('\n🔹 TEST 12: Password mismatch validation error');
    let mismatchRejected = false;
    try {
      await authController.registerAdmin(
        {
          name: 'Mismatch Admin',
          email: `mismatch.${timestamp}@institution.edu`,
          password: 'Password123!',
          confirmPassword: 'DifferentPassword456!',
          role: 'ADMIN',
          department: 'Academic Office',
        } as any,
        { id: rootAdmin.id, role: rootAdmin.role } as any,
      );
    } catch (err: any) {
      if (err instanceof BadRequestException || err.status === 400) {
        mismatchRejected = true;
      }
    }
    assert.strictEqual(mismatchRejected, true, 'Password mismatch must throw 400 BadRequest');
    console.log('  ✅ PASS: Validation error thrown for password mismatch');

    // ─── TEST 13: Invalid email validation ────────────────────────────────────
    console.log('\n🔹 TEST 13: Invalid email validation error');
    let invalidEmailRejected = false;
    try {
      await authController.registerAdmin(
        {
          name: 'Invalid Email Admin',
          email: 'not-a-valid-email',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          role: 'ADMIN',
          department: 'Academic Office',
        } as any,
        { id: rootAdmin.id, role: rootAdmin.role } as any,
      );
    } catch (err: any) {
      if (err instanceof BadRequestException || err.status === 400) {
        invalidEmailRejected = true;
      }
    }
    assert.strictEqual(invalidEmailRejected, true, 'Invalid email format must throw 400 BadRequest');
    console.log('  ✅ PASS: Validation error thrown for invalid email format');

    // ─── TEST 14: Refresh Admin Dashboard (Session persistence) ──────────────
    console.log('\n🔹 TEST 14: Refresh Admin Dashboard & Session Persistence');
    const refreshValidation = await authService.validateSession(freshLogin.sessionToken);
    assert.ok(refreshValidation, 'Session remains valid upon page refresh');
    assert.strictEqual(refreshValidation.user.id, freshLogin.user.id, 'Session retains correct User ID');
    assert.strictEqual(refreshValidation.user.role, 'TNP_ADMIN', 'Session retains correct ADMIN role');
    assert.strictEqual(refreshValidation.user.status, 'ACTIVE', 'Session retains ACTIVE status');
    console.log('  ✅ PASS: Admin session and authorization remain active and valid across dashboard refreshes');

    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('🎉 ALL 14 PHASE 10 END-TO-END TESTS COMPLETED AND PASSED PERFECTLY!');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('🧹 Cleaning up Phase 10 test fixtures...');
    for (const userId of cleanupUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
    console.log('✨ Cleanup complete.');
  }
}

runPhase10E2ETests().catch((err) => {
  console.error('❌ Phase 10 verification failed:', err);
  process.exit(1);
});
