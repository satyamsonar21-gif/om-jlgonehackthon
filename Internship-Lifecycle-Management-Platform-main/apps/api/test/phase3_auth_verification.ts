import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

async function runPhase3AuthTests() {
  const prisma = new PrismaClient();
  const authService = new AuthService(prisma as any);
  const authController = new AuthController(authService);
  const reflector = new Reflector();
  const authGuard = new AuthGuard(prisma as any, reflector);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, title: string, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title} - ${details || 'Assertion failed'}`);
      failed++;
    }
  }

  console.log('\n================================================================');
  console.log('🧪 ILMP PHASE 3: CORE BACKEND AUTHENTICATION TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testEmail = `phase3.student.${timestamp}@ghrce.edu`;
  const rawPassword = 'SecretPassword123!';
  let testUser: any = null;

  try {
    // ─── SETUP: CREATE ISOLATED TEST USER WITH SECURE HASH ─────────────────────
    console.log('🔹 Setup: Provisioning isolated user with Scrypt password hash');
    const passwordHash = authService.hashPassword(rawPassword);
    assert(passwordHash.startsWith('scrypt:'), 'Password hash uses scrypt algorithm prefix');
    assert(authService.verifyPassword(rawPassword, passwordHash), 'Password verification succeeds with correct password');
    assert(!authService.verifyPassword('WrongPassword123!', passwordHash), 'Password verification fails with incorrect password');

    testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        name: 'Phase3 Test Student',
        firstName: 'Phase3',
        lastName: 'Student',
        role: 'STUDENT',
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
      },
    });
    assert(Boolean(testUser.id), 'User persisted in database with isActive=true and status=ACTIVE');

    // ─── TEST 1: VALID LOGIN & SESSION CREATION ──────────────────────────────
    console.log('\n🔹 Test Suite 1: Valid Login, Database Session & Cookie Dispatch');
    const mockReq: any = { ip: '127.0.0.1', headers: { 'user-agent': 'Jest-E2E-Agent' }, socket: {} };
    let setCookieCalled = false;
    let cookieName = '';
    let cookieVal = '';
    let cookieOptions: any = null;

    const mockRes: any = {
      cookie: (name: string, val: string, options: any) => {
        setCookieCalled = true;
        cookieName = name;
        cookieVal = val;
        cookieOptions = options;
      },
      clearCookie: () => {},
    };

    const loginResponse = await authController.login(
      { email: testEmail, password: rawPassword } as any,
      mockReq,
      mockRes,
    );

    assert(Boolean(loginResponse.success), 'Login controller returns success: true');
    assert(Boolean(loginResponse.token), 'Login controller returns session token');
    assert(setCookieCalled, 'Login controller sets HTTP cookie');
    assert(cookieName === 'ilmp_session', 'Cookie name is "ilmp_session"');
    assert(Boolean(cookieOptions.httpOnly), 'Cookie is marked httpOnly: true');
    assert(cookieOptions.maxAge === 7 * 24 * 3600 * 1000, 'Cookie maxAge is 7 days');
    assert(!('passwordHash' in loginResponse.user), 'User passwordHash is sanitized and NOT returned in response');

    // Verify Session in Database
    const sessionTokenHash = crypto.createHash('sha256').update(cookieVal).digest('hex');
    const dbSession = await prisma.session.findUnique({
      where: { sessionTokenHash },
    });
    assert(Boolean(dbSession), 'Session record created in database with SHA-256 hashed token');
    assert(dbSession?.userId === testUser.id, 'Session userId matches authenticated user');
    assert(dbSession?.isValid === true, 'Session isValid flag is true');
    assert(dbSession?.ipAddress === '127.0.0.1', 'Session recorded client IP address');

    // ─── TEST 2: INVALID CREDENTIALS ──────────────────────────────────────────
    console.log('\n🔹 Test Suite 2: Invalid & Missing Credentials');
    try {
      await authService.login({ email: testEmail, password: 'IncorrectPassword!' });
      assert(false, 'Login with incorrect password should throw');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Incorrect password throws 401 Unauthorized');
    }

    try {
      await authService.login({ email: 'nonexistent.user@ghrce.edu', password: rawPassword });
      assert(false, 'Login with non-existent user should throw');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Non-existent user throws 401 Unauthorized');
    }

    try {
      await authService.login({ email: '', password: '' });
      assert(false, 'Login with missing credentials should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Missing credentials throws 400 BadRequestException');
    }

    // ─── TEST 3: INACTIVE & SUSPENDED ACCOUNTS ────────────────────────────────
    console.log('\n🔹 Test Suite 3: Inactive & Suspended Account Enforcement');
    // Deactivated account
    await prisma.user.update({ where: { id: testUser.id }, data: { isActive: false } });
    try {
      await authService.login({ email: testEmail, password: rawPassword });
      assert(false, 'Login on deactivated account should throw');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Deactivated account (isActive=false) throws 401 Unauthorized');
    }

    // Suspended account
    await prisma.user.update({ where: { id: testUser.id }, data: { isActive: true, status: 'SUSPENDED' } });
    try {
      await authService.login({ email: testEmail, password: rawPassword });
      assert(false, 'Login on suspended account should throw');
    } catch (err: any) {
      assert(err instanceof ForbiddenException, 'Suspended account (status=SUSPENDED) throws 403 Forbidden');
    }

    // Restore to active
    await prisma.user.update({ where: { id: testUser.id }, data: { isActive: true, status: 'ACTIVE' } });

    // ─── TEST 4: AUTH GUARD VALIDATION (COOKIE & BEARER) ─────────────────────
    console.log('\n🔹 Test Suite 4: AuthGuard Cookie & Header Session Inspection');
    const validSessionRaw = cookieVal;

    // A. Via Cookie
    const reqCookieObj: any = {
      cookies: { ilmp_session: validSessionRaw },
      headers: {},
    };
    const guardContextCookie: any = {
      switchToHttp: () => ({
        getRequest: () => reqCookieObj,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    const guardCookieResult = await authGuard.canActivate(guardContextCookie);
    assert(guardCookieResult === true, 'AuthGuard allows request with valid ilmp_session cookie');
    assert(reqCookieObj.user?.id === testUser.id, 'AuthGuard attaches user to request');
    assert(reqCookieObj.session?.id === dbSession?.id, 'AuthGuard attaches session to request');

    // B. Via Bearer Token Header
    const guardContextHeader: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {},
          headers: { authorization: `Bearer ${validSessionRaw}` },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    const guardHeaderResult = await authGuard.canActivate(guardContextHeader);
    assert(guardHeaderResult === true, 'AuthGuard allows request with valid Authorization Bearer header');

    // C. Unauthenticated Request
    const guardContextUnauthed: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {},
          headers: {},
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    try {
      await authGuard.canActivate(guardContextUnauthed);
      assert(false, 'Unauthenticated request on protected route should throw');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Unauthenticated request throws 401 Unauthorized');
    }

    // ─── TEST 5: GET /auth/me ENDPOINT ─────────────────────────────────────────
    console.log('\n🔹 Test Suite 5: GET /auth/me Safe Identity Payload');
    const meResponse = await authController.getMe(testUser);
    assert(meResponse.authenticated === true, 'GET /auth/me returns authenticated: true');
    assert(meResponse.user.id === testUser.id, 'GET /auth/me returns user.id');
    assert(meResponse.user.email === testEmail, 'GET /auth/me returns user.email');
    assert(meResponse.user.role === 'STUDENT', 'GET /auth/me returns user.role');
    assert(!('passwordHash' in meResponse.user), 'GET /auth/me strictly omits passwordHash');

    // ─── TEST 6: LOGOUT & SESSION REVOCATION ──────────────────────────────────
    console.log('\n🔹 Test Suite 6: Logout & Session Invalidation');
    let clearCookieCalled = false;
    let clearCookieName = '';
    const mockLogoutRes: any = {
      clearCookie: (name: string) => {
        clearCookieCalled = true;
        clearCookieName = name;
      },
    };
    const mockLogoutReq: any = {
      cookies: { ilmp_session: validSessionRaw },
      headers: {},
    };

    const logoutResponse = await authController.logout(mockLogoutReq, mockLogoutRes);
    assert(Boolean(logoutResponse.success), 'Logout controller returns success: true');
    assert(clearCookieCalled, 'Logout controller clears cookie');
    assert(clearCookieName === 'ilmp_session', 'Cleared cookie is "ilmp_session"');

    // Verify session revoked in database
    const revokedSession = await prisma.session.findUnique({
      where: { sessionTokenHash },
    });
    assert(revokedSession?.isValid === false, 'Session in database marked isValid = false after logout');

    // Verify AuthGuard now rejects the revoked session
    try {
      await authGuard.canActivate(guardContextCookie);
      assert(false, 'Revoked session should be rejected by AuthGuard');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Revoked session throws 401 Unauthorized');
    }

    // ─── TEST 7: EXPIRED SESSION REJECTION ────────────────────────────────────
    console.log('\n🔹 Test Suite 7: Expired Session Handling');
    const expiredRaw = crypto.randomBytes(32).toString('hex');
    const expiredHash = crypto.createHash('sha256').update(expiredRaw).digest('hex');
    await prisma.session.create({
      data: {
        userId: testUser.id,
        sessionTokenHash: expiredHash,
        expiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour ago
        isValid: true,
      },
    });

    const guardContextExpired: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { ilmp_session: expiredRaw },
          headers: {},
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };

    try {
      await authGuard.canActivate(guardContextExpired);
      assert(false, 'Expired session should be rejected');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Expired session throws 401 Unauthorized');
    }
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up Phase 3 test fixtures...');
    if (testUser) {
      await prisma.session.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
      console.log('✅ Phase 3 test fixtures cleaned up successfully.');
    }
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 PHASE 3 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3AuthTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
