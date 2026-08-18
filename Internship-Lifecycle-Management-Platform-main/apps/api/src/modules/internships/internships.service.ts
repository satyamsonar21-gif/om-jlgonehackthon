import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternshipsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.companyId) where.companyId = query.companyId;
    if (query.facultyMentorId) where.facultyMentorId = query.facultyMentorId;
    if (query.status) where.status = query.status;
    if (query.department) where.student = { department: query.department };

    return this.prisma.internship.findMany({
      where,
      include: {
        student: { include: { user: true, college: true } },
        company: true,
        facultyMentor: { include: { user: true } },
        companyMentor: { include: { user: true } },
        application: { include: { listing: true } },
        certificate: true,
        ppo: true,
        _count: {
          select: {
            weeklyReports: true,
            attendanceRecords: true,
            tasks: true,
            feedback: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const internship = await this.prisma.internship.findFirst({
      where: {
        OR: [{ id }, { studentId: id }, { applicationId: id }],
      },
      include: {
        student: { include: { user: true, college: true } },
        company: true,
        facultyMentor: { include: { user: true } },
        companyMentor: { include: { user: true } },
        application: { include: { listing: true } },
        attendanceRecords: { orderBy: { date: 'desc' } },
        dailyLogs: { orderBy: { date: 'desc' } },
        weeklyReports: { orderBy: { weekNumber: 'asc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
        feedback: { orderBy: { submittedAt: 'desc' } },
        certificate: true,
        ppo: true,
        documents: true,
        riskAlerts: true,
      },
    });

    if (!internship) throw new NotFoundException(`Internship '${id}' not found`);
    return internship;
  }

  async confirmJoining(
    id: string,
    data: {
      actualJoiningDate?: string;
      joiningRemarks?: string;
      joiningLetterUrl?: string;
    },
  ) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: { student: { include: { user: true } }, company: true },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const updated = await this.prisma.internship.update({
      where: { id },
      data: {
        joiningStatus: 'JOINED',
        actualJoiningDate: data.actualJoiningDate ? new Date(data.actualJoiningDate) : new Date(),
        joiningRemarks: data.joiningRemarks,
        joiningLetterUrl: data.joiningLetterUrl,
        status: 'ACTIVE',
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'INTERNSHIP_JOINING_CONFIRMED',
        entity: 'Internship',
        entityId: id,
        userRole: 'STUDENT',
        userId: internship.student.userId,
        previousState: 'PENDING',
        newState: 'JOINED',
        reason: 'Student confirmed formal joining date and workplace commencement.',
      },
    });

    return updated;
  }

  async update(id: string, data: any) {
    return this.prisma.internship.update({
      where: { id },
      data,
      include: {
        student: { include: { user: true } },
        company: true,
      },
    });
  }

  async complete(id: string, body: { remarks?: string; completedById?: string } = {}) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        company: true,
        weeklyReports: true,
        feedback: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const updated = await this.prisma.internship.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completionApprovedAt: new Date(),
        completionRemarks: body.remarks || 'Internship successfully completed all milestones.',
      },
      include: {
        student: { include: { user: true } },
        company: true,
        certificate: true,
      },
    });

    // Create Notification
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: 'Internship Completed 🏆',
        message: `Congratulations! Your internship at ${internship.company.name} is marked as Completed.`,
        type: 'SUCCESS',
        link: '/student/certificates',
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'INTERNSHIP_COMPLETED',
        entity: 'Internship',
        entityId: id,
        userRole: 'TNP_ADMIN',
        userId: body.completedById,
        previousState: internship.status,
        newState: 'COMPLETED',
        reason: body.remarks || 'All academic and company milestones satisfied.',
      },
    });

    return updated;
  }
}
