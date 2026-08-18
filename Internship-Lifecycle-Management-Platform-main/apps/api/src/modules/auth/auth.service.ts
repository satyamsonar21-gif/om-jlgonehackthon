import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(clerkId: string, data: { email: string; name: string; role?: string; phone?: string }) {
    const role = (data.role?.toUpperCase() as any) || 'STUDENT';
    const user = await this.prisma.user.upsert({
      where: { clerkId },
      update: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: role === 'COMPANY' ? 'COMPANY_MENTOR' : role === 'FACULTY' ? 'FACULTY_MENTOR' : role,
      },
      create: {
        clerkId,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: role === 'COMPANY' ? 'COMPANY_MENTOR' : role === 'FACULTY' ? 'FACULTY_MENTOR' : role,
      },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });
    return user;
  }

  async getMe(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { clerkId: identifier }, { email: identifier }],
      },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async login(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException(`Account with email ${email} not found.`);
    }

    return {
      token: `demo_${user.role.toLowerCase()}`,
      user,
    };
  }

  async getDemoUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return users;
  }

  async switchRole(targetRole: string) {
    const normalized = targetRole.toUpperCase();
    let queryRole: string[] = [normalized];
    if (normalized === 'COMPANY' || normalized === 'COMPANY_MENTOR') queryRole = ['COMPANY', 'COMPANY_MENTOR'];
    if (normalized === 'FACULTY' || normalized === 'FACULTY_MENTOR') queryRole = ['FACULTY', 'FACULTY_MENTOR'];
    if (normalized === 'TNP_ADMIN') queryRole = ['TNP_ADMIN'];
    if (normalized === 'ADMIN' || normalized === 'HOD_ADMIN') queryRole = ['ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'];

    const user = await this.prisma.user.findFirst({
      where: { role: { in: queryRole } },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`No demo account found for role ${targetRole}`);
    }

    return {
      token: `demo_${user.role.toLowerCase()}`,
      user,
    };
  }
}
