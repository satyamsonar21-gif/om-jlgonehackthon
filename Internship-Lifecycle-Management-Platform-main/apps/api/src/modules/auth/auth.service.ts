import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(clerkId: string, data: { email: string; name: string; role?: string }) {
    const user = await this.prisma.user.upsert({
      where: { clerkId },
      update: { name: data.name, email: data.email },
      create: {
        clerkId,
        email: data.email,
        name: data.name,
        role: (data.role as any) || 'STUDENT',
      },
    });
    return user;
  }

  async getMe(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
