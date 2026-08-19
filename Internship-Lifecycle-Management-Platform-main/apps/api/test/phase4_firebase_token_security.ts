import { AuthGuard, Public } from '../src/common/guards/auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Mock ExecutionContext helper
function createMockContext(options: {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  isPublic?: boolean;
  requiredRoles?: string[];
  user?: any;
}) {
  const request: any = {
    headers: options.headers || {},
    cookies: options.cookies || {},
    user: options.user,
  };

  const mockReflector = {
    getAllAndOverride: (key: string) => {
      if (key === 'isPublic') return options.isPublic || false;
      if (key === 'roles') return options.requiredRoles || [];
      return null;
    },
  } as unknown as Reflector;

  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;

  return { mockContext, mockReflector, request };
}

async function runTests() {
  console.log('================================================================');
  console.log('🔒 PHASE 4: FIREBASE ID TOKEN & NESTJS SECURITY VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // Mock Prisma Service
  const mockPrisma = {
    user: {
      findFirst: async ({ where }: any) => {
        if (where.OR?.some((cond: any) => cond.email === 'student@test.edu' || cond.id === 'uid_student_123')) {
          return {
            id: 'uid_student_123',
            email: 'student@test.edu',
            role: 'STUDENT',
            status: 'ACTIVE',
            isActive: true,
          };
        }
        if (where.OR?.some((cond: any) => cond.email === 'admin@test.edu' || cond.id === 'uid_admin_999')) {
          return {
            id: 'uid_admin_999',
            email: 'admin@test.edu',
            role: 'ADMIN',
            status: 'ACTIVE',
            isActive: true,
          };
        }
        return null;
      },
    },
    session: {
      findFirst: async () => null,
    },
  };

  // Mock FirebaseAdminService
  const mockFirebaseAdmin: any = {
    verifyIdToken: async (token: string) => {
      if (token === 'valid_student_firebase_token') {
        return {
          uid: 'uid_student_123',
          email: 'student@test.edu',
          role: 'STUDENT',
          status: 'ACTIVE',
          auth_time: Math.floor(Date.now() / 1000),
        };
      }
      if (token === 'valid_admin_firebase_token') {
        return {
          uid: 'uid_admin_999',
          email: 'admin@test.edu',
          role: 'ADMIN',
          status: 'ACTIVE',
          auth_time: Math.floor(Date.now() / 1000),
        };
      }
      if (token === 'expired_firebase_token') {
        const err: any = new Error('Firebase ID token has expired.');
        err.code = 'auth/id-token-expired';
        throw new UnauthorizedException('Firebase authentication token has expired. Please sign in again.');
      }
      if (token === 'malformed_invalid_token') {
        const err: any = new Error('Invalid token');
        err.code = 'auth/invalid-id-token';
        throw new UnauthorizedException('Malformed or invalid Firebase authentication token.');
      }
      throw new UnauthorizedException('Firebase authentication token verification failed.');
    },
  };

  // TEST 1: No token on protected endpoint -> 401 Unauthorized
  try {
    const { mockContext, mockReflector } = createMockContext({
      headers: {},
      isPublic: false,
    });
    const authGuard = new AuthGuard(mockPrisma as any, mockReflector, mockFirebaseAdmin);
    await authGuard.canActivate(mockContext);
    console.error('❌ TEST 1 FAILED: Expected UnauthorizedException on missing token');
    failed++;
  } catch (err: any) {
    if (err instanceof UnauthorizedException) {
      console.log('✅ TEST 1 PASSED: Protected endpoint rejects request without token with 401 Unauthorized');
      passed++;
    } else {
      console.error('❌ TEST 1 FAILED with unexpected error:', err);
      failed++;
    }
  }

  // TEST 2: Invalid / Malformed token -> 401 Unauthorized
  try {
    const { mockContext, mockReflector } = createMockContext({
      headers: { authorization: 'Bearer malformed_invalid_token' },
      isPublic: false,
    });
    const authGuard = new AuthGuard(mockPrisma as any, mockReflector, mockFirebaseAdmin);
    await authGuard.canActivate(mockContext);
    console.error('❌ TEST 2 FAILED: Expected UnauthorizedException on malformed token');
    failed++;
  } catch (err: any) {
    if (err instanceof UnauthorizedException) {
      console.log('✅ TEST 2 PASSED: Protected endpoint rejects malformed token with 401 Unauthorized');
      passed++;
    } else {
      console.error('❌ TEST 2 FAILED with unexpected error:', err);
      failed++;
    }
  }

  // TEST 3: Expired token -> 401 Unauthorized
  try {
    const { mockContext, mockReflector } = createMockContext({
      headers: { authorization: 'Bearer expired_firebase_token' },
      isPublic: false,
    });
    const authGuard = new AuthGuard(mockPrisma as any, mockReflector, mockFirebaseAdmin);
    await authGuard.canActivate(mockContext);
    console.error('❌ TEST 3 FAILED: Expected UnauthorizedException on expired token');
    failed++;
  } catch (err: any) {
    if (err instanceof UnauthorizedException && err.message.includes('expired')) {
      console.log('✅ TEST 3 PASSED: Protected endpoint rejects expired token with 401 Unauthorized');
      passed++;
    } else {
      console.error('❌ TEST 3 FAILED with unexpected error:', err);
      failed++;
    }
  }

  // TEST 4: Valid Student Firebase ID token -> Authenticates and attaches request.user
  try {
    const { mockContext, mockReflector, request } = createMockContext({
      headers: { authorization: 'Bearer valid_student_firebase_token' },
      isPublic: false,
    });
    const authGuard = new AuthGuard(mockPrisma as any, mockReflector, mockFirebaseAdmin);
    const result = await authGuard.canActivate(mockContext);
    if (result && request.user && request.user.role === 'STUDENT') {
      console.log('✅ TEST 4 PASSED: Valid Firebase token attaches authenticated Student user to request');
      passed++;
    } else {
      console.error('❌ TEST 4 FAILED: User not correctly attached');
      failed++;
    }
  } catch (err: any) {
    console.error('❌ TEST 4 FAILED with error:', err);
    failed++;
  }

  // TEST 5: Student attempting Admin-only endpoint -> 403 Forbidden (RBAC Guard)
  try {
    const { mockContext, mockReflector } = createMockContext({
      user: { id: 'uid_student_123', email: 'student@test.edu', role: 'STUDENT' },
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    });
    const rolesGuard = new RolesGuard(mockReflector);
    rolesGuard.canActivate(mockContext);
    console.error('❌ TEST 5 FAILED: Expected ForbiddenException for Student accessing Admin route');
    failed++;
  } catch (err: any) {
    if (err instanceof ForbiddenException) {
      console.log('✅ TEST 5 PASSED: RolesGuard denies Student access to Admin-only route with 403 Forbidden');
      passed++;
    } else {
      console.error('❌ TEST 5 FAILED with unexpected error:', err);
      failed++;
    }
  }

  // TEST 6: Admin user accessing Admin-only endpoint -> 200 Allowed
  try {
    const { mockContext, mockReflector } = createMockContext({
      user: { id: 'uid_admin_999', email: 'admin@test.edu', role: 'ADMIN' },
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    });
    const rolesGuard = new RolesGuard(mockReflector);
    const allowed = rolesGuard.canActivate(mockContext);
    if (allowed) {
      console.log('✅ TEST 6 PASSED: RolesGuard allows Admin access to Admin endpoint');
      passed++;
    } else {
      console.error('❌ TEST 6 FAILED: Admin was unexpectedly rejected');
      failed++;
    }
  } catch (err: any) {
    console.error('❌ TEST 6 FAILED with error:', err);
    failed++;
  }

  // TEST 7: Zero-Trust Check (Client Role Tampering Prevention)
  // Even if client injects header `x-injected-role: ADMIN`, backend only uses verified user.role from token
  try {
    const { mockContext, mockReflector } = createMockContext({
      headers: {
        authorization: 'Bearer valid_student_firebase_token',
        'x-user-role': 'ADMIN',
        'x-admin-override': 'true',
      },
      user: { id: 'uid_student_123', email: 'student@test.edu', role: 'STUDENT' }, // verified from token
      requiredRoles: ['ADMIN'],
    });
    const rolesGuard = new RolesGuard(mockReflector);
    rolesGuard.canActivate(mockContext);
    console.error('❌ TEST 7 FAILED: Client role injection was mistakenly trusted');
    failed++;
  } catch (err: any) {
    if (err instanceof ForbiddenException) {
      console.log('✅ TEST 7 PASSED: Zero-trust backend strictly enforces verified token claims, ignoring client header injection');
      passed++;
    } else {
      console.error('❌ TEST 7 FAILED with unexpected error:', err);
      failed++;
    }
  }

  // TEST 8: Public Endpoint Access (@Public())
  try {
    const { mockContext, mockReflector } = createMockContext({
      headers: {},
      isPublic: true,
    });
    const authGuard = new AuthGuard(mockPrisma as any, mockReflector, mockFirebaseAdmin);
    const isAllowed = await authGuard.canActivate(mockContext);
    if (isAllowed) {
      console.log('✅ TEST 8 PASSED: Public endpoint (@Public()) allows unauthenticated access');
      passed++;
    } else {
      console.error('❌ TEST 8 FAILED: Public endpoint was blocked');
      failed++;
    }
  } catch (err: any) {
    console.error('❌ TEST 8 FAILED with error:', err);
    failed++;
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`Phase 4 Test Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
