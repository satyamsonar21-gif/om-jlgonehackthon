import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const where: any = { status: 'OPEN' };
    if (query.domain) where.domain = { contains: query.domain, mode: 'insensitive' };
    if (query.mode) where.mode = query.mode;
    if (query.search) where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
    return this.prisma.internshipListing.findMany({
      where,
      include: { company: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.internshipListing.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async create(data: any) {
    return this.prisma.internshipListing.create({ data, include: { company: true } });
  }

  async update(id: string, data: any) {
    return this.prisma.internshipListing.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.internshipListing.update({ where: { id }, data: { status: 'CLOSED' } });
  }
}
