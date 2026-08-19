import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as assert from 'assert';

async function runStrictAdminAuthorizationVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 4: STRICT RBAC & MULTI-ROLE AUTHORIZATION VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════');

  const prisma = new PrismaService();
  await prisma.$connect();
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  const cleanupUserIds: string[] = [];

  try {
    const timestamp = Date.now();

    // ─── SETUP: CREATE SEED IDENTITIES ACROSS ALL 4 ROLES ─────────────────────
    console.log('\n🔹 Step 1: Setting Up Test Identities for All 4 Roles...');

    // 1. STUDENT User
    const studentUser = await prisma.user.create({
      data: {
        email: `student.auth.${timestamp}@institution.edu`,
        name: 'Priya Sharma (Student)',
        passwordHash: authService.hashPassword('StudentPass123!'),
        role: 'STUDENT',
        status: 'ACTIVE',
        isActive: true,
      },
    });
    cleanupUserIds.push(studentUser.id);

    // 2. FACULTY User
    const facultyUser = await prisma.user.create({
      data: {
        email: `faculty.auth.${timestamp}@institution.edu`,
        name: 'Dr. Ramesh Kumar (Faculty)',
        passwordHash: authService.hashPassword('FacultyPass123!'),
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
        isActive: true,
      },
    });
    cleanupUserIds.push(facultyUser.id);

    // 3. COMPANY User
    const companyUser = await prisma.user.create({
      data: {
        email: `company.auth.${timestamp}@techcorp.com`,
        name: 'John Doe (Company Mentor)',
        passwordHash: authService.hashPassword('CompanyPass123!'),
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        isActive: true,
      },
    });
    cleanupUserIds.push(companyUser.id);

    // 4. ADMIN User
    const adminUser = await prisma.user.create({
      data: {
        email: `super.admin.${timestamp}@institution.edu`,
        name: 'Executive Super Admin',
        passwordHash: authService.hashPassword('SuperAdminPass123!'),
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        isActive: true,
      },
    });
    cleanupUserIds.push(adminUser.id);

    console.log('  ✔ Created Student, Faculty, Company Mentor, and Super Admin test accounts');

    // ─── RULE 1: STUDENT CANNOT CREATE ADMIN ACCOUNTS ────────────────────────
    console.log('\n🔹 Step 2: Testing Rule 1 — STUDENT cannot create Admin accounts...');
    try {
      await authController.registerAdmin(
        {
          name: 'Hacked Admin',
          email: `hacked.admin1.${timestamp}@institution.edu`,
          password: 'SecurePassword123!',
          role: 'ADMIN',
        } as any,
        studentUser as any,
      );
      assert.fail('STUDENT should be blocked from creating admin accounts');
    } catch (err: any) {
      assert.ok(
        err instanceof ForbiddenException,
        'STUDENT role must throw 403 ForbiddenException',
      );
      console.log('  ✅ PASS: STUDENT blocked with 403 ForbiddenException');
    }

    // ─── RULE 2: FACULTY CANNOT CREATE ADMIN ACCOUNTS ────────────────────────
    console.log('\n🔹 Step 3: Testing Rule 2 — FACULTY cannot create Admin accounts...');
    try {
      await authController.registerAdmin(
        {
          name: 'Hacked Admin',
          email: `hacked.admin2.${timestamp}@institution.edu`,
          password: 'SecurePassword123!',
          role: 'ADMIN',
        } as any,
        facultyUser as any,
      );
      assert.fail('FACULTY should be blocked from creating admin accounts');
    } catch (err: any) {
      assert.ok(
        err instanceof ForbiddenException,
        'FACULTY role must throw 403 ForbiddenException',
      );
      console.log('  ✅ PASS: FACULTY blocked with 403 ForbiddenException');
    }

    // ─── RULE 3: COMPANY CANNOT CREATE ADMIN ACCOUNTS ────────────────────────
    console.log('\n🔹 Step 4: Testing Rule 3 — COMPANY Mentor cannot create Admin accounts...');
    try {
      await authController.registerAdmin(
        {
          name: 'Hacked Admin',
          email: `hacked.admin3.${timestamp}@institution.edu`,
          password: 'SecurePassword123!',
          role: 'ADMIN',
        } as any,
        companyUser as any,
      );
      assert.fail('COMPANY should be blocked from creating admin accounts');
    } catch (err: any) {
      assert.ok(
        err instanceof ForbiddenException,
        'COMPANY role must throw 403 ForbiddenException',
      );
      console.log('  ✅ PASS: COMPANY blocked with 403 ForbiddenException');
    }

    // ─── RULE 4: UNAUTHENTICATED USERS CANNOT CREATE ADMIN ACCOUNTS ─────────
    console.log('\n🔹 Step 5: Testing Rule 4 — Unauthenticated users cannot create Admin accounts...');
    try {
      await authController.registerAdmin(
        {
          name: 'Anonymous Admin',
          email: `anon.admin.${timestamp}@institution.edu`,
          password: 'SecurePassword123!',
          role: 'ADMIN',
        } as any,
        null, // No authenticated user
      );
      assert.fail('Unauthenticated request should be blocked');
    } catch (err: any) {
      assert.ok(
        err instanceof ForbiddenException || err instanceof UnauthorizedException,
        'Unauthenticated request must throw 401 or 403',
      );
      console.log('  ✅ PASS: Unauthenticated creation blocked with 401/403');
    }

    // ─── RULE 5: ONLY ADMIN CAN CREATE ANOTHER ADMIN ─────────────────────────
    console.log('\n🔹 Step 6: Testing Rule 5 & 6 — Authorized ADMIN can create another ADMIN...');
    const newTnpAdminEmail = `tnp.officer.${timestamp}@institution.edu`;
    const newAdminRes = await authController.registerAdmin(
      {
        name: 'Prof. Sunil Patil',
        email: newTnpAdminEmail,
        password: 'SecureAdminPassword2026!',
        confirmPassword: 'SecureAdminPassword2026!',
        role: 'TNP_ADMIN',
        department: 'Central Training & Placement Cell',
      } as any,
      adminUser as any, // Authenticated Super Admin
    );

    assert.strictEqual(newAdminRes.success, true, 'Admin creation by authorized Admin must succeed');
    assert.strictEqual(newAdminRes.role, 'TNP_ADMIN', 'Role must be TNP_ADMIN');
    cleanupUserIds.push(newAdminRes.user.id);
    console.log('  ✅ PASS: Super Admin successfully provisioned new TNP_ADMIN');

    // ─── RULE 7: NORMAL USER CANNOT ESCALATE ROLE TO ADMIN VIA REGISTRATION ──
    console.log('\n🔹 Step 7: Testing Rule 7 & 8 — Normal user cannot escalate role to ADMIN...');
    const spoofedStudent = await authService.registerStudent({
      name: 'Spoofed Student',
      email: `spoofed.student.${timestamp}@ghrce.edu`,
      studentId: `STU-SPOOF-${timestamp}`,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      // Client maliciously sends role: "ADMIN"
      ...({ role: 'ADMIN' } as any),
    });

    assert.strictEqual(
      spoofedStudent.role,
      'STUDENT',
      'Server MUST ignore client role="ADMIN" and enforce STUDENT',
    );
    const dbSpoofed = await prisma.user.findUnique({ where: { id: spoofedStudent.user.id } });
    assert.strictEqual(
      dbSpoofed?.role,
      'STUDENT',
      'Database record MUST have role="STUDENT"',
    );
    cleanupUserIds.push(spoofedStudent.user.id);
    console.log('  ✅ PASS: Client-side role escalation ignored, server strictly enforced STUDENT');

    // ─── RULE 8: NEWLY CREATED ADMIN CAN LOG IN AND GET SESSIONS ─────────────
    console.log('\n🔹 Step 8: Verifying newly created Admin can log in successfully...');
    const adminLogin = await authService.login({
      email: newTnpAdminEmail,
      password: 'SecureAdminPassword2026!',
    });

    assert.strictEqual(adminLogin.success, true, 'Newly created admin can log in');
    assert.strictEqual(adminLogin.role, 'TNP_ADMIN', 'Logged-in role is TNP_ADMIN');
    console.log('  ✅ PASS: Newly provisioned Admin authenticated and session established');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 ALL 8 STRICT AUTHORIZATION & RBAC TESTS PASSED PERFECTLY!');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } finally {
    // ─── CLEANUP TEST FIXTURES ────────────────────────────────────────────────
    console.log('🧹 Cleaning up authorization test fixtures...');
    for (const userId of cleanupUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.student.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
    console.log('✨ Cleanup complete.');
  }
}

runStrictAdminAuthorizationVerification().catch((err) => {
  console.error('❌ Authorization verification failed:', err);
  process.exit(1);
});
