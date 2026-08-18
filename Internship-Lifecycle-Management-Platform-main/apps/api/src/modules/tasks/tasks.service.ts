import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    internshipId: string;
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
    dueDate?: string;
    assignedById?: string;
    assignedByName?: string;
    assignedByRole?: string;
    attachments?: string;
  }) {
    const internship = await this.prisma.internship.findUnique({
      where: { id: data.internshipId },
      include: { companyMentor: true, student: { include: { user: true } } },
    });
    if (!internship) throw new NotFoundException('Internship not found');

    const assignedById = data.assignedById || internship.companyMentorId;
    const dueDate = data.deadline || data.dueDate ? new Date(data.deadline || data.dueDate!) : null;
    const priority = (data.priority || 'MEDIUM').toUpperCase();

    const task = await this.prisma.task.create({
      data: {
        internshipId: data.internshipId,
        title: data.title,
        description: data.description,
        priority,
        dueDate,
        status: 'TODO',
        assignedById,
        assignedByName: data.assignedByName || 'Industry Supervisor',
        assignedByRole: data.assignedByRole || 'COMPANY_MENTOR',
        attachments: data.attachments,
        comments: JSON.stringify([]),
      },
      include: { assignedBy: { include: { user: true } } },
    });

    // Notify Student
    if (internship.student?.userId) {
      await this.prisma.notification.create({
        data: {
          userId: internship.student.userId,
          role: 'STUDENT',
          title: `New Task: ${data.title} [${priority}] 📋`,
          message: `Your supervisor assigned a new task: '${data.title}'.`,
          type: 'INFO',
          link: '/student/active/tasks',
        },
      });
    }

    return task;
  }

  async findByInternship(internshipId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { internshipId },
      include: { assignedBy: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Auto compute OVERDUE state if deadline passed and not completed
    const now = new Date();
    return tasks.map((t) => {
      let computedStatus = t.status;
      if (t.dueDate && new Date(t.dueDate) < now && !['COMPLETED', 'SUBMITTED'].includes(t.status)) {
        computedStatus = 'OVERDUE';
      }
      return {
        ...t,
        status: computedStatus,
      };
    });
  }

  async update(id: string, data: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const updateData: any = { ...data };
    if (data.deadline || data.dueDate) {
      updateData.dueDate = new Date(data.deadline || data.dueDate);
      delete updateData.deadline;
    }

    // Append comment thread if new comment provided
    if (data.newComment) {
      let existingComments: any[] = [];
      try {
        existingComments = task.comments ? JSON.parse(task.comments) : [];
      } catch {
        existingComments = [];
      }
      existingComments.push({
        id: `com_${Date.now()}`,
        author: data.authorName || 'Collaborator',
        role: data.authorRole || 'STUDENT',
        message: data.newComment,
        createdAt: new Date().toISOString(),
      });
      updateData.comments = JSON.stringify(existingComments);
      delete updateData.newComment;
      delete updateData.authorName;
      delete updateData.authorRole;
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }
}
