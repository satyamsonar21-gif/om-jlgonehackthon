import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import * as assert from 'assert';

async function runAdminCreationVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 3: REAL ADMIN ACCOUNT CREATION & LOGIN VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════');

  const prisma = new PrismaService();
  await prisma.$connect();
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  const cleanupUserIds: string[] = [];

  try {
    // ─── STEP 1: CREATE NEW ADMIN ACCOUNT ──────────────────────────────────────
    console.log('\n🔹 Step 1: Provisioning New Institutional Administrator...');
    const uniqueTimestamp = Date.now();
    const adminEmail = `director.tnp.${uniqueTimestamp}@institution.edu`;
    const adminPassword = 'SecureAdminPassword2026!';
    const adminFullName = 'Dr. Anand Mahindra Sharma';

    const registrationPayload = {
      name: adminFullName,
      fullName: adminFullName,
      email: adminEmail,
      phone: '+91 98220 54321',
      password: adminPassword,
      confirmPassword: adminPassword,
      role: 'TNP_ADMIN',
      department: 'Central Training & Placement Cell',
      designation: 'Director of Corporate Relations & Placement',
    };

    const requestingSuperAdmin = {
      id: 'super-admin-root',
      email: 'admin.root@institution.edu',
      role: 'SUPER_ADMIN',
    };

    const createResult = await authController.registerAdmin(
      registrationPayload as any,
      requestingSuperAdmin as any,
    );

    console.log('  ✔ Administrator registered successfully');
    console.log(`  ✔ Returned User ID: ${createResult.user.id}`);
    console.log(`  ✔ Assigned Role: ${createResult.user.role}`);
    console.log(`  ✔ Account Status: ${createResult.user.status}`);

    assert.strictEqual(createResult.success, true, 'Registration result must have success: true');
    assert.strictEqual(createResult.role, 'TNP_ADMIN', 'Role must be server-enforced as TNP_ADMIN');
    assert.strictEqual(createResult.user.email, adminEmail.toLowerCase(), 'Email must match');
    assert.ok(createResult.user.id, 'Created user must have a valid UUID/ID');

    cleanupUserIds.push(createResult.user.id);

    // ─── STEP 2: VERIFY DATABASE PERSISTENCE & SECURITY ENFORCEMENT ───────────
    console.log('\n🔹 Step 2: Inspecting Database Model & Password Hashing...');
    const dbUser = await prisma.user.findUnique({
      where: { id: createResult.user.id },
    });

    assert.ok(dbUser, 'User must exist in Prisma User database table');
    assert.ok(dbUser.passwordHash, 'User must have a password hash');
    assert.ok(
      dbUser.passwordHash.startsWith('scrypt:'),
      'Password hash must use Scrypt KDF format (scrypt:salt:derivedKey)',
    );
    assert.notStrictEqual(
      dbUser.passwordHash,
      adminPassword,
      'Raw password must NEVER be stored in plain text',
    );
    assert.strictEqual(dbUser.role, 'TNP_ADMIN', 'Database role must be TNP_ADMIN');
    assert.strictEqual(dbUser.status, 'ACTIVE', 'Database status must be ACTIVE');
    assert.strictEqual(dbUser.isActive, true, 'Account isActive must be true');

    console.log('  ✔ Database record verified with Scrypt password hashing');

    // ─── STEP 3: VERIFY AUDIT TRAIL RECORDING ──────────────────────────────────
    console.log('\n🔹 Step 3: Verifying Immutable Institutional Audit Log...');
    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: createResult.user.id },
    });

    assert.ok(auditLogs.length >= 1, 'At least 1 audit log entry must be created');
    const creationLog = auditLogs.find((l) => l.action === 'ADMIN_ACCOUNT_CREATED');
    assert.ok(creationLog, 'Audit log action must be ADMIN_ACCOUNT_CREATED');
    console.log(`  ✔ Audit log confirmed: ${creationLog?.action} for User ${creationLog?.entityId}`);

    // ─── STEP 4: REAL LOGIN AUTHENTICATION VERIFICATION ────────────────────────
    console.log('\n🔹 Step 4: Testing Real Sign In with Newly Created Admin Credentials...');
    const loginResult = await authService.login(
      {
        email: adminEmail,
        password: adminPassword,
      },
      {
        ipAddress: '127.0.0.1',
        userAgent: 'AdminCreationVerificationSuite/1.0',
      },
    );

    console.log('  ✔ Sign-in successful!');
    console.log(`  ✔ Session Token: ${loginResult.sessionToken.substring(0, 16)}...`);
    console.log(`  ✔ Logged in User: ${loginResult.user.name} (${loginResult.role})`);

    assert.strictEqual(loginResult.success, true, 'Login must succeed');
    assert.strictEqual(loginResult.role, 'TNP_ADMIN', 'Logged-in user role must be TNP_ADMIN');
    assert.strictEqual(loginResult.user.id, createResult.user.id, 'Logged-in user ID must match created ID');
    assert.ok(loginResult.sessionToken, 'Login must issue a valid session token');

    // ─── STEP 5: VERIFY ACTIVE SESSION IN PRISMA DATABASE ──────────────────────
    console.log('\n🔹 Step 5: Validating Database Session Record...');
    const sessionValidation = await authService.validateSession(loginResult.sessionToken);

    assert.ok(sessionValidation, 'Session token must be validated by AuthService');
    assert.strictEqual(
      sessionValidation.user.id,
      createResult.user.id,
      'Validated session must belong to the newly created admin',
    );
    assert.strictEqual(
      sessionValidation.user.role,
      'TNP_ADMIN',
      'Validated session user role must be TNP_ADMIN',
    );
    console.log('  ✔ Session validated successfully against database');

    // ─── STEP 6: TEST DUPLICATE EMAIL REJECTION ───────────────────────────────
    console.log('\n🔹 Step 6: Testing Conflict Rejection for Duplicate Email...');
    try {
      await authController.registerAdmin(
        registrationPayload as any,
        requestingSuperAdmin as any,
      );
      assert.fail('Duplicate email should throw ConflictException');
    } catch (err: any) {
      assert.ok(
        err instanceof ConflictException,
        'Duplicate registration must throw 409 ConflictException',
      );
      console.log('  ✔ Duplicate email properly rejected with 409 Conflict');
    }

    // ─── STEP 7: TEST INVALID PASSWORD VALIDATION ──────────────────────────────
    console.log('\n🔹 Step 7: Testing Weak Password & Mismatch Rejections...');
    try {
      await authController.registerAdmin(
        {
          name: 'Invalid Password Admin',
          email: `invalid.${uniqueTimestamp}@institution.edu`,
          password: 'short',
          confirmPassword: 'short',
          role: 'ADMIN',
        } as any,
        requestingSuperAdmin as any,
      );
      assert.fail('Short password must be rejected');
    } catch (err: any) {
      assert.ok(
        err instanceof BadRequestException,
        'Weak password must throw 400 BadRequestException',
      );
      console.log('  ✔ Password length policy enforced');
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 ALL PHASE 3 ADMIN CREATION TESTS PASSED PERFECTLY!');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } finally {
    // ─── CLEANUP TEST FIXTURES ────────────────────────────────────────────────
    console.log('🧹 Cleaning up test fixtures...');
    for (const userId of cleanupUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
    console.log('✨ Cleanup complete.');
  }
}

runAdminCreationVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
