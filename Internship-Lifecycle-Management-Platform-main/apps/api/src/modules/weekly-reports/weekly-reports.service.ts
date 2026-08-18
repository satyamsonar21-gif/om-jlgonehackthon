import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WeeklyReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const weekNumber = Number(data.weekNumber);
    const hoursWorked = data.hoursWorked !== undefined ? Number(data.hoursWorked) : 40;

    const report = await this.prisma.weeklyReport.upsert({
      where: {
        internshipId_weekNumber: {
          internshipId: data.internshipId,
          weekNumber,
        },
      },
      update: {
        summary: data.summary,
        keyLearnings: data.keyLearnings,
        issuesFaced: data.issuesFaced,
        nextWeekGoals: data.nextWeekGoals,
        hoursWorked,
        fileUrl: data.fileUrl,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      create: {
        internshipId: data.internshipId,
        weekNumber,
        summary: data.summary,
        keyLearnings: data.keyLearnings,
        issuesFaced: data.issuesFaced,
        nextWeekGoals: data.nextWeekGoals,
        hoursWorked,
        fileUrl: data.fileUrl,
        status: 'SUBMITTED',
      },
      include: {
        internship: {
          include: {
            student: { include: { user: true } },
            facultyMentor: { include: { user: true } },
            company: true,
          },
        },
      },
    });

    // Notify Faculty Mentor
    if (report.internship?.facultyMentor?.userId) {
      await this.prisma.notification.create({
        data: {
          userId: report.internship.facultyMentor.userId,
          role: 'FACULTY_MENTOR',
          title: 'Synthesis Report Submitted',
          message: `${report.internship.student.user.name} submitted Week ${weekNumber} Synthesis Report for review.`,
          type: 'INFO',
          link: '/faculty/reports',
        },
      });
    }

    return report;
  }

  async findByInternship(internshipId: string) {
    return this.prisma.weeklyReport.findMany({
      where: { internshipId },
      orderBy: { weekNumber: 'asc' },
    });
  }

  async getPending(facultyId?: string) {
    const where: any = { status: 'SUBMITTED' };
    if (facultyId) {
      where.internship = {
        OR: [{ facultyMentorId: facultyId }, { facultyMentor: { userId: facultyId } }],
      };
    }

    return this.prisma.weeklyReport.findMany({
      where,
      include: {
        internship: {
          include: {
            student: { include: { user: true, college: true } },
            company: true,
            facultyMentor: { include: { user: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async review(
    id: string,
    data: {
      status: string;
      comments?: string;
      reviewedById?: string;
    },
  ) {
    const report = await this.prisma.weeklyReport.findUnique({
      where: { id },
      include: {
        internship: {
          include: {
            student: { include: { user: true } },
            company: true,
          },
        },
      },
    });
    if (!report) throw new NotFoundException('Weekly report not found');

    const updated = await this.prisma.weeklyReport.update({
      where: { id },
      data: {
        status: data.status,
        facultyComments: data.comments,
        reviewedById: data.reviewedById,
        reviewedAt: new Date(),
      },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: report.internship.student.userId,
        role: 'STUDENT',
        title: `Week ${report.weekNumber} Report: ${data.status === 'APPROVED' ? 'Approved ✅' : 'Feedback Provided'}`,
        message: data.comments || `Your Week ${report.weekNumber} report status is now ${data.status}.`,
        type: data.status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        link: '/student/active/reports',
      },
    });

    return updated;
  }
}
