import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany({ include: { user: true, college: true } });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: { user: true, college: true },
    });
    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async getStudents(facultyId: string) {
    return this.prisma.student.findMany({
      where: { facultyAssignments: { some: { facultyId } } },
      include: { user: true, internships: { include: { company: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.faculty.update({ where: { id }, data });
  }
}
