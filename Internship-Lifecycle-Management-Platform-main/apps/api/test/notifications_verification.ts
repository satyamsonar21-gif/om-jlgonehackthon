import { PrismaClient } from '@prisma/client';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { EmailService } from '../src/modules/notifications/email.service';

async function runNotificationTests() {
  const prisma = new PrismaClient();
  const emailService = new EmailService();
  const notificationsService = new NotificationsService(prisma as any, emailService);

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
  console.log('🔔  ILMP CENTRALIZED NOTIFICATION & EMAIL SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();

  try {
    // ─── SETUP TEST FIXTURES ──────────────────────────────────────────────────
    console.log('🔹 Setting up notification test fixtures...');

    const user: any = await (prisma.user as any).create({
      data: {
        clerkId: `clerk_notif_${timestamp}`,
        email: `notif.user.${timestamp}@test.edu`,
        name: 'Aarav Patil',
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Notification test fixtures initialized.\n');

    // ─── SUITE 1: NOTIFICATION CREATION ACROSS ALL 9 EVENT CATEGORIES ────────
    console.log('🔹 Test Suite 1: Event Category & Severity Classification');

    // 1.1: Application Notification
    const notifApp = await notificationsService.create({
      userId: user.id,
      title: 'Application Submitted: Full Stack Developer',
      message: 'Your application has been received and forwarded to Faculty for review.',
      type: 'INFO',
      category: 'application',
      actionLabel: 'View Status',
      link: '/student/active',
    });
    assert(Boolean(notifApp.id), 'Application notification created');
    assert(notifApp.category === 'application', 'Category categorized as application');

    // 1.2: Approval Notification
    const notifApproval = await notificationsService.create({
      userId: user.id,
      title: '✓ Faculty Endorsement Approved',
      message: 'Dr. Rajesh Kumar has approved your nomination for TechNova Solutions.',
      type: 'SUCCESS',
      category: 'approval',
      actionLabel: 'View Approval',
      link: '/student/active',
    });
    assert(notifApproval.type === 'SUCCESS', 'Approval classified as SUCCESS');
    assert(notifApproval.category === 'approval', 'Category is approval');

    // 1.3: Rejection Notification with Reason
    const notifRejection = await notificationsService.create({
      userId: user.id,
      title: 'Application Update: Backend Systems',
      message: 'Application not shortlisted due to minimum CGPA prerequisite.',
      type: 'ERROR',
      category: 'rejection',
      actionLabel: 'Explore Openings',
      link: '/internships',
    });
    assert(notifRejection.type === 'ERROR', 'Rejection classified as ERROR');
    assert(notifRejection.category === 'rejection', 'Category is rejection');

    // 1.4: Interview Scheduled
    const notifInterview = await notificationsService.create({
      userId: user.id,
      title: '📅 Interview Scheduled: TechNova Solutions',
      message: 'Technical round scheduled on Friday at 3:00 PM via Google Meet.',
      type: 'INFO',
      category: 'interview',
      actionLabel: 'Meeting Link',
      link: 'https://meet.google.com/abc-def-ghi',
    });
    assert(notifInterview.category === 'interview', 'Interview invitation categorized as interview');

    // 1.5: Task Assigned
    const notifTask = await notificationsService.create({
      userId: user.id,
      title: 'Sprint Deliverable Assigned',
      message: 'Company mentor Siddharth assigned: Implement distributed session cache.',
      type: 'ACTION_REQUIRED',
      category: 'task',
      actionLabel: 'View Task',
      link: '/student/tasks',
    });
    assert(notifTask.type === 'ACTION_REQUIRED', 'Task assigned classified as ACTION_REQUIRED');

    // 1.6: Weekly Report Reminder
    const notifReport = await notificationsService.create({
      userId: user.id,
      title: '⏰ Weekly Report Reminder: Week 4',
      message: 'Your weekly synthesis report is due in 24 hours.',
      type: 'WARNING',
      category: 'report',
      actionLabel: 'Submit Report',
      link: '/student/weekly-reports',
    });
    assert(notifReport.type === 'WARNING', 'Weekly report reminder classified as WARNING');

    // 1.7: Attendance Alert
    const notifAttendance = await notificationsService.create({
      userId: user.id,
      title: 'Attendance Compliance Notice',
      message: 'Monthly attendance recorded at 95.0% (Above 75.0% minimum threshold).',
      type: 'INFO',
      category: 'attendance',
      actionLabel: 'View Logs',
      link: '/student/attendance',
    });
    assert(notifAttendance.category === 'attendance', 'Attendance alert categorized as attendance');

    // 1.8: Certificate Issued
    const notifCert = await notificationsService.create({
      userId: user.id,
      title: '🎓 Completion Certificate Issued',
      message: 'Certificate CERT-2026-NITT-8492 has been cryptographically signed.',
      type: 'SUCCESS',
      category: 'certificate',
      actionLabel: 'Download Certificate',
      link: '/student/certificates',
    });
    assert(notifCert.category === 'certificate', 'Certificate notification categorized as certificate');

    // 1.9: System Notice
    const notifSystem = await notificationsService.create({
      userId: user.id,
      title: 'Profile Updated Successfully',
      message: 'Your contact credentials and technical skills were updated.',
      type: 'INFO',
      category: 'system',
    });
    assert(notifSystem.category === 'system', 'System notice categorized as system');

    // ─── SUITE 2: UNREAD COUNTS & FILTERING ──────────────────────────────────
    console.log('\n🔹 Test Suite 2: Unread Count & Category Filtering');

    const countRes = await notificationsService.getUnreadCount(user.id);
    assert(countRes.count === 9, `Initial unread count matches: ${countRes.count} (Expected 9)`);

    // Filter by category
    const appNotifs = await notificationsService.getForUser(user.id, { category: 'application' });
    assert(appNotifs.length === 1, 'Filtered application category returns 1 notification');

    const certNotifs = await notificationsService.getForUser(user.id, { category: 'certificate' });
    assert(certNotifs.length === 1, 'Filtered certificate category returns 1 notification');

    // Filter by type
    const actionNotifs = await notificationsService.getForUser(user.id, { type: 'ACTION_REQUIRED' });
    assert(actionNotifs.length === 1, 'Filtered ACTION_REQUIRED returns 1 notification');

    // ─── SUITE 3: READ / UNREAD STATE MUTATIONS ──────────────────────────────
    console.log('\n🔹 Test Suite 3: State Transitions (Mark Read & Mark All Read)');

    // Mark single notification read
    await notificationsService.markRead(notifApp.id);
    const updatedNotif = await prisma.notification.findUnique({ where: { id: notifApp.id } });
    assert(updatedNotif?.isRead === true, 'Single notification marked as isRead=true');

    const countAfterOne = await notificationsService.getUnreadCount(user.id);
    assert(countAfterOne.count === 8, `Unread count decremented to ${countAfterOne.count} (Expected 8)`);

    // Mark all as read
    await notificationsService.markAllRead(user.id);
    const countAfterAll = await notificationsService.getUnreadCount(user.id);
    assert(countAfterAll.count === 0, 'Mark all read sets unread count to 0');

    // ─── SUITE 4: NOTIFICATION PREFERENCES MANAGEMENT ────────────────────────
    console.log('\n🔹 Test Suite 4: Notification Delivery Preferences');

    const prefs = await notificationsService.getPreferences(user.id);
    assert(prefs.emailNotifications === true, 'Default email notifications enabled');
    assert(prefs.applicationAlerts === true, 'Default application alerts enabled');

    // Update preferences
    const updatedPrefs = await notificationsService.updatePreferences(user.id, {
      applicationAlerts: false,
      attendanceWarnings: true,
    });
    assert(updatedPrefs.applicationAlerts === false, 'Application alerts preference toggled off');

    // ─── SUITE 5: EMAIL SERVICE ABSTRACTION & DISPATCH ───────────────────────
    console.log('\n🔹 Test Suite 5: Email Service Provider & Transactional Templates');

    const emailProvider = emailService.getProviderName();
    assert(Boolean(emailProvider), `Email provider active: ${emailProvider}`);

    const verifyEmailRes = await emailService.sendAccountVerification(
      user.email,
      user.name,
      'https://ilmp.edu/verify-email?token=xyz'
    );
    assert(verifyEmailRes.success === true, 'Account verification email dispatched');

    const passResetRes = await emailService.sendPasswordReset(
      user.email,
      user.name,
      'https://ilmp.edu/reset-password?token=xyz'
    );
    assert(passResetRes.success === true, 'Password reset transactional email dispatched');

    const interviewEmailRes = await emailService.sendInterviewScheduled(
      user.email,
      user.name,
      'Full Stack Developer',
      'TechNova Solutions',
      '2026-08-22 15:00 IST',
      'https://meet.google.com/abc-def-ghi'
    );
    assert(interviewEmailRes.success === true, 'Interview schedule transactional email dispatched');

    const certEmailRes = await emailService.sendCertificateIssued(
      user.email,
      user.name,
      'CERT-2026-NITT-8492',
      'https://ilmp.edu/verify/CERT-2026-NITT-8492'
    );
    assert(certEmailRes.success === true, 'Certificate issued transactional email dispatched');

    // ─── CLEANUP ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning up notification test artifacts...');
    await (prisma.notificationPreference as any).deleteMany({ where: { userId: user.id } });
    await (prisma.notification as any).deleteMany({ where: { userId: user.id } });
    await (prisma.user as any).deleteMany({ where: { id: user.id } });
    console.log('✅ Notification test fixtures cleaned up.');

  } catch (error: any) {
    console.error('Fatal notification test error:', error);
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

runNotificationTests();
