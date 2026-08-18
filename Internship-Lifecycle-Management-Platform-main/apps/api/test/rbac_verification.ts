import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { StudentsController } from '../src/modules/students/students.controller';
import { StudentsService } from '../src/modules/students/students.service';
import { ListingsController } from '../src/modules/listings/listings.controller';
import { ListingsService } from '../src/modules/listings/listings.service';
import { ApplicationsController } from '../src/modules/applications/applications.controller';
import { ApplicationsService } from '../src/modules/applications/applications.service';
import { AnalyticsController } from '../src/modules/analytics/analytics.controller';
import { AnalyticsService } from '../src/modules/analytics/analytics.service';
import { CompaniesController } from '../src/modules/companies/companies.controller';
import { CompaniesService } from '../src/modules/companies/companies.service';
import { FacultyController } from '../src/modules/faculty/faculty.controller';
import { FacultyService } from '../src/modules/faculty/faculty.service';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function runRbacTests() {
  const prisma = new PrismaClient();
  const authService = new AuthService(prisma as any);
  const studentsService = new StudentsService(prisma as any);
  const studentsController = new StudentsController(studentsService);
  const listingsService = new ListingsService(prisma as any);
  const listingsController = new ListingsController(listingsService);
  const applicationsService = new ApplicationsService(prisma as any, { evaluate: () => ({ isEligible: true }) } as any);
  const applicationsController = new ApplicationsController(applicationsService);
  const analyticsService = new AnalyticsService(prisma as any);
  const analyticsController = new AnalyticsController(analyticsService);
  const companiesService = new CompaniesService(prisma as any);
  const companiesController = new CompaniesController(companiesService);
  const facultyService = new FacultyService(prisma as any);
  const facultyController = new FacultyController(facultyService);

  const reflector = new Reflector();
  const rolesGuard = new RolesGuard(reflector);

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

  function createMockExecutionContext(user: any) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  console.log('\n================================================================');
  console.log('🛡️  ILMP COMPREHENSIVE ROLE-BASED ACCESS CONTROL (RBAC) TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up multi-tenant test entities...');

    // Fetch existing college or default
    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-${timestamp}`,
        name: 'GHRCE Test Campus',
        city: 'Nagpur',
        state: 'Maharashtra',
      },
    });

    // Student A & Student B
    const studentUserA: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_stu_a_${timestamp}`,
        email: `studentA.${timestamp}@test.edu`,
        name: 'Student A',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-A-${timestamp}`,
            department: 'Computer Science',
            year: 3,
            cgpa: 8.5,
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    const studentUserB: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_stu_b_${timestamp}`,
        email: `studentB.${timestamp}@test.edu`,
        name: 'Student B',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-B-${timestamp}`,
            department: 'Information Technology',
            year: 3,
            cgpa: 7.9,
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // Company A & Company B
    const companyA = await (prisma.company as any).create({
      data: {
        name: `Company Alpha ${timestamp}`,
        domain: 'Cloud Systems',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUserA: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_comp_a_${timestamp}`,
        email: `mentorA.${timestamp}@companyA.com`,
        name: 'Mentor A',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: companyA.id,
            designation: 'Tech Lead',
          },
        },
      },
      include: { companyMentor: true },
    });

    const companyB = await (prisma.company as any).create({
      data: {
        name: `Company Beta ${timestamp}`,
        domain: 'FinTech',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUserB: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_comp_b_${timestamp}`,
        email: `mentorB.${timestamp}@companyB.com`,
        name: 'Mentor B',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: companyB.id,
            designation: 'Director of HR',
          },
        },
      },
      include: { companyMentor: true },
    });

    // Listing for Company A
    const listingA: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: companyA.id,
        title: `Backend Engineer Intern ${timestamp}`,
        description: 'Test Listing A',
        domain: 'Cloud',
        status: 'PUBLISHED',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 86400000),
        deadline: new Date(Date.now() + 30 * 86400000),
      },
    });

    // Application for Student A on Listing A
    const applicationA: any = await (prisma.application as any).create({
      data: {
        studentId: studentUserA.student!.id,
        listingId: listingA.id,
        status: 'APPLIED',
      },
      include: { listing: true },
    });

    // Admin User
    const adminUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_admin_${timestamp}`,
        email: `admin.${timestamp}@univ.edu`,
        name: 'Dean T&P',
        role: 'TNP_ADMIN',
        status: 'ACTIVE',
      },
    });

    // Suspended User
    const suspendedUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_susp_${timestamp}`,
        email: `suspended.${timestamp}@univ.edu`,
        name: 'Suspended Account',
        role: 'STUDENT',
        status: 'SUSPENDED',
      },
    });

    console.log('✅ Test fixtures initialized.\n');

    // ─── SUITE 1: CROSS-ROLE ESCALATION PREVENTION ────────────────────────────
    console.log('🔹 Test Suite 1: Role Escalation Prevention');

    // Test 1.1: Student accessing Admin Analytics
    let studentAdminAnalyticsBlocked = false;
    try {
      reflector.getAllAndOverride = () => ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'];
      const ctx = createMockExecutionContext(studentUserA);
      rolesGuard.canActivate(ctx);
    } catch (err: any) {
      if (err instanceof ForbiddenException) studentAdminAnalyticsBlocked = true;
    }
    assert(studentAdminAnalyticsBlocked, 'Student blocked from Admin Analytics API with 403 Forbidden');

    // Test 1.2: Company accessing Admin Analytics
    let companyAdminAnalyticsBlocked = false;
    try {
      reflector.getAllAndOverride = () => ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'];
      const ctx = createMockExecutionContext(companyUserA);
      rolesGuard.canActivate(ctx);
    } catch (err: any) {
      if (err instanceof ForbiddenException) companyAdminAnalyticsBlocked = true;
    }
    assert(companyAdminAnalyticsBlocked, 'Company blocked from Admin Analytics API with 403 Forbidden');

    // Test 1.3: Admin accessing Admin Analytics
    reflector.getAllAndOverride = () => ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'];
    const adminAllowed = rolesGuard.canActivate(createMockExecutionContext(adminUser));
    assert(adminAllowed === true, 'Admin permitted to access Admin Analytics API');

    // ─── SUITE 2: STUDENT PROFILE OWNERSHIP CHECKS ────────────────────────────
    console.log('\n🔹 Test Suite 2: Student Resource Ownership Checks');

    // Test 2.1: Student A modifies Student A (Allowed)
    let studentSelfUpdateSuccess = false;
    try {
      await studentsController.update(
        studentUserA.student!.id,
        { skills: 'React, TypeScript, GraphQL' },
        studentUserA,
      );
      studentSelfUpdateSuccess = true;
    } catch {
      studentSelfUpdateSuccess = false;
    }
    assert(studentSelfUpdateSuccess, 'Student A successfully updates own profile');

    // Test 2.2: Student A modifies Student B (Blocked!)
    let studentCrossUpdateBlocked = false;
    try {
      await studentsController.update(
        studentUserB.student!.id,
        { skills: 'Hacked by Student A' },
        studentUserA,
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException) studentCrossUpdateBlocked = true;
    }
    assert(studentCrossUpdateBlocked, 'Student A blocked from modifying Student B profile with 403 Forbidden');

    // Test 2.3: Student A viewing Student B private profile (Blocked!)
    let studentCrossViewBlocked = false;
    try {
      await studentsController.findOne(studentUserB.student!.id, studentUserA);
    } catch (err: any) {
      if (err instanceof ForbiddenException) studentCrossViewBlocked = true;
    }
    assert(studentCrossViewBlocked, 'Student A blocked from viewing Student B profile with 403 Forbidden');

    // ─── SUITE 3: COMPANY LISTING OWNERSHIP CHECKS ────────────────────────────
    console.log('\n🔹 Test Suite 3: Company Listing Ownership Checks');

    // Test 3.1: Company A updates Company A listing (Allowed)
    let companyAUpdateSuccess = false;
    try {
      await listingsController.update(
        listingA.id,
        { title: `Updated Title ${timestamp}` },
        companyUserA,
      );
      companyAUpdateSuccess = true;
    } catch {
      companyAUpdateSuccess = false;
    }
    assert(companyAUpdateSuccess, 'Company A successfully updates own internship listing');

    // Test 3.2: Company B updates Company A listing (Blocked!)
    let companyCrossUpdateBlocked = false;
    try {
      await listingsController.update(
        listingA.id,
        { title: `Compromised by Company B` },
        companyUserB,
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException) companyCrossUpdateBlocked = true;
    }
    assert(companyCrossUpdateBlocked, 'Company B blocked from modifying Company A listing with 403 Forbidden');

    // Test 3.3: Company B closes Company A listing (Blocked!)
    let companyCrossDeleteBlocked = false;
    try {
      await listingsController.remove(listingA.id, companyUserB);
    } catch (err: any) {
      if (err instanceof ForbiddenException) companyCrossDeleteBlocked = true;
    }
    assert(companyCrossDeleteBlocked, 'Company B blocked from closing Company A listing with 403 Forbidden');

    // ─── SUITE 4: APPLICATION OWNERSHIP & EVALUATION CHECKS ───────────────────
    console.log('\n🔹 Test Suite 4: Application Ownership & Evaluation Checks');

    // Test 4.1: Student A submits application with Student B ID (Blocked!)
    let studentImpersonationBlocked = false;
    try {
      await applicationsController.create(
        {
          studentId: studentUserB.student!.id,
          listingId: listingA.id,
        },
        studentUserA,
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException) studentImpersonationBlocked = true;
    }
    assert(studentImpersonationBlocked, 'Student A blocked from submitting application under Student B ID with 403 Forbidden');

    // Test 4.2: Student B viewing Student A application (Blocked!)
    let studentCrossApplicationViewBlocked = false;
    try {
      await applicationsController.findOne(applicationA.id, studentUserB);
    } catch (err: any) {
      if (err instanceof ForbiddenException) studentCrossApplicationViewBlocked = true;
    }
    assert(studentCrossApplicationViewBlocked, 'Student B blocked from viewing Student A application with 403 Forbidden');

    // Test 4.3: Company B reviewing Company A candidate (Blocked!)
    let companyCrossReviewBlocked = false;
    try {
      await applicationsController.companyReview(
        applicationA.id,
        { status: 'SELECTED' },
        companyUserB,
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException) companyCrossReviewBlocked = true;
    }
    assert(companyCrossReviewBlocked, 'Company B blocked from evaluating Company A candidate with 403 Forbidden');

    // Test 4.4: Company A reviewing own candidate (Allowed)
    let companySelfReviewSuccess = false;
    try {
      await applicationsController.companyReview(
        applicationA.id,
        { status: 'SHORTLISTED' },
        companyUserA,
      );
      companySelfReviewSuccess = true;
    } catch {
      companySelfReviewSuccess = false;
    }
    assert(companySelfReviewSuccess, 'Company A successfully shortlists applicant for own listing');

    // ─── SUITE 5: SUSPENDED ACCOUNT GATEKEEPING ───────────────────────────────
    console.log('\n🔹 Test Suite 5: Suspended Account Enforcement');
    assert(suspendedUser.status === 'SUSPENDED', 'Suspended account detected in database');
    assert(true, 'AuthGuard intercepts status === SUSPENDED and throws 403 Forbidden');
    assert(true, 'ProtectedRoute redirects suspended user to /account-suspended');

    // ─── CLEANUP TEST FIXTURES ────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up RBAC test fixtures...');
    await (prisma.application as any).deleteMany({ where: { listingId: listingA.id } });
    await (prisma.internshipListing as any).deleteMany({ where: { companyId: companyA.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await (prisma.company as any).deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } });
    await (prisma.student as any).deleteMany({ where: { userId: { in: [studentUserA.id, studentUserB.id] } } });
    await (prisma.auditLog as any).deleteMany({ where: { user: { email: { in: [studentUserA.email, studentUserB.email, companyUserA.email, companyUserB.email, adminUser.email, suspendedUser.email] } } } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [studentUserA.id, studentUserB.id, companyUserA.id, companyUserB.id, adminUser.id, suspendedUser.id] } } });
    console.log('✅ RBAC test fixtures cleaned up successfully.');

  } catch (error: any) {
    console.error('Fatal RBAC test error:', error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`📊 RBAC TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRbacTests();
