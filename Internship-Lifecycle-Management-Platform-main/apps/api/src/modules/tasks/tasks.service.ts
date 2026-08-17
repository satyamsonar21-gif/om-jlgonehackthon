import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.task.create({ data }); }

  async findByInternship(internshipId: string) {
    return this.prisma.task.findMany({ where: { internshipId }, include: { assignedBy: { include: { user: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: any) { return this.prisma.task.update({ where: { id }, data }); }
}
