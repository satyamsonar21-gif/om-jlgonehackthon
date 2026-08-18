import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private uploadDir = path.resolve(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: any, folder: string = 'general') {
    if (!file) {
      // Return simulated link if no actual file payload was passed
      const simName = `doc_${Date.now()}.pdf`;
      return {
        url: `https://storage.ilmp.edu/${folder}/${simName}`,
        fileName: simName,
        size: 250000,
        mimeType: 'application/pdf',
      };
    }

    const ext = path.extname(file.originalname || 'doc.pdf') || '.pdf';
    const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3001';
    const fileUrl = `${appUrl}/uploads/${fileName}`;

    return {
      url: fileUrl,
      fileName: file.originalname || fileName,
      size: file.size || file.buffer?.length || 100000,
      mimeType: file.mimetype || 'application/pdf',
    };
  }

  async uploadResume(file: any, studentId: string) {
    const uploaded = await this.uploadFile(file, 'resumes');
    if (studentId) {
      const student = await this.prisma.student.findFirst({
        where: { OR: [{ id: studentId }, { userId: studentId }] },
      });
      if (student) {
        await this.prisma.student.update({
          where: { id: student.id },
          data: { resumeUrl: uploaded.url },
        });

        await this.prisma.document.create({
          data: {
            title: `${student.studentId} Resume`,
            type: 'RESUME',
            fileUrl: uploaded.url,
            fileName: uploaded.fileName,
            fileSize: uploaded.size,
            mimeType: uploaded.mimeType,
            status: 'VERIFIED',
            uploadedById: student.userId,
            studentId: student.id,
          },
        });
      }
    }
    return uploaded;
  }

  async createDocument(data: {
    title: string;
    type: string;
    fileUrl?: string;
    fileName?: string;
    uploadedById: string;
    studentId?: string;
    companyId?: string;
    internshipId?: string;
    remarks?: string;
  }) {
    return this.prisma.document.create({
      data: {
        title: data.title,
        type: data.type,
        fileUrl: data.fileUrl || `https://storage.ilmp.edu/docs/${Date.now()}.pdf`,
        fileName: data.fileName || `${data.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        status: 'PENDING_REVIEW',
        uploadedById: data.uploadedById,
        studentId: data.studentId,
        companyId: data.companyId,
        internshipId: data.internshipId,
        remarks: data.remarks,
      },
      include: { student: { include: { user: true } }, company: true },
    });
  }

  async getDocuments(query: any = {}) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.companyId) where.companyId = query.companyId;
    if (query.internshipId) where.internshipId = query.internshipId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    return this.prisma.document.findMany({
      where,
      include: {
        uploadedBy: true,
        student: { include: { user: true } },
        company: true,
        internship: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyDocument(id: string, body: { status: string; remarks?: string; verifiedById?: string }) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        status: body.status,
        remarks: body.remarks,
        verifiedById: body.verifiedById,
        verifiedAt: new Date(),
      },
      include: { student: { include: { user: true } } },
    });

    // Notify Student if attached
    if (updated.student?.userId) {
      await this.prisma.notification.create({
        data: {
          userId: updated.student.userId,
          role: 'STUDENT',
          title: `Document ${body.status === 'VERIFIED' ? 'Verified ✅' : 'Status Updated'}`,
          message: `${updated.title}: ${body.remarks || `Marked as ${body.status}`}.`,
          type: body.status === 'VERIFIED' ? 'SUCCESS' : 'WARNING',
        },
      });
    }

    return updated;
  }

  async getChecklist(internshipId: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        application: { include: { offerLetter: true, tnpVerification: true } },
        weeklyReports: true,
        feedback: true,
        certificate: true,
        ppo: true,
        documents: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const offerLetter = internship.application.offerLetter;
    const tnp = internship.application.tnpVerification;
    const weeklyReportsApproved = internship.weeklyReports.filter((r) => r.status === 'APPROVED').length;
    const feedbackCompleted = internship.feedback.length > 0;

    return {
      checklist: [
        {
          item: 'Offer Letter',
          status: offerLetter?.status === 'ACCEPTED' ? 'VERIFIED' : offerLetter?.status || 'PENDING',
          required: true,
          completed: offerLetter?.status === 'ACCEPTED',
        },
        {
          item: 'T&P Placement Verification',
          status: tnp?.status === 'VERIFIED' ? 'VERIFIED' : tnp?.status || 'PENDING',
          required: true,
          completed: tnp?.status === 'VERIFIED',
        },
        {
          item: 'Joining Confirmation & Document',
          status: internship.joiningStatus === 'JOINED' ? 'VERIFIED' : 'PENDING',
          required: true,
          completed: internship.joiningStatus === 'JOINED',
        },
        {
          item: 'Weekly Synthesis Reports',
          status: `${weeklyReportsApproved} Approved`,
          required: true,
          completed: weeklyReportsApproved >= 4,
        },
        {
          item: 'Company Performance Evaluation',
          status: feedbackCompleted ? 'VERIFIED' : 'PENDING',
          required: true,
          completed: feedbackCompleted,
        },
        {
          item: 'Completion Certificate',
          status: internship.certificate ? 'ISSUED' : 'LOCKED',
          required: false,
          completed: Boolean(internship.certificate),
        },
        {
          item: 'PPO Status',
          status: internship.ppo?.status || 'NOT_APPLICABLE',
          required: false,
          completed: Boolean(internship.ppo && internship.ppo.status === 'ACCEPTED'),
        },
      ],
    };
  }

  async getSignedUrl(path: string) {
    return { signedUrl: `https://storage.ilmp.edu/signed/${path}` };
  }
}
