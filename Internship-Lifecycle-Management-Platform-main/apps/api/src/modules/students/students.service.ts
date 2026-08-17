import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.student.findMany({
      include: { user: true, college: true },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true, college: true, internships: { include: { company: true, facultyMentor: { include: { user: true } } } } },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, data: any) {
    return this.prisma.student.update({ where: { id }, data });
  }
}
