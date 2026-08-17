import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.application.create({
      data: { studentId: data.studentId, listingId: data.listingId, coverLetter: data.coverLetter },
      include: { student: { include: { user: true } }, listing: { include: { company: true } } },
    });
  }

  async findAll(query: any) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.listingId) where.listingId = query.listingId;
    if (query.status) where.status = query.status;
    if (query.companyId) where.listing = { companyId: query.companyId };
    return this.prisma.application.findMany({
      where,
      include: { student: { include: { user: true } }, listing: { include: { company: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { student: { include: { user: true } }, listing: { include: { company: true } } },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async facultyReview(id: string, data: { status: 'FACULTY_APPROVED' | 'FACULTY_REJECTED'; comment?: string }) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status: data.status,
        facultyApprovedAt: data.status === 'FACULTY_APPROVED' ? new Date() : undefined,
      },
    });
  }

  async companyReview(id: string, data: { status: 'SELECTED' | 'REJECTED' | 'UNDER_REVIEW'; companyMentorId?: string; facultyMentorId?: string }) {
    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: data.status,
        selectedAt: data.status === 'SELECTED' ? new Date() : undefined,
      },
      include: { listing: true, student: true },
    });

    if (data.status === 'SELECTED' && data.companyMentorId && data.facultyMentorId) {
      await this.prisma.internship.create({
        data: {
          applicationId: id,
          studentId: updated.studentId,
          companyId: updated.listing.companyId,
          facultyMentorId: data.facultyMentorId,
          companyMentorId: data.companyMentorId,
          startDate: updated.listing.startDate,
          endDate: updated.listing.endDate,
        },
      });
    }
    return updated;
  }
}
