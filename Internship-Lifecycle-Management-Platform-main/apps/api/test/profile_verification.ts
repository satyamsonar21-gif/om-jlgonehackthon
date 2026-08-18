import { PrismaClient } from '@prisma/client';
import { StudentsService } from '../src/modules/students/students.service';
import { CompaniesService } from '../src/modules/companies/companies.service';
import { ListingsService } from '../src/modules/listings/listings.service';
import { ForbiddenException } from '@nestjs/common';

async function runProfileVerificationTests() {
  const prisma = new PrismaClient();
  const studentsService = new StudentsService(prisma as any);
  const companiesService = new CompaniesService(prisma as any);
  const listingsService = new ListingsService(prisma as any);

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
  console.log('👤 ILMP STUDENT PROFILE & COMPANY VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up test stakeholders...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-${timestamp}`,
        name: 'GHRCE Test Campus',
        city: 'Nagpur',
        state: 'Maharashtra',
      },
    });

    // 1. Student Test Record (initially bare-bones)
    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_prof_stu_${timestamp}`,
        email: `student.profile.${timestamp}@test.edu`,
        name: 'Kavya Verma',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-PRF-${timestamp}`,
            department: 'Computer Science',
            year: 3,
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // 2. Company Test Record (initially PENDING)
    const company = await (prisma.company as any).create({
      data: {
        name: `Acme Corp ${timestamp}`,
        domain: 'Distributed Systems',
        isVerified: false,
        verificationStatus: 'PENDING',
      },
    });

    const companyMentorUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_prof_comp_${timestamp}`,
        email: `lead.mentor.${timestamp}@acmecorp.com`,
        name: 'Rajesh Sharma',
        role: 'COMPANY_MENTOR',
        status: 'PENDING_APPROVAL',
        companyMentor: {
          create: {
            companyId: company.id,
            designation: 'Director of Engineering',
          },
        },
      },
      include: { companyMentor: true },
    });

    console.log('✅ Test stakeholders initialized.\n');

    // ─── SUITE 1: DYNAMIC PROFILE COMPLETION CALCULATOR ───────────────────────
    console.log('🔹 Test Suite 1: Dynamic Profile Completion Engine');

    // Test 1.1: Partial profile completion
    const partialUpdate = await studentsService.update(studentUser.student.id, {
      cgpa: 8.5,
      skills: 'React, Node.js, TypeScript',
    });

    assert(
      partialUpdate.profileCompletion > 0 && partialUpdate.profileCompletion < 100,
      `Calculates partial profile completion score dynamically (${partialUpdate.profileCompletion}%)`
    );
    assert(
      Array.isArray(partialUpdate.completionBreakdown?.completed) &&
      partialUpdate.completionBreakdown.completed.length > 0,
      'Returns breakdown of completed profile sections'
    );
    assert(
      Array.isArray(partialUpdate.completionBreakdown?.missing) &&
      partialUpdate.completionBreakdown.missing.length > 0,
      'Returns breakdown of missing profile recommendations'
    );

    // Test 1.2: 100% Comprehensive profile completion
    const fullProjects = [
      {
        id: '1',
        title: 'Microservices Mesh',
        description: 'Service mesh with distributed tracing',
        techStack: 'Go, gRPC, Docker',
        githubUrl: 'https://github.com/kavya/mesh',
      },
    ];

    const fullCertifications = [
      {
        id: '1',
        title: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2025-10-01',
      },
    ];

    const fullUpdate = await studentsService.update(studentUser.student.id, {
      name: 'Kavya Verma',
      phone: '+91 98765 01234',
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 9.1,
      passingYear: 2026,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      softSkills: ['Leadership', 'Communication', 'Problem Solving'],
      projects: fullProjects,
      certifications: fullCertifications,
      resumeUrl: 'https://storage.ilmp.edu/resumes/kavya_verma.pdf',
      githubUrl: 'https://github.com/kavya',
      linkedinUrl: 'https://linkedin.com/in/kavya',
      portfolioUrl: 'https://kavya.dev',
      preferredDomains: ['Full Stack', 'Cloud & DevOps'],
      preferredLocation: 'Pune / Remote',
      preferredDurationWeeks: 16,
    });

    assert(
      fullUpdate.profileCompletion === 100,
      `Full profile achieves 100% profile completion score (Actual: ${fullUpdate.profileCompletion}%)`
    );
    assert(
      fullUpdate.completionBreakdown?.missing.length === 0,
      'Zero missing recommendations on 100% completed profile'
    );
    assert(
      fullUpdate.user.phone === '+91 98765 01234',
      'User contact phone synchronized with root user record'
    );

    // ─── SUITE 2: COMPANY VERIFICATION LIFECYCLE ──────────────────────────────
    console.log('\n🔹 Test Suite 2: Corporate Accreditation & Verification Lifecycle');

    // Test 2.1: Initial State is PENDING and isVerified is false
    assert(company.verificationStatus === 'PENDING', 'Initial company status is PENDING');
    assert(company.isVerified === false, 'Initial isVerified flag is false');

    // Test 2.2: Move to UNDER_REVIEW
    const underReview = await companiesService.verifyCompany(company.id, {
      status: 'UNDER_REVIEW',
      remarks: 'T&P Cell conducting corporate MoU verification check.',
    });
    assert(underReview.verificationStatus === 'UNDER_REVIEW', 'Company successfully transitioned to UNDER_REVIEW');
    assert(underReview.isVerified === false, 'isVerified remains false while UNDER_REVIEW');

    // Test 2.3: Rejection requires a formal reason
    let rejectionBlockedWithoutReason = false;
    try {
      await companiesService.verifyCompany(company.id, {
        status: 'REJECTED',
        remarks: '', // Missing required reason
      });
    } catch (err: any) {
      if (err instanceof ForbiddenException) rejectionBlockedWithoutReason = true;
    }
    assert(
      rejectionBlockedWithoutReason,
      'Rejecting corporate registration without remarks is rejected with 403 Forbidden'
    );

    // Test 2.4: Formal Rejection with reason
    const rejected = await companiesService.verifyCompany(company.id, {
      status: 'REJECTED',
      remarks: 'Incomplete corporate GST and university MoU documentation.',
    });
    assert(rejected.verificationStatus === 'REJECTED', 'Company status updated to REJECTED');
    assert(rejected.isVerified === false, 'isVerified is false when REJECTED');

    // Test 2.5: Approval / Accreditation (VERIFIED)
    const verified = await companiesService.verifyCompany(company.id, {
      status: 'VERIFIED',
      remarks: 'Corporate MoU signed and approved by Dean T&P.',
      verifiedBy: 'Dean T&P Cell',
    });
    assert(verified.verificationStatus === 'VERIFIED', 'Company status updated to VERIFIED');
    assert(verified.isVerified === true, 'isVerified flag set to true upon approval');
    assert(Boolean(verified.verifiedAt), 'verifiedAt timestamp recorded upon accreditation');

    // Verify linked mentor account status activated
    const updatedMentor = await prisma.user.findUnique({ where: { id: companyMentorUser.id } });
    assert(
      updatedMentor?.status === 'ACTIVE',
      'Linked Company Mentor user status automatically activated upon company accreditation'
    );

    // Verify notification sent to mentor
    const mentorNotification = await prisma.notification.findFirst({
      where: { userId: companyMentorUser.id, role: 'COMPANY_MENTOR' },
      orderBy: { createdAt: 'desc' },
    });
    assert(
      Boolean(mentorNotification && mentorNotification.title.includes('VERIFIED')),
      'Corporate mentor receives official verification notification'
    );

    // Test 2.6: Suspension Workflow
    const suspended = await companiesService.verifyCompany(company.id, {
      status: 'SUSPENDED',
      remarks: 'MoU temporarily paused pending stipend compliance review.',
    });
    assert(suspended.verificationStatus === 'SUSPENDED', 'Company status updated to SUSPENDED');
    assert(suspended.isVerified === false, 'isVerified set to false when SUSPENDED');

    const suspendedMentor = await prisma.user.findUnique({ where: { id: companyMentorUser.id } });
    assert(
      suspendedMentor?.status === 'SUSPENDED',
      'Linked Company Mentor user account suspended when company is SUSPENDED'
    );

    // ─── SUITE 3: LISTING PUBLISHING GATEKEEPER ───────────────────────────────
    console.log('\n🔹 Test Suite 3: Verified Company Listing Enforcement');

    // Re-verify company for testing listing creation
    await companiesService.verifyCompany(company.id, {
      status: 'VERIFIED',
      remarks: 'Re-activated for test.',
    });

    const listing = await listingsService.create({
      companyId: company.id,
      title: `Full Stack Intern ${timestamp}`,
      description: 'Test verified internship',
      domain: 'Cloud',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 86400000),
      deadline: new Date(Date.now() + 30 * 86400000),
    });
    assert(Boolean(listing && listing.id), 'Verified corporate partner can successfully publish internship listing');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up test artifacts...');
    await (prisma.internshipListing as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.notification as any).deleteMany({ where: { userId: companyMentorUser.id } });
    await (prisma.auditLog as any).deleteMany({ where: { entityId: company.id } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [studentUser.id, companyMentorUser.id] } } });
    console.log('✅ Test artifacts cleaned up successfully.');

  } catch (error: any) {
    console.error('Fatal Profile test error:', error);
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

runProfileVerificationTests();
