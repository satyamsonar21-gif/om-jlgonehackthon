import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

async function runPhase6PasswordRecoveryTests() {
  const prisma = new PrismaClient();
  const authService = new AuthService(prisma as any);
  const authController = new AuthController(authService);

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
  console.log('🧪 ILMP PHASE 6: FORGOT, RESET & CHANGE PASSWORD SECURITY SUITE');
  console.log('================================================================\n');

  const ts = Date.now();
  const testEmail1 = `p6.student1.${ts}@ghrce.edu`;
  const testEmail2 = `p6.student2.${ts}@ghrce.edu`;
  const initialPassword = 'InitialSecurePassword123!';
  const createdUserIds: string[] = [];

  try {
    // ─── SETUP: REGISTER TEST USERS ───────────────────────────────────────────
    console.log('🔹 Setup: Provisioning isolated test accounts');
    const user1Res = await authController.registerStudent({
      firstName: 'PassTest1',
      lastName: 'User',
      email: testEmail1,
      enrollmentNumber: `P6-1-${ts.toString().slice(-4)}`,
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      password: initialPassword,
      confirmPassword: initialPassword,
    } as any);
    createdUserIds.push(user1Res.user.id);

    const user2Res = await authController.registerStudent({
      firstName: 'PassTest2',
      lastName: 'User',
      email: testEmail2,
      enrollmentNumber: `P6-2-${ts.toString().slice(-4)}`,
      department: 'Computer Science & Engineering',
      year: 2,
      semester: 4,
      password: initialPassword,
      confirmPassword: initialPassword,
    } as any);
    createdUserIds.push(user2Res.user.id);

    assert(Boolean(user1Res.success && user2Res.success), 'Test users provisioned successfully');

    // ─── TEST SUITE 1: FORGOT PASSWORD & NON-ENUMERATION ──────────────────────
    console.log('\n🔹 Test Suite 1: Forgot Password Flow & Non-Enumeration');

    // 1A. Valid User Forgot Password Request
    const forgotResValid = await authController.forgotPassword({ email: testEmail1 });
    assert(Boolean(forgotResValid.success), 'Forgot password returns success: true');
    assert(!('token' in forgotResValid), 'Forgot password response strictly omits raw token');
    assert(!('resetToken' in forgotResValid), 'Forgot password response strictly omits reset token');
    assert(!('passwordHash' in forgotResValid), 'Forgot password response strictly omits password hash');

    const dbResetToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user1Res.user.id, usedAt: null },
    });
    assert(Boolean(dbResetToken?.tokenHash), 'PasswordResetToken created in database with SHA-256 hash');
    assert(Boolean(dbResetToken?.expiresAt && dbResetToken.expiresAt > new Date()), 'PasswordResetToken expires in the future');

    // 1B. Non-Existent User Non-Enumeration Test
    const forgotResNonExistent = await authController.forgotPassword({ email: `nonexistent.${ts}@ghrce.edu` });
    assert(
      forgotResNonExistent.message === forgotResValid.message,
      'Non-existent email returns the EXACT same message (prevents user enumeration)',
    );

    // ─── TEST SUITE 2: RESET PASSWORD ERROR HANDLING ──────────────────────────
    console.log('\n🔹 Test Suite 2: Reset Password Validation & Error Handling');

    // 2A. Password Mismatch Failure Test
    try {
      await authController.resetPassword({
        email: testEmail1,
        code: '123456',
        newPassword: 'NewPassword123!',
        confirmPassword: 'MismatchPassword123!',
      });
      assert(false, 'Password mismatch should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Password mismatch throws 400 BadRequestException');
    }

    // 2B. Weak Password Failure Test (< 8 chars)
    try {
      await authController.resetPassword({
        email: testEmail1,
        code: '123456',
        newPassword: 'weak',
        confirmPassword: 'weak',
      });
      assert(false, 'Weak password should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Weak password throws 400 BadRequestException');
    }

    // 2C. Invalid Reset Token Test
    try {
      await authController.resetPassword({
        token: 'completely_fake_reset_token_999999999',
        newPassword: 'NewValidPassword123!',
        confirmPassword: 'NewValidPassword123!',
      });
      assert(false, 'Invalid reset token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Invalid reset token throws 400 BadRequestException');
    }

    // 2D. Expired Reset Token Test
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredTokenHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user1Res.user.id,
        tokenHash: expiredTokenHash,
        expiresAt: new Date(Date.now() - 3600 * 1000), // Expired 1 hour ago
      },
    });

    try {
      await authController.resetPassword({
        token: expiredRawToken,
        newPassword: 'NewValidPassword123!',
        confirmPassword: 'NewValidPassword123!',
      });
      assert(false, 'Expired reset token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Expired reset token throws 400 BadRequestException');
    }

    // ─── TEST SUITE 3: VALID RESET PASSWORD & SESSION REVOCATION ──────────────
    console.log('\n🔹 Test Suite 3: Valid Reset Password & Session Invalidation');

    // Create active session for User 1 before reset
    const loginBeforeReset = await authService.login(testEmail1, initialPassword);
    assert(Boolean(loginBeforeReset.sessionToken), 'User 1 logged in successfully before reset');

    const activeSessionsBefore = await prisma.session.findMany({
      where: { userId: user1Res.user.id, isValid: true },
    });
    assert(activeSessionsBefore.length >= 1, 'Active session exists for User 1 before password reset');

    // Generate fresh valid reset token
    const validRawToken = crypto.randomBytes(32).toString('hex');
    const validTokenHash = crypto.createHash('sha256').update(validRawToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user1Res.user.id,
        tokenHash: validTokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetSuccessRes = await authController.resetPassword({
      token: validRawToken,
      newPassword: 'UpdatedSecretPassword123!',
      confirmPassword: 'UpdatedSecretPassword123!',
    });
    assert(Boolean(resetSuccessRes.success), 'POST /auth/reset-password returns success: true');

    // Verify token marked used
    const usedTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: validTokenHash },
    });
    assert(Boolean(usedTokenRecord?.usedAt), 'PasswordResetToken marked with usedAt timestamp');

    // Verify all prior sessions invalidated
    const activeSessionsAfter = await prisma.session.findMany({
      where: { userId: user1Res.user.id, isValid: true },
    });
    assert(activeSessionsAfter.length === 0, 'All previous sessions invalidated after password reset');

    // 3B. Reusing Reset Token Must Fail (Single-Use)
    try {
      await authController.resetPassword({
        token: validRawToken,
        newPassword: 'AnotherPassword123!',
        confirmPassword: 'AnotherPassword123!',
      });
      assert(false, 'Reusing reset token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Reusing reset token throws 400 ("already been used")');
    }

    // 3C. Verify Old Password Fails and New Password Succeeds
    try {
      await authService.login(testEmail1, initialPassword);
      assert(false, 'Login with old password should fail');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Login with old password rejected with 401 Unauthorized');
    }

    const loginWithNewPass = await authService.login(testEmail1, 'UpdatedSecretPassword123!');
    assert(Boolean(loginWithNewPass.success), 'Login with new reset password succeeds');

    // ─── TEST SUITE 4: CHANGE PASSWORD (AUTHENTICATED USER) ───────────────────
    console.log('\n🔹 Test Suite 4: Change Password & Multi-Session Invalidation');

    // User 2 logs in on Device A and Device B
    const sessionA = await authService.createSession(user2Res.user.id);
    const sessionB = await authService.createSession(user2Res.user.id);

    const activeSessionsUser2 = await prisma.session.findMany({
      where: { userId: user2Res.user.id, isValid: true },
    });
    assert(activeSessionsUser2.length === 2, 'User 2 has 2 active concurrent sessions');

    // 4A. Wrong Current Password Test
    try {
      await authController.changePassword(
        { id: user2Res.user.id },
        { session: { id: sessionA.session.id } } as any,
        {
          currentPassword: 'IncorrectOldPassword123!',
          newPassword: 'BrandNewSecurePassword123!',
          confirmPassword: 'BrandNewSecurePassword123!',
        },
      );
      assert(false, 'Wrong current password should throw');
    } catch (err: any) {
      assert(err instanceof UnauthorizedException, 'Wrong current password throws 401 Unauthorized');
    }

    // 4B. Password Mismatch Test
    try {
      await authController.changePassword(
        { id: user2Res.user.id },
        { session: { id: sessionA.session.id } } as any,
        {
          currentPassword: initialPassword,
          newPassword: 'BrandNewSecurePassword123!',
          confirmPassword: 'MismatchedConfirm123!',
        },
      );
      assert(false, 'Password mismatch should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Password mismatch throws 400 BadRequestException');
    }

    // 4C. Identical Old/New Password Test
    try {
      await authController.changePassword(
        { id: user2Res.user.id },
        { session: { id: sessionA.session.id } } as any,
        {
          currentPassword: initialPassword,
          newPassword: initialPassword,
          confirmPassword: initialPassword,
        },
      );
      assert(false, 'Identical old/new password should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Identical old/new password throws 400 BadRequestException');
    }

    // 4D. Successful Password Change Test
    const changePassRes = await authController.changePassword(
      { id: user2Res.user.id },
      { session: { id: sessionA.session.id } } as any,
      {
        currentPassword: initialPassword,
        newPassword: 'BrandNewSecurePassword123!',
        confirmPassword: 'BrandNewSecurePassword123!',
      },
    );
    assert(Boolean(changePassRes.success), 'POST /auth/change-password returns success: true');

    // 4E. Verify Session A preserved, Session B invalidated
    const dbSessionA = await prisma.session.findUnique({ where: { id: sessionA.session.id } });
    const dbSessionB = await prisma.session.findUnique({ where: { id: sessionB.session.id } });
    assert(dbSessionA?.isValid === true, 'Current active session (Session A) preserved');
    assert(dbSessionB?.isValid === false, 'Other active session (Session B) invalidated');

    // 4F. Verify Login with New Password
    const loginUser2New = await authService.login(testEmail2, 'BrandNewSecurePassword123!');
    assert(Boolean(loginUser2New.success), 'User 2 can log in with new changed password');
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up Phase 6 test fixtures...');
    for (const userId of createdUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.passwordResetToken.deleteMany({ where: { userId } });
      await prisma.emailVerificationToken.deleteMany({ where: { userId } });
      await prisma.student.deleteMany({ where: { userId } });
      await prisma.faculty.deleteMany({ where: { userId } });
      await prisma.companyMentor.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    console.log('✅ Phase 6 test fixtures cleaned up successfully.');
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 PHASE 6 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase6PasswordRecoveryTests().catch((err) => {
  console.error('Fatal Phase 6 test error:', err);
  process.exit(1);
});
