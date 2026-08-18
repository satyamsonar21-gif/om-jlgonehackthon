import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WeeklyReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    weekNumber: number;
    summary: string;
    keyLearnings: string;
    issuesFaced?: string;
    nextWeekGoals: string;
    hoursWorked?: number;
    fileUrl?: string;
    attachments?: string;
    status?: string;
    isDraft?: boolean;
    revisionNotes?: string;
  }) {
    const weekNumber = Number(data.weekNumber);
    const hoursWorked = data.hoursWorked !== undefined ? Number(data.hoursWorked) : 40;
    const status = data.isDraft ? 'DRAFT' : data.status || 'SUBMITTED';

    const existing = await this.prisma.weeklyReport.findUnique({
      where: {
        internshipId_weekNumber: {
          internshipId: data.internshipId,
          weekNumber,
        },
      },
    });

    const isResubmission = existing && (existing.status === 'REVISION_REQUESTED' || existing.status === 'DRAFT');

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
        attachments: data.attachments,
        status,
        revisionNotes: data.revisionNotes,
        submittedAt: status === 'SUBMITTED' ? new Date() : existing?.submittedAt || new Date(),
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
        attachments: data.attachments,
        status,
        revisionNotes: data.revisionNotes,
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

    // Notify Faculty Mentor on Submission
    if (status === 'SUBMITTED' && report.internship?.facultyMentor?.userId) {
      await this.prisma.notification.create({
        data: {
          userId: report.internship.facultyMentor.userId,
          role: 'FACULTY_MENTOR',
          title: isResubmission ? `Week ${weekNumber} Report Resubmitted 📝` : `Week ${weekNumber} Report Submitted 📋`,
          message: `${report.internship.student.user.name} submitted Week ${weekNumber} report for review.`,
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
    const where: any = { status: { in: ['SUBMITTED', 'REVISION_REQUESTED'] } };
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

    const targetStatus = data.status;

    // Enforce mandatory feedback if requesting changes
    if (targetStatus === 'REVISION_REQUESTED') {
      if (!data.comments || data.comments.trim().length === 0) {
        throw new BadRequestException('Specific actionable feedback is mandatory when requesting report revisions.');
      }
    }

    const updated = await this.prisma.weeklyReport.update({
      where: { id },
      data: {
        status: targetStatus,
        facultyComments: data.comments,
        reviewedById: data.reviewedById,
        reviewedAt: new Date(),
      },
    });

    // Notify Student
    let notifTitle = `Week ${report.weekNumber} Report Updated`;
    let notifType: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' = 'INFO';

    if (targetStatus === 'APPROVED' || targetStatus === 'FINAL_APPROVED') {
      notifTitle = `Week ${report.weekNumber} Report Approved ✅`;
      notifType = 'SUCCESS';
    } else if (targetStatus === 'REVISION_REQUESTED') {
      notifTitle = `Week ${report.weekNumber} Report: Changes Requested ⚠️`;
      notifType = 'WARNING';
    }

    await this.prisma.notification.create({
      data: {
        userId: report.internship.student.userId,
        role: 'STUDENT',
        title: notifTitle,
        message: data.comments || `Your Week ${report.weekNumber} report was marked as ${targetStatus}.`,
        type: notifType,
        link: '/student/active/reports',
      },
    });

    return updated;
  }
}
