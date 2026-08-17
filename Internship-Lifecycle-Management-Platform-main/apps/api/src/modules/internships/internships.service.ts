import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternshipsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.companyId) where.companyId = query.companyId;
    if (query.facultyMentorId) where.facultyMentorId = query.facultyMentorId;
    if (query.status) where.status = query.status;
    return this.prisma.internship.findMany({
      where,
      include: {
        student: { include: { user: true } },
        company: true,
        facultyMentor: { include: { user: true } },
        companyMentor: { include: { user: true } },
        application: { include: { listing: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        company: true,
        facultyMentor: { include: { user: true } },
        companyMentor: { include: { user: true } },
        application: { include: { listing: true } },
        attendanceRecords: true,
        weeklyReports: true,
        tasks: true,
        feedback: true,
        certificate: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');
    return internship;
  }

  async update(id: string, data: any) {
    return this.prisma.internship.update({ where: { id }, data });
  }

  async complete(id: string) {
    return this.prisma.internship.update({ where: { id }, data: { status: 'COMPLETED' } });
  }
}
