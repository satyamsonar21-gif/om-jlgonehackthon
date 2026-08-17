import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.dailyLog.upsert({
      where: { internshipId_date: { internshipId: data.internshipId, date: new Date(data.date) } },
      update: { tasksCompleted: data.tasksCompleted, hoursWorked: data.hoursWorked, challengesFaced: data.challengesFaced, plansForTomorrow: data.plansForTomorrow },
      create: { internshipId: data.internshipId, date: new Date(data.date), tasksCompleted: data.tasksCompleted, hoursWorked: data.hoursWorked, challengesFaced: data.challengesFaced, plansForTomorrow: data.plansForTomorrow },
    });
  }

  async findByInternship(internshipId: string) {
    return this.prisma.dailyLog.findMany({ where: { internshipId }, orderBy: { date: 'desc' } });
  }

  async acknowledge(id: string) {
    return this.prisma.dailyLog.update({ where: { id }, data: { acknowledgedAt: new Date() } });
  }
}
