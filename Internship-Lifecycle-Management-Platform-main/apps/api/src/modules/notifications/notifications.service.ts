import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from './email.service';

export interface CreateNotificationDto {
  userId: string;
  role?: string;
  title: string;
  message: string;
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'ACTION_REQUIRED';
  category?:
    | 'application'
    | 'approval'
    | 'rejection'
    | 'interview'
    | 'task'
    | 'report'
    | 'attendance'
    | 'certificate'
    | 'system';
  actionLabel?: string;
  link?: string;
  metadata?: string;
  sendEmail?: boolean;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        role: data.role,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        category: data.category || 'system',
        actionLabel: data.actionLabel,
        link: data.link,
        metadata: data.metadata,
      },
    });

    // Check notification preferences for transactional email dispatch
    if (data.sendEmail !== false) {
      try {
        const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
        if (user && user.email) {
          const pref = await this.getPreferences(data.userId);
          if (pref.emailNotifications) {
            // Category check
            const cat = data.category || 'system';
            let shouldSend = true;
            if (cat === 'application' && !pref.applicationAlerts) shouldSend = false;
            if (cat === 'task' && !pref.taskAlerts) shouldSend = false;
            if (cat === 'report' && !pref.reportReminders) shouldSend = false;
            if (cat === 'attendance' && !pref.attendanceWarnings) shouldSend = false;
            if (cat === 'certificate' && !pref.certificateAlerts) shouldSend = false;
            if (cat === 'system' && !pref.systemAnnouncements) shouldSend = false;

            if (shouldSend) {
              await this.emailService.sendEmail({
                to: user.email,
                subject: data.title,
                category: cat,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #0f172a; margin-top: 0;">${data.title}</h2>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6;">${data.message}</p>
                    ${
                      data.link
                        ? `<a href="${data.link}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; margin-top: 10px;">${data.actionLabel || 'View Details'}</a>`
                        : ''
                    }
                  </div>
                `,
              });
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`Failed to dispatch email for notification ${notification.id}: ${err.message}`);
      }
    }

    return notification;
  }

  async getForUser(userId: string, query: any = {}) {
    const where: any = { userId };

    if (query.unread === 'true') {
      where.isRead = false;
    }

    if (query.category && query.category !== 'all') {
      where.category = query.category;
    }

    if (query.type && query.type !== 'all') {
      where.type = query.type;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit ? Number(query.limit) : 50,
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async getPreferences(userId: string) {
    let pref = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await this.prisma.notificationPreference.create({
        data: {
          userId,
          emailNotifications: true,
          applicationAlerts: true,
          taskAlerts: true,
          reportReminders: true,
          attendanceWarnings: true,
          certificateAlerts: true,
          systemAnnouncements: true,
        },
      });
    }

    return pref;
  }

  async updatePreferences(userId: string, data: any) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        emailNotifications: data.emailNotifications ?? true,
        applicationAlerts: data.applicationAlerts ?? true,
        taskAlerts: data.taskAlerts ?? true,
        reportReminders: data.reportReminders ?? true,
        attendanceWarnings: data.attendanceWarnings ?? true,
        certificateAlerts: data.certificateAlerts ?? true,
        systemAnnouncements: data.systemAnnouncements ?? true,
      },
      update: {
        emailNotifications: data.emailNotifications,
        applicationAlerts: data.applicationAlerts,
        taskAlerts: data.taskAlerts,
        reportReminders: data.reportReminders,
        attendanceWarnings: data.attendanceWarnings,
        certificateAlerts: data.certificateAlerts,
        systemAnnouncements: data.systemAnnouncements,
      },
    });
  }
}
