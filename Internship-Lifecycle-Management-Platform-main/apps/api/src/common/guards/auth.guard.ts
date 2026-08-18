import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const demoUserId = request.headers['x-demo-user-id'] as string;
    const demoRole = request.headers['x-demo-role'] as string;

    let user = null;

    // 1. Direct Demo User Header ID
    if (demoUserId) {
      user = await this.prisma.user.findUnique({
        where: { id: demoUserId },
        include: {
          student: { include: { college: true } },
          faculty: { include: { college: true } },
          companyMentor: { include: { company: true } },
        },
      });
    }

    // 2. Demo Role header fallback
    if (!user && demoRole) {
      const normalizedRole = demoRole.toUpperCase();
      user = await this.prisma.user.findFirst({
        where: {
          role: {
            in: [
              normalizedRole,
              normalizedRole === 'COMPANY' ? 'COMPANY_MENTOR' : normalizedRole,
              normalizedRole === 'FACULTY' ? 'FACULTY_MENTOR' : normalizedRole,
            ],
          },
        },
        include: {
          student: { include: { college: true } },
          faculty: { include: { college: true } },
          companyMentor: { include: { company: true } },
        },
      });
    }

    // 3. Bearer Token
    if (!user && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Check if token is custom demo token
      try {
        if (token.startsWith('demo_')) {
          const roleFromToken = token.replace('demo_', '').toUpperCase();
          user = await this.prisma.user.findFirst({
            where: {
              role: {
                in: [
                  roleFromToken,
                  roleFromToken === 'COMPANY' ? 'COMPANY_MENTOR' : roleFromToken,
                  roleFromToken === 'FACULTY' ? 'FACULTY_MENTOR' : roleFromToken,
                ],
              },
            },
            include: {
              student: { include: { college: true } },
              faculty: { include: { college: true } },
              companyMentor: { include: { company: true } },
            },
          });
        } else if (process.env.CLERK_SECRET_KEY) {
          const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
          });
          if (payload && payload.sub) {
            user = await this.prisma.user.findUnique({
              where: { clerkId: payload.sub },
              include: {
                student: { include: { college: true } },
                faculty: { include: { college: true } },
                companyMentor: { include: { company: true } },
              },
            });
          }
        }
      } catch (err) {
        // Fallback or ignore clerk verification error if public
      }
    }

    // 4. Default Demo fallback for local development & jury presentation
    if (!user && !isPublic) {
      // Default to student if no token provided in development mode
      user = await this.prisma.user.findFirst({
        where: { email: 'aarav.patil@ghrce.edu' },
        include: {
          student: { include: { college: true } },
          faculty: { include: { college: true } },
          companyMentor: { include: { company: true } },
        },
      });
    }

    if (!user && !isPublic) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user) {
      request.user = user;
      request.clerkUserId = user.clerkId;
    }

    return true;
  }
}
