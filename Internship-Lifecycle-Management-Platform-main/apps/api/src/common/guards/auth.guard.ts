import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'ilmp_production_secure_jwt_secret_2026';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  private verifyCustomJwt(token: string): { sub: string; email: string; role: string; exp: number } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${parts[0]}.${parts[1]}`)
        .digest('base64url');

      if (expectedSignature !== parts[2]) return null;

      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Session expired. Please sign in again.');
      }

      return payload;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      return null;
    }
  }

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

    // 1. Bearer Token Check (Standard JWT or Demo Token)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // A. Custom Signed JWT
      const jwtPayload = this.verifyCustomJwt(token);
      if (jwtPayload && jwtPayload.sub) {
        user = await this.prisma.user.findFirst({
          where: {
            OR: [{ id: jwtPayload.sub }, { email: jwtPayload.email }],
          },
          include: {
            student: { include: { college: true } },
            faculty: { include: { college: true } },
            companyMentor: { include: { company: true } },
          },
        });
      }

      // B. Custom Demo Token (e.g. demo_student, demo_faculty)
      if (!user && token.startsWith('demo_')) {
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
      }

      // C. Clerk Verification Fallback
      if (!user && process.env.CLERK_SECRET_KEY) {
        try {
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
        } catch {
          // Ignore clerk error if handled by other fallbacks
        }
      }
    }

    // 2. Direct Demo User Header ID
    if (!user && demoUserId) {
      user = await this.prisma.user.findUnique({
        where: { id: demoUserId },
        include: {
          student: { include: { college: true } },
          faculty: { include: { college: true } },
          companyMentor: { include: { company: true } },
        },
      });
    }

    // 3. Demo Role Header Fallback
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

    // 4. Default Demo fallback for local development & jury presentation
    if (!user && !isPublic) {
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
      throw new UnauthorizedException('Authentication required. Please sign in.');
    }

    if (user) {
      if (user.status === 'SUSPENDED') {
        throw new ForbiddenException('Account has been suspended by the administrator.');
      }
      request.user = user;
      request.clerkUserId = user.clerkId;
    }

    return true;
  }
}
