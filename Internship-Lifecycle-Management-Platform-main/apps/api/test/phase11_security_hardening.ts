import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { RateLimitGuard } from '../src/common/guards/rate-limit.guard';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const authService = new AuthService(prisma as any);
const reflector = new Reflector();
const authGuard = new AuthGuard(prisma as any, reflector);
const rolesGuard = new RolesGuard(reflector);
const rateLimitGuard = new RateLimitGuard(reflector);

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

async function runSecurityHardeningTestSuite() {
  console.log('================================================================');
  console.log('🔒 ILMP PHASE 11: COMPLETE SECURITY HARDENING & VERIFICATION TEST');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testPassword = 'HardenedSecret2026!';
  const hashedPassword = authService.hashPassword(testPassword);

  // ─── SETUP FIXTURES ─────────────────────────────────────────────────────────
  console.log('🔹 Setup: Provisioning security test fixtures...');

  const college = await prisma.college.upsert({
    where: { code: `SEC_${timestamp}` },
    update: {},
    create: {
      code: `SEC_${timestamp}`,
      name: 'Security Test Academy',
      address: 'Nagpur, MH',
    },
  });

  // 1. Active Student
  const activeStudent = await prisma.user.create({
    data: {
      email: `student_sec_${timestamp}@test.edu`,
      passwordHash: hashedPassword,
      name: 'Sec Student',
      role: 'STUDENT',
      status: 'ACTIVE',
      isActive: true,
      collegeId: college.id,
      student: {
        create: {
          studentId: `SEC_STU_${timestamp}`,
          department: 'CSE',
          year: 4,
          collegeId: college.id,
        },
      },
    },
    include: { student: true },
  });

  // 2. Inactive Student
  const inactiveUser = await prisma.user.create({
    data: {
      email: `inactive_${timestamp}@test.edu`,
      passwordHash: hashedPassword,
      name: 'Inactive User',
      role: 'STUDENT',
      status: 'PENDING_APPROVAL',
      isActive: false,
      collegeId: college.id,
    },
  });

  // 3. Suspended Faculty
  const suspendedUser = await prisma.user.create({
    data: {
      email: `suspended_${timestamp}@test.edu`,
      passwordHash: hashedPassword,
      name: 'Suspended Faculty',
      role: 'FACULTY_MENTOR',
      status: 'SUSPENDED',
      isActive: true,
      collegeId: college.id,
    },
  });

  // 4. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: `admin_sec_${timestamp}@test.edu`,
      passwordHash: hashedPassword,
      name: 'Sec Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
      collegeId: college.id,
    },
  });

  console.log('  ✅ Fixtures provisioned successfully.\n');

  // ─── TEST SUITE 1: PASSWORD ENCRYPTION & SECURITY ───────────────────────────
  console.log('🔹 Test Suite 1: Password Key Derivation & Policy Hardening');
  {
    const suite = 'Password Security';

    // 1. Verify Scrypt key derivation format
    assert(
      hashedPassword.startsWith('scrypt:') && hashedPassword.split(':').length === 3,
      suite,
      'Password hash uses Node.js Scrypt KDF format (scrypt:salt:hash)',
    );

    // 2. Salt length check (16 bytes hex = 32 chars)
    const salt = hashedPassword.split(':')[1];
    assert(
      salt.length === 32,
      suite,
      'Password salt is cryptographically random 16 bytes (32 hex characters)',
    );

    // 3. Password match verification
    const isValid = authService.verifyPassword(testPassword, hashedPassword);
    assert(isValid === true, suite, 'Valid password verifies accurately via Scrypt timing-safe comparison');

    // 4. Invalid password rejection
    const isWrong = authService.verifyPassword('WrongPassword123!', hashedPassword);
    assert(isWrong === false, suite, 'Incorrect password safely fails verification');

    // 5. Plaintext passwords never stored in DB
    const dbUser = await prisma.user.findUnique({ where: { id: activeStudent.id } });
    assert(
      dbUser?.passwordHash !== testPassword && !dbUser?.passwordHash?.includes(testPassword),
      suite,
      'Database stores only derived cryptographic hash, never plaintext credentials',
    );
  }

  // ─── TEST SUITE 2: SESSION SECURITY & LIFECYCLE ─────────────────────────────
  console.log('\n🔹 Test Suite 2: Session Security, Revocation & Expiration');
  {
    const suite = 'Session Security';

    // 1. Create valid session
    const { rawToken, session } = await authService.createSession(activeStudent.id, {
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Security Test Agent',
    });

    // 2. Session validation
    const validated = await authService.validateSession(rawToken);
    assert(
      validated !== null && validated.user.id === activeStudent.id,
      suite,
      'Valid session token resolves to authenticated user identity',
    );

    // 3. Session token hash at rest
    const rawTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    assert(
      session.sessionTokenHash === rawTokenHash,
      suite,
      'Session token is stored as SHA-256 hash at rest (raw token never saved in DB)',
    );

    // 4. Invalid / malformed session token rejection
    const invalidTokenRes = await authService.validateSession('malformed_random_token_123456');
    assert(invalidTokenRes === null, suite, 'Malformed or forged session token returns null');

    // 5. Expired session rejection
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredTokenHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
    await prisma.session.create({
      data: {
        userId: activeStudent.id,
        sessionTokenHash: expiredTokenHash,
        expiresAt: new Date(Date.now() - 1000 * 60), // expired 1 minute ago
        isValid: true,
      },
    });
    const expiredRes = await authService.validateSession(expiredRawToken);
    assert(expiredRes === null, suite, 'Expired session token strictly rejected');

    // 6. Revoked session rejection
    await authService.revokeSessionByToken(rawToken);
    const revokedRes = await authService.validateSession(rawToken);
    assert(revokedRes === null, suite, 'Explicitly revoked session token strictly rejected');

    // 7. Inactive user session rejection
    const { rawToken: inactiveToken } = await authService.createSession(inactiveUser.id);
    const inactiveRes = await authService.validateSession(inactiveToken);
    assert(inactiveRes === null, suite, 'Deactivated / Inactive account session rejected');

    // 8. Suspended user session rejection
    const { rawToken: suspendedToken } = await authService.createSession(suspendedUser.id);
    const suspendedRes = await authService.validateSession(suspendedToken);
    assert(suspendedRes === null, suite, 'Suspended account session rejected');
  }

  // ─── TEST SUITE 3: INACTIVE / SUSPENDED LOGIN REJECTION ──────────────────────
  console.log('\n🔹 Test Suite 3: Inactive and Suspended Account Login Rejection');
  {
    const suite = 'Account Status Defense';

    // 1. Inactive account login rejected
    let inactiveError: any = null;
    try {
      await authService.login({ email: inactiveUser.email, password: testPassword });
    } catch (err: any) {
      inactiveError = err;
    }
    assert(
      inactiveError !== null && inactiveError.status === 401,
      suite,
      'Inactive user login attempt rejected with 401 Unauthorized',
    );

    // 2. Suspended account login rejected
    let suspendedError: any = null;
    try {
      await authService.login({ email: suspendedUser.email, password: testPassword });
    } catch (err: any) {
      suspendedError = err;
    }
    assert(
      suspendedError !== null && suspendedError.status === 403,
      suite,
      'Suspended user login attempt rejected with 403 Forbidden',
    );
  }

  // ─── TEST SUITE 4: USER ENUMERATION DEFENSE ─────────────────────────────────
  console.log('\n🔹 Test Suite 4: User Non-Enumeration Protection');
  {
    const suite = 'User Enumeration Defense';

    // 1. Existing email forgot password
    const existingRes = await authService.forgotPassword({ email: activeStudent.email });

    // 2. Non-existent email forgot password
    const nonExistentRes = await authService.forgotPassword({
      email: `nonexistent_${timestamp}@unknown-domain.com`,
    });

    // 3. Compare responses: Must be identical
    assert(
      existingRes.success === true &&
        nonExistentRes.success === true &&
        existingRes.message === nonExistentRes.message,
      suite,
      'Forgot-password returns identical generic responses regardless of account existence',
    );

    // 4. Response never leaks resetToken or code in response body
    assert(
      (existingRes as any).resetToken === undefined &&
        (existingRes as any).code === undefined &&
        (nonExistentRes as any).resetToken === undefined,
      suite,
      'Forgot-password response body never exposes raw resetToken or verification code',
    );
  }

  // ─── TEST SUITE 5: RATE LIMITING & BRUTE FORCE DEFENSE ──────────────────────
  console.log('\n🔹 Test Suite 5: Rate Limiting & Brute-Force Defense');
  {
    const suite = 'Rate Limiting';

    // Reset store for fresh test
    RateLimitGuard.reset();

    const mockExecutionContext = (ip: string, path: string): any => ({
      switchToHttp: () => ({
        getRequest: () => ({
          ip,
          headers: {},
          route: { path },
          url: path,
        }),
        getResponse: () => ({
          setHeader: () => {},
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    });

    // Configure reflector mock for RateLimit (3 requests per 60 seconds)
    const testReflector = {
      getAllAndOverride: () => ({
        limit: 3,
        ttlMs: 60000,
        message: 'Rate limit exceeded.',
      }),
    };

    const guard = new RateLimitGuard(testReflector as any);
    const testIp = `192.168.1.${timestamp % 255}`;
    const testPath = '/auth/login';

    const ctx = mockExecutionContext(testIp, testPath);

    // Requests 1, 2, 3 should succeed
    const req1 = guard.canActivate(ctx);
    const req2 = guard.canActivate(ctx);
    const req3 = guard.canActivate(ctx);

    assert(
      req1 === true && req2 === true && req3 === true,
      suite,
      'Legitimate requests under the rate limit threshold are permitted',
    );

    // Request 4 should be throttled (429 Too Many Requests)
    let throttledError: any = null;
    try {
      guard.canActivate(ctx);
    } catch (err: any) {
      throttledError = err;
    }

    assert(
      throttledError !== null && throttledError.getStatus() === 429,
      suite,
      'Burst / Brute-force exceeding threshold is rejected with 429 Too Many Requests',
    );
  }

  // ─── TEST SUITE 6: RBAC ANTI-TAMPERING & AUTHORIZATION BOUNDARY ──────────────
  console.log('\n🔹 Test Suite 6: RBAC Authorization & Direct Access Defense');
  {
    const suite = 'RBAC & Anti-Tampering';

    // 1. Direct unauthenticated request to protected route
    const unauthedReq: any = { headers: {}, cookies: {} };
    let unauthedError: any = null;
    try {
      await authGuard.canActivate({
        switchToHttp: () => ({ getRequest: () => unauthedReq }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as any);
    } catch (err: any) {
      unauthedError = err;
    }
    assert(
      unauthedError !== null && unauthedError.status === 401,
      suite,
      'Direct unauthenticated API request strictly blocked with 401 Unauthorized',
    );

    // 2. Student attempting to access Admin endpoint with spoofed headers & body
    const studentContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: activeStudent, // Authenticated as STUDENT
          headers: { 'x-role': 'ADMIN', 'x-custom-role': 'SUPER_ADMIN' },
          body: { role: 'ADMIN' },
          query: { role: 'ADMIN' },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };

    const adminRequiredReflector = {
      getAllAndOverride: (key: string) => {
        if (key === 'roles') return ['ADMIN', 'SUPER_ADMIN'];
        return null;
      },
    };

    const adminRolesGuard = new RolesGuard(adminRequiredReflector as any);
    let rbacViolation: any = null;
    try {
      adminRolesGuard.canActivate(studentContext);
    } catch (err: any) {
      rbacViolation = err;
    }

    assert(
      rbacViolation !== null && rbacViolation.status === 403,
      suite,
      'Student with spoofed role headers/body accessing Admin API rejected with 403 Forbidden',
    );

    // 3. Legitimate Admin accessing Admin endpoint
    const adminContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: adminUser,
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };

    const adminAllowed = adminRolesGuard.canActivate(adminContext);
    assert(adminAllowed === true, suite, 'Legitimate Admin accessing Admin API permitted');
  }

  // ─── CLEANUP FIXTURES ───────────────────────────────────────────────────────
  console.log('\n🧹 Cleaning up Phase 11 test fixtures...');
  await prisma.session.deleteMany({
    where: {
      userId: { in: [activeStudent.id, inactiveUser.id, suspendedUser.id, adminUser.id] },
    },
  });
  await prisma.student.deleteMany({
    where: { studentId: `SEC_STU_${timestamp}` },
  });
  await prisma.user.deleteMany({
    where: {
      id: { in: [activeStudent.id, inactiveUser.id, suspendedUser.id, adminUser.id] },
    },
  });
  await prisma.college.deleteMany({
    where: { code: `SEC_${timestamp}` },
  });
  console.log('✅ Phase 11 security test fixtures cleaned up successfully.');

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n================================================================');
  console.log(`📊 PHASE 11 SECURITY TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityHardeningTestSuite()
  .catch((err) => {
    console.error('Fatal error during security hardening test run:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
