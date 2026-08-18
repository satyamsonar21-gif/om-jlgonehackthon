import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    mentorId?: string;
    evaluatorRole?: string;
    type?: string; // MID_TERM, FINAL
    technicalSkills: number;
    communication: number;
    teamwork: number;
    problemSolving: number;
    punctuality: number;
    initiative?: number;
    professionalism?: number;
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
    const technical = Math.max(1, Math.min(5, Number(data.technicalSkills) || 4));
    const communication = Math.max(1, Math.min(5, Number(data.communication) || 4));
    const teamwork = Math.max(1, Math.min(5, Number(data.teamwork) || 4));
    const problemSolving = Math.max(1, Math.min(5, Number(data.problemSolving) || 4));
    const punctuality = Math.max(1, Math.min(5, Number(data.punctuality) || 4));
    const initiative = Math.max(1, Math.min(5, Number(data.initiative !== undefined ? data.initiative : 4)));
    const professionalism = Math.max(1, Math.min(5, Number(data.professionalism !== undefined ? data.professionalism : 4)));

    // Actual calculated score (un-hardcoded 5-point scale and 100-point scale)
    const rawSum = technical + communication + teamwork + problemSolving + punctuality + initiative + professionalism;
    const calculatedOverallRating = Math.round((rawSum / 7) * 10) / 10;
    const percentageScore = Math.round((rawSum / 35) * 100);

    const feedback = await this.prisma.mentorFeedback.create({
      data: {
        internshipId: data.internshipId,
        mentorId,
        evaluatorRole: data.evaluatorRole || 'COMPANY_MENTOR',
        type: data.type || 'MID_TERM',
        technicalSkills: technical,
        communication,
        problemSolving,
        punctuality,
        teamwork,
        initiative,
        professionalism,
        overallRating: calculatedOverallRating,
        comments: data.comments,
      },
      include: { mentor: { include: { user: true } } },
    });

    // Update Placement Readiness Score
    await this.prisma.internship.update({
      where: { id: data.internshipId },
      data: { placementReadinessScore: percentageScore },
    });
    await this.prisma.student.update({
      where: { id: internship.studentId },
      data: { placementReadinessScore: percentageScore },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: `${data.type === 'FINAL' ? 'Final' : 'Mid-Term'} Evaluation Published 🌟`,
        message: `${internship.company.name} published your evaluation with an overall score of ${calculatedOverallRating}/5.0 (${percentageScore}%).`,
        type: 'SUCCESS',
        link: '/student/active/feedback',
      },
    });

    return {
      feedback,
      scores: {
        overallScore: calculatedOverallRating,
        percentageScore,
        technical,
        communication,
        teamwork,
        problemSolving,
        punctuality,
        initiative,
        professionalism,
      },
    };
  }

  async findByInternship(internshipId: string) {
    const records = await this.prisma.mentorFeedback.findMany({
      where: { internshipId },
      include: { mentor: { include: { user: true } } },
      orderBy: { submittedAt: 'desc' },
    });

    return records.map((f) => {
      const sum = f.technicalSkills + f.communication + f.teamwork + f.problemSolving + f.punctuality + (f.initiative || 4) + f.professionalism;
      const calcOverall = Math.round((sum / 7) * 10) / 10;
      return {
        ...f,
        calculatedScore: {
          overallScore: calcOverall,
          percentageScore: Math.round((sum / 35) * 100),
          technical: f.technicalSkills,
          communication: f.communication,
          teamwork: f.teamwork,
          problemSolving: f.problemSolving,
          punctuality: f.punctuality,
          initiative: f.initiative || 4,
          professionalism: f.professionalism,
        },
      };
    });
  }
}
