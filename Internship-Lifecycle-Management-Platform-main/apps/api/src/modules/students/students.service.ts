import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.department) where.department = { contains: query.department };
    if (query?.verificationStatus) where.verificationStatus = query.verificationStatus;
    if (query?.search) {
      where.OR = [
        { studentId: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
        { skills: { contains: query.search } },
      ];
    }

    return this.prisma.student.findMany({
      where,
      include: {
        user: true,
        college: true,
        applications: {
          include: { listing: { include: { company: true } } },
        },
        internships: {
          include: {
            company: true,
            facultyMentor: { include: { user: true } },
            certificate: true,
            ppo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [{ id }, { userId: id }, { studentId: id }],
      },
      include: {
        user: true,
        college: true,
        applications: {
          include: {
            listing: { include: { company: true } },
            offerLetter: true,
            tnpVerification: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
          orderBy: { submittedAt: 'desc' },
        },
        internships: {
          include: {
            company: true,
            facultyMentor: { include: { user: true } },
            companyMentor: { include: { user: true } },
            attendanceRecords: { orderBy: { date: 'desc' } },
            dailyLogs: { orderBy: { date: 'desc' } },
            weeklyReports: { orderBy: { weekNumber: 'asc' } },
            feedback: true,
            tasks: true,
            certificate: true,
            ppo: true,
          },
        },
        facultyAssignments: {
          include: { faculty: { include: { user: true } } },
        },
        documents: { orderBy: { createdAt: 'desc' } },
        riskAlerts: { orderBy: { createdAt: 'desc' } },
        aiRecommendations: {
          include: { listing: { include: { company: true } } },
        },
      },
    });

    if (!student) throw new NotFoundException(`Student profile '${id}' not found`);
    return student;
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });
    if (!existing) throw new NotFoundException('Student profile not found');

    // Calculate dynamic completeness score
    const merged = { ...existing, ...data };
    let score = 0;
    if (merged.department && merged.year) score += 20;
    if (merged.cgpa !== undefined && merged.cgpa !== null) score += 20;
    if (merged.skills && merged.skills.length > 0) score += 20;
    if (merged.resumeUrl) score += 20;
    if (merged.certifications || merged.experience || merged.githubUrl || merged.linkedinUrl) score += 20;

    data.profileCompletion = score;

    return this.prisma.student.update({
      where: { id: existing.id },
      data,
      include: { user: true, college: true },
    });
  }

  async verifyProfile(id: string, body: { status: string; remarks?: string; verifiedBy?: string }) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student not found');

    const previousStatus = student.verificationStatus;

    const updated = await this.prisma.student.update({
      where: { id: student.id },
      data: {
        verificationStatus: body.status,
        verificationRemarks: body.remarks,
        verifiedAt: new Date(),
        verifiedBy: body.verifiedBy || 'T&P Office',
      },
      include: { user: true },
    });

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: `STUDENT_PROFILE_${body.status}`,
        entity: 'Student',
        entityId: student.id,
        userRole: 'TNP_ADMIN',
        previousState: previousStatus,
        newState: body.status,
        reason: body.remarks || `Student profile status changed to ${body.status}`,
      },
    });

    // Send Notification
    await this.prisma.notification.create({
      data: {
        userId: student.userId,
        role: 'STUDENT',
        title: `Profile ${body.status === 'VERIFIED' ? 'Verified ✅' : 'Status Updated'}`,
        message: body.remarks || `Your academic profile has been marked as ${body.status} by T&P Administration.`,
        type: body.status === 'VERIFIED' ? 'SUCCESS' : body.status === 'REJECTED' ? 'ERROR' : 'WARNING',
        link: '/student/profile',
      },
    });

    return updated;
  }
}
