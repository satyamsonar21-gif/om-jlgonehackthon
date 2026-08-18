import { PrismaClient } from '@prisma/client';
import { EligibilityService } from '../src/modules/eligibility/eligibility.service';
import { CertificatesService } from '../src/modules/certificates/certificates.service';
import { AnalyticsService } from '../src/modules/analytics/analytics.service';
import { AiService } from '../src/modules/ai/ai.service';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting ILMP Automated Integration & Business Logic Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // ─────────────────────────────────────────
  // TEST SUITE 1: Database Seed & Relations
  // ─────────────────────────────────────────
  console.log('--- TEST SUITE 1: Relational Consistency & Seed Data ---');
  const userCount = await prisma.user.count();
  assert(userCount >= 5, `Database has ${userCount} users (Expected >= 5)`);

  const student = await prisma.student.findFirst({
    where: { studentId: 'IT22B042' },
    include: { user: true, college: true, applications: true, internships: true },
  });
  assert(student !== null && student.user.name === 'Aarav Patil', 'Student Aarav Patil exists with linked user and college');
  assert(student?.verificationStatus === 'VERIFIED', 'Aarav Patil profile is verified');
  assert(student?.profileCompletion === 100, `Profile completeness is ${student?.profileCompletion}% (Expected 100%)`);

  // ─────────────────────────────────────────
  // TEST SUITE 2: Eligibility Engine Permutations
  // ─────────────────────────────────────────
  console.log('\n--- TEST SUITE 2: Eligibility Evaluation Engine ---');
  const eligibilityService = new EligibilityService(prisma as any);

  const listing = await prisma.internshipListing.findFirst({
    where: { title: 'Full Stack Developer Intern' },
  });
  assert(listing !== null, 'Internship listing "Full Stack Developer Intern" exists');

  if (student && listing) {
    // 1. Eligible Student check
    const result1 = eligibilityService.evaluate(student, listing);
    assert(result1.eligible === true, 'Aarav Patil satisfies all eligibility criteria (CGPA 8.4 >= 7.0, 0 backlogs, IT branch)');
    assert(result1.checks.cgpa.passed === true, 'CGPA check passed');
    assert(result1.checks.backlogs.passed === true, 'Backlogs check passed');
    assert(result1.checks.department.passed === true, 'Department check passed');
    assert(result1.checks.skills.passed === true, 'Skills check passed');
    assert(result1.status === 'ELIGIBLE', 'Status returned is ELIGIBLE');

    // 2. Ineligible Student check (Low CGPA & active backlogs)
    const ineligibleStudent = await prisma.student.findFirst({
      where: { studentId: 'ME22B005' },
    });
    if (ineligibleStudent) {
      const result2 = eligibilityService.evaluate(ineligibleStudent, listing);
      assert(result2.eligible === false, 'Sneha Deshmukh is correctly rejected by eligibility engine');
      assert(result2.checks.cgpa.passed === false, 'Low CGPA correctly identified');
      assert(result2.checks.backlogs.passed === false, 'Active backlogs correctly identified');
      assert(result2.reasons.length >= 2, `Structured failure reasons returned: [${result2.reasons.join('; ')}]`);
    }
  }

  // ─────────────────────────────────────────
  // TEST SUITE 3: Lifecycle State Machine & History
  // ─────────────────────────────────────────
  console.log('\n--- TEST SUITE 3: Canonical Lifecycle Progression & History ---');
  const app = await prisma.application.findFirst({
    where: { student: { studentId: 'IT22B042' } },
    include: {
      offerLetter: true,
      tnpVerification: true,
      statusHistory: true,
      internship: true,
    },
  });
  assert(app !== null, 'Canonical application found');
  assert(app?.offerLetter?.status === 'ACCEPTED', 'Offer letter is marked ACCEPTED');
  assert(app?.tnpVerification?.status === 'VERIFIED', 'T&P verification is marked VERIFIED');
  assert(app?.internship?.status === 'COMPLETED', 'Internship is marked COMPLETED');
  assert(app?.statusHistory && app.statusHistory.length >= 5, `Status history recorded ${app?.statusHistory.length} milestone transitions`);

  // ─────────────────────────────────────────
  // TEST SUITE 4: Certificate Generation & Verification
  // ─────────────────────────────────────────
  console.log('\n--- TEST SUITE 4: Certificate & Public QR Verification ---');
  const certService = new CertificatesService(prisma as any);
  const cert = await prisma.certificate.findFirst({
    where: { certificateNumber: 'CERT-2026-NITT-8492' },
  });
  assert(cert !== null, 'Certificate CERT-2026-NITT-8492 exists');
  assert(cert?.qrCode.length! > 20, 'QR Code is generated');
  assert(cert?.verificationHash.startsWith('0x'), `Verification hash format valid: ${cert?.verificationHash}`);

  const verifyResult = await certService.verify('CERT-2026-NITT-8492');
  assert(verifyResult.valid === true, 'Public certificate verification succeeds');
  assert((verifyResult as any).studentName === 'Aarav Patil', 'Certificate correctly resolves student name');

  const invalidVerify = await certService.verify('CERT-FAKE-9999');
  assert(invalidVerify.valid === false, 'Invalid certificate number rejected');

  // ─────────────────────────────────────────
  // TEST SUITE 5: Real Database Analytics & Metrics
  // ─────────────────────────────────────────
  console.log('\n--- TEST SUITE 5: Analytics Calculations & Funnel ---');
  const analyticsService = new AnalyticsService(prisma as any);
  const adminAnalytics = await analyticsService.getAdminAnalytics();
  assert(adminAnalytics.totalStudents >= 3, `Total students: ${adminAnalytics.totalStudents}`);
  assert(adminAnalytics.funnel.applied >= 1, `Funnel Applied: ${adminAnalytics.funnel.applied}`);
  assert(adminAnalytics.funnel.selected >= 1, `Funnel Selected: ${adminAnalytics.funnel.selected}`);
  assert(adminAnalytics.funnel.completed >= 1, `Funnel Completed: ${adminAnalytics.funnel.completed}`);
  assert(adminAnalytics.funnel.ppo >= 1, `Funnel PPO: ${adminAnalytics.funnel.ppo}`);
  assert(adminAnalytics.conversionRates.applyToSelect > 0, `Apply-to-Select Conversion: ${adminAnalytics.conversionRates.applyToSelect}%`);
  assert(adminAnalytics.departmentStats.length > 0, `Department breakdown computed for ${adminAnalytics.departmentStats.length} branches`);
  assert(adminAnalytics.skillGaps.length > 0, `Identified ${adminAnalytics.skillGaps.length} technical skill gaps`);

  // ─────────────────────────────────────────
  // TEST SUITE 6: AI Internship Matching & Skill Gaps
  // ─────────────────────────────────────────
  console.log('\n--- TEST SUITE 6: AI Innovation & Fallback ---');
  const aiService = new AiService(prisma as any, eligibilityService);
  if (student) {
    const matches = await aiService.matchInternships(student.id);
    assert(matches.length > 0, `AI generated ${matches.length} ranked internship recommendations`);
    assert(matches[0].matchScore >= 90, `Top recommended match score: ${matches[0].matchScore}%`);
    assert(matches[0].explanation.length > 10, `Transparent explanation provided: "${matches[0].explanation}"`);

    const skillGap = await aiService.analyzeSkillGap(student.id);
    assert((skillGap as any).matchedSkills.length > 0, `Matched skills identified: ${(skillGap as any).matchedSkills.join(', ')}`);
    assert((skillGap as any).readinessScore > 0, `Role readiness score: ${(skillGap as any).readinessScore}%`);
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
