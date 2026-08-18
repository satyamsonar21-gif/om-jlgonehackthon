import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async facultyApprove(internshipId: string, facultyId?: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: internshipId },
      include: { feedback: true, student: { include: { user: true } } },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    if (internship.feedback.length === 0) {
      throw new BadRequestException('Faculty approval requires mentor evaluation to be completed first.');
    }

    const cert = await this.prisma.certificate.upsert({
      where: { internshipId },
      update: {
        facultyApprovedAt: new Date(),
      },
      create: {
        internshipId,
        certificateNumber: `PENDING-${randomBytes(3).toString('hex').toUpperCase()}`,
        verificationHash: `pending_${Date.now()}`,
        qrCode: '',
        facultyApprovedAt: new Date(),
      },
    });

    return { message: 'Faculty approval recorded.', certificate: cert };
  }

  async adminApproveAndIssue(internshipId: string, adminId?: string) {
    return this.generate(internshipId, false, adminId);
  }

  async generate(internshipId: string, force: boolean = false, adminId?: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        student: { include: { user: true, college: true } },
        company: true,
        companyMentor: { include: { user: true } },
        facultyMentor: { include: { user: true } },
        application: { include: { listing: true } },
        weeklyReports: true,
        attendanceRecords: true,
        feedback: true,
        certificate: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    // Completion & Approval Gatekeeper
    if (!force) {
      const blockers: string[] = [];

      // 1. Weekly Reports check
      const totalReports = internship.weeklyReports.length;
      const approvedReports = internship.weeklyReports.filter((r) => r.status === 'APPROVED' || r.status === 'FINAL_APPROVED').length;
      if (totalReports > 0 && approvedReports === 0) {
        blockers.push(`Synthesis reports pending faculty review (${approvedReports}/${totalReports} approved)`);
      }

      // 2. Attendance Check
      if (internship.attendancePercentage < 75.0 && internship.attendanceRecords.length >= 3) {
        blockers.push(`Attendance rate (${internship.attendancePercentage.toFixed(1)}%) is below institutional threshold (75%)`);
      }

      // 3. Mentor Evaluation Check
      if (internship.feedback.length === 0) {
        blockers.push('Company mentor performance evaluation has not been submitted');
      }

      if (blockers.length > 0) {
        throw new BadRequestException(
          `Certificate issuance blocked: ${blockers.join('; ')}`
        );
      }
    }

    const collegeCode = internship.student?.college?.code?.split('-')?.[0] || 'GHRCE';
    const certNumber = `CERT-${new Date().getFullYear()}-${collegeCode}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const rawData = `${certNumber}-${internship.studentId}-${internship.companyId}-${Date.now()}`;
    const verificationHash = '0x' + createHash('sha256').update(rawData).digest('hex');

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify/${certNumber}`;
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(verifyUrl);
    } catch {
      qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`;
    }

    const cert = await this.prisma.certificate.upsert({
      where: { internshipId },
      update: {
        certificateNumber: certNumber,
        verificationHash,
        qrCode: qrDataUrl,
        isRevoked: false,
        facultyApprovedAt: internship.certificate?.facultyApprovedAt || new Date(),
        adminApprovedAt: new Date(),
        issuedAt: new Date(),
        metadata: JSON.stringify({
          studentName: internship.student.user.name,
          college: internship.student.college.name,
          company: internship.company.name,
          role: internship.application.listing.title,
          domain: internship.application.listing.domain,
          duration: `${internship.application.listing.durationWeeks || 8} Weeks`,
          startDate: internship.startDate.toISOString().split('T')[0],
          endDate: internship.endDate.toISOString().split('T')[0],
          issuedOn: new Date().toISOString(),
        }),
      },
      create: {
        internshipId,
        certificateNumber: certNumber,
        verificationHash,
        qrCode: qrDataUrl,
        facultyApprovedAt: new Date(),
        adminApprovedAt: new Date(),
        issuedAt: new Date(),
        metadata: JSON.stringify({
          studentName: internship.student.user.name,
          college: internship.student.college.name,
          company: internship.company.name,
          role: internship.application.listing.title,
          domain: internship.application.listing.domain,
          duration: `${internship.application.listing.durationWeeks || 8} Weeks`,
          startDate: internship.startDate.toISOString().split('T')[0],
          endDate: internship.endDate.toISOString().split('T')[0],
          issuedOn: new Date().toISOString(),
        }),
      },
    });

    // Mark internship as COMPLETED
    await this.prisma.internship.update({
      where: { id: internshipId },
      data: {
        status: 'COMPLETED',
        completionApprovedAt: new Date(),
      },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: 'Institutional Certificate Issued 🎓',
        message: `Your verified internship certificate (${certNumber}) for ${internship.company.name} has been generated.`,
        type: 'SUCCESS',
        link: '/student/certificates',
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'CERTIFICATE_ISSUED',
        entity: 'Certificate',
        entityId: certNumber,
        userRole: 'ADMIN',
        newState: 'ISSUED',
        reason: `Cryptographic certificate generated for ${internship.student.user.name}`,
      },
    });

    return { certificate: cert, internship, verifyUrl };
  }

  async findByInternship(internshipId: string) {
    return this.prisma.certificate.findUnique({
      where: { internshipId },
      include: {
        internship: {
          include: {
            student: { include: { user: true, college: true } },
            company: true,
            application: { include: { listing: true } },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.certificate.findMany({
      include: {
        internship: {
          include: {
            student: { include: { user: true, college: true } },
            company: true,
            application: { include: { listing: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async verify(code: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ certificateNumber: code }, { verificationHash: code }, { id: code }],
      },
      include: {
        internship: {
          include: {
            student: { include: { user: true, college: true } },
            company: true,
            application: { include: { listing: true } },
          },
        },
      },
    });

    if (!cert) {
      return {
        valid: false,
        status: 'NOT_FOUND',
        message: 'No institutional certificate record matches this identifier.',
      };
    }

    if (cert.isRevoked) {
      return {
        valid: false,
        status: 'REVOKED',
        certificateNumber: cert.certificateNumber,
        revocationReason: cert.revocationReason || 'Revoked by institution administration',
        message: 'This certificate has been revoked and is no longer authentic.',
      };
    }

    // PRIVACY POLICY ENFORCEMENT:
    // Only expose information intended for public verification.
    // DO NOT expose private student data (email, phone, roll number, CGPA, backlogs, etc.).
    const listing = cert.internship?.application?.listing;
    const durationWeeks = listing?.durationWeeks || 8;

    return {
      valid: true,
      status: 'VERIFIED',
      certificateNumber: cert.certificateNumber,
      verificationHash: cert.verificationHash,
      studentName: cert.internship.student.user.name,
      collegeName: cert.internship.student.college.name,
      companyName: cert.internship.company.name,
      internshipTitle: listing?.title || 'Engineering Intern',
      domain: listing?.domain || 'Software Engineering',
      duration: `${durationWeeks} Weeks`,
      startDate: cert.internship.startDate.toISOString().split('T')[0],
      endDate: cert.internship.endDate.toISOString().split('T')[0],
      issuedAt: cert.issuedAt.toISOString().split('T')[0],
      isRevoked: cert.isRevoked,
      qrCode: cert.qrCode,
      registryStatus: 'OFFICIALLY_AUTHENTICATED',
    };
  }
}
