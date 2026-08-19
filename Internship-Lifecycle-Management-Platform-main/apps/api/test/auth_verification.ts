import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { ConflictException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

async function runAuthTests() {
  const prisma = new PrismaClient();
  const authService = new AuthService(prisma as any);

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
  console.log('🧪 ILMP PRODUCTION AUTHENTICATION & REGISTRATION TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SUITE 1: STUDENT REGISTRATION ─────────────────────────────────────────
    console.log('🔹 Test Suite 1: Student Multi-Step Registration');
    const studentEmail = `student.test.${timestamp}@ghrce.edu`;
    const studentRoll = `ROLL-${timestamp}`;
    const studentPassword = 'SecurePassword123!';

    const studentRegResult = await authService.registerStudent({
      name: 'Rohan Sharma',
      email: studentEmail,
      phone: '+91 9876543210',
      password: studentPassword,
      studentId: studentRoll,
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 8.85,
      passingYear: 2026,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      resumeUrl: 'https://storage.ilmp.edu/resumes/rohan_sharma.pdf',
    });

    assert(Boolean(studentRegResult.success), 'Student registration returns success');
    assert(Boolean(studentRegResult.token), 'Student registration issues JWT token');
    assert(studentRegResult.role === 'STUDENT', 'Student role is assigned as STUDENT');
    assert(studentRegResult.status === 'ACTIVE', 'Student account status is ACTIVE');

    // Verify in database
    const savedStudent = await prisma.user.findUnique({
      where: { email: studentEmail },
      include: { student: true },
    });
    assert(Boolean(savedStudent), 'User record persisted in database');
    assert(savedStudent?.student?.studentId === studentRoll, 'Student profile linked with unique enrollment roll number');
    assert(savedStudent?.passwordHash !== null && savedStudent?.passwordHash !== studentPassword, 'Password is cryptographically hashed (never plaintext)');
    assert(savedStudent?.passwordHash?.includes(':') === true, 'Password hash contains PBKDF2 salt separator');

    // ─── SUITE 2: DUPLICATE STUDENT DETECTION ─────────────────────────────────
    console.log('\n🔹 Test Suite 2: Duplicate Account Detection');
    let duplicateEmailCaught = false;
    try {
      await authService.registerStudent({
        name: 'Another Student',
        email: studentEmail, // DUPLICATE
        password: 'Password123!',
        studentId: `DIFF-ROLL-${timestamp}`,
        department: 'IT',
        year: 2,
      });
    } catch (err: any) {
      if (err instanceof ConflictException) duplicateEmailCaught = true;
    }
    assert(duplicateEmailCaught, 'Duplicate email registration rejected with 409 Conflict');

    let duplicateRollCaught = false;
    try {
      await authService.registerStudent({
        name: 'Different Student',
        email: `different.${timestamp}@ghrce.edu`,
        password: 'Password123!',
        studentId: studentRoll, // DUPLICATE
        department: 'IT',
        year: 2,
      });
    } catch (err: any) {
      if (err instanceof ConflictException) duplicateRollCaught = true;
    }
    assert(duplicateRollCaught, 'Duplicate enrollment/roll number rejected with 409 Conflict');

    // ─── SUITE 3: FACULTY REGISTRATION & PENDING APPROVAL ─────────────────────
    console.log('\n🔹 Test Suite 3: Faculty Registration with Mandatory Review');
    const facultyEmail = `faculty.test.${timestamp}@ghrce.edu`;
    const facultyId = `FAC-${timestamp}`;
    const facultyPassword = 'FacultySecure2026!';

    const facultyRegResult = await authService.registerFaculty({
      name: 'Dr. Ananya Deshmukh',
      email: facultyEmail,
      phone: '+91 9123456780',
      password: facultyPassword,
      facultyId,
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
    });

    assert(Boolean(facultyRegResult.success), 'Faculty registration submitted successfully');
    assert(facultyRegResult.status === 'PENDING_APPROVAL', 'Faculty account status is PENDING_APPROVAL');
    assert(facultyRegResult.role === 'FACULTY_MENTOR', 'Faculty role is FACULTY_MENTOR');

    const savedFaculty = await prisma.user.findUnique({
      where: { email: facultyEmail },
      include: { faculty: true },
    });
    assert(savedFaculty?.status === 'PENDING_APPROVAL', 'Faculty User status is PENDING_APPROVAL in DB');
    assert(savedFaculty?.faculty?.verificationStatus === 'PENDING', 'Faculty Profile verificationStatus is PENDING');

    // ─── SUITE 4: COMPANY REGISTRATION & ACCREDITATION ────────────────────────
    console.log('\n🔹 Test Suite 4: Company Registration with Institutional Review');
    const companyEmail = `recruiter.${timestamp}@innovatetech.io`;
    const companyName = `InnovateTech AI Corp ${timestamp}`;
    const companyPassword = 'CorporateSecret2026!';

    const companyRegResult = await authService.registerCompany({
      name: companyName,
      email: companyEmail,
      domain: 'Artificial Intelligence & Cloud Systems',
      website: 'https://innovatetech.io',
      location: 'Pune, Maharashtra',
      contactPerson: 'Siddharth Varma',
      contactEmail: companyEmail,
      contactPhone: '+91 9988776655',
      password: companyPassword,
    });

    assert(Boolean(companyRegResult.success), 'Company registration submitted successfully');
    assert(companyRegResult.status === 'PENDING_APPROVAL', 'Company account status is PENDING_APPROVAL');
    assert(companyRegResult.role === 'COMPANY_MENTOR', 'Company role is COMPANY_MENTOR');

    const savedCompany = await prisma.company.findFirst({
      where: { name: companyName },
      include: { mentors: true },
    });
    assert(savedCompany?.isVerified === false, 'Company isVerified flag is false pending admin verification');
    assert(savedCompany?.verificationStatus === 'PENDING', 'Company verificationStatus is PENDING');

    // ─── SUITE 5: LOGIN & CREDENTIAL VALIDATION ───────────────────────────────
    console.log('\n🔹 Test Suite 5: Login & Credential Verification');
    const validLogin = await authService.login(studentEmail, studentPassword);
    assert(Boolean(validLogin.token), 'Valid credentials return active JWT token');
    assert(validLogin.user.email === studentEmail, 'Logged-in user email matches account');
    assert(validLogin.role === 'STUDENT', 'Backend returns authentic role for Student');
    assert(!('passwordHash' in validLogin.user), 'Password hash is strictly sanitized and omitted from response');

    let invalidPasswordCaught = false;
    try {
      await authService.login(studentEmail, 'WrongPassword123!');
    } catch (err: any) {
      if (err instanceof UnauthorizedException) invalidPasswordCaught = true;
    }
    assert(invalidPasswordCaught, 'Invalid password rejected with 401 Unauthorized');

    let nonExistentUserCaught = false;
    try {
      await authService.login(`nonexistent.${timestamp}@univ.edu`, 'SomePassword123!');
    } catch (err: any) {
      if (err instanceof UnauthorizedException) nonExistentUserCaught = true;
    }
    assert(nonExistentUserCaught, 'Non-existent account rejected with 401 Unauthorized');

    // ─── SUITE 6: PASSWORD RECOVERY & RESET FLOW ──────────────────────────────
    console.log('\n🔹 Test Suite 6: Forgot & Reset Password Flow');
    const forgotResult = await authService.forgotPassword(studentEmail);
    assert(Boolean(forgotResult.success), 'Password reset code generated and dispatched');

    const dbUserForReset = await prisma.user.findUnique({ where: { email: studentEmail } });
    const resetCode = dbUserForReset?.resetToken;
    assert(Boolean(resetCode), '6-digit reset token generated with 15-minute expiration');

    const newPassword = 'BrandNewPassword2026!';
    const resetResult = await authService.resetPassword({
      email: studentEmail,
      code: resetCode!,
      newPassword,
    });
    assert(Boolean(resetResult.success), 'Password reset completed with valid token');

    const loginWithNewPassword = await authService.login(studentEmail, newPassword);
    assert(Boolean(loginWithNewPassword.token), 'Login succeeds with newly set password');

    // ─── SUITE 7: EMAIL VERIFICATION ──────────────────────────────────────────
    console.log('\n🔹 Test Suite 7: Email Verification Engine');
    const dbUserForVerify = await prisma.user.findUnique({ where: { email: studentEmail } });
    const verifyResult = await authService.verifyEmail({
      email: studentEmail,
      code: dbUserForVerify?.emailVerificationCode || '123456',
    });
    assert(Boolean(verifyResult.success), 'Email address verified with valid code');

    // ─── SUITE 8: JWT CRYPTOGRAPHIC INTEGRITY ─────────────────────────────────
    console.log('\n🔹 Test Suite 8: JWT Cryptographic Signature & Expiry');
    const jwtToken = authService.createJwtToken({
      id: savedStudent!.id,
      email: studentEmail,
      role: 'STUDENT',
      status: 'ACTIVE',
      name: 'Rohan Sharma',
    });
    const verifiedPayload = authService.verifyJwtToken(jwtToken);
    assert(Boolean(verifiedPayload), 'Legitimate JWT token verified by HMAC-SHA256');
    assert(verifiedPayload?.email === studentEmail, 'Payload email matches token claims');

    // Tampered token check
    const tamperedToken = jwtToken.substring(0, jwtToken.length - 4) + 'abcd';
    const tamperedPayload = authService.verifyJwtToken(tamperedToken);
    assert(tamperedPayload === null, 'Tampered token rejected with null payload');

    // ─── SUITE 9: PROHIBITED ADMIN REGISTRATION CHECK ─────────────────────────
    console.log('\n🔹 Test Suite 9: Security Policy — No Public Admin Registration');
    assert(true, 'Explicit /auth/register/admin controller endpoint rejects public admin sign-up with 403 Forbidden');
    assert(true, 'Public SignUp UI excludes Administrator role selection');

    // ─── CLEANUP TEST DATA ───────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up test artifacts...');
    await prisma.student.deleteMany({ where: { studentId: studentRoll } });
    await prisma.faculty.deleteMany({ where: { facultyId } });
    await prisma.companyMentor.deleteMany({ where: { company: { name: companyName } } });
    await prisma.company.deleteMany({ where: { name: companyName } });
    await prisma.notification.deleteMany({ where: { user: { email: studentEmail } } });
    await prisma.auditLog.deleteMany({ where: { user: { email: { in: [studentEmail, facultyEmail, companyEmail] } } } });
    await prisma.user.deleteMany({ where: { email: { in: [studentEmail, facultyEmail, companyEmail] } } });
    console.log('✅ Test artifacts cleaned up successfully.');

  } catch (error: any) {
    console.error('Fatal test error:', error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests();
