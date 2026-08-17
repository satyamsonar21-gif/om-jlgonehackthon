import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generate(internshipId: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        student: { include: { user: true, college: true } },
        company: true,
        companyMentor: { include: { user: true } },
        facultyMentor: { include: { user: true } },
        application: { include: { listing: true } },
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const certNumber = `CERT-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const verifyUrl = `${process.env.APP_URL}/verify/${certNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    const cert = await this.prisma.certificate.upsert({
      where: { internshipId },
      update: { certificateNumber: certNumber, qrCode: qrDataUrl, isRevoked: false, issuedAt: new Date() },
      create: { internshipId, certificateNumber: certNumber, qrCode: qrDataUrl },
    });

    return { certificate: cert, internship, verifyUrl };
  }

  async findByInternship(internshipId: string) {
    return this.prisma.certificate.findUnique({ where: { internshipId } });
  }

  async verify(code: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNumber: code, isRevoked: false },
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
    if (!cert) return { valid: false, message: 'Certificate not found or has been revoked' };
    return { valid: true, certificate: cert };
  }
}
