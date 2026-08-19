import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

async function runPhase5EmailVerificationTests() {
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
  console.log('🧪 ILMP PHASE 5: REAL EMAIL VERIFICATION & TOKEN SECURITY SUITE');
  console.log('================================================================\n');

  const ts = Date.now();
  const testEmail1 = `p5.student1.${ts}@ghrce.edu`;
  const testEmail2 = `p5.student2.${ts}@ghrce.edu`;
  const testEmail3 = `p5.student3.${ts}@ghrce.edu`;
  const createdUserIds: string[] = [];

  try {
    // ─── TEST SUITE 1: REGISTRATION & INITIAL UNVERIFIED STATE ─────────────────
    console.log('🔹 Test Suite 1: Registration & Initial Unverified State');
    const studentRes = await authController.registerStudent({
      firstName: 'EmailTest',
      lastName: 'Student',
      email: testEmail1,
      enrollmentNumber: `P5-${ts.toString().slice(-5)}`,
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    } as any);

    assert(Boolean(studentRes.success), 'Student registered successfully');
    createdUserIds.push(studentRes.user.id);

    const initialUser = await prisma.user.findUnique({
      where: { id: studentRes.user.id },
      include: { emailVerificationTokens: true },
    });

    assert(initialUser?.isEmailVerified === false, 'New user isEmailVerified is initially false');
    assert(initialUser?.emailVerified === null, 'New user emailVerified timestamp is initially null');
    assert(initialUser?.emailVerificationTokens.length === 1, 'Exactly one EmailVerificationToken record created on signup');
    
    const dbToken = initialUser?.emailVerificationTokens[0];
    assert(Boolean(dbToken?.tokenHash), 'EmailVerificationToken stores SHA-256 hash');
    assert(dbToken?.usedAt === null, 'EmailVerificationToken usedAt is initially null');
    assert(Boolean(dbToken?.expiresAt && dbToken.expiresAt > new Date()), 'EmailVerificationToken expiresAt is in the future (24h)');

    // ─── TEST SUITE 2: VALID TOKEN VERIFICATION ───────────────────────────────
    console.log('\n🔹 Test Suite 2: Valid Token Verification (Link Flow)');
    // Retrieve token generated for testEmail1
    const rawToken1 = crypto.randomBytes(32).toString('hex');
    const tokenHash1 = crypto.createHash('sha256').update(rawToken1).digest('hex');
    await prisma.emailVerificationToken.create({
      data: {
        userId: studentRes.user.id,
        tokenHash: tokenHash1,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });

    const verifyRes1 = await authController.verifyEmail({ token: rawToken1 });
    assert(Boolean(verifyRes1.success), 'POST /auth/verify-email returns success: true');

    const verifiedUser1 = await prisma.user.findUnique({
      where: { id: studentRes.user.id },
    });
    assert(verifiedUser1?.isEmailVerified === true, 'User isEmailVerified updated to true');
    assert(Boolean(verifiedUser1?.emailVerified), 'User emailVerified timestamp recorded');

    const updatedToken1 = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash: tokenHash1 },
    });
    assert(Boolean(updatedToken1?.usedAt), 'EmailVerificationToken marked with usedAt timestamp');

    // ─── TEST SUITE 3: SINGLE-USE TOKEN ENFORCEMENT ───────────────────────────
    console.log('\n🔹 Test Suite 3: Single-Use Token Enforcement (Already Used)');
    try {
      await authController.verifyEmail({ token: rawToken1 });
      assert(false, 'Reusing an already-used token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Reusing token throws 400 BadRequestException ("already been used")');
    }

    // ─── TEST SUITE 4: INVALID TOKEN REJECTION ────────────────────────────────
    console.log('\n🔹 Test Suite 4: Invalid & Tampered Token Rejection');
    try {
      await authController.verifyEmail({ token: 'completely_invalid_fake_token_123456789' });
      assert(false, 'Invalid token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Invalid token throws 400 BadRequestException');
    }

    // ─── TEST SUITE 5: EXPIRED TOKEN REJECTION ────────────────────────────────
    console.log('\n🔹 Test Suite 5: Expired Token Rejection');
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredTokenHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
    await prisma.emailVerificationToken.create({
      data: {
        userId: studentRes.user.id,
        tokenHash: expiredTokenHash,
        expiresAt: new Date(Date.now() - 3600 * 1000), // Expired 1 hour ago
      },
    });

    try {
      await authController.verifyEmail({ token: expiredRawToken });
      assert(false, 'Expired token should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Expired token throws 400 BadRequestException');
    }

    // ─── TEST SUITE 6: CODE-BASED VERIFICATION ────────────────────────────────
    console.log('\n🔹 Test Suite 6: 6-Digit Verification Code Flow');
    const student2Res = await authController.registerStudent({
      firstName: 'CodeTest',
      lastName: 'Student',
      email: testEmail2,
      enrollmentNumber: `P5-CODE-${ts.toString().slice(-4)}`,
      department: 'Computer Science & Engineering',
      year: 2,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    } as any);
    createdUserIds.push(student2Res.user.id);

    const user2 = await prisma.user.findUnique({ where: { id: student2Res.user.id } });
    const validCode = user2?.emailVerificationCode;
    assert(Boolean(validCode && validCode.length === 6), '6-digit verification code generated on registration');

    // 6A. Invalid Code Failure Test
    try {
      await authController.verifyEmail({ email: testEmail2, code: '000000' });
      assert(false, 'Incorrect code should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Incorrect code throws 400 BadRequestException');
    }

    // 6B. Valid Code Success Test
    const codeVerifyRes = await authController.verifyEmail({ email: testEmail2, code: validCode! });
    assert(Boolean(codeVerifyRes.success), 'Verification with valid 6-digit code succeeds');

    const verifiedUser2 = await prisma.user.findUnique({ where: { id: student2Res.user.id } });
    assert(verifiedUser2?.isEmailVerified === true, 'User 2 isEmailVerified set to true after code verification');
    assert(verifiedUser2?.emailVerificationCode === null, 'User 2 emailVerificationCode cleared after verification');

    // ─── TEST SUITE 7: RESEND VERIFICATION & RATE LIMITING ────────────────────
    console.log('\n🔹 Test Suite 7: Resend Verification & Anti-Abuse Rate Limiting');
    const student3Res = await authController.registerStudent({
      firstName: 'ResendTest',
      lastName: 'Student',
      email: testEmail3,
      enrollmentNumber: `P5-RES-${ts.toString().slice(-4)}`,
      department: 'Computer Science & Engineering',
      year: 1,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    } as any);
    createdUserIds.push(student3Res.user.id);

    // Initial token was created just now (< 60s ago), so immediate resend triggers rate limit
    try {
      await authController.resendVerification({ email: testEmail3 });
      assert(false, 'Immediate resend within 60s should trigger rate limit');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Immediate resend triggers anti-abuse rate limit (60s cooldown)');
    }

    // Simulate token aging (> 60s ago)
    await prisma.emailVerificationToken.updateMany({
      where: { userId: student3Res.user.id },
      data: { createdAt: new Date(Date.now() - 120 * 1000) },
    });

    // Resend now succeeds
    const resendRes = await authController.resendVerification({ email: testEmail3 });
    assert(Boolean(resendRes.success), 'Resend verification succeeds after cooldown');

    const tokensUser3 = await prisma.emailVerificationToken.findMany({
      where: { userId: student3Res.user.id },
      orderBy: { createdAt: 'desc' },
    });
    assert(tokensUser3.length === 2, 'New EmailVerificationToken record created on resend');
    assert(tokensUser3[1].usedAt !== null, 'Previous token invalidated (usedAt set) when new token generated');

    // ─── TEST SUITE 8: ALREADY VERIFIED ACCOUNT RESEND ────────────────────────
    console.log('\n🔹 Test Suite 8: Resend on Already-Verified Account');
    try {
      await authController.resendVerification({ email: testEmail1 });
      assert(false, 'Resend on verified account should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Resend on verified account throws 400 BadRequestException');
    }
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up Phase 5 test fixtures...');
    for (const userId of createdUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.emailVerificationToken.deleteMany({ where: { userId } });
      await prisma.student.deleteMany({ where: { userId } });
      await prisma.faculty.deleteMany({ where: { userId } });
      await prisma.companyMentor.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    console.log('✅ Phase 5 test fixtures cleaned up successfully.');
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 PHASE 5 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5EmailVerificationTests().catch((err) => {
  console.error('Fatal Phase 5 test error:', err);
  process.exit(1);
});
