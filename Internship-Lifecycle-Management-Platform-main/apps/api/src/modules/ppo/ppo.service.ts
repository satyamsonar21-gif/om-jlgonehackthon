import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PpoService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(data: {
    internshipId: string;
    studentId?: string;
    companyId?: string;
    packageLpa?: number;
    designation?: string;
    offerLetterUrl?: string;
    remarks?: string;
    status?: string;
  }) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: data.internshipId },
      include: { student: { include: { user: true } }, company: true },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const studentId = data.studentId || internship.studentId;
    const companyId = data.companyId || internship.companyId;
    const packageLpa = data.packageLpa !== undefined ? Number(data.packageLpa) : undefined;
    const status = data.status || 'OFFERED';

    const ppo = await this.prisma.pPO.upsert({
      where: { internshipId: data.internshipId },
      update: {
        packageLpa,
        designation: data.designation,
        offerLetterUrl: data.offerLetterUrl,
        remarks: data.remarks,
        status,
        offeredAt: new Date(),
      },
      create: {
        internshipId: data.internshipId,
        studentId,
        companyId,
        packageLpa,
        designation: data.designation || 'Associate Engineer',
        offerLetterUrl: data.offerLetterUrl,
        remarks: data.remarks,
        status,
        offeredAt: new Date(),
      },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: 'Pre-Placement Offer (PPO) Received! 🚀',
        message: `${internship.company.name} has extended a Pre-Placement Offer (${packageLpa ? `${packageLpa} LPA` : 'Competitive Package'}).`,
        type: 'SUCCESS',
        link: '/student/certificates',
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'PPO_OFFERED',
        entity: 'PPO',
        entityId: ppo.id,
        userRole: 'COMPANY_MENTOR',
        newState: status,
        reason: `PPO offered to ${internship.student.user.name} by ${internship.company.name}`,
      },
    });

    return ppo;
  }

  async findAll(query: any = {}) {
    const where: any = {};
    if (query.companyId) where.companyId = query.companyId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    return this.prisma.pPO.findMany({
      where,
      include: {
        internship: {
          include: {
            student: { include: { user: true, college: true } },
            company: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respond(id: string, body: { status: 'ACCEPTED' | 'REJECTED'; remarks?: string; studentUserId?: string }) {
    const ppo = await this.prisma.pPO.findFirst({
      where: { OR: [{ id }, { internshipId: id }] },
      include: {
        internship: {
          include: {
            student: { include: { user: true } },
            company: true,
          },
        },
      },
    });
    if (!ppo) throw new NotFoundException('PPO record not found');

    const updated = await this.prisma.pPO.update({
      where: { id: ppo.id },
      data: {
        status: body.status,
        remarks: body.remarks,
        respondedAt: new Date(),
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: `PPO_${body.status}`,
        entity: 'PPO',
        entityId: ppo.id,
        userRole: 'STUDENT',
        userId: body.studentUserId || ppo.internship.student.userId,
        previousState: ppo.status,
        newState: body.status,
        reason: body.remarks || `Student ${body.status.toLowerCase()} the Pre-Placement Offer`,
      },
    });

    return updated;
  }
}
