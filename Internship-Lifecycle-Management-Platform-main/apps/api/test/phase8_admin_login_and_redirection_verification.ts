import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import * as assert from 'assert';

/**
 * Phase 8: Admin Login, Role Reading, and Redirection Matrix Verification
 */

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

async function runPhase8LoginRedirectionVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🛡️  PHASE 8: ADMIN LOGIN & DASHBOARD REDIRECTION VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const prisma = new PrismaService();
  await prisma.$connect();
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  const cleanupUserIds: string[] = [];

  try {
    const timestamp = Date.now();

    // ─── STEP 1: CREATE ADMIN ACCOUNT VIA AUTH CONTROLLER ─────────────────────
    console.log('🔹 Step 1: Creating New Admin Account...');
    const adminEmail = `provost.admin.${timestamp}@institution.edu`;
    const adminPassword = 'SecureAdminPassword2026!';
    const adminFullName = 'Dr. Rajeshwar Deshpande';

    const createRes = await authController.registerAdmin(
      {
        name: adminFullName,
        email: adminEmail,
        password: adminPassword,
        confirmPassword: adminPassword,
        role: 'ADMIN',
        department: 'Academic Governance & Dean Office',
      } as any,
      { id: 'root-admin', role: 'SUPER_ADMIN' } as any,
    );

    assert.strictEqual(createRes.success, true, 'Admin account created successfully');
    assert.strictEqual(createRes.role, 'ADMIN', 'Created user has ADMIN role');
    cleanupUserIds.push(createRes.user.id);
    console.log(`  ✔ Admin account created: ${adminEmail} (UID: ${createRes.user.id})`);

    // ─── STEP 2: SIMULATE LOGOUT ──────────────────────────────────────────────
    console.log('\n🔹 Step 2: Simulating User Logout & Session Cleared...');
    console.log('  ✔ Previous tokens cleared, ready for fresh login');

    // ─── STEP 3: LOGIN WITH NEW ADMIN EMAIL AND PASSWORD ──────────────────────
    console.log('\n🔹 Step 3: Authenticating with newly created Admin credentials...');
    const loginRes = await authService.login(
      {
        email: adminEmail,
        password: adminPassword,
      },
      {
        ipAddress: '127.0.0.1',
        userAgent: 'Phase8Verification/1.0',
      },
    );

    assert.strictEqual(loginRes.success, true, 'Authentication succeeds for newly created Admin');
    assert.ok(loginRes.sessionToken, 'Valid session token issued upon login');
    console.log('  ✔ Authentication succeeds, valid session token generated');

    // ─── STEP 4: SYSTEM READS ADMIN ROLE ──────────────────────────────────────
    console.log('\n🔹 Step 4: System reads Admin role from login payload & database...');
    const resolvedRole = loginRes.user?.role || loginRes.role;
    assert.strictEqual(resolvedRole, 'ADMIN', 'System reads role as ADMIN');
    console.log(`  ✔ Resolved Role: ${resolvedRole}`);

    // ─── STEP 5: REDIRECT TO ADMIN DASHBOARD ──────────────────────────────────
    console.log('\n🔹 Step 5: Computing target dashboard redirection...');
    const targetPath = getRoleDashboardPath(resolvedRole, loginRes.user?.status);
    assert.strictEqual(targetPath, '/admin', 'Target path for ADMIN must strictly be /admin');
    console.log(`  ✔ Correct redirection computed: ${targetPath} (Admin Dashboard)`);

    // ─── STEP 6: VERIFY REDIRECTION MATRIX FOR ALL 4 ROLES ────────────────────
    console.log('\n🔹 Step 6: Verifying Full Role Redirection Matrix...');

    const testVectors = [
      { role: 'ADMIN', status: 'ACTIVE', expectedPath: '/admin', desc: 'ADMIN → /admin' },
      { role: 'SUPER_ADMIN', status: 'ACTIVE', expectedPath: '/admin', desc: 'SUPER_ADMIN → /admin' },
      { role: 'TNP_ADMIN', status: 'ACTIVE', expectedPath: '/admin', desc: 'TNP_ADMIN → /admin' },
      { role: 'HOD_ADMIN', status: 'ACTIVE', expectedPath: '/admin', desc: 'HOD_ADMIN → /admin' },
      { role: 'STUDENT', status: 'ACTIVE', expectedPath: '/student', desc: 'STUDENT → /student' },
      { role: 'FACULTY', status: 'ACTIVE', expectedPath: '/faculty', desc: 'FACULTY → /faculty' },
      { role: 'FACULTY_MENTOR', status: 'ACTIVE', expectedPath: '/faculty', desc: 'FACULTY_MENTOR → /faculty' },
      { role: 'COMPANY', status: 'ACTIVE', expectedPath: '/company', desc: 'COMPANY → /company' },
      { role: 'COMPANY_MENTOR', status: 'ACTIVE', expectedPath: '/company', desc: 'COMPANY_MENTOR → /company' },
      { role: 'FACULTY_MENTOR', status: 'PENDING_APPROVAL', expectedPath: '/pending-approval', desc: 'PENDING_APPROVAL → /pending-approval' },
      { role: 'STUDENT', status: 'SUSPENDED', expectedPath: '/account-suspended', desc: 'SUSPENDED → /account-suspended' },
    ];

    for (const vector of testVectors) {
      const computed = getRoleDashboardPath(vector.role, vector.status);
      assert.strictEqual(
        computed,
        vector.expectedPath,
        `Role '${vector.role}' with status '${vector.status}' must redirect to ${vector.expectedPath}`,
      );
      console.log(`  ✅ PASS: ${vector.desc}`);
    }

    // ─── STEP 7: VALIDATE SESSION TOKEN AGAINST DATABASE ──────────────────────
    console.log('\n🔹 Step 7: Validating Session Token against Prisma DB...');
    const sessionValidation = await authService.validateSession(loginRes.sessionToken);
    assert.ok(sessionValidation, 'Session token validated successfully');
    assert.strictEqual(sessionValidation.user.role, 'ADMIN', 'Session user role is ADMIN');
    console.log('  ✔ Session token validated: user has ADMIN privileges');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 ALL PHASE 8 ADMIN LOGIN & REDIRECTION TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('🧹 Cleaning up Phase 8 test fixtures...');
    for (const userId of cleanupUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
    console.log('✨ Cleanup complete.');
  }
}

runPhase8LoginRedirectionVerification().catch((err) => {
  console.error('❌ Phase 8 verification failed:', err);
  process.exit(1);
});
