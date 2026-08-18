import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    userRole?: string;
    previousState?: string;
    newState?: string;
    reason?: string;
    metadata?: string;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
        userRole: data.userRole,
        previousState: data.previousState,
        newState: data.newState,
        reason: data.reason,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
      },
    });
  }

  async findAll(query: any = {}) {
    const where: any = {};
    if (query.action) where.action = { contains: query.action };
    if (query.entity) where.entity = query.entity;
    if (query.userRole) where.userRole = query.userRole;
    if (query.userId) where.userId = query.userId;

    return this.prisma.auditLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: query.limit ? Number(query.limit) : 100,
    });
  }
}
