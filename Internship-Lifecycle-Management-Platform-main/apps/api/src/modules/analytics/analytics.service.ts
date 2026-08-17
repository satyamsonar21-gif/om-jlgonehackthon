import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminAnalytics() {
    const [totalStudents, activeInternships, completedInternships, totalCompanies, pendingApplications, reports] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.internship.count({ where: { status: 'ACTIVE' } }),
      this.prisma.internship.count({ where: { status: 'COMPLETED' } }),
      this.prisma.company.count(),
      this.prisma.application.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.weeklyReport.count({ where: { status: 'APPROVED' } }),
    ]);

    const totalReports = await this.prisma.weeklyReport.count();
    const reportRate = totalReports > 0 ? (reports / totalReports) * 100 : 0;

    const internships = await this.prisma.internship.findMany({ select: { attendancePercentage: true } });
    const avgAttendance = internships.length > 0
      ? internships.reduce((sum, i) => sum + i.attendancePercentage, 0) / internships.length
      : 0;

    return {
      totalStudents, activeInternships, completedInternships, totalCompanies, pendingApplications,
      reportSubmissionRate: Math.round(reportRate * 100) / 100,
      avgAttendance: Math.round(avgAttendance * 100) / 100,
    };
  }

  async getStudentAnalytics(studentId: string) {
    const internship = await this.prisma.internship.findFirst({
      where: { studentId, status: 'ACTIVE' },
      include: { attendanceRecords: true, weeklyReports: true, tasks: true },
    });
    if (!internship) return { message: 'No active internship' };

    const totalReports = internship.weeklyReports.length;
    const approvedReports = internship.weeklyReports.filter((r) => r.status === 'APPROVED').length;
    const totalTasks = internship.tasks.length;
    const completedTasks = internship.tasks.filter((t) => t.status === 'COMPLETED').length;

    return {
      attendancePercentage: internship.attendancePercentage,
      reportSubmissionRate: totalReports > 0 ? (approvedReports / totalReports) * 100 : 0,
      taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      logsSubmitted: internship.attendanceRecords.length,
      reportsSubmitted: totalReports,
      reportsApproved: approvedReports,
    };
  }

  async getFacultyAnalytics(facultyId: string) {
    const students = await this.prisma.student.count({
      where: { facultyAssignments: { some: { facultyId } } },
    });
    const pendingReports = await this.prisma.weeklyReport.count({
      where: { status: 'SUBMITTED', internship: { facultyMentorId: facultyId } },
    });
    const atRiskStudents = await this.prisma.internship.count({
      where: { facultyMentorId: facultyId, attendancePercentage: { lt: 75 } },
    });
    return { studentsMonitored: students, pendingReports, atRiskStudents };
  }

  async getCompanyAnalytics(companyId: string) {
    const activeInterns = await this.prisma.internship.count({ where: { companyId, status: 'ACTIVE' } });
    const totalFeedback = await this.prisma.mentorFeedback.count({ where: { internship: { companyId } } });
    const completedInternships = await this.prisma.internship.count({ where: { companyId, status: 'COMPLETED' } });
    return { activeInterns, totalFeedback, completedInternships };
  }
}
