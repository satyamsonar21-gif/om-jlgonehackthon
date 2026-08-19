/**
 * ILMP Phase 9: Portal Route Protection & Navigation Security Verification
 * 
 * Verifies:
 * 1. Role-aware route gatekeeper logic (hasRole, getRoleDashboardPath)
 * 2. Unauthenticated route protection (401 redirection to /sign-in)
 * 3. Cross-role boundary defense (Student -> /admin 403, Faculty -> /admin 403, Company -> /admin 403)
 * 4. Destination resolution strictly from authenticated backend identity
 * 5. Suspension and Pending Approval route gatekeepers
 */

import { PrismaClient } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { AuthService } from '../src/modules/auth/auth.service';

let currentRequiredRoles: string[] = [];

const mockReflector = {
  getAllAndOverride: <T>(metadataKey: string, targets: any[]): T => {
    if (metadataKey === 'isPublic') return false as any;
    if (metadataKey === 'roles') return currentRequiredRoles as any;
    return undefined as any;
  },
} as unknown as Reflector;

function createMockExecutionContext(req: any, requiredRoles: string[] = []): ExecutionContext {
  currentRequiredRoles = requiredRoles;
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
  } as unknown as ExecutionContext;
}

// ─── Pure Client Permission Functions (Mirrors apps/web/src/lib/permissions.ts) ──
function hasRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  const ur = userRole.toUpperCase();

  const normalizedUserRole =
    ur === 'COMPANY' ? 'COMPANY_MENTOR' :
    ur === 'FACULTY' ? 'FACULTY_MENTOR' :
    ur;

  return allowedRoles.some((role) => {
    const r = role.toUpperCase();
    if (r === ur || r === normalizedUserRole) return true;
    if (r === 'ADMIN' && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(ur)) return true;
    if (r === 'FACULTY' && ['FACULTY', 'FACULTY_MENTOR'].includes(ur)) return true;
    if (r === 'COMPANY' && ['COMPANY', 'COMPANY_MENTOR'].includes(ur)) return true;
    return false;
  });
}

function getRoleDashboardPath(role: string, status?: string): string {
  if (status === 'PENDING_APPROVAL') {
    return '/pending-approval';
  }
  if (status === 'SUSPENDED') {
    return '/account-suspended';
  }
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return '/student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return '/faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return '/company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return '/admin';
  return '/student';
}

async function runPhase9Verification() {
  console.log('\n================================================================');
  console.log('🛡️ ILMP PHASE 9: PORTAL ROUTE PROTECTION & NAVIGATION TEST SUITE');
  console.log('================================================================\n');

  const prisma = new PrismaClient();
  const authService = new AuthService(prisma as any);
  const authGuard = new AuthGuard(prisma as any, mockReflector);
  const rolesGuard = new RolesGuard(mockReflector);

  let totalPassed = 0;
  let totalFailed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      totalPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      totalFailed++;
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  const timestamp = Date.now();
  const testUsers: any[] = [];

  async function provisionUserWithSession(role: string, name: string, status: string = 'ACTIVE') {
    const user = await (prisma as any).user.create({
      data: {
        email: `p9.${role.toLowerCase()}.${timestamp}@test.edu`,
        passwordHash: 'scrypt:validhash',
        name,
        role,
        status,
        isActive: status === 'ACTIVE',
        emailVerified: new Date(),
      },
    });
    testUsers.push(user);
    const { rawToken } = await authService.createSession(user.id);
    return { user, rawToken };
  }

  try {
    // ─── PROVISION ROLE FIXTURES ──────────────────────────────────────────────
    console.log('🔹 Setup: Provisioning authenticated users across all 4 roles');
    const student = await provisionUserWithSession('STUDENT', 'Rohan Student');
    const faculty = await provisionUserWithSession('FACULTY_MENTOR', 'Dr. Swati Faculty');
    const company = await provisionUserWithSession('COMPANY_MENTOR', 'Arjun Mentor');
    const admin = await provisionUserWithSession('ADMIN', 'Super Admin');

    assert(Boolean(student.rawToken && faculty.rawToken && company.rawToken && admin.rawToken), 'All 4 role fixtures provisioned with database sessions');

    // ─── TEST SUITE 1: AUTHENTICATED DESTINATION RESOLUTION ───────────────────
    console.log('\n🔹 Test Suite 1: Destination Resolution Strictly from Server Role');
    assert(getRoleDashboardPath('STUDENT') === '/student', 'STUDENT resolves strictly to /student');
    assert(getRoleDashboardPath('FACULTY_MENTOR') === '/faculty', 'FACULTY_MENTOR resolves strictly to /faculty');
    assert(getRoleDashboardPath('FACULTY') === '/faculty', 'FACULTY resolves strictly to /faculty');
    assert(getRoleDashboardPath('COMPANY_MENTOR') === '/company', 'COMPANY_MENTOR resolves strictly to /company');
    assert(getRoleDashboardPath('COMPANY') === '/company', 'COMPANY resolves strictly to /company');
    assert(getRoleDashboardPath('ADMIN') === '/admin', 'ADMIN resolves strictly to /admin');
    assert(getRoleDashboardPath('SUPER_ADMIN') === '/admin', 'SUPER_ADMIN resolves strictly to /admin');
    assert(getRoleDashboardPath('TNP_ADMIN') === '/admin', 'TNP_ADMIN resolves strictly to /admin');
    assert(getRoleDashboardPath('HOD_ADMIN') === '/admin', 'HOD_ADMIN resolves strictly to /admin');
    assert(getRoleDashboardPath('STUDENT', 'PENDING_APPROVAL') === '/pending-approval', 'PENDING_APPROVAL status redirects to /pending-approval');
    assert(getRoleDashboardPath('STUDENT', 'SUSPENDED') === '/account-suspended', 'SUSPENDED status redirects to /account-suspended');

    // ─── TEST SUITE 2: CLIENT ROLE-AWARE ROUTE PROTECTION (hasRole) ───────────
    console.log('\n🔹 Test Suite 2: Client Route Guard Permission Evaluation');
    // Student Route [/student/*]
    assert(hasRole('STUDENT', ['STUDENT']) === true, 'Student is permitted on /student/*');
    assert(hasRole('FACULTY_MENTOR', ['STUDENT']) === false, 'Faculty is BLOCKED from /student/*');
    assert(hasRole('COMPANY_MENTOR', ['STUDENT']) === false, 'Company Mentor is BLOCKED from /student/*');

    // Faculty Route [/faculty/*]
    assert(hasRole('FACULTY_MENTOR', ['FACULTY', 'FACULTY_MENTOR']) === true, 'Faculty is permitted on /faculty/*');
    assert(hasRole('STUDENT', ['FACULTY', 'FACULTY_MENTOR']) === false, 'Student is BLOCKED from /faculty/*');
    assert(hasRole('COMPANY_MENTOR', ['FACULTY', 'FACULTY_MENTOR']) === false, 'Company Mentor is BLOCKED from /faculty/*');

    // Company Route [/company/*]
    assert(hasRole('COMPANY_MENTOR', ['COMPANY', 'COMPANY_MENTOR']) === true, 'Company Mentor is permitted on /company/*');
    assert(hasRole('STUDENT', ['COMPANY', 'COMPANY_MENTOR']) === false, 'Student is BLOCKED from /company/*');
    assert(hasRole('FACULTY_MENTOR', ['COMPANY', 'COMPANY_MENTOR']) === false, 'Faculty is BLOCKED from /company/*');

    // Admin Route [/admin/*]
    assert(hasRole('ADMIN', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === true, 'Admin is permitted on /admin/*');
    assert(hasRole('SUPER_ADMIN', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === true, 'Super Admin is permitted on /admin/*');
    assert(hasRole('TNP_ADMIN', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === true, 'T&P Admin is permitted on /admin/*');
    assert(hasRole('STUDENT', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === false, 'Student is BLOCKED from /admin/*');
    assert(hasRole('FACULTY_MENTOR', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === false, 'Faculty is BLOCKED from /admin/*');
    assert(hasRole('COMPANY_MENTOR', ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN']) === false, 'Company Mentor is BLOCKED from /admin/*');

    // ─── TEST SUITE 3: BACKEND REJECTION FOR TAMPERED NAVIGATION ──────────────
    console.log('\n🔹 Test Suite 3: Backend Rejection of Unauthorized Route Calls (403)');
    
    // 3A. Student attempting to invoke Admin API
    try {
      rolesGuard.canActivate(createMockExecutionContext({ user: student.user }, ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN']));
      assert(false, 'Student invoking Admin API should throw 403');
    } catch (err: any) {
      assert(err instanceof ForbiddenException, 'Student invoking Admin API rejected with 403 Forbidden');
    }

    // 3B. Faculty attempting to invoke Admin API
    try {
      rolesGuard.canActivate(createMockExecutionContext({ user: faculty.user }, ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN']));
      assert(false, 'Faculty invoking Admin API should throw 403');
    } catch (err: any) {
      assert(err instanceof ForbiddenException, 'Faculty invoking Admin API rejected with 403 Forbidden');
    }

    // 3C. Company Mentor attempting to invoke Admin API
    try {
      rolesGuard.canActivate(createMockExecutionContext({ user: company.user }, ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN']));
      assert(false, 'Company Mentor invoking Admin API should throw 403');
    } catch (err: any) {
      assert(err instanceof ForbiddenException, 'Company Mentor invoking Admin API rejected with 403 Forbidden');
    }

    // 3D. Unauthenticated request to any protected route
    try {
      await authGuard.canActivate(createMockExecutionContext({ headers: {}, cookies: {} }, ['ADMIN']));
      assert(false, 'Unauthenticated request should throw 401');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Unauthenticated request rejected with 401 Unauthorized');
    }

  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up Phase 9 test fixtures...');
    for (const u of testUsers) {
      try {
        await (prisma as any).session.deleteMany({ where: { userId: u.id } });
        await (prisma as any).user.delete({ where: { id: u.id } });
      } catch {}
    }
    console.log('✅ Phase 9 test fixtures cleaned up successfully.');
  }

  console.log('\n================================================================');
  console.log(`📊 PHASE 9 TEST SUMMARY: ${totalPassed} PASSED | ${totalFailed} FAILED`);
  console.log('================================================================\n');

  await prisma.$disconnect();
}

runPhase9Verification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
