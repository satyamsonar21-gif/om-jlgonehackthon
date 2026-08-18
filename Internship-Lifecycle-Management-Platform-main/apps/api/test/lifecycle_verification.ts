import { PrismaClient } from '@prisma/client';
import { ApplicationsService } from '../src/modules/applications/applications.service';
import { ApplicationsController } from '../src/modules/applications/applications.controller';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

async function runLifecycleTests() {
  const prisma = new PrismaClient();
  const applicationsService = new ApplicationsService(
    prisma as any,
    { evaluate: () => ({ eligible: true, reasons: [] }) } as any
  );
  const applicationsController = new ApplicationsController(applicationsService);

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
  console.log('🔄 ILMP FULL APPLICATION LIFECYCLE & WORKFLOW TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up multi-stakeholder test entities...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-LC-${timestamp}`,
        name: 'GHRCE Test Campus',
        city: 'Nagpur',
        state: 'Maharashtra',
      },
    });

    // Student A & Student B
    const studentUserA: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_lc_stu_a_${timestamp}`,
        email: `stu.lc.a.${timestamp}@test.edu`,
        name: 'Aarav Patil',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-LC-A-${timestamp}`,
            department: 'Computer Science',
            year: 3,
            cgpa: 8.8,
            activeBacklogs: 0,
            skills: 'React, TypeScript, Node.js, Docker, PostgreSQL',
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    const studentUserB: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_lc_stu_b_${timestamp}`,
        email: `stu.lc.b.${timestamp}@test.edu`,
        name: 'Neha Sharma',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-LC-B-${timestamp}`,
            department: 'Computer Science',
            year: 3,
            cgpa: 8.2,
            activeBacklogs: 0,
            skills: 'React, Python, SQL',
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // Faculty Mentor
    const facultyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_lc_fac_${timestamp}`,
        email: `faculty.guide.${timestamp}@univ.edu`,
        name: 'Dr. Rajesh Kumar',
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
        faculty: {
          create: {
            facultyId: `FAC-LC-${timestamp}`,
            department: 'Computer Science',
            designation: 'Associate Professor',
            collegeId: college.id,
          },
        },
      },
      include: { faculty: true },
    });

    // Company A (Hiring Partner)
    const companyA = await (prisma.company as any).create({
      data: {
        name: `TechCorp Solutions ${timestamp}`,
        domain: 'Cloud Systems',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUserA: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_lc_comp_a_${timestamp}`,
        email: `mentor.a.${timestamp}@techcorp.com`,
        name: 'Siddharth Nambiar',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: companyA.id,
            designation: 'VP of Engineering',
          },
        },
      },
      include: { companyMentor: true },
    });

    // Company B (Competitor / Cross-Tenant)
    const companyB = await (prisma.company as any).create({
      data: {
        name: `Competitor Labs ${timestamp}`,
        domain: 'FinTech',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUserB: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_lc_comp_b_${timestamp}`,
        email: `mentor.b.${timestamp}@competitor.com`,
        name: 'Alex Mercer',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: companyB.id,
            designation: 'Tech Lead',
          },
        },
      },
      include: { companyMentor: true },
    });

    // Listing for Company A
    const listingA: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: companyA.id,
        title: `Full Stack Cloud Engineer ${timestamp}`,
        description: 'React & Node.js microservices developer',
        domain: 'Full Stack',
        status: 'PUBLISHED',
        stipend: 35000,
        minCgpa: 7.5,
        maxBacklogs: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
        deadline: new Date(Date.now() + 30 * 86400000),
      },
    });

    console.log('✅ Test stakeholders initialized.\n');

    // ─── STAGE 1: STUDENT APPLICATION SUBMISSION & DUPLICATE PREVENTION ───────
    console.log('🔹 Stage 1: Student Submission & Duplicate Gatekeeping');

    // 1.1: Successful Application
    const application = await applicationsService.create({
      studentId: studentUserA.student.id,
      listingId: listingA.id,
      coverLetter: 'Passionate full-stack developer with React & Docker experience.',
    });

    assert(Boolean(application && application.id), 'Student successfully submits application');
    assert(application.status === 'APPLIED', 'Initial application status set to APPLIED');

    // 1.2: Prevent Duplicate Application
    let duplicateBlocked = false;
    try {
      await applicationsService.create({
        studentId: studentUserA.student.id,
        listingId: listingA.id,
      });
    } catch (err: any) {
      if (err instanceof BadRequestException) duplicateBlocked = true;
    }
    assert(duplicateBlocked, 'Duplicate application submission rejected with 400 Bad Request');

    // ─── STAGE 2: FACULTY ACADEMIC REVIEW ─────────────────────────────────────
    console.log('\n🔹 Stage 2: Faculty Academic Review & Approval');

    // 2.1: Faculty rejects without reason (Blocked!)
    let facultyRejectBlockedWithoutReason = false;
    try {
      await applicationsService.updateStatus(application.id, {
        status: 'REJECTED',
        remarks: '',
        changedByRole: 'FACULTY_MENTOR',
      });
    } catch (err: any) {
      if (err instanceof BadRequestException) facultyRejectBlockedWithoutReason = true;
    }
    assert(facultyRejectBlockedWithoutReason, 'Faculty rejection without reason rejected with 400 Bad Request');

    // 2.2: Faculty Approves Academic Standing
    const facultyApproved = await applicationsService.updateStatus(application.id, {
      status: 'FACULTY_APPROVED',
      remarks: 'Student meets all academic eligibility criteria and NOC approved.',
      changedByRole: 'FACULTY_MENTOR',
      changedById: facultyUser.id,
    });
    assert(facultyApproved.status === 'FACULTY_APPROVED', 'Application transitioned to FACULTY_APPROVED');
    assert(Boolean(facultyApproved.facultyApprovedAt), 'facultyApprovedAt timestamp recorded');
    assert(
      facultyApproved.facultyRemarks.includes('academic eligibility'),
      'Faculty approval remarks recorded in application dossier'
    );

    // ─── STAGE 3: COMPANY SCREENING & DATA ISOLATION ──────────────────────────
    console.log('\n🔹 Stage 3: Corporate Screening, Interview & Cross-Tenant Isolation');

    // 3.1: Cross-Company Isolation: Company B attempts to evaluate Company A application (Blocked!)
    let crossCompanyReviewBlocked = false;
    try {
      await applicationsController.companyReview(
        application.id,
        { status: 'SHORTLISTED' },
        companyUserB,
      );
    } catch (err: any) {
      if (err instanceof ForbiddenException) crossCompanyReviewBlocked = true;
    }
    assert(
      crossCompanyReviewBlocked,
      'Cross-tenant isolation enforced: Company B blocked from evaluating Company A candidate with 403 Forbidden'
    );

    // 3.2: Company A shortlists candidate
    const shortlisted = await applicationsService.updateStatus(application.id, {
      status: 'SHORTLISTED',
      remarks: 'Top match on technical skills. Shortlisted for interview.',
      changedByRole: 'COMPANY_MENTOR',
      changedById: companyUserA.id,
    });
    assert(shortlisted.status === 'SHORTLISTED', 'Application transitioned to SHORTLISTED');
    assert(Boolean(shortlisted.shortlistedAt), 'shortlistedAt timestamp recorded');

    // 3.3: Company A moves candidate to Interview
    const interviewTime = new Date(Date.now() + 3 * 86400000).toISOString();
    const interviewed = await applicationsService.updateStatus(application.id, {
      status: 'INTERVIEW',
      interviewDate: interviewTime,
      remarks: 'Technical architecture round scheduled via Google Meet.',
      changedByRole: 'COMPANY_MENTOR',
      changedById: companyUserA.id,
    });
    assert(interviewed.status === 'INTERVIEW', 'Application transitioned to INTERVIEW');
    assert(Boolean(interviewed.interviewDate), 'Interview date recorded in application dossier');

    // ─── STAGE 4: SELECTION & BINDING CORPORATE OFFER ─────────────────────────
    console.log('\n🔹 Stage 4: Candidate Selection & Offer Issuance');

    const selected = await applicationsService.updateStatus(application.id, {
      status: 'SELECTED',
      stipend: 35000,
      designation: 'Full Stack Cloud Intern',
      remarks: 'Selected following technical interview.',
      changedByRole: 'COMPANY_MENTOR',
      changedById: companyUserA.id,
    });
    assert(selected.status === 'SELECTED', 'Application transitioned to SELECTED');
    assert(Boolean(selected.selectedAt), 'selectedAt timestamp recorded');
    assert(Boolean(selected.offerLetter), 'Binding OfferLetter record auto-generated');
    assert(selected.offerLetter?.stipend === 35000, 'Offer letter stipend matches specified amount (₹35,000)');

    // ─── STAGE 5: ACTIVE INTERNSHIP ONBOARDING & COMPLETION ───────────────────
    console.log('\n🔹 Stage 5: Active Internship Onboarding & Certification');

    // 5.1: Move to INTERNSHIP_ACTIVE
    const activeInternship = await applicationsService.updateStatus(application.id, {
      status: 'INTERNSHIP_ACTIVE',
      remarks: 'Student commenced day 1 of internship.',
      facultyMentorId: facultyUser.faculty.id,
      companyMentorId: companyUserA.companyMentor.id,
    });
    assert(activeInternship.status === 'INTERNSHIP_ACTIVE', 'Application transitioned to INTERNSHIP_ACTIVE');
    assert(Boolean(activeInternship.internship), 'Internship enrollment record auto-provisioned');

    // 5.2: Completion
    const completed = await applicationsService.updateStatus(application.id, {
      status: 'COMPLETED',
      remarks: 'Completed 16-week internship sprint and final presentation.',
    });
    assert(completed.status === 'COMPLETED', 'Application transitioned to COMPLETED');

    // ─── STAGE 6: MANDATORY REJECTION REASON VALIDATION ───────────────────────
    console.log('\n🔹 Stage 6: Rejection Validation on Second Candidate');

    const applicationB = await applicationsService.create({
      studentId: studentUserB.student.id,
      listingId: listingA.id,
      coverLetter: 'Application from student B.',
    });

    const rejectedB = await applicationsService.updateStatus(applicationB.id, {
      status: 'REJECTED',
      rejectionReason: 'Position filled following final candidate selection.',
      changedByRole: 'COMPANY_MENTOR',
      changedById: companyUserA.id,
    });

    assert(rejectedB.status === 'REJECTED', 'Second application moved to REJECTED');
    assert(
      rejectedB.rejectionReason === 'Position filled following final candidate selection.',
      'Mandatory rejection reason persisted in database'
    );
    assert(Boolean(rejectedB.rejectedAt), 'rejectedAt timestamp recorded');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up lifecycle test artifacts...');
    await (prisma.offerLetter as any).deleteMany({ where: { applicationId: { in: [application.id, applicationB.id] } } });
    await (prisma.internship as any).deleteMany({ where: { applicationId: application.id } });
    await (prisma.applicationStatusHistory as any).deleteMany({ where: { applicationId: { in: [application.id, applicationB.id] } } });
    await (prisma.application as any).deleteMany({ where: { id: { in: [application.id, applicationB.id] } } });
    await (prisma.internshipListing as any).deleteMany({ where: { companyId: companyA.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await (prisma.company as any).deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } });
    await (prisma.student as any).deleteMany({ where: { userId: { in: [studentUserA.id, studentUserB.id] } } });
    await (prisma.faculty as any).deleteMany({ where: { userId: facultyUser.id } });
    await (prisma.notification as any).deleteMany({ where: { userId: { in: [studentUserA.id, studentUserB.id, facultyUser.id, companyUserA.id] } } });
    await (prisma.auditLog as any).deleteMany({ where: { entityId: { in: [application.id, applicationB.id, listingA.id] } } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [studentUserA.id, studentUserB.id, facultyUser.id, companyUserA.id, companyUserB.id] } } });
    console.log('✅ Lifecycle test artifacts cleaned up.');

  } catch (error: any) {
    console.error('Fatal Lifecycle test error:', error);
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

runLifecycleTests();
