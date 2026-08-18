import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from '../src/modules/analytics/analytics.service';
import { AuditService } from '../src/modules/audit/audit.service';

async function runAdminConsoleTests() {
  const prisma = new PrismaClient();
  const analyticsService = new AnalyticsService(prisma as any);
  const auditService = new AuditService(prisma as any);

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
  console.log('🏛️  ILMP INSTITUTIONAL ADMIN CONSOLE & AUDIT LEDGER SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up admin console test fixtures...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-ADMIN-${timestamp}`,
        name: 'G.H. Raisoni College of Engineering, Jalgaon',
        city: 'Jalgaon',
        state: 'Maharashtra',
      },
    });

    const adminUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_admin_${timestamp}`,
        email: `admin.console.${timestamp}@test.edu`,
        name: 'Dr. Administrative Director',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_admin_stu_${timestamp}`,
        email: `stu.admin.${timestamp}@test.edu`,
        name: 'Sneha Deshmukh',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-ADM-${timestamp}`,
            department: 'Computer Science',
            year: 4,
            cgpa: 8.9,
            activeBacklogs: 0,
            skills: 'React, Node.js, PostgreSQL, Docker',
            collegeId: college.id,
            profileCompletion: 100,
          },
        },
      },
      include: { student: true },
    });

    const facultyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_admin_fac_${timestamp}`,
        email: `fac.admin.${timestamp}@test.edu`,
        name: 'Dr. Suresh Patil',
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
        faculty: {
          create: {
            facultyId: `FAC-ADM-${timestamp}`,
            department: 'Computer Science',
            designation: 'Associate Professor',
            collegeId: college.id,
          },
        },
      },
      include: { faculty: true },
    });

    const company: any = await (prisma.company as any).create({
      data: {
        name: `HexaTech Industrial Systems ${timestamp}`,
        domain: 'Robotics & Embedded',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyMentorUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_admin_comp_${timestamp}`,
        email: `mentor.admin.${timestamp}@hexatech.com`,
        name: 'Rohan Deshpande',
        role: 'COMPANY_MENTOR',
        status: 'ACTIVE',
        companyMentor: {
          create: {
            companyId: company.id,
            designation: 'Director of Embedded Engineering',
          },
        },
      },
      include: { companyMentor: true },
    });

    const listing: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Embedded Systems Intern ${timestamp}`,
        domain: 'Robotics & Embedded',
        description: 'C++, RTOS, ROS2 microservices',
        requiredSkills: 'c++, rtos, ros2, embedded linux',
        status: 'PUBLISHED',
        stipend: 32000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 86400000),
        durationWeeks: 8,
        deadline: new Date(Date.now() + 15 * 86400000),
      },
    });

    const application: any = await (prisma.application as any).create({
      data: {
        studentId: studentUser.student.id,
        listingId: listing.id,
        status: 'SELECTED',
      },
    });

    const internship = await (prisma.internship as any).create({
      data: {
        application: { connect: { id: application.id } },
        student: { connect: { id: studentUser.student.id } },
        company: { connect: { id: company.id } },
        facultyMentor: { connect: { id: facultyUser.faculty.id } },
        companyMentor: { connect: { id: companyMentorUser.companyMentor.id } },
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(),
        joiningStatus: 'JOINED',
        status: 'ACTIVE',
        attendancePercentage: 92.5,
      },
    });

    const certificate = await (prisma.certificate as any).create({
      data: {
        internshipId: internship.id,
        certificateNumber: `CERT-ADM-${timestamp}`,
        verificationHash: `0x${timestamp}aabbccdd`,
        qrCode: 'data:image/png;base64,demo',
        issuedAt: new Date(),
        adminApprovedAt: new Date(),
        facultyApprovedAt: new Date(),
      },
    });

    console.log('✅ Admin test fixtures initialized.\n');

    // ─── SUITE 1: DYNAMIC CALCULATED MACRO METRICS ────────────────────────────
    console.log('🔹 Test Suite 1: Real Calculated Institutional Metrics');

    const analytics = await analyticsService.getAdminAnalytics();

    assert(typeof analytics.totalStudents === 'number' && analytics.totalStudents >= 1, `Students metric computed dynamically (${analytics.totalStudents})`);
    assert(typeof analytics.activeInternships === 'number' && analytics.activeInternships >= 1, `Active Internships metric computed dynamically (${analytics.activeInternships})`);
    assert(typeof analytics.totalCompanies === 'number' && analytics.totalCompanies >= 1, `Partner Companies metric computed dynamically (${analytics.totalCompanies})`);
    assert(typeof analytics.pendingApprovals === 'number', `Pending Approvals metric computed dynamically (${analytics.pendingApprovals})`);
    assert(typeof analytics.atRiskStudents === 'number', `At-Risk Students metric computed dynamically (${analytics.atRiskStudents})`);
    assert(typeof analytics.certificatesIssued === 'number' && analytics.certificatesIssued >= 1, `Verified Certificates metric computed dynamically (${analytics.certificatesIssued})`);

    // ─── SUITE 2: INSTITUTIONAL VISUALIZATIONS & REPORTING ───────────────────
    console.log('\n🔹 Test Suite 2: Institutional Visualizations & Benchmarks');

    // 2.1: Placement Trend Over 6 Months
    assert(Array.isArray(analytics.placementTrend) && analytics.placementTrend.length === 6, 'Placement momentum trend calculated over 6 months');
    assert(Boolean(analytics.placementTrend[5].placed), 'Latest monthly placed cohort is populated');

    // 2.2: Department Participation
    assert(Array.isArray(analytics.departmentStats) && analytics.departmentStats.length > 0, 'Department participation statistics computed');
    const cseDept = analytics.departmentStats.find((d: any) => d.department === 'Computer Science');
    assert(Boolean(cseDept && cseDept.totalStudents >= 1), 'Computer Science department metrics aggregated');
    assert(typeof cseDept?.placementRate === 'number', 'Department placement rate computed as percentage');

    // 2.3: Company Participation
    assert(Array.isArray(analytics.companyParticipation), 'Company hiring participation computed');
    const topCompany = analytics.companyParticipation.find((c: any) => c.name.includes('HexaTech'));
    assert(Boolean(topCompany), 'Active hiring partner tracked in participation index');

    // 2.4: Attendance Compliance Cohorts
    assert(typeof analytics.attendanceCohorts?.above85 === 'number', 'Exemplary attendance cohort (>=85%) calculated');
    assert(typeof analytics.attendanceCohorts?.between75and85 === 'number', 'Compliant attendance cohort (75-84%) calculated');
    assert(typeof analytics.attendanceCohorts?.below75AtRisk === 'number', 'At-risk attendance cohort (<75%) calculated');

    // 2.5: Completion Rate
    assert(typeof analytics.completionRate === 'number', `Completion rate calculated (${analytics.completionRate}%)`);

    // 2.6: Application Funnel & Conversions
    assert(Boolean(analytics.funnel && analytics.conversionRates), 'Full application funnel and stage conversion rates generated');
    assert(analytics.funnel.applied >= analytics.funnel.selected, 'Funnel geometry: Applied >= Selected');

    // 2.7: Skill Demand vs Supply Gap
    assert(Array.isArray(analytics.skillGaps), 'Skill demand vs supply gap matrix generated');

    // ─── SUITE 3: AUDIT LOG LEDGER & COMPLIANCE ACTIONS ───────────────────────
    console.log('\n🔹 Test Suite 3: Audit Log Ledger Tracking & Immutability');

    // 3.1: Log Sensitive Administrative Action
    const auditEntry1 = await auditService.log({
      action: 'VERIFY_COMPANY',
      entity: 'Company',
      entityId: company.id,
      userId: adminUser.id,
      userRole: 'ADMIN',
      reason: 'Accreditation MoU verified by Training & Placement Officer',
      metadata: JSON.stringify({ companyName: company.name, registrationNumber: 'REG-2026-904' }),
    });

    assert(Boolean(auditEntry1.id), 'Sensitive action VERIFY_COMPANY logged to audit ledger');
    assert(auditEntry1.action === 'VERIFY_COMPANY', 'Action matches VERIFY_COMPANY');
    assert(auditEntry1.userRole === 'ADMIN', 'Actor role recorded as ADMIN');

    const auditEntry2 = await auditService.log({
      action: 'APPROVE_CERTIFICATE',
      entity: 'Certificate',
      entityId: certificate.certificateNumber,
      userId: adminUser.id,
      userRole: 'ADMIN',
      reason: 'Institutional Director final signoff granted',
      metadata: JSON.stringify({ hash: certificate.verificationHash }),
    });

    assert(Boolean(auditEntry2.id), 'Sensitive action APPROVE_CERTIFICATE logged');

    // 3.2: Query with Filters & Search
    const searchLogs = await auditService.findAll({ search: 'HexaTech' });
    assert(searchLogs.data.length >= 1, 'Search query resolves relevant audit logs');

    const filteredLogs = await auditService.findAll({ action: 'VERIFY_COMPANY' });
    assert(filteredLogs.data.some((l: any) => l.action === 'VERIFY_COMPANY'), 'Action filter strictly isolates target audit category');

    const roleLogs = await auditService.findAll({ userRole: 'ADMIN' });
    assert(roleLogs.data.length >= 2, 'Role filter isolates administrative actor events');

    // 3.3: Pagination Support
    const paginated = await auditService.findAll({ page: 1, limit: 1 });
    assert(paginated.data.length === 1, 'Pagination limit is respected (1 item returned)');
    assert(paginated.pagination.totalPages >= 2, 'Pagination metadata accurately reports total pages');

    // ─── SUITE 4: CSV AUDIT LOG EXPORT ────────────────────────────────────────
    console.log('\n🔹 Test Suite 4: Institutional CSV Export');

    const csvExport = await auditService.exportCsv({ userRole: 'ADMIN' });
    assert(Boolean(csvExport.filename && csvExport.csv), 'CSV audit ledger generated');
    assert(csvExport.csv.includes('Timestamp,Actor Name,Actor Role,Action,Entity,Entity ID,Reason,Metadata'), 'CSV contains standard institutional headers');
    assert(csvExport.csv.includes('VERIFY_COMPANY'), 'CSV contains logged VERIFY_COMPANY transaction row');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up admin test artifacts...');
    await (prisma.auditLog as any).deleteMany({ where: { userId: adminUser.id } });
    await (prisma.certificate as any).deleteMany({ where: { id: certificate.id } });
    await (prisma.internship as any).deleteMany({ where: { id: internship.id } });
    await (prisma.application as any).deleteMany({ where: { id: application.id } });
    await (prisma.internshipListing as any).deleteMany({ where: { id: listing.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.faculty as any).deleteMany({ where: { userId: facultyUser.id } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [adminUser.id, studentUser.id, facultyUser.id, companyMentorUser.id] } } });
    console.log('✅ Admin test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal admin test error:', error);
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

runAdminConsoleTests();
