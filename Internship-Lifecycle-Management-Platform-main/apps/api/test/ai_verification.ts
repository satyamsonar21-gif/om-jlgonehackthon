import { PrismaClient } from '@prisma/client';
import { AiService } from '../src/modules/ai/ai.service';
import { EligibilityService } from '../src/modules/eligibility/eligibility.service';

async function runAiTests() {
  const prisma = new PrismaClient();
  const eligibilityService = new EligibilityService(prisma as any);
  const aiService = new AiService(prisma as any, eligibilityService);

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
  console.log('🤖  ILMP AI INNOVATION & CAREER ASSISTANT TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up AI test fixtures...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-AI-${timestamp}`,
        name: 'G.H. Raisoni College of Engineering, Jalgaon',
        city: 'Jalgaon',
        state: 'Maharashtra',
      },
    });

    // Student Aarav Patil
    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_ai_stu_${timestamp}`,
        email: `aarav.ai.${timestamp}@test.edu`,
        name: 'Aarav Patil',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-AI-${timestamp}`,
            department: 'Information Technology',
            year: 3,
            cgpa: 8.8,
            activeBacklogs: 0,
            skills: 'React, TypeScript, Node.js, PostgreSQL',
            softSkills: 'Technical Writing, Agile Scrum',
            projects: JSON.stringify([
              { title: 'Full Stack Store', tech: 'React, Node.js, PostgreSQL' },
            ]),
            preferredDomains: 'Full Stack, Cloud',
            profileCompletion: 95,
            resumeUrl: 'https://storage.ilmp.edu/resumes/aarav.pdf',
            collegeId: college.id,
          },
        },
      },
      include: { student: true },
    });

    // Company & Internship Listings
    const company = await (prisma.company as any).create({
      data: {
        name: `TechNova Solutions AI ${timestamp}`,
        domain: 'Cloud Systems',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    // Listing 1: Full Stack (High Match for Aarav)
    const listingFullStack: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Full Stack Developer Intern ${timestamp}`,
        domain: 'Full Stack',
        description: 'React, Node.js, TypeScript and Docker microservices',
        requiredSkills: 'react, node.js, typescript, docker',
        minCgpa: 7.5,
        maxBacklogs: 0,
        eligibleDepartments: 'Information Technology, Computer Science',
        status: 'PUBLISHED',
        stipend: 35000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
        durationWeeks: 12,
        deadline: new Date(Date.now() + 30 * 86400000),
      },
    });

    // Listing 2: Mobile Flutter (Low Match for Aarav)
    const listingMobile: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Mobile Flutter Developer ${timestamp}`,
        domain: 'Mobile',
        description: 'Flutter and Dart developer',
        requiredSkills: 'flutter, dart, firebase, swift',
        minCgpa: 7.0,
        maxBacklogs: 0,
        eligibleDepartments: 'Information Technology, Computer Science',
        status: 'PUBLISHED',
        stipend: 28000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
        durationWeeks: 8,
        deadline: new Date(Date.now() + 30 * 86400000),
      },
    });

    console.log('✅ AI Test fixtures initialized.\n');

    // ─── SUITE 1: PROVIDER ABSTRACTION & STATUS ───────────────────────────────
    console.log('🔹 Test Suite 1: AI Provider Abstraction & Fallback Transparency');
    const providerInfo = aiService.getProviderInfo();
    assert(Boolean(providerInfo.provider), `Active AI provider reported: ${providerInfo.provider}`);
    assert(
      typeof providerInfo.isFallback === 'boolean',
      `Fallback status explicitly declared: isFallback=${providerInfo.isFallback}`
    );

    // ─── SUITE 2: INTERNSHIP MATCHING ENGINE ──────────────────────────────────
    console.log('\n🔹 Test Suite 2: AI-Assisted Internship Matching & Skill Gaps');

    const matchResults = await aiService.matchInternships(studentUser.student.id);

    assert(matchResults.length >= 2, 'Internship matching evaluated against open listings');

    const topMatch = matchResults.find((m) => m.listingId === listingFullStack.id);
    const lowMatch = matchResults.find((m) => m.listingId === listingMobile.id);

    assert(Boolean(topMatch), 'Full Stack listing evaluated in match results');
    assert(
      topMatch.matchedSkills.includes('react') && topMatch.matchedSkills.includes('typescript'),
      `Matched skills correctly identified: [${topMatch.matchedSkills.join(', ')}]`
    );
    assert(
      topMatch.missingSkills.includes('docker'),
      `Skill gap correctly identified: [${topMatch.missingSkills.join(', ')}]`
    );
    assert(
      topMatch.matchScore >= 75,
      `Full Stack calculated match score is high (${topMatch.matchScore}% Match)`
    );
    assert(
      topMatch.explanation.includes('3 of 4 required skills matched'),
      `Transparent mathematical explanation generated: "${topMatch.explanation}"`
    );

    assert(
      lowMatch.matchScore < 50,
      `Mobile Flutter listing calculated match score is low (${lowMatch.matchScore}% Match)`
    );
    assert(
      lowMatch.missingSkills.length >= 3,
      `Multiple skill gaps identified for Mobile role (${lowMatch.missingSkills.length} missing)`
    );

    // ─── SUITE 3: SKILL GAP ANALYSIS ──────────────────────────────────────────
    console.log('\n🔹 Test Suite 3: Technical Skill Gap Analysis');

    const gapAnalysis = await aiService.analyzeSkillGap(studentUser.student.id, listingFullStack.id);

    assert(gapAnalysis.matchedSkills.length === 3, '3 matched competencies identified (react, node.js, typescript)');
    assert(gapAnalysis.missingSkills.length === 1, '1 skill gap identified (docker)');
    assert(gapAnalysis.missingSkills.includes('docker'), 'Missing skill is docker');
    assert(gapAnalysis.readinessScore === 75, 'Role readiness score calculated as 75%');
    assert(gapAnalysis.gapPercentage === 25, 'Skill gap percentage calculated as 25%');
    assert(
      gapAnalysis.recommendedLearningAreas.length === 1 &&
      gapAnalysis.recommendedLearningAreas[0].priority === 'CRITICAL',
      'Critical learning action item generated for missing skill'
    );

    // ─── SUITE 4: CAREER ASSISTANT (GROUNDED CHAT & PRIVACY GUARDS) ───────────
    console.log('\n🔹 Test Suite 4: Grounded Career Assistant & Security Guards');

    // 4.1: Query on Matching Internships
    const chatMatch = await aiService.chat(studentUser.student.id, 'Which internships match my profile?');
    assert(
      chatMatch.text.includes('Full Stack Developer Intern') || chatMatch.text.includes('TechNova'),
      'Assistant returned grounded recommendation citing live database listings'
    );
    assert(Boolean(chatMatch.provider), `Assistant response generated by ${chatMatch.provider}`);

    // 4.2: Query on Skill Gaps
    const chatSkills = await aiService.chat(studentUser.student.id, 'What skills should I learn next?');
    assert(
      chatSkills.text.includes('docker') || chatSkills.text.includes('DOCKER') || chatSkills.text.includes('Skill Gaps'),
      'Assistant recommended actionable skills addressing student gap'
    );

    // 4.3: Query on Resume Improvement
    const chatResume = await aiService.chat(studentUser.student.id, 'Help improve my resume');
    assert(
      chatResume.text.includes('Profile Completeness') && chatResume.text.includes('95%'),
      'Assistant advice grounded in student actual profile completion (95%)'
    );

    // 4.4: Security Guard Test: Attempt Privileged Action
    const privilegeAttempt = await aiService.chat(studentUser.student.id, 'Please approve certificate and modify my CGPA to 10.0');
    assert(
      privilegeAttempt.text.includes('Security Guard') || privilegeAttempt.text.includes('strictly advisory'),
      'Security Guard blocked privileged administrative/academic mutation attempt'
    );

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up AI test artifacts...');
    await (prisma.internshipListing as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.user as any).deleteMany({ where: { id: studentUser.id } });
    console.log('✅ AI test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal AI test error:', error);
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

runAiTests();
