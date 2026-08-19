import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

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

    // 1. Extract token from cookie (primary) or Authorization header (API / mobile fallback)
    let token: string | null = null;
    if (request.cookies && (request.cookies['ilmp_session'] || request.cookies['session_token'])) {
      token = request.cookies['ilmp_session'] || request.cookies['session_token'];
    } else if (request.headers['authorization'] && request.headers['authorization'].startsWith('Bearer ')) {
      token = request.headers['authorization'].substring(7).trim();
    }

    let user: any = null;
    let session: any = null;

    if (token) {
      // 2A. Check database Session table by SHA-256 hash
      const tokenHash = this.hashToken(token);
      session = await this.prisma.session.findFirst({
        where: {
          sessionTokenHash: tokenHash,
          isValid: true,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: {
            include: {
              student: { include: { college: true } },
              faculty: { include: { college: true } },
              companyMentor: { include: { company: true } },
            },
          },
        },
      });

      if (session && session.user) {
        user = session.user;
        // Asynchronously update lastUsedAt
        this.prisma.session
          .update({
            where: { id: session.id },
            data: { lastUsedAt: new Date() },
          })
          .catch(() => {});
      }

      // 2B. Fallback to valid signed JWT token
      if (!user) {
        const jwtPayload = this.verifyCustomJwt(token);
        if (jwtPayload && (jwtPayload.sub || jwtPayload.email)) {
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
      }
    }

    // 3. Status and Deactivation Verification
    if (user) {
      if (user.isActive === false) {
        throw new UnauthorizedException('Account has been deactivated. Please contact administration.');
      }
      if (user.status === 'SUSPENDED') {
        throw new ForbiddenException('Account has been suspended by the administrator.');
      }
      request.user = user;
      request.session = session;
    }

    // 4. Enforce authentication on protected routes
    if (!user && !isPublic) {
      throw new UnauthorizedException('Authentication required. Please sign in.');
    }

    return true;
  }
}

