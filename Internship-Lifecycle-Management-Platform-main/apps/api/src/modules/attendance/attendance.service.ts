import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async mark(data: any) {
    const record = await this.prisma.attendanceRecord.upsert({
      where: { internshipId_date: { internshipId: data.internshipId, date: new Date(data.date) } },
      update: { status: data.status, notes: data.notes },
      create: { internshipId: data.internshipId, date: new Date(data.date), status: data.status, markedById: data.markedById, notes: data.notes },
    });
    await this.updateAttendancePercentage(data.internshipId);
    return record;
  }

  async findByInternship(internshipId: string, query: any) {
    return this.prisma.attendanceRecord.findMany({
      where: { internshipId },
      orderBy: { date: 'desc' },
    });
  }

  async getStats(internshipId: string) {
    const records = await this.prisma.attendanceRecord.findMany({ where: { internshipId } });
    const total = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const halfDay = records.filter((r) => r.status === 'HALF_DAY').length;
    const leave = records.filter((r) => r.status === 'LEAVE').length;
    const percentage = total > 0 ? ((present + halfDay * 0.5) / total) * 100 : 0;
    return { total, present, absent, halfDay, leave, percentage: Math.round(percentage * 100) / 100 };
  }

  private async updateAttendancePercentage(internshipId: string) {
    const stats = await this.getStats(internshipId);
    await this.prisma.internship.update({
      where: { id: internshipId },
      data: { attendancePercentage: stats.percentage },
    });
  }
}
