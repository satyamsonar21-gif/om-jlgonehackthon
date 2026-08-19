import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
  Logger,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import * as crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'ilmp_production_secure_jwt_secret_2026';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly firebaseAdmin: FirebaseAdminService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    @Optional() firebaseAdmin?: FirebaseAdminService,
  ) {
    this.firebaseAdmin = firebaseAdmin || new FirebaseAdminService();
  }

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

    // 1. Extract Bearer token or cookie session
    let bearerToken: string | null = null;
    let cookieToken: string | null = null;

    if (request.headers['authorization'] && request.headers['authorization'].startsWith('Bearer ')) {
      bearerToken = request.headers['authorization'].substring(7).trim();
    }

    if (request.cookies && (request.cookies['ilmp_session'] || request.cookies['session_token'])) {
      cookieToken = request.cookies['ilmp_session'] || request.cookies['session_token'];
    }

    let user: any = null;
    let session: any = null;
    let decodedFirebaseToken: any = null;
    let tokenAuthError: Error | null = null;

    // 2. Primary: Verify Firebase ID Token if Bearer token present
    if (bearerToken) {
      try {
        decodedFirebaseToken = await this.firebaseAdmin.verifyIdToken(bearerToken);
        if (decodedFirebaseToken && (decodedFirebaseToken.uid || decodedFirebaseToken.email)) {
          // Look up user in Prisma DB
          user = await this.prisma.user.findFirst({
            where: {
              OR: [
                { email: decodedFirebaseToken.email },
                { id: decodedFirebaseToken.uid },
              ],
            },
            include: {
              student: { include: { college: true } },
              faculty: { include: { college: true } },
              companyMentor: { include: { company: true } },
            },
          });

          // If user exists in Firebase Auth but not yet in Prisma, construct secure user object
          if (!user) {
            user = {
              id: decodedFirebaseToken.uid,
              uid: decodedFirebaseToken.uid,
              email: decodedFirebaseToken.email,
              name: decodedFirebaseToken.name || decodedFirebaseToken.email?.split('@')[0] || 'User',
              role: (decodedFirebaseToken.role || 'STUDENT').toUpperCase(),
              status: decodedFirebaseToken.status || 'ACTIVE',
              isActive: true,
            };
          }

          request.firebaseUser = decodedFirebaseToken;
        }
      } catch (err: any) {
        tokenAuthError = err;
      }
    }

    // 3. Fallback: Database Session or Custom JWT (for legacy session compatibility)
    if (!user && (cookieToken || bearerToken)) {
      const fallbackToken = cookieToken || bearerToken;
      if (fallbackToken) {
        const tokenHash = this.hashToken(fallbackToken);
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
          this.prisma.session
            .update({
              where: { id: session.id },
              data: { lastUsedAt: new Date() },
            })
            .catch(() => {});
        }

        if (!user) {
          const jwtPayload = this.verifyCustomJwt(fallbackToken);
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
    }

    // 4. Status and Deactivation Verification
    if (user) {
      if (user.isActive === false) {
        throw new UnauthorizedException('Account has been deactivated. Please contact administration.');
      }
      if (user.status === 'SUSPENDED') {
        throw new ForbiddenException('Account has been suspended by the administrator.');
      }
      request.user = user;
      request.session = session;
      return true;
    }

    // 5. Allow access if endpoint is decorated with @Public()
    if (isPublic) {
      return true;
    }

    // 6. Enforce rejection on missing, invalid, or expired tokens
    if (tokenAuthError) {
      throw tokenAuthError;
    }

    throw new UnauthorizedException('Authentication required. Please sign in with a valid Firebase authentication token.');
  }
}

