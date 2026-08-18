import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const where: any = {};

    // Filter by status (default to PUBLISHED and OPEN for students)
    if (query.status) {
      where.status = query.status;
    } else if (!query.companyId && !query.all) {
      where.status = { in: ['PUBLISHED', 'OPEN'] };
    }

    if (query.companyId) where.companyId = query.companyId;
    if (query.domain) where.domain = { contains: query.domain };
    if (query.mode) where.mode = query.mode;
    if (query.department && query.department !== 'ALL') {
      where.OR = [
        { eligibleDepartments: 'ALL' },
        { eligibleDepartments: { contains: query.department } },
      ];
    }
    if (query.minStipend) where.stipend = { gte: Number(query.minStipend) };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { domain: { contains: query.search } },
        { requiredSkills: { contains: query.search } },
        { company: { name: { contains: query.search } } },
      ];
    }

    return this.prisma.internshipListing.findMany({
      where,
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.internshipListing.findUnique({
      where: { id },
      include: {
        company: {
          include: { mentors: { include: { user: true } } },
        },
        applications: {
          include: {
            student: { include: { user: true } },
            offerLetter: true,
            statusHistory: true,
          },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!listing) throw new NotFoundException(`Internship listing '${id}' not found`);
    return listing;
  }

  async create(data: any) {
    const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundException('Associated company not found');

    const status = company.isVerified ? (data.status || 'PUBLISHED') : 'PENDING_APPROVAL';

    const listing = await this.prisma.internshipListing.create({
      data: {
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        domain: data.domain || 'Technology',
        mode: data.mode || 'ONSITE',
        location: data.location || company.location,
        stipend: data.stipend !== undefined ? Number(data.stipend) : 0,
        openings: data.openings !== undefined ? Number(data.openings) : 1,
        durationWeeks: data.durationWeeks !== undefined ? Number(data.durationWeeks) : 8,
        startDate: data.startDate ? new Date(data.startDate) : new Date(Date.now() + 14 * 86400000),
        endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 70 * 86400000),
        deadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 86400000),
        status,
        minCgpa: data.minCgpa !== undefined ? Number(data.minCgpa) : 0.0,
        maxBacklogs: data.maxBacklogs !== undefined ? Number(data.maxBacklogs) : 0,
        eligibleDepartments: data.eligibleDepartments || 'ALL',
        passingYears: data.passingYears || 'ALL',
        requiredSkills: data.requiredSkills || '',
        requiredCertifications: data.requiredCertifications,
        experienceRequirement: data.experienceRequirement,
        additionalCriteria: data.additionalCriteria,
      },
      include: { company: true },
    });

    // Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'INTERNSHIP_LISTING_CREATED',
        entity: 'InternshipListing',
        entityId: listing.id,
        userRole: 'COMPANY_MENTOR',
        newState: status,
        reason: `New internship '${listing.title}' posted by ${company.name}`,
      },
    });

    return listing;
  }

  async update(id: string, data: any) {
    if (data.minCgpa !== undefined) data.minCgpa = Number(data.minCgpa);
    if (data.maxBacklogs !== undefined) data.maxBacklogs = Number(data.maxBacklogs);
    if (data.stipend !== undefined) data.stipend = Number(data.stipend);
    if (data.openings !== undefined) data.openings = Number(data.openings);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.deadline) data.deadline = new Date(data.deadline);

    return this.prisma.internshipListing.update({
      where: { id },
      data,
      include: { company: true },
    });
  }

  async remove(id: string) {
    return this.prisma.internshipListing.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }
}
