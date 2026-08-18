import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany({
      include: {
        user: true,
        college: true,
        studentAssignments: {
          include: { student: { include: { user: true } } },
        },
        _count: { select: { studentAssignments: true, internships: true } },
      },
    });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findFirst({
      where: {
        OR: [{ id }, { userId: id }, { facultyId: id }],
      },
      include: {
        user: true,
        college: true,
        studentAssignments: {
          include: {
            student: {
              include: {
                user: true,
                internships: {
                  include: { company: true, weeklyReports: true, certificate: true },
                },
              },
            },
          },
        },
        internships: {
          include: {
            student: { include: { user: true } },
            company: true,
            weeklyReports: true,
            riskAlerts: true,
          },
        },
      },
    });

    if (!faculty) throw new NotFoundException(`Faculty profile '${id}' not found`);
    return faculty;
  }

  async getStudents(id: string) {
    const faculty = await this.prisma.faculty.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
    });

    const facultyId = faculty ? faculty.id : id;

    return this.prisma.student.findMany({
      where: {
        OR: [
          { facultyAssignments: { some: { facultyId } } },
          { internships: { some: { facultyMentorId: facultyId } } },
        ],
      },
      include: {
        user: true,
        college: true,
        internships: {
          where: { facultyMentorId: facultyId },
          include: {
            company: true,
            weeklyReports: { orderBy: { weekNumber: 'desc' } },
            attendanceRecords: true,
            riskAlerts: true,
          },
        },
        riskAlerts: { where: { facultyMentorId: facultyId, isResolved: false } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.faculty.update({ where: { id }, data });
  }
}
