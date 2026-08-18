import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    title: string;
    description?: string;
    dueDate?: string;
    assignedById?: string;
  }) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: data.internshipId },
      include: { companyMentor: true, student: { include: { user: true } } },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const assignedById = data.assignedById || internship.companyMentorId;

    const task = await this.prisma.task.create({
      data: {
        internshipId: data.internshipId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: 'PENDING',
        assignedById,
      },
      include: { assignedBy: { include: { user: true } } },
    });

    // Notify Student
    await this.prisma.notification.create({
      data: {
        userId: internship.student.userId,
        role: 'STUDENT',
        title: 'New Sprint Task Assigned 📋',
        message: `Task: '${data.title}' has been assigned by your mentor.`,
        type: 'INFO',
        link: '/student/active/tasks',
      },
    });

    return task;
  }

  async findByInternship(internshipId: string) {
    return this.prisma.task.findMany({
      where: { internshipId },
      include: { assignedBy: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }
}
