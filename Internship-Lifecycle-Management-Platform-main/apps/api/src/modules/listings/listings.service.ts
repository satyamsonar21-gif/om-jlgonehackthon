import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface MatchingResult {
  matchScore: number;
  isEligible: boolean;
  matchExplanation: string;
  matchedSkills: string[];
  missingSkills: string[];
}

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Deterministic AI & Skill Matching Abstraction
   * Compares candidate skills, CGPA, and department with listing requirements.
   */
  evaluateMatch(student: any, listing: any): MatchingResult {
    if (!student) {
      return {
        matchScore: 0,
        isEligible: true,
        matchExplanation: 'Sign in as a student to see personalized AI match score.',
        matchedSkills: [],
        missingSkills: [],
      };
    }

    const studentSkills: string[] = typeof student.skills === 'string'
      ? student.skills.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : Array.isArray(student.skills)
      ? student.skills.map((s: string) => String(s).trim().toLowerCase())
      : [];

    const requiredSkills: string[] = typeof listing.requiredSkills === 'string'
      ? listing.requiredSkills.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const matchedSkills = requiredSkills.filter((req) =>
      studentSkills.some((stu) => stu.includes(req) || req.includes(stu))
    );

    const missingSkills = requiredSkills.filter((req) => !matchedSkills.includes(req));

    // Skill match score component (up to 70 points)
    const skillRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 1;
    const skillScore = Math.round(skillRatio * 70);

    // CGPA component (up to 15 points)
    const minCgpa = Number(listing.minCgpa || 0);
    const studentCgpa = Number(student.cgpa || 0);
    const cgpaScore = minCgpa === 0 || studentCgpa >= minCgpa ? 15 : Math.max(0, Math.round((studentCgpa / minCgpa) * 15));

    // Department match component (up to 15 points)
    const eligibleDepts = (listing.eligibleDepartments || 'ALL').toUpperCase();
    const studentDept = (student.department || '').toUpperCase();
    const deptMatch = eligibleDepts === 'ALL' || eligibleDepts.includes(studentDept) || (studentDept && eligibleDepts.includes(studentDept.substring(0, 4)));
    const deptScore = deptMatch ? 15 : 0;

    const totalMatchScore = Math.min(100, Math.max(10, skillScore + cgpaScore + deptScore));

    const isEligible =
      (minCgpa === 0 || studentCgpa >= minCgpa) &&
      deptMatch &&
      Number(student.activeBacklogs || 0) <= Number(listing.maxBacklogs || 0);

    const matchExplanation = requiredSkills.length > 0
      ? `${matchedSkills.length} of ${requiredSkills.length} required skills matched (${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''}). ${isEligible ? 'Meets academic criteria.' : 'Academic criteria review required.'}`
      : 'Open technical criteria. Profile matched based on department & academics.';

    return {
      matchScore: totalMatchScore,
      isEligible,
      matchExplanation,
      matchedSkills,
      missingSkills,
    };
  }

  async findAll(query: any = {}, currentUserId?: string) {
    const where: any = {};

    // Filter by status (default to PUBLISHED and OPEN for students)
    if (query.status) {
      where.status = query.status;
    } else if (!query.companyId && !query.all) {
      where.status = { in: ['PUBLISHED', 'OPEN'] };
    }

    if (query.companyId) where.companyId = query.companyId;
    if (query.domain && query.domain !== 'All' && query.domain !== 'ALL') {
      where.domain = { contains: query.domain };
    }
    if (query.mode && query.mode !== 'All' && query.mode !== 'ALL') {
      where.mode = query.mode.toUpperCase();
    }
    if (query.location && query.location !== 'All') {
      where.location = { contains: query.location };
    }
    if (query.durationWeeks) {
      where.durationWeeks = Number(query.durationWeeks);
    }
    if (query.minStipend) {
      where.stipend = { gte: Number(query.minStipend) };
    }
    if (query.department && query.department !== 'ALL') {
      where.OR = [
        { eligibleDepartments: 'ALL' },
        { eligibleDepartments: { contains: query.department } },
      ];
    }

    // Active deadline filter
    if (query.activeOnly === 'true' || query.activeOnly === true) {
      where.deadline = { gte: new Date() };
    }

    // Keyword Search
    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s } },
        { description: { contains: s } },
        { domain: { contains: s } },
        { requiredSkills: { contains: s } },
        { location: { contains: s } },
        { company: { name: { contains: s } } },
      ];
    }

    // Fetch listings
    let listings = await this.prisma.internshipListing.findMany({
      where,
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Resolve Student context if available
    let studentRecord: any = null;
    const studentIdToFind = query.studentId || currentUserId;
    if (studentIdToFind) {
      studentRecord = await this.prisma.student.findFirst({
        where: { OR: [{ id: studentIdToFind }, { userId: studentIdToFind }] },
        include: { user: true, college: true },
      });
    }

    // Augment with deterministic AI Match & Eligibility evaluation
    let augmented = listings.map((listing) => {
      const match = this.evaluateMatch(studentRecord, listing);
      return {
        ...listing,
        matchScore: match.matchScore,
        isEligible: match.isEligible,
        matchExplanation: match.matchExplanation,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
      };
    });

    // Eligibility Filter if requested
    if (query.eligibleOnly === 'true' || query.eligibleOnly === true) {
      augmented = augmented.filter((l) => l.isEligible);
    }

    // Sorting
    const sort = (query.sort || 'best_match').toLowerCase();
    if (sort === 'best_match') {
      augmented.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sort === 'newest') {
      augmented.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'deadline') {
      augmented.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sort === 'stipend' || sort === 'highest_stipend') {
      augmented.sort((a, b) => (b.stipend || 0) - (a.stipend || 0));
    } else if (sort === 'distance' || sort === 'shortest_distance') {
      // Prioritize listings in the candidate's exact college/profile city or state
      const targetCity = (studentRecord?.college?.city || studentRecord?.preferredLocation || '').toLowerCase();
      augmented.sort((a, b) => {
        const aLoc = (a.location || '').toLowerCase();
        const bLoc = (b.location || '').toLowerCase();
        const aMatch = targetCity && aLoc.includes(targetCity) ? 1 : 0;
        const bMatch = targetCity && bLoc.includes(targetCity) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return augmented;
  }

  async findOne(id: string, studentId?: string) {
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

    if (studentId) {
      const studentRecord = await this.prisma.student.findFirst({
        where: { OR: [{ id: studentId }, { userId: studentId }] },
      });
      const match = this.evaluateMatch(studentRecord, listing);
      return {
        ...listing,
        matchScore: match.matchScore,
        isEligible: match.isEligible,
        matchExplanation: match.matchExplanation,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
      };
    }

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
