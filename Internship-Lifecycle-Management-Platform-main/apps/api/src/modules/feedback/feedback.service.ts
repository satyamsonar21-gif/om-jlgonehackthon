import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const feedback = await this.prisma.mentorFeedback.create({ data });
    const avgScore = (data.technicalSkills + data.communication + data.problemSolving + data.punctuality + data.teamwork + data.overallRating) / 6;
    return { feedback, avgScore };
  }

  async findByInternship(internshipId: string) {
    return this.prisma.mentorFeedback.findMany({
      where: { internshipId },
      include: { mentor: { include: { user: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
