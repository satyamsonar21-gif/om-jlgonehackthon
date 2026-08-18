import { PrismaClient } from '@prisma/client';
import { FeedbackService } from '../src/modules/feedback/feedback.service';
import { StudentsService } from '../src/modules/students/students.service';
import { CertificatesService } from '../src/modules/certificates/certificates.service';
import { BadRequestException } from '@nestjs/common';

async function runEvaluationAndCertificateTests() {
  const prisma = new PrismaClient();
  const feedbackService = new FeedbackService(prisma as any);
  const studentsService = new StudentsService(prisma as any);
  const certificatesService = new CertificatesService(prisma as any);

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
  console.log('🎓  ILMP EVALUATION, READINESS & CERTIFICATE TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up test fixtures...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-CERT-${timestamp}`,
        name: 'G.H. Raisoni College of Engineering, Jalgaon',
        city: 'Jalgaon',
        state: 'Maharashtra',
      },
    });

    // Student with Skills, Projects, and Resume
    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_cert_stu_${timestamp}`,
        email: `stu.cert.${timestamp}@test.edu`,
        name: 'Aarav Patil',
        phone: '+91 9876543210',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-CERT-${timestamp}`,
            department: 'Computer Science',
            year: 4,
            cgpa: 8.9,
            activeBacklogs: 0,
            skills: 'React, TypeScript, Node.js, PostgreSQL, Docker, Redis',
            softSkills: 'Technical Writing, Scrum Agile, Code Reviews',
            githubUrl: 'https://github.com/aaravpatil',
            linkedinUrl: 'https://linkedin.com/in/aaravpatil',
            resumeUrl: 'https://storage.ilmp.edu/resumes/aarav_patil.pdf',
            projects: JSON.stringify([
              { title: 'Distributed Cache System', tech: 'Redis, Go' },
              { title: 'ILMP Management Platform', tech: 'React, NestJS' },
            ]),
            profileCompletion: 100,
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // Faculty Mentor
    const facultyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_cert_fac_${timestamp}`,
        email: `fac.cert.${timestamp}@test.edu`,
        name: 'Dr. Rajesh Kumar',
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
        faculty: {
          create: {
            facultyId: `FAC-CERT-${timestamp}`,
            department: 'Computer Science',
            designation: 'Associate Professor',
            collegeId: college.id,
          },
        },
      },
      include: { faculty: true },
    });

    // Company & Mentor
    const company = await (prisma.company as any).create({
      data: {
        name: `TechNova Solutions Pvt Ltd ${timestamp}`,
        domain: 'Full Stack Engineering',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_cert_comp_${timestamp}`,
        email: `mentor.cert.${timestamp}@technova.com`,
        name: 'Siddharth Nambiar',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: company.id,
            designation: 'VP of Engineering',
          },
        },
      },
      include: { companyMentor: true },
    });

    // Listing & Application
    const listing: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: 'Full Stack Developer Intern',
        domain: 'Full Stack Engineering',
        description: 'React, TypeScript and microservices',
        status: 'PUBLISHED',
        stipend: 35000,
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(),
        durationWeeks: 8,
        deadline: new Date(),
      },
    });

    const application: any = await (prisma.application as any).create({
      data: {
        studentId: studentUser.student.id,
        listingId: listing.id,
        status: 'INTERNSHIP_ACTIVE',
      },
    });

    // Active Internship
    const internship = await (prisma.internship as any).create({
      data: {
        applicationId: application.id,
        studentId: studentUser.student.id,
        companyId: company.id,
        facultyMentorId: facultyUser.faculty.id,
        companyMentorId: companyUser.companyMentor.id,
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(),
        actualJoiningDate: new Date(Date.now() - 60 * 86400000),
        joiningStatus: 'JOINED',
        status: 'ACTIVE',
        attendancePercentage: 95.0,
      },
    });

    // Weekly reports approved
    await (prisma.weeklyReport as any).create({
      data: {
        internshipId: internship.id,
        weekNumber: 1,
        summary: 'OAuth2 implementation',
        keyLearnings: 'PKCE flows',
        nextWeekGoals: 'Testing',
        status: 'APPROVED',
      },
    });

    console.log('✅ Test fixtures initialized.\n');

    // ─── SUITE 1: MID-TERM & FINAL EVALUATION SCORES ─────────────────────────
    console.log('🔹 Test Suite 1: Mid-Term & Final Evaluations with Calculated Scores');

    // 1.1: Mid-Term Evaluation
    const midTermRes = await feedbackService.create({
      internshipId: internship.id,
      type: 'MID_TERM',
      technicalSkills: 5,
      communication: 4,
      teamwork: 5,
      problemSolving: 5,
      punctuality: 4,
      initiative: 5,
      professionalism: 5,
      comments: 'Strong mid-term performance on microservice authentication.',
    });

    assert(Boolean(midTermRes.feedback), 'Mid-Term evaluation created');
    assert(midTermRes.scores.technical === 5, 'Technical score accurately recorded (5/5)');
    assert(midTermRes.scores.communication === 4, 'Communication score accurately recorded (4/5)');
    assert(midTermRes.scores.teamwork === 5, 'Teamwork score accurately recorded (5/5)');
    assert(midTermRes.scores.professionalism === 5, 'Professionalism score accurately recorded (5/5)');
    assert(
      midTermRes.scores.overallScore === 4.7,
      `Calculated overall score matches exact mathematical average: ${midTermRes.scores.overallScore}/5.0`
    );

    // 1.2: Final Evaluation
    const finalRes = await feedbackService.create({
      internshipId: internship.id,
      type: 'FINAL',
      technicalSkills: 5,
      communication: 5,
      teamwork: 5,
      problemSolving: 5,
      punctuality: 5,
      initiative: 5,
      professionalism: 5,
      comments: 'Exceptional final contribution. Exemplary engineer recommended for full-time offer.',
    });

    assert(Boolean(finalRes.feedback), 'Final evaluation created');
    assert(finalRes.scores.overallScore === 5.0, 'Final overall calculated score is 5.0/5.0');
    assert(finalRes.scores.percentageScore === 100, 'Final percentage score is 100%');

    // ─── SUITE 2: EXPLAINABLE PLACEMENT READINESS ENGINE ─────────────────────
    console.log('\n🔹 Test Suite 2: Explainable Placement Readiness Engine');

    const readiness = await studentsService.getPlacementReadiness(studentUser.student.id);

    assert(Boolean(readiness && readiness.score), 'Placement readiness score calculated');
    assert(readiness.score >= 85, `Placement score in Tier-1 bracket (${readiness.score}/100)`);
    assert(readiness.tier === 'TIER_1_READY', 'Readiness tier classified as TIER_1_READY');

    // Verify 5 dimensions
    assert(readiness.breakdown.technicalSkills.score === 25, 'Technical Skills: 25 / 25 pts (6 verified skills)');
    assert(readiness.breakdown.projects.score === 15, 'Projects & Portfolio: 15 / 20 pts (2 projects + github)');
    assert(readiness.breakdown.internshipExperience.score === 25, 'Internship Experience: 25 / 25 pts (High attendance + 5.0 rating)');
    assert(readiness.breakdown.resumeAndProfile.score === 15, 'Resume & Profile: 15 / 15 pts (ATS resume + 100% profile)');
    assert(readiness.breakdown.communication.score === 15, 'Communication: 15 / 15 pts (5.0 mentor rating + soft skills)');
    assert(Array.isArray(readiness.recommendedActions), 'Dynamic recommended actions returned');

    // ─── SUITE 3: CERTIFICATE APPROVAL & ISSUANCE LIFECYCLE ──────────────────
    console.log('\n🔹 Test Suite 3: Certificate Sign-off & Cryptographic Issuance Flow');

    // 3.1: Faculty Approval
    const facultyApproval = await certificatesService.facultyApprove(internship.id, facultyUser.faculty.id);
    assert(
      Boolean(facultyApproval.certificate.facultyApprovedAt),
      'Faculty guide approval recorded on certificate'
    );

    // 3.2: Admin Final Signoff & Generation
    const certResult = await certificatesService.adminApproveAndIssue(internship.id, 'admin-id');
    const cert = certResult.certificate;

    assert(Boolean(cert && cert.certificateNumber), 'Unique certificate number generated');
    assert(cert.certificateNumber.startsWith('CERT-'), `Certificate number follows institutional schema (${cert.certificateNumber})`);
    assert(cert.verificationHash.startsWith('0x'), `Cryptographic SHA-256 verification hash generated (${cert.verificationHash.substring(0, 16)}...)`);
    assert(Boolean(cert.adminApprovedAt), 'Admin approval timestamp recorded');

    // Verify internship transitioned to COMPLETED
    const updatedInternship = await prisma.internship.findUnique({ where: { id: internship.id } });
    assert(updatedInternship?.status === 'COMPLETED', 'Internship status automatically transitioned to COMPLETED');

    // ─── SUITE 4: PUBLIC VERIFICATION & PRIVACY SAFEGUARDS ───────────────────
    console.log('\n🔹 Test Suite 4: Public Verification & Privacy Protection');

    // 4.1: Public Verify by Certificate Number
    const publicVerification = await certificatesService.verify(cert.certificateNumber);
    assert(publicVerification.valid === true, 'Certificate verified as authentic in public registry');
    assert(publicVerification.status === 'VERIFIED', 'Status returns VERIFIED');
    assert(publicVerification.studentName === 'Aarav Patil', 'Student full name displayed correctly');
    assert(publicVerification.companyName.includes('TechNova'), 'Host organization name displayed');
    assert(publicVerification.internshipTitle === 'Full Stack Developer Intern', 'Internship role title displayed');
    assert(publicVerification.duration === '8 Weeks', 'Duration displayed');

    // 4.2: PRIVACY CHECK: Ensure NO private student details are returned
    assert((publicVerification as any).email === undefined, 'Privacy Guard: Student email NOT exposed');
    assert((publicVerification as any).phone === undefined, 'Privacy Guard: Student phone number NOT exposed');
    assert((publicVerification as any).studentId === undefined, 'Privacy Guard: Student institutional roll number NOT exposed');
    assert((publicVerification as any).cgpa === undefined, 'Privacy Guard: Student CGPA NOT exposed');

    // 4.3: Verify Non-existent / Invalid Code
    const invalidVerification = await certificatesService.verify('INVALID-CERT-9999');
    assert(invalidVerification.valid === false, 'Invalid certificate identifier correctly rejected');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up test artifacts...');
    await (prisma.certificate as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.mentorFeedback as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.weeklyReport as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.internship as any).deleteMany({ where: { id: internship.id } });
    await (prisma.application as any).deleteMany({ where: { id: application.id } });
    await (prisma.internshipListing as any).deleteMany({ where: { id: listing.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.faculty as any).deleteMany({ where: { userId: facultyUser.id } });
    await (prisma.auditLog as any).deleteMany({ where: { entityId: cert.certificateNumber } });
    await (prisma.notification as any).deleteMany({ where: { userId: { in: [studentUser.id, facultyUser.id, companyUser.id] } } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [studentUser.id, facultyUser.id, companyUser.id] } } });
    console.log('✅ Evaluation and certificate test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal Evaluation/Certificate test error:', error);
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

runEvaluationAndCertificateTests();
