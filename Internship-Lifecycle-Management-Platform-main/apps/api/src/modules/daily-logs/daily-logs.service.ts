import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    date: string | Date;
    tasksCompleted: string;
    hoursWorked?: number;
    whatILearned?: string;
    challengesFaced?: string;
    plansForTomorrow?: string;
    skillsUsed?: string;
    attachments?: string;
    status?: string;
    isDraft?: boolean;
  }) {
    const rawDate = data.date ? new Date(data.date) : new Date();
    const dateOnly = new Date(rawDate.toISOString().split('T')[0]);
    const hoursWorked = data.hoursWorked !== undefined ? Number(data.hoursWorked) : 8.0;
    const status = data.isDraft ? 'DRAFT' : data.status || 'SUBMITTED';

    // 1. Check for Duplicate Daily Log for the same date
    const existing = await this.prisma.dailyLog.findUnique({
      where: {
        internshipId_date: {
          internshipId: data.internshipId,
          date: dateOnly,
        },
      },
    });

    if (existing) {
      // If already submitted/reviewed and not explicitly editing
      if (existing.status !== 'DRAFT' && !data.isDraft) {
        throw new BadRequestException(
          `A daily log for ${dateOnly.toISOString().split('T')[0]} has already been submitted. Multiple logs per date are not permitted.`
        );
      }
    }

    return this.prisma.dailyLog.upsert({
      where: {
        internshipId_date: {
          internshipId: data.internshipId,
          date: dateOnly,
        },
      },
      update: {
        tasksCompleted: data.tasksCompleted,
        hoursWorked,
        whatILearned: data.whatILearned,
        challengesFaced: data.challengesFaced,
        plansForTomorrow: data.plansForTomorrow,
        skillsUsed: data.skillsUsed,
        attachments: data.attachments,
        status,
      },
      create: {
        internshipId: data.internshipId,
        date: dateOnly,
        tasksCompleted: data.tasksCompleted,
        hoursWorked,
        whatILearned: data.whatILearned,
        challengesFaced: data.challengesFaced,
        plansForTomorrow: data.plansForTomorrow,
        skillsUsed: data.skillsUsed,
        attachments: data.attachments,
        status,
      },
    });
  }

  async findByInternship(internshipId: string) {
    return this.prisma.dailyLog.findMany({
      where: { internshipId },
      orderBy: { date: 'desc' },
    });
  }

  async review(id: string, body: { status: string; reviewNotes?: string; mentorId?: string }) {
    const log = await this.prisma.dailyLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Daily log not found');

    return this.prisma.dailyLog.update({
      where: { id },
      data: {
        status: body.status || 'REVIEWED',
        reviewNotes: body.reviewNotes,
        acknowledgedAt: new Date(),
        acknowledgedById: body.mentorId,
      },
    });
  }
}
