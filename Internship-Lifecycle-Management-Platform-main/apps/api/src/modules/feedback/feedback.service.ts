import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    mentorId?: string;
    evaluatorRole?: string;
    type?: string;
    technicalSkills: number;
    communication: number;
    problemSolving: number;
    punctuality: number;
    teamwork: number;
    professionalism?: number;
    overallRating: number;
    comments?: string;
  }) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: data.internshipId },
      include: {
        student: { include: { user: true } },
        company: true,
        companyMentor: true,
      },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const mentorId = data.mentorId || internship.companyMentorId;
    const professionalism = data.professionalism !== undefined ? Number(data.professionalism) : 5;

    const feedback = await this.prisma.mentorFeedback.create({
      data: {
        internshipId: data.internshipId,
        mentorId,
        evaluatorRole: data.evaluatorRole || 'COMPANY_MENTOR',
        type: data.type || 'MID_TERM',
        technicalSkills: Number(data.technicalSkills),
        communication: Number(data.communication),
        problemSolving: Number(data.problemSolving),
        punctuality: Number(data.punctuality),
        teamwork: Number(data.teamwork),
        professionalism,
        overallRating: Number(data.overallRating),
        comments: data.comments,
      },
      include: { mentor: { include: { user: true } } },
    });

    const averageRating = (
      Number(data.technicalSkills) +
      Number(data.communication) +
      Number(data.problemSolving) +
      Number(data.punctuality) +
      Number(data.teamwork) +
      professionalism +
      Number(data.overallRating)
    ) / 7;

    // Update Placement Readiness Score
    const newPlacementScore = Math.round(averageRating * 20); // 5-star converted to 100-point scale
    await this.prisma.internship.update({
      where: { id: data.internshipId },
      data: { placementReadinessScore: newPlacementScore },
    });
    await this.prisma.student.update({
      where: { id: internship.studentId },
      data: { placementReadinessScore: newPlacementScore },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: 'Performance Evaluation Received 🌟',
        message: `${internship.company.name} submitted a ${data.type || 'Milestone'} evaluation (Rating: ${data.overallRating}/5).`,
        type: 'SUCCESS',
        link: '/student/active/feedback',
      },
    });

    return { feedback, averageRating: Math.round(averageRating * 10) / 10 };
  }

  async findByInternship(internshipId: string) {
    return this.prisma.mentorFeedback.findMany({
      where: { internshipId },
      include: { mentor: { include: { user: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
