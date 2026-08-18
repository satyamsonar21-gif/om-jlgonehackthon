import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async exportCsv(type: string, query: any = {}) {
    const normalizedType = type.toLowerCase();

    if (normalizedType === 'students') {
      const students = await this.prisma.student.findMany({
        include: { user: true, college: true },
        orderBy: { studentId: 'asc' },
      });

      const header = 'Student ID,Name,Email,Department,Year,CGPA,Active Backlogs,Verification Status,Profile Completion,Placement Score\n';
      const rows = students
        .map((s) =>
          [
            `"${s.studentId}"`,
            `"${s.user.name}"`,
            `"${s.user.email}"`,
            `"${s.department}"`,
            s.year,
            s.cgpa || 'N/A',
            s.activeBacklogs,
            `"${s.verificationStatus}"`,
            `"${s.profileCompletion}%"`,
            s.placementReadinessScore || 'N/A',
          ].join(','),
        )
        .join('\n');

      return { filename: 'students_report.csv', contentType: 'text/csv', csv: header + rows };
    }

    if (normalizedType === 'companies') {
      const companies = await this.prisma.company.findMany({
        include: { _count: { select: { listings: true, internships: true } } },
        orderBy: { name: 'asc' },
      });

      const header = 'Company Name,Domain,Location,Contact Person,Contact Email,Verified,Listings Count,Interns Hired\n';
      const rows = companies
        .map((c) =>
          [
            `"${c.name}"`,
            `"${c.domain || 'N/A'}"`,
            `"${c.location || 'N/A'}"`,
            `"${c.contactPerson || 'N/A'}"`,
            `"${c.contactEmail || 'N/A'}"`,
            c.isVerified ? 'YES' : 'NO',
            c._count.listings,
            c._count.internships,
          ].join(','),
        )
        .join('\n');

      return { filename: 'companies_report.csv', contentType: 'text/csv', csv: header + rows };
    }

    if (normalizedType === 'internships' || normalizedType === 'completions') {
      const internships = await this.prisma.internship.findMany({
        include: {
          student: { include: { user: true } },
          company: true,
          facultyMentor: { include: { user: true } },
          certificate: true,
          ppo: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const header = 'Student Name,Student ID,Department,Company,Faculty Guide,Attendance %,Status,Certificate Number,PPO Status\n';
      const rows = internships
        .map((i) =>
          [
            `"${i.student.user.name}"`,
            `"${i.student.studentId}"`,
            `"${i.student.department}"`,
            `"${i.company.name}"`,
            `"${i.facultyMentor.user.name}"`,
            `"${i.attendancePercentage.toFixed(1)}%"`,
            `"${i.status}"`,
            `"${i.certificate?.certificateNumber || 'N/A'}"`,
            `"${i.ppo?.status || 'N/A'}"`,
          ].join(','),
        )
        .join('\n');

      return { filename: 'internship_lifecycle_report.csv', contentType: 'text/csv', csv: header + rows };
    }

    throw new BadRequestException(`Unknown report type '${type}'. Supported types: students, companies, internships, completions.`);
  }
}
