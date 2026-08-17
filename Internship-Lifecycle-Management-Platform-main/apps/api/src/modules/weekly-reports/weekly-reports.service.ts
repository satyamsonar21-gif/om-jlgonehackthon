import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WeeklyReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.weeklyReport.upsert({
      where: { internshipId_weekNumber: { internshipId: data.internshipId, weekNumber: data.weekNumber } },
      update: { summary: data.summary, keyLearnings: data.keyLearnings, issuesFaced: data.issuesFaced, nextWeekGoals: data.nextWeekGoals, status: 'SUBMITTED' },
      create: { internshipId: data.internshipId, weekNumber: data.weekNumber, summary: data.summary, keyLearnings: data.keyLearnings, issuesFaced: data.issuesFaced, nextWeekGoals: data.nextWeekGoals },
    });
  }

  async findByInternship(internshipId: string) {
    return this.prisma.weeklyReport.findMany({ where: { internshipId }, orderBy: { weekNumber: 'asc' } });
  }

  async getPending(facultyId: string) {
    return this.prisma.weeklyReport.findMany({
      where: { status: 'SUBMITTED', internship: { facultyMentorId: facultyId } },
      include: { internship: { include: { student: { include: { user: true } }, company: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async review(id: string, data: { status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED'; comments?: string }) {
    return this.prisma.weeklyReport.update({
      where: { id },
      data: { status: data.status, facultyComments: data.comments, reviewedAt: new Date() },
    });
  }
}
