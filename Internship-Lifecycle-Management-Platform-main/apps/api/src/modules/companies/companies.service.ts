import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({ include: { mentors: { include: { user: true } }, _count: { select: { listings: true, internships: true } } } });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { mentors: { include: { user: true } }, listings: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: any) { return this.prisma.company.create({ data }); }
  async update(id: string, data: any) { return this.prisma.company.update({ where: { id }, data }); }
  async verify(id: string) { return this.prisma.company.update({ where: { id }, data: { isVerified: true, verifiedAt: new Date() } }); }
}
