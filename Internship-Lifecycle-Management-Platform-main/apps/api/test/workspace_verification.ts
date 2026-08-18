import { PrismaClient } from '@prisma/client';
import { TasksService } from '../src/modules/tasks/tasks.service';
import { DailyLogsService } from '../src/modules/daily-logs/daily-logs.service';
import { AttendanceService } from '../src/modules/attendance/attendance.service';
import { WeeklyReportsService } from '../src/modules/weekly-reports/weekly-reports.service';
import { BadRequestException } from '@nestjs/common';

async function runWorkspaceTests() {
  const prisma = new PrismaClient();
  const tasksService = new TasksService(prisma as any);
  const dailyLogsService = new DailyLogsService(prisma as any);
  const attendanceService = new AttendanceService(prisma as any);
  const weeklyReportsService = new WeeklyReportsService(prisma as any);

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
  console.log('🛠️  ILMP INTERNSHIP EXECUTION WORKSPACE TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up execution test entities...');

    const college = await prisma.college.findFirst() || await (prisma.college as any).create({
      data: {
        code: `COL-WS-${timestamp}`,
        name: 'GHRCE Test Campus',
        city: 'Nagpur',
        state: 'Maharashtra',
      },
    });

    // Student
    const studentUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_ws_stu_${timestamp}`,
        email: `stu.ws.${timestamp}@test.edu`,
        name: 'Aarav Patil',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            studentId: `STU-WS-${timestamp}`,
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

    // Faculty Mentor
    const facultyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_ws_fac_${timestamp}`,
        email: `fac.ws.${timestamp}@test.edu`,
        name: 'Dr. Rajesh Kumar',
        role: 'FACULTY_MENTOR',
        status: 'ACTIVE',
        faculty: {
          create: {
            facultyId: `FAC-WS-${timestamp}`,
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
        name: `TechCorp Solutions ${timestamp}`,
        domain: 'Cloud Systems',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      },
    });

    const companyUser: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_ws_comp_${timestamp}`,
        email: `mentor.ws.${timestamp}@techcorp.com`,
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

    // Internship Listing & Application
    const listing: any = await (prisma.internshipListing as any).create({
      data: {
        companyId: company.id,
        title: `Full Stack Engineer ${timestamp}`,
        description: 'React & Node.js developer',
        domain: 'Full Stack',
        status: 'PUBLISHED',
        stipend: 35000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
        deadline: new Date(Date.now() + 30 * 86400000),
      },
    });

    const application: any = await (prisma.application as any).create({
      data: {
        studentId: studentUser.student.id,
        listingId: listing.id,
        status: 'INTERNSHIP_ACTIVE',
      },
    });

    // Active Internship Record
    const internship = await (prisma.internship as any).create({
      data: {
        applicationId: application.id,
        studentId: studentUser.student.id,
        companyId: company.id,
        facultyMentorId: facultyUser.faculty.id,
        companyMentorId: companyUser.companyMentor.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 86400000),
        actualJoiningDate: new Date(),
        joiningStatus: 'JOINED',
        status: 'ACTIVE',
        attendancePercentage: 100.0,
      },
    });

    console.log('✅ Test fixtures initialized.\n');

    // ─── SUITE 1: TASK MANAGEMENT ─────────────────────────────────────────────
    console.log('🔹 Test Suite 1: Task Management & Deliverables');

    // 1.1: Create Task with Priority, Deadline, Attachments
    const task = await tasksService.create({
      internshipId: internship.id,
      title: 'Implement Redis Session Cache Layer',
      description: 'Configure distributed redis cache with SHA-256 tokens.',
      priority: 'CRITICAL',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      assignedByName: 'Siddharth Nambiar',
      assignedByRole: 'COMPANY_MENTOR',
      attachments: 'https://github.com/org/repo/pull/104',
    });

    assert(Boolean(task && task.id), 'Sprint task created successfully');
    assert(task.status === 'TODO', 'Initial task status set to TODO');
    assert(task.priority === 'CRITICAL', 'Task priority recorded as CRITICAL');
    assert(Boolean(task.dueDate), 'Task deadline recorded');

    // 1.2: Status Progression
    const inProgressTask = await tasksService.update(task.id, { status: 'IN_PROGRESS' });
    assert(inProgressTask.status === 'IN_PROGRESS', 'Task transitioned to IN_PROGRESS');

    const submittedTask = await tasksService.update(task.id, { status: 'SUBMITTED' });
    assert(submittedTask.status === 'SUBMITTED', 'Task transitioned to SUBMITTED');

    // 1.3: Add Comments Thread
    const commentedTask = await tasksService.update(task.id, {
      newComment: 'Unit test suite passing with 96% coverage.',
      authorName: 'Aarav Patil',
      authorRole: 'STUDENT',
    });
    const commentsList = JSON.parse(commentedTask.comments || '[]');
    assert(
      commentsList.length === 1 && commentsList[0].message.includes('96% coverage'),
      'Discussion comment appended to task thread'
    );

    // 1.4: Complete Task
    const completedTask = await tasksService.update(task.id, { status: 'COMPLETED' });
    assert(completedTask.status === 'COMPLETED', 'Task transitioned to COMPLETED');

    // ─── SUITE 2: DAILY LOGS & DUPLICATE PREVENTION ───────────────────────────
    console.log('\n🔹 Test Suite 2: Daily Work Activity Logs & Duplicate Prevention');

    const todayStr = new Date().toISOString().split('T')[0];

    // 2.1: Submit Daily Log
    const dailyLog = await dailyLogsService.create({
      internshipId: internship.id,
      date: todayStr,
      hoursWorked: 8.5,
      tasksCompleted: 'Configured Redis cluster and authored auth middleware tests.',
      whatILearned: 'Learned token revocation patterns using Redis key expiry TTL.',
      challengesFaced: 'Encountered race conditions during multi-instance cache invalidation.',
      plansForTomorrow: 'Optimize PostgreSQL connection pooling with pgbouncer.',
      attachments: 'https://github.com/org/repo/pull/120',
      status: 'SUBMITTED',
    });

    assert(Boolean(dailyLog && dailyLog.id), 'Daily work log submitted successfully');
    assert(dailyLog.hoursWorked === 8.5, 'Hours worked recorded accurately (8.5 hrs)');
    assert(Boolean(dailyLog.whatILearned), 'Learning outcomes recorded');
    assert(Boolean(dailyLog.challengesFaced), 'Roadblocks & challenges recorded');

    // 2.2: Prevent Duplicate Daily Log for same student/date
    let duplicateBlocked = false;
    try {
      await dailyLogsService.create({
        internshipId: internship.id,
        date: todayStr,
        hoursWorked: 8.0,
        tasksCompleted: 'Duplicate submission attempt',
      });
    } catch (err: any) {
      if (err instanceof BadRequestException) duplicateBlocked = true;
    }
    assert(duplicateBlocked, 'Duplicate daily log for same date rejected with 400 Bad Request');

    // 2.3: Mentor Review Daily Log
    const reviewedLog = await dailyLogsService.review(dailyLog.id, {
      status: 'REVIEWED',
      reviewNotes: 'Excellent documentation and clean implementation.',
      mentorId: companyUser.companyMentor.id,
    });
    assert(reviewedLog.status === 'REVIEWED', 'Daily log marked as REVIEWED');
    assert(Boolean(reviewedLog.reviewNotes), 'Mentor review notes persisted');

    // ─── SUITE 3: ATTENDANCE & AUTOMATED RISK FLAGGING ────────────────────────
    console.log('\n🔹 Test Suite 3: Attendance Tracking & Automated Compliance Flagging');

    // Record attendance punches
    const d1 = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    const d2 = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const d3 = new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0];

    await attendanceService.mark({ internshipId: internship.id, date: d1, status: 'PRESENT' });
    await attendanceService.mark({ internshipId: internship.id, date: d2, status: 'PRESENT' });
    await attendanceService.mark({ internshipId: internship.id, date: d3, status: 'HALF_DAY' });

    // 3.1: Verify Attendance Statistics
    const attStats = await attendanceService.getStats(internship.id);
    assert(attStats.total === 3, 'Total 3 attendance days recorded');
    assert(attStats.present === 2, '2 full days present');
    assert(attStats.halfDay === 1, '1 half day recorded (0.5x weight)');
    assert(
      Math.abs(attStats.percentage - 83.3) < 0.5,
      `Calculated attendance percentage matches formula: ${attStats.percentage}%`
    );

    // 3.2: Batch Attendance Overview & Configurable Threshold
    const batchOverview = await attendanceService.getBatchAttendance(facultyUser.faculty.id, 75.0);
    const studentRecord = batchOverview.find((s) => s.internshipId === internship.id);
    assert(Boolean(studentRecord), 'Student present in faculty batch attendance overview');
    assert(studentRecord?.isFlagged === false, 'Student with 83.3% attendance NOT flagged (Threshold: 75.0%)');

    // High threshold test (90% threshold)
    const strictBatchOverview = await attendanceService.getBatchAttendance(facultyUser.faculty.id, 90.0);
    const strictRecord = strictBatchOverview.find((s) => s.internshipId === internship.id);
    assert(
      strictRecord?.isFlagged === true,
      'Student with 83.3% attendance automatically flagged when threshold raised to 90.0%'
    );

    // ─── SUITE 4: WEEKLY SYNTHESIS REPORT LIFECYCLE ───────────────────────────
    console.log('\n🔹 Test Suite 4: Weekly Report Lifecycle & Revision Workflow');

    // 4.1: Save Draft
    const draftReport = await weeklyReportsService.create({
      internshipId: internship.id,
      weekNumber: 1,
      summary: 'Drafting week 1 architecture milestones.',
      keyLearnings: 'FastAPI vs NestJS comparative latency.',
      nextWeekGoals: 'Finalize schema designs.',
      isDraft: true,
    });
    assert(draftReport.status === 'DRAFT', 'Weekly report saved as DRAFT');

    // 4.2: Submit Report for Faculty Review
    const submittedReport = await weeklyReportsService.create({
      internshipId: internship.id,
      weekNumber: 1,
      summary: 'Completed OAuth2 PKCE security module and benchmarked Redis session storage.',
      keyLearnings: 'Cryptographic challenge verification algorithms and Redis caching patterns.',
      issuesFaced: 'Initial CORS policy restrictions during local multi-tenant testing.',
      nextWeekGoals: 'Author integration test suite and load test DB pools.',
      hoursWorked: 40,
      fileUrl: 'https://storage.ilmp.edu/reports/week_01_report.pdf',
      status: 'SUBMITTED',
    });
    assert(submittedReport.status === 'SUBMITTED', 'Weekly report submitted for Faculty Review');

    // 4.3: Faculty Requests Revisions without Comments (Blocked!)
    let revisionBlockedWithoutComments = false;
    try {
      await weeklyReportsService.review(submittedReport.id, {
        status: 'REVISION_REQUESTED',
        comments: '',
      });
    } catch (err: any) {
      if (err instanceof BadRequestException) revisionBlockedWithoutComments = true;
    }
    assert(
      revisionBlockedWithoutComments,
      'Faculty requesting revisions without comments rejected with 400 Bad Request'
    );

    // 4.4: Faculty Requests Revisions with Actionable Comments
    const revisionReport = await weeklyReportsService.review(submittedReport.id, {
      status: 'REVISION_REQUESTED',
      comments: 'Please add specific benchmark latency percentiles (p95 and p99 metrics) and link PR diffs.',
      reviewedById: facultyUser.id,
    });
    assert(revisionReport.status === 'REVISION_REQUESTED', 'Report status moved to REVISION_REQUESTED');
    assert(
      revisionReport.facultyComments.includes('p95 and p99'),
      'Actionable faculty feedback persisted in report'
    );

    // 4.5: Student Revises and Resubmits
    const resubmittedReport = await weeklyReportsService.create({
      internshipId: internship.id,
      weekNumber: 1,
      summary: 'Completed OAuth2 PKCE module with detailed p95 (4.2ms) and p99 (9.8ms) latency percentiles.',
      keyLearnings: 'Cryptographic challenge verification algorithms and Redis caching patterns.',
      issuesFaced: 'Initial CORS policy restrictions during local multi-tenant testing.',
      nextWeekGoals: 'Author integration test suite and load test DB pools.',
      hoursWorked: 40,
      fileUrl: 'https://storage.ilmp.edu/reports/week_01_revised_report.pdf',
      status: 'SUBMITTED',
      revisionNotes: 'Added latency benchmark metrics p95/p99 and updated PR link.',
    });
    assert(resubmittedReport.status === 'SUBMITTED', 'Revised report successfully resubmitted to Faculty');
    assert(Boolean(resubmittedReport.revisionNotes), 'Revision explanation notes persisted');

    // 4.6: Faculty Final Approval
    const approvedReport = await weeklyReportsService.review(submittedReport.id, {
      status: 'APPROVED',
      comments: 'Excellent revisions. Benchmark percentiles verified and approved.',
      reviewedById: facultyUser.id,
    });
    assert(approvedReport.status === 'APPROVED', 'Report granted final approval by Faculty Guide');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up execution workspace test fixtures...');
    await (prisma.weeklyReport as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.dailyLog as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.attendanceRecord as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.task as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.riskAlert as any).deleteMany({ where: { internshipId: internship.id } });
    await (prisma.internship as any).deleteMany({ where: { id: internship.id } });
    await (prisma.application as any).deleteMany({ where: { id: application.id } });
    await (prisma.internshipListing as any).deleteMany({ where: { id: listing.id } });
    await (prisma.companyMentor as any).deleteMany({ where: { companyId: company.id } });
    await (prisma.company as any).deleteMany({ where: { id: company.id } });
    await (prisma.student as any).deleteMany({ where: { userId: studentUser.id } });
    await (prisma.faculty as any).deleteMany({ where: { userId: facultyUser.id } });
    await (prisma.notification as any).deleteMany({ where: { userId: { in: [studentUser.id, facultyUser.id, companyUser.id] } } });
    await (prisma.user as any).deleteMany({ where: { id: { in: [studentUser.id, facultyUser.id, companyUser.id] } } });
    console.log('✅ Execution workspace test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal Workspace test error:', error);
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

runWorkspaceTests();
