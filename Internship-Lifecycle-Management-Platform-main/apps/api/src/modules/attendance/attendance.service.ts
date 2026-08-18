import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async mark(data: {
    internshipId: string;
    date: string | Date;
    status: string;
    markedById?: string;
    notes?: string;
  }) {
    const rawDate = data.date ? new Date(data.date) : new Date();
    const dateOnly = new Date(rawDate.toISOString().split('T')[0]);

    const internship = await this.prisma.internship.findUnique({
      where: { id: data.internshipId },
      include: {
        student: { include: { user: true } },
        company: true,
        companyMentor: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const markedById = data.markedById || internship.companyMentorId;

    const record = await this.prisma.attendanceRecord.upsert({
      where: {
        internshipId_date: {
          internshipId: data.internshipId,
          date: dateOnly,
        },
      },
      update: {
        status: data.status,
        notes: data.notes,
      },
      create: {
        internshipId: data.internshipId,
        date: dateOnly,
        status: data.status,
        markedById,
        notes: data.notes,
      },
    });

    // Update Attendance Percentage
    const stats = await this.getStats(data.internshipId);
    await this.prisma.internship.update({
      where: { id: data.internshipId },
      data: { attendancePercentage: stats.percentage },
    });

    // Automated Risk Detection: If attendance drops below 75%, trigger RiskAlert
    if (stats.percentage < 75.0 && stats.total >= 5) {
      await this.prisma.riskAlert.upsert({
        where: { id: `risk_att_${data.internshipId}` },
        update: {
          riskLevel: stats.percentage < 60 ? 'HIGH' : 'MEDIUM',
          description: `Attendance rate dropped to ${stats.percentage.toFixed(1)}% (${stats.present}/${stats.total} days present).`,
          isResolved: false,
        },
        create: {
          id: `risk_att_${data.internshipId}`,
          internshipId: data.internshipId,
          studentId: internship.studentId,
          facultyMentorId: internship.facultyMentorId,
          riskLevel: stats.percentage < 60 ? 'HIGH' : 'MEDIUM',
          riskType: 'LOW_ATTENDANCE',
          description: `Attendance rate dropped to ${stats.percentage.toFixed(1)}% (${stats.present}/${stats.total} days present).`,
          isResolved: false,
        },
      });
    }

    return record;
  }

  async findByInternship(internshipId: string, query?: any) {
    return this.prisma.attendanceRecord.findMany({
      where: { internshipId },
      include: { markedBy: { include: { user: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async getStats(internshipId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { internshipId },
    });
    const total = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const halfDay = records.filter((r) => r.status === 'HALF_DAY').length;
    const leave = records.filter((r) => r.status === 'LEAVE').length;
    const percentage = total > 0 ? ((present + halfDay * 0.5) / total) * 100 : 0;

    return {
      total,
      present,
      absent,
      halfDay,
      leave,
      percentage: Math.round(percentage * 10) / 10,
    };
  }
}
