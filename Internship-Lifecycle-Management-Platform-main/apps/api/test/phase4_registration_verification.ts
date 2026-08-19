import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';

async function runPhase4RegistrationTests() {
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
  console.log('🧪 ILMP PHASE 4: REAL ACCOUNT CREATION & REGISTRATION TEST SUITE');
  console.log('================================================================\n');

  const ts = Date.now();
  const studentEmail = `p4.student.${ts}@ghrce.edu`;
  const studentRoll = `BT22CSE${ts.toString().slice(-4)}`;
  const facultyEmail = `p4.faculty.${ts}@ghrce.edu`;
  const facultyEmpId = `EMP-CSE-${ts.toString().slice(-4)}`;
  const companyEmail1 = `p4.mentor1.${ts}@acmecorp.com`;
  const companyEmail2 = `p4.mentor2.${ts}@acmecorp.com`;
  const uniqueCompanyName = `Acme Global Dynamics ${ts}`;

  const createdUserIds: string[] = [];
  const createdCompanyIds: string[] = [];

  try {
    // ─── TEST SUITE 1: STUDENT REGISTRATION ───────────────────────────────────
    console.log('🔹 Test Suite 1: Real Student Account Registration');

    // 1A. Password Mismatch Failure Test
    try {
      await authController.registerStudent({
        firstName: 'Test',
        lastName: 'Student',
        email: studentEmail,
        enrollmentNumber: studentRoll,
        department: 'Computer Science & Engineering',
        year: 3,
        semester: 6,
        password: 'SecurePassword123!',
        confirmPassword: 'MismatchPassword123!',
      } as any);
      assert(false, 'Registration with password mismatch should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Password mismatch throws 400 BadRequestException');
    }

    // 1B. Weak Password Failure Test (< 8 chars)
    try {
      await authController.registerStudent({
        firstName: 'Test',
        lastName: 'Student',
        email: studentEmail,
        enrollmentNumber: studentRoll,
        department: 'Computer Science & Engineering',
        year: 3,
        semester: 6,
        password: 'pass',
        confirmPassword: 'pass',
      } as any);
      assert(false, 'Registration with weak password should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Weak password throws 400 BadRequestException');
    }

    // 1C. Successful Student Registration + Role Escalation Attempt Test
    const studentRes = await authController.registerStudent({
      firstName: 'Aarav',
      lastName: 'Patil',
      email: studentEmail,
      phone: '+91 9876543210',
      enrollmentNumber: studentRoll,
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      passingYear: 2026,
      cgpa: 8.85,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      role: 'ADMIN', // MALICIOUS INPUT: Attempting to escalate role
    } as any);

    assert(Boolean(studentRes.success), 'Student registration returns success: true');
    assert(studentRes.role === 'STUDENT', 'Response role is strictly STUDENT (ignored client role="ADMIN")');
    assert(studentRes.status === 'ACTIVE', 'Student account status is ACTIVE');
    assert(!('passwordHash' in studentRes.user), 'Response strictly omits passwordHash');
    createdUserIds.push(studentRes.user.id);

    // Verify in Database
    const dbStudentUser = await prisma.user.findUnique({
      where: { id: studentRes.user.id },
      include: { student: true },
    });
    assert(Boolean(dbStudentUser), 'Student User persisted in database');
    assert(dbStudentUser?.role === 'STUDENT', 'Database User.role is strictly STUDENT');
    assert(dbStudentUser?.firstName === 'Aarav', 'Database User.firstName is stored');
    assert(dbStudentUser?.lastName === 'Patil', 'Database User.lastName is stored');
    assert(dbStudentUser?.name === 'Aarav Patil', 'Database User.name is combined correctly');
    assert(dbStudentUser?.passwordHash?.startsWith('scrypt:'), 'User password stored with scrypt hash algorithm');
    assert(dbStudentUser?.student?.studentId === studentRoll, 'StudentProfile linked with unique studentId / roll number');
    assert(dbStudentUser?.student?.year === 3, 'StudentProfile year recorded as 3');
    assert(dbStudentUser?.student?.semester === 6, 'StudentProfile semester recorded as 6');

    // 1D. Duplicate Email Rejection Test
    try {
      await authController.registerStudent({
        firstName: 'Duplicate',
        lastName: 'Email',
        email: studentEmail,
        enrollmentNumber: `DIFF-${ts}`,
        department: 'Computer Science & Engineering',
        year: 2,
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      } as any);
      assert(false, 'Duplicate student email should throw');
    } catch (err: any) {
      assert(err instanceof ConflictException, 'Duplicate student email rejected with 409 ConflictException');
    }

    // 1E. Duplicate Enrollment Number Rejection Test
    try {
      await authController.registerStudent({
        firstName: 'Duplicate',
        lastName: 'Roll',
        email: `diff.student.${ts}@ghrce.edu`,
        enrollmentNumber: studentRoll,
        department: 'Computer Science & Engineering',
        year: 2,
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      } as any);
      assert(false, 'Duplicate enrollment number should throw');
    } catch (err: any) {
      assert(err instanceof ConflictException, 'Duplicate enrollment number rejected with 409 ConflictException');
    }

    // ─── TEST SUITE 2: FACULTY REGISTRATION ───────────────────────────────────
    console.log('\n🔹 Test Suite 2: Real Faculty Account Registration');

    // 2A. Password Mismatch Failure Test
    try {
      await authController.registerFaculty({
        firstName: 'Dr. Ramesh',
        lastName: 'Sharma',
        email: facultyEmail,
        employeeId: facultyEmpId,
        department: 'Computer Science & Engineering',
        designation: 'Associate Professor',
        password: 'SecurePassword123!',
        confirmPassword: 'WrongPassword123!',
      } as any);
      assert(false, 'Faculty password mismatch should throw');
    } catch (err: any) {
      assert(err instanceof BadRequestException, 'Faculty password mismatch throws 400 BadRequestException');
    }

    // 2B. Successful Faculty Registration + Role Escalation Attempt Test
    const facultyRes = await authController.registerFaculty({
      firstName: 'Dr. Ramesh',
      lastName: 'Sharma',
      email: facultyEmail,
      phone: '+91 9876543211',
      employeeId: facultyEmpId,
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor & Internship Coordinator',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      role: 'SUPER_ADMIN', // MALICIOUS INPUT: Attempting to escalate role
    } as any);

    assert(Boolean(facultyRes.success), 'Faculty registration returns success: true');
    assert(facultyRes.role === 'FACULTY_MENTOR', 'Response role is strictly FACULTY_MENTOR');
    assert(facultyRes.status === 'PENDING_APPROVAL', 'Faculty account status is PENDING_APPROVAL');
    assert(!('passwordHash' in facultyRes.user), 'Response strictly omits passwordHash');
    createdUserIds.push(facultyRes.user.id);

    // Verify in Database
    const dbFacultyUser = await prisma.user.findUnique({
      where: { id: facultyRes.user.id },
      include: { faculty: true },
    });
    assert(Boolean(dbFacultyUser), 'Faculty User persisted in database');
    assert(dbFacultyUser?.role === 'FACULTY_MENTOR', 'Database User.role is strictly FACULTY_MENTOR');
    assert(dbFacultyUser?.status === 'PENDING_APPROVAL', 'Database User.status is PENDING_APPROVAL (requires review)');
    assert(dbFacultyUser?.faculty?.facultyId === facultyEmpId, 'FacultyProfile linked with unique employeeId');
    assert(dbFacultyUser?.faculty?.designation === 'Associate Professor & Internship Coordinator', 'Faculty designation recorded');

    // 2C. Duplicate Employee ID Rejection Test
    try {
      await authController.registerFaculty({
        firstName: 'Duplicate',
        lastName: 'EmpId',
        email: `diff.faculty.${ts}@ghrce.edu`,
        employeeId: facultyEmpId,
        department: 'Information Technology',
        designation: 'Assistant Professor',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      } as any);
      assert(false, 'Duplicate faculty employee ID should throw');
    } catch (err: any) {
      assert(err instanceof ConflictException, 'Duplicate faculty employee ID rejected with 409 ConflictException');
    }

    // ─── TEST SUITE 3: COMPANY MENTOR & COMPANY REUSE ─────────────────────────
    console.log('\n🔹 Test Suite 3: Real Company Mentor Registration & Company Reuse');

    // 3A. Register Mentor 1 (Creates new Company record)
    const mentor1Res = await authController.registerCompany({
      firstName: 'Priya',
      lastName: 'Nair',
      email: companyEmail1,
      phone: '+91 9876543212',
      company: uniqueCompanyName,
      industry: 'Software & Technology Services',
      designation: 'Lead University Recruiter',
      website: 'https://acmeglobal.example.com',
      location: 'Pune, Maharashtra',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      role: 'ADMIN', // MALICIOUS INPUT: Attempting to escalate role
    } as any);

    assert(Boolean(mentor1Res.success), 'Company mentor 1 registration returns success: true');
    assert(mentor1Res.role === 'COMPANY_MENTOR', 'Response role is strictly COMPANY_MENTOR');
    assert(mentor1Res.status === 'PENDING_APPROVAL', 'Company mentor account status is PENDING_APPROVAL');
    createdUserIds.push(mentor1Res.user.id);
    const companyId1 = mentor1Res.company.id;
    createdCompanyIds.push(companyId1);

    // Verify Company in Database
    const dbCompany1 = await prisma.company.findUnique({
      where: { id: companyId1 },
    });
    assert(Boolean(dbCompany1), 'New Company record created in database');
    assert(dbCompany1?.name === uniqueCompanyName, 'Company name matches registration input');
    assert(dbCompany1?.isVerified === false, 'Company isVerified is false pending university clearance');

    // 3B. Register Mentor 2 from the SAME Company (Reuses existing Company record)
    const mentor2Res = await authController.registerCompany({
      firstName: 'Vikram',
      lastName: 'Mehta',
      email: companyEmail2,
      phone: '+91 9876543213',
      company: uniqueCompanyName, // SAME COMPANY
      designation: 'Principal Architect & Technical Mentor',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    } as any);

    assert(Boolean(mentor2Res.success), 'Company mentor 2 registration returns success: true');
    assert(mentor2Res.company.id === companyId1, 'Mentor 2 correctly reused existing Company record (no duplicate company)');
    createdUserIds.push(mentor2Res.user.id);

    // Verify total companies count for this name is exactly 1
    const matchingCompanies = await prisma.company.findMany({
      where: { name: uniqueCompanyName },
    });
    assert(matchingCompanies.length === 1, 'Exactly 1 Company record exists in database (zero duplication)');

    // ─── TEST SUITE 4: SECURITY ENFORCEMENT & ADMIN PROVISIONING ────────────
    console.log('\n🔹 Test Suite 4: Administrator Account Provisioning');
    const adminEmail = `test.admin.${Date.now()}@institution.edu`;
    const adminRes = await authController.registerAdmin(
      {
        name: 'Dr. Test Administrator',
        email: adminEmail,
        password: 'SecureAdminPassword123!',
        role: 'TNP_ADMIN',
        department: 'Training & Placement Cell',
      } as any,
      { id: 'root-super-admin', role: 'SUPER_ADMIN' } as any,
    );
    assert(Boolean(adminRes.success), 'Administrator registration returned success');
    assert(adminRes.role === 'TNP_ADMIN', 'Created administrator has server-assigned TNP_ADMIN role');
    createdUserIds.push(adminRes.user.id);

    // ─── TEST SUITE 5: LOGIN WITH NEWLY REGISTERED USERS ──────────────────────
    console.log('\n🔹 Test Suite 5: Login with newly created accounts');
    const studentLogin = await authService.login({
      email: studentEmail,
      password: 'SecurePassword123!',
    });
    assert(studentLogin.success === true, 'Student can log in with newly created credentials');
    assert(studentLogin.role === 'STUDENT', 'Logged in student role is STUDENT');
  } finally {
    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up Phase 4 test fixtures...');
    for (const userId of createdUserIds) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.student.deleteMany({ where: { userId } });
      await prisma.faculty.deleteMany({ where: { userId } });
      await prisma.companyMentor.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    for (const companyId of createdCompanyIds) {
      await prisma.company.deleteMany({ where: { id: companyId } });
    }
    console.log('✅ Phase 4 test fixtures cleaned up successfully.');
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 PHASE 4 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4RegistrationTests().catch((err) => {
  console.error('Fatal Phase 4 test error:', err);
  process.exit(1);
});
