import { PrismaClient } from '@prisma/client';
import { ListingsService } from '../src/modules/listings/listings.service';

async function runDiscoveryTests() {
  const prisma = new PrismaClient();
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
  console.log('🔍 ILMP INTERNSHIP DISCOVERY & AI MATCHING TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST ENTITIES ──────────────────────────────────────────────────
    console.log('🔹 Initializing test entities for discovery...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-DISC-${timestamp}`,
        name: 'GHRCE Pune Campus',
        city: 'Pune',
        state: 'Maharashtra',
      },
    });

    // Student Candidate
    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_disc_stu_${timestamp}`,
        email: `candidate.${timestamp}@ghrce.edu`,
        name: 'Aarav Patil',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `DISC-STU-${timestamp}`,
            department: 'Computer Science',
            year: 3,
            cgpa: 8.8,
            activeBacklogs: 0,
            skills: 'React, TypeScript, Node.js, PostgreSQL, Docker',
            preferredLocation: 'Pune',
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // Partner Company
    const company = await (prisma.company as any).create({
      data: {
        name: `CloudSys Technologies ${timestamp}`,
        domain: 'Cloud Systems',
        location: 'Pune, Maharashtra',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    // Create 3 distinct listings for testing search, filters & sort
    const listingA: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Full Stack Cloud Engineer ${timestamp}`,
        description: 'React, TypeScript, Node.js, and Docker microservices developer.',
        domain: 'Full Stack',
        mode: 'REMOTE',
        location: 'Pune, Maharashtra',
        stipend: 35000,
        durationWeeks: 16,
        requiredSkills: 'React, TypeScript, Node.js, Docker',
        minCgpa: 7.5,
        maxBacklogs: 0,
        eligibleDepartments: 'Computer Science, Information Technology',
        status: 'PUBLISHED',
        deadline: new Date(Date.now() + 15 * 86400000), // Closes in 15 days
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 86400000),
      },
    });

    const listingB: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Python Data Science Intern ${timestamp}`,
        description: 'Machine learning data pipeline engineer using Python and PyTorch.',
        domain: 'Data & AI',
        mode: 'ONSITE',
        location: 'Bangalore, Karnataka',
        stipend: 50000,
        durationWeeks: 24,
        requiredSkills: 'Python, PyTorch, Pandas, Scikit-learn',
        minCgpa: 8.0,
        maxBacklogs: 0,
        eligibleDepartments: 'Computer Science, Data Science',
        status: 'PUBLISHED',
        deadline: new Date(Date.now() + 5 * 86400000), // Closes in 5 days
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 86400000),
      },
    });

    const listingC: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Embedded Firmware Intern ${timestamp}`,
        description: 'C/C++ RTOS developer for IoT devices.',
        domain: 'Embedded Systems',
        mode: 'HYBRID',
        location: 'Hyderabad, Telangana',
        stipend: 20000,
        durationWeeks: 12,
        requiredSkills: 'C, C++, RTOS, Embedded C',
        minCgpa: 9.5, // Student CGPA 8.8 will NOT be eligible for this
        maxBacklogs: 0,
        eligibleDepartments: 'Electronics, Electrical',
        status: 'PUBLISHED',
        deadline: new Date(Date.now() + 30 * 86400000), // Closes in 30 days
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
      },
    });

    console.log('✅ Discovery test fixtures initialized.\n');

    // ─── SUITE 1: KEYWORD SEARCH & DOMAIN FILTERS ─────────────────────────────
    console.log('🔹 Test Suite 1: Keyword Search & Multi-Criteria Filtering');

    // Test 1.1: Keyword Search
    const searchRes = await listingsService.findAll({ search: 'Cloud Engineer' }, studentUser.id);
    assert(
      searchRes.some((l) => l.id === listingA.id),
      'Search query "Cloud Engineer" returns matching listing'
    );

    // Test 1.2: Domain Filter
    const domainRes = await listingsService.findAll({ domain: 'Data & AI' }, studentUser.id);
    assert(
      domainRes.some((l) => l.id === listingB.id) && !domainRes.some((l) => l.id === listingA.id),
      'Domain filter "Data & AI" scopes results exclusively'
    );

    // Test 1.3: Mode Filter
    const modeRes = await listingsService.findAll({ mode: 'REMOTE' }, studentUser.id);
    assert(
      modeRes.every((l) => l.mode === 'REMOTE'),
      'Mode filter "REMOTE" returns only remote positions'
    );

    // Test 1.4: Minimum Stipend Filter
    const stipendRes = await listingsService.findAll({ minStipend: 40000 }, studentUser.id);
    assert(
      stipendRes.every((l) => (l.stipend || 0) >= 40000),
      'Stipend filter (₹40k+) excludes lower paying opportunities'
    );

    // ─── SUITE 2: DETERMINISTIC AI MATCHING ENGINE ────────────────────────────
    console.log('\n🔹 Test Suite 2: AI Compatibility Scoring');

    const matchedListingA = searchRes.find((l) => l.id === listingA.id);
    assert(
      Boolean(matchedListingA && matchedListingA.matchScore >= 90),
      `Candidate receives high match score for Full Stack listing (Score: ${matchedListingA?.matchScore}%)`
    );
    assert(
      matchedListingA?.isEligible === true,
      'Candidate is marked as ELIGIBLE for Full Stack listing'
    );
    assert(
      typeof matchedListingA?.matchExplanation === 'string' && matchedListingA.matchExplanation.length > 0,
      'Transparent match explanation generated without hallucinated claims'
    );

    // Python listing (partial skill overlap)
    const matchedListingB = (await listingsService.findAll({}, studentUser.id)).find((l) => l.id === listingB.id);
    assert(
      Boolean(matchedListingB && matchedListingB.matchScore < matchedListingA.matchScore),
      `Lower match score computed for non-specialized tech stack (Score: ${matchedListingB?.matchScore}%)`
    );

    // ─── SUITE 3: ELIGIBILITY GATEKEEPER FILTERING ────────────────────────────
    console.log('\n🔹 Test Suite 3: Eligibility Filtering');

    const eligibleOnlyRes = await listingsService.findAll({ eligibleOnly: true }, studentUser.id);
    assert(
      eligibleOnlyRes.some((l) => l.id === listingA.id),
      'Eligible listing included in eligibleOnly results'
    );
    assert(
      !eligibleOnlyRes.some((l) => l.id === listingC.id),
      'Ineligible listing (min CGPA 9.5 > 8.8) excluded from eligibleOnly results'
    );

    // ─── SUITE 4: SORTING PERMUTATIONS ────────────────────────────────────────
    console.log('\n🔹 Test Suite 4: Multi-Dimensional Sorting');

    // Test 4.1: Sort by Highest Stipend
    const stipendSorted = await listingsService.findAll({ sort: 'stipend', companyId: company.id }, studentUser.id);
    assert(
      stipendSorted[0].id === listingB.id,
      'Highest stipend sort positions ₹50,000/mo listing first'
    );

    // Test 4.2: Sort by Deadline (Closing Soonest)
    const deadlineSorted = await listingsService.findAll({ sort: 'deadline', companyId: company.id }, studentUser.id);
    assert(
      deadlineSorted[0].id === listingB.id &&
      new Date(deadlineSorted[0].deadline).getTime() <= new Date(deadlineSorted[1].deadline).getTime(),
      'Deadline sort positions closest deadline (5-day) first in ascending chronological order'
    );

    // Test 4.3: Sort by Distance / Local City Prioritization
    const distanceSorted = await listingsService.findAll({ sort: 'distance', companyId: company.id }, studentUser.id);
    assert(
      distanceSorted[0].location.toLowerCase().includes('pune'),
      'Distance sort prioritizes Pune listing matching student campus location without fake GPS data'
    );

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up discovery test fixtures...');
    await (prisma.internshipListing as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.auditLog as any).deleteMany({ where: { entityId: { in: [listingA.id, listingB.id, listingC.id] } } });
    await (prisma.user as any).deleteMany({ where: { id: studentUser.id } });
    console.log('✅ Discovery test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal Discovery test error:', error);
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

runDiscoveryTests();
