import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; title: string; message: string; type?: string; link?: string }) {
    return this.prisma.notification.create({
      data: { userId: data.userId, title: data.title, message: data.message, type: (data.type as any) || 'INFO', link: data.link },
    });
  }

  async getForUser(userId: string, query: any) {
    const where: any = { userId };
    if (query.unread === 'true') where.isRead = false;
    return this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }
}
