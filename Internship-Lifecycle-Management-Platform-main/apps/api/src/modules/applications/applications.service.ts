import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EligibilityService } from '../eligibility/eligibility.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private eligibilityService: EligibilityService,
  ) {}

  async create(data: {
    studentId: string;
    listingId: string;
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    // 1. Verify Listing
    const listing = await this.prisma.internshipListing.findUnique({
      where: { id: data.listingId },
      include: { company: true },
    });
    if (!listing) throw new NotFoundException('Internship listing not found');

    if (listing.status !== 'PUBLISHED' && listing.status !== 'OPEN') {
      throw new BadRequestException(`Applications are closed for this position (Status: ${listing.status}).`);
    }

    if (new Date() > new Date(listing.deadline)) {
      throw new BadRequestException('The application deadline for this internship has passed.');
    }

    // 2. Verify Student
    const student = await this.prisma.student.findUnique({
      where: { id: data.studentId },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    // 3. Check for Duplicate Application
    const existing = await this.prisma.application.findUnique({
      where: {
        studentId_listingId: {
          studentId: data.studentId,
          listingId: data.listingId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('You have already submitted an application for this internship listing.');
    }

    // 4. Automatic Eligibility Evaluation
    const eligibilityResult = this.eligibilityService.evaluate(student, listing);
    if (!eligibilityResult.eligible) {
      const reasonsSummary = eligibilityResult.reasons.join('; ');
      throw new BadRequestException(
        `Application rejected: You do not satisfy the mandatory eligibility criteria for this role (${reasonsSummary}).`,
      );
    }

    // 5. Create Application with Status History
    const application = await this.prisma.application.create({
      data: {
        studentId: data.studentId,
        listingId: data.listingId,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl || student.resumeUrl,
        eligibilitySnapshot: JSON.stringify(eligibilityResult),
        status: 'SUBMITTED',
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: 'SUBMITTED',
            changedById: student.userId,
            changedByRole: 'STUDENT',
            reason: 'Student submitted formal application.',
          },
        },
      },
      include: {
        student: { include: { user: true } },
        listing: { include: { company: true } },
      },
    });

    // 6. Generate Notification for Student
    await this.prisma.notification.create({
      data: {
        userId: student.userId,
        role: 'STUDENT',
        title: 'Application Submitted 🚀',
        message: `Your application for '${listing.title}' at ${listing.company.name} was successfully submitted.`,
        type: 'SUCCESS',
        link: '/student/applications',
      },
    });

    // 7. Generate Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'APPLICATION_SUBMITTED',
        entity: 'Application',
        entityId: application.id,
        userRole: 'STUDENT',
        userId: student.userId,
        newState: 'SUBMITTED',
        reason: `Applied to ${listing.title} at ${listing.company.name}`,
      },
    });

    return application;
  }

  async findAll(query: any = {}) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.listingId) where.listingId = query.listingId;
    if (query.companyId) where.listing = { companyId: query.companyId };
    if (query.status) where.status = query.status;

    return this.prisma.application.findMany({
      where,
      include: {
        student: { include: { user: true, college: true } },
        listing: { include: { company: true } },
        offerLetter: true,
        tnpVerification: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        internship: {
          include: {
            facultyMentor: { include: { user: true } },
            companyMentor: { include: { user: true } },
            certificate: true,
            ppo: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        student: { include: { user: true, college: true } },
        listing: { include: { company: true } },
        offerLetter: true,
        tnpVerification: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        internship: {
          include: {
            facultyMentor: { include: { user: true } },
            companyMentor: { include: { user: true } },
            certificate: true,
            ppo: true,
          },
        },
      },
    });

    if (!app) throw new NotFoundException(`Application '${id}' not found`);
    return app;
  }

  async updateStatus(
    id: string,
    body: {
      status: string;
      remarks?: string;
      changedById?: string;
      changedByRole?: string;
      stipend?: number;
      designation?: string;
      joiningDate?: string;
      expiryDate?: string;
      facultyMentorId?: string;
      companyMentorId?: string;
    },
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        listing: { include: { company: { include: { mentors: true } } } },
        offerLetter: true,
      },
    });
    if (!app) throw new NotFoundException('Application not found');

    const previousStatus = app.status;
    const targetStatus = body.status;

    // Build update object
    const updateData: any = { status: targetStatus };
    if (body.remarks) updateData.companyRemarks = body.remarks;

    if (targetStatus === 'SHORTLISTED') updateData.shortlistedAt = new Date();
    if (targetStatus === 'SELECTED') updateData.selectedAt = new Date();
    if (targetStatus === 'REJECTED') {
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = body.remarks || 'Application rejected during review';
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        student: { include: { user: true } },
        listing: { include: { company: true } },
      },
    });

    // 1. Record Status History
    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        fromStatus: previousStatus,
        toStatus: targetStatus,
        changedById: body.changedById,
        changedByRole: body.changedByRole || 'COMPANY_MENTOR',
        reason: body.remarks || `Application status transitioned to ${targetStatus}`,
      },
    });

    // 2. Handle Offer Letter Issuance
    if (targetStatus === 'OFFER_ISSUED' || (targetStatus === 'SELECTED' && body.stipend !== undefined)) {
      const stipend = body.stipend !== undefined ? Number(body.stipend) : app.listing.stipend || 0;
      const designation = body.designation || `${app.listing.title} Intern`;
      const joiningDate = body.joiningDate ? new Date(body.joiningDate) : app.listing.startDate;
      const expiryDate = body.expiryDate ? new Date(body.expiryDate) : new Date(Date.now() + 7 * 86400000);

      await this.prisma.offerLetter.upsert({
        where: { applicationId: id },
        update: {
          stipend,
          designation,
          joiningDate,
          expiryDate,
          status: 'ISSUED',
        },
        create: {
          applicationId: id,
          companyId: app.listing.companyId,
          studentId: app.studentId,
          stipend,
          designation,
          joiningDate,
          expiryDate,
          status: 'ISSUED',
          offerLetterUrl: `https://storage.ilmp.edu/offers/offer_${id}.pdf`,
          terms: `Full-time internship with ${app.listing.company.name}`,
        },
      });

      // Notify Student
      await this.prisma.notification.create({
        data: {
          userId: app.student.userId,
          role: 'STUDENT',
          title: 'Offer Letter Issued! 🎉',
          message: `Congratulations! ${app.listing.company.name} has issued an offer letter for '${app.listing.title}'.`,
          type: 'SUCCESS',
          link: '/student/applications',
        },
      });
    }

    // 3. Handle Offer Acceptance by Student
    if (targetStatus === 'OFFER_ACCEPTED') {
      await this.prisma.offerLetter.updateMany({
        where: { applicationId: id },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
          studentRemarks: body.remarks || 'Accepted by student on portal',
        },
      });

      // Move to TNP_VERIFICATION_PENDING
      await this.prisma.tNPVerification.upsert({
        where: { applicationId: id },
        update: { status: 'PENDING' },
        create: {
          applicationId: id,
          status: 'PENDING',
          remarks: 'Awaiting T&P approval of accepted corporate offer',
        },
      });

      // Update status to TNP_VERIFICATION_PENDING
      await this.prisma.application.update({
        where: { id },
        data: { status: 'TNP_VERIFICATION_PENDING' },
      });
    }

    // 4. Handle T&P Verification Approval
    if (targetStatus === 'TNP_VERIFIED') {
      await this.prisma.tNPVerification.updateMany({
        where: { applicationId: id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedById: body.changedById,
          remarks: body.remarks || 'Offer verified and approved by T&P cell',
        },
      });

      // Auto-assign faculty or create Internship record
      const defaultFaculty = await this.prisma.faculty.findFirst({
        where: { department: app.student.department },
      }) || await this.prisma.faculty.findFirst();

      const defaultCompanyMentor = app.listing.company.mentors[0] || await this.prisma.companyMentor.findFirst({
        where: { companyId: app.listing.companyId },
      });

      const facultyMentorId = body.facultyMentorId || defaultFaculty?.id;
      const companyMentorId = body.companyMentorId || defaultCompanyMentor?.id;

      if (facultyMentorId && companyMentorId) {
        await this.prisma.internship.upsert({
          where: { applicationId: id },
          update: {
            facultyMentorId,
            companyMentorId,
            status: 'ACTIVE',
            joiningStatus: 'JOINED',
          },
          create: {
            applicationId: id,
            studentId: app.studentId,
            companyId: app.listing.companyId,
            facultyMentorId,
            companyMentorId,
            startDate: app.listing.startDate,
            endDate: app.listing.endDate,
            actualJoiningDate: new Date(),
            joiningStatus: 'JOINED',
            status: 'ACTIVE',
            attendancePercentage: 100.0,
            placementReadinessScore: app.student.placementReadinessScore || 85.0,
          },
        });

        // Faculty Student Assignment
        await this.prisma.facultyStudentAssignment.upsert({
          where: {
            facultyId_studentId: {
              facultyId: facultyMentorId,
              studentId: app.studentId,
            },
          },
          update: { status: 'ACTIVE' },
          create: {
            facultyId: facultyMentorId,
            studentId: app.studentId,
            assignedBy: body.changedById,
            status: 'ACTIVE',
          },
        });
      }
    }

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: `APPLICATION_${targetStatus}`,
        entity: 'Application',
        entityId: id,
        userRole: body.changedByRole || 'SYSTEM',
        userId: body.changedById,
        previousState: previousStatus,
        newState: targetStatus,
        reason: body.remarks || `Status transitioned to ${targetStatus}`,
      },
    });

    return this.findOne(id);
  }
}
