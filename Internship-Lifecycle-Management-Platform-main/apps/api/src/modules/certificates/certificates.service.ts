import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generate(internshipId: string, force: boolean = false) {
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
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    // Completion Gatekeeper
    if (!force && internship.status !== 'COMPLETED') {
      const blockers: string[] = [];

      // 1. Weekly Reports check
      const totalReports = internship.weeklyReports.length;
      const approvedReports = internship.weeklyReports.filter((r) => r.status === 'APPROVED').length;
      if (totalReports === 0 || approvedReports < Math.min(totalReports, 4)) {
        blockers.push(`Synthesis reports incomplete (${approvedReports}/${totalReports} approved)`);
      }

      // 2. Attendance Check
      if (internship.attendancePercentage < 75.0 && internship.attendanceRecords.length > 0) {
        blockers.push(`Attendance rate (${internship.attendancePercentage.toFixed(1)}%) is below institutional threshold (75%)`);
      }

      // 3. Evaluation Check
      if (internship.feedback.length === 0) {
        blockers.push('Company mentor performance evaluation has not been submitted');
      }

      if (blockers.length > 0) {
        throw new BadRequestException(
          `Certificate issuance blocked: ${blockers.join('; ')}`,
        );
      }
    }

    const certNumber = `CERT-${new Date().getFullYear()}-GHR-${randomBytes(3).toString('hex').toUpperCase()}`;
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
        issuedAt: new Date(),
        metadata: JSON.stringify({
          studentName: internship.student.user.name,
          studentId: internship.student.studentId,
          college: internship.student.college.name,
          company: internship.company.name,
          role: internship.application.listing.title,
          duration: `${internship.application.listing.durationWeeks || 8} Weeks`,
          attendance: `${internship.attendancePercentage.toFixed(1)}%`,
          issuedOn: new Date().toISOString(),
        }),
      },
      create: {
        internshipId,
        certificateNumber: certNumber,
        verificationHash,
        qrCode: qrDataUrl,
        issuedAt: new Date(),
        metadata: JSON.stringify({
          studentName: internship.student.user.name,
          studentId: internship.student.studentId,
          college: internship.student.college.name,
          company: internship.company.name,
          role: internship.application.listing.title,
          duration: `${internship.application.listing.durationWeeks || 8} Weeks`,
          attendance: `${internship.attendancePercentage.toFixed(1)}%`,
          issuedOn: new Date().toISOString(),
        }),
      },
    });

    // Mark internship as COMPLETED if not already
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
        title: 'Completion Certificate Issued 🎓',
        message: `Your verified internship certificate (${certNumber}) for ${internship.company.name} is ready for download.`,
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
        isRevoked: false,
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
        message: 'Certificate not found or has been revoked in the institutional registry.',
      };
    }

    return {
      valid: true,
      certificateNumber: cert.certificateNumber,
      verificationHash: cert.verificationHash,
      issuedAt: cert.issuedAt,
      studentName: cert.internship.student.user.name,
      studentId: cert.internship.student.studentId,
      college: cert.internship.student.college.name,
      company: cert.internship.company.name,
      role: cert.internship.application.listing.title,
      duration: `${cert.internship.application.listing.durationWeeks || 8} Weeks`,
      attendance: `${cert.internship.attendancePercentage.toFixed(1)}%`,
      status: 'VERIFIED_AUTHENTIC',
      certificate: cert,
    };
  }
}
