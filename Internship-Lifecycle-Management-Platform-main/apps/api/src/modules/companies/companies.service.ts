import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.verificationStatus) where.verificationStatus = query.verificationStatus;
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search } },
        { domain: { contains: query.search } },
        { location: { contains: query.search } },
      ];
    }

    return this.prisma.company.findMany({
      where,
      include: {
        mentors: { include: { user: true } },
        listings: true,
        _count: { select: { listings: true, internships: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findFirst({
      where: { OR: [{ id }, { name: id }] },
      include: {
        mentors: { include: { user: true } },
        listings: {
          include: {
            applications: {
              include: { student: { include: { user: true } } },
            },
          },
        },
        internships: {
          include: {
            student: { include: { user: true } },
            facultyMentor: { include: { user: true } },
            certificate: true,
            ppo: true,
          },
        },
        documents: true,
      },
    });

    if (!company) throw new NotFoundException(`Company '${id}' not found`);
    return company;
  }

  async create(data: any) {
    return this.prisma.company.create({
      data: {
        name: data.name,
        domain: data.domain,
        website: data.website,
        description: data.description,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        location: data.location,
        isVerified: false,
        verificationStatus: 'PENDING',
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async verifyCompany(id: string, body: { status: string; remarks?: string; verifiedBy?: string }) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { mentors: { include: { user: true } } },
    });
    if (!company) throw new NotFoundException('Company not found');

    if (body.status === 'REJECTED' && (!body.remarks || body.remarks.trim().length === 0)) {
      throw new ForbiddenException('A formal rejection reason is required for institutional compliance.');
    }

    const previousStatus = company.verificationStatus;
    const isVerified = body.status === 'VERIFIED';

    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        isVerified,
        verificationStatus: body.status,
        verificationRemarks: body.remarks || null,
        verifiedAt: body.status === 'VERIFIED' ? new Date() : company.verifiedAt,
        verifiedBy: body.verifiedBy || 'T&P Administration',
      },
      include: { mentors: true },
    });

    // Update linked company mentor user statuses if verified or suspended
    if (company.mentors && company.mentors.length > 0) {
      for (const mentor of company.mentors) {
        if (mentor.userId) {
          const userStatus = body.status === 'SUSPENDED' ? 'SUSPENDED' : body.status === 'VERIFIED' ? 'ACTIVE' : 'PENDING_APPROVAL';
          await this.prisma.user.update({
            where: { id: mentor.userId },
            data: { status: userStatus },
          });

          // Notify Mentor
          await this.prisma.notification.create({
            data: {
              userId: mentor.userId,
              role: 'COMPANY_MENTOR',
              title: `Institutional Verification: ${body.status}`,
              message: body.remarks || `Your corporate profile '${company.name}' verification status has been updated to ${body.status}.`,
              type: body.status === 'VERIFIED' ? 'SUCCESS' : body.status === 'REJECTED' ? 'ERROR' : 'WARNING',
              link: '/company/profile',
            },
          });
        }
      }
    }

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: `COMPANY_VERIFICATION_${body.status}`,
        entity: 'Company',
        entityId: id,
        userRole: 'TNP_ADMIN',
        previousState: previousStatus,
        newState: body.status,
        reason: body.remarks || `Company status updated to ${body.status}`,
      },
    });

    return updated;
  }
}

