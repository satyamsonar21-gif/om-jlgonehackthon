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

    if (query.search) {
      where.OR = [
        { action: { contains: query.search } },
        { entity: { contains: query.search } },
        { entityId: { contains: query.search } },
        { reason: { contains: query.search } },
        { metadata: { contains: query.search } },
        { user: { name: { contains: query.search } } },
      ];
    }

    if (query.action && query.action !== 'all') {
      where.action = query.action;
    }

    if (query.entity && query.entity !== 'all') {
      where.entity = query.entity;
    }

    if (query.userRole && query.userRole !== 'all') {
      where.userRole = query.userRole;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async exportCsv(query: any = {}) {
    const where: any = {};
    if (query.action && query.action !== 'all') where.action = query.action;
    if (query.entity && query.entity !== 'all') where.entity = query.entity;
    if (query.userRole && query.userRole !== 'all') where.userRole = query.userRole;

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Entity', 'Entity ID', 'Reason', 'Metadata'];
    const rows = logs.map((log) => [
      `"${new Date(log.createdAt).toISOString()}"`,
      `"${log.user?.name || log.userId || 'System'}"`,
      `"${log.userRole || 'SYSTEM'}"`,
      `"${log.action}"`,
      `"${log.entity}"`,
      `"${log.entityId || ''}"`,
      `"${(log.reason || '').replace(/"/g, '""')}"`,
      `"${(log.metadata || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return {
      filename: `ilmp_audit_ledger_${new Date().toISOString().split('T')[0]}.csv`,
      csv: csvContent,
    };
  }
}
