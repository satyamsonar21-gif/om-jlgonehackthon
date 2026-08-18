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
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    const previousStatus = company.verificationStatus;
    const isVerified = body.status === 'VERIFIED';

    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        isVerified,
        verificationStatus: body.status,
        verificationRemarks: body.remarks,
        verifiedAt: new Date(),
        verifiedBy: body.verifiedBy || 'T&P Office',
      },
    });

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
