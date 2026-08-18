import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const rawDate = data.date ? new Date(data.date) : new Date();
    const dateOnly = new Date(rawDate.toISOString().split('T')[0]);
    const hoursWorked = data.hoursWorked !== undefined ? Number(data.hoursWorked) : 8.0;

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
        challengesFaced: data.challengesFaced,
        plansForTomorrow: data.plansForTomorrow,
        skillsUsed: data.skillsUsed,
      },
      create: {
        internshipId: data.internshipId,
        date: dateOnly,
        tasksCompleted: data.tasksCompleted,
        hoursWorked,
        challengesFaced: data.challengesFaced,
        plansForTomorrow: data.plansForTomorrow,
        skillsUsed: data.skillsUsed,
      },
    });
  }

  async findByInternship(internshipId: string) {
    return this.prisma.dailyLog.findMany({
      where: { internshipId },
      orderBy: { date: 'desc' },
    });
  }

  async acknowledge(id: string, mentorId?: string) {
    return this.prisma.dailyLog.update({
      where: { id },
      data: {
        acknowledgedAt: new Date(),
        acknowledgedById: mentorId,
      },
    });
  }
}
