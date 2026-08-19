import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterFacultyDto } from './dto/register-faculty.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/password-reset.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @RateLimit(5, 60, 'Too many login attempts. Please try again after 60 seconds.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password, returning session cookie' })
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ipAddress = req.ip || (req.headers?.['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers?.['user-agent'];

    const result = await this.authService.login(body, { ipAddress, userAgent });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('ilmp_session', result.sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: result.message,
      user: result.user,
      token: result.sessionToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke active session' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req as any).cookies?.['ilmp_session'] ||
      (req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].substring(7).trim() : null);

    if (token) {
      await this.authService.revokeSessionByToken(token);
    } else if ((req as any).session?.id) {
      await this.authService.revokeSessionById((req as any).session.id);
    }

    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('ilmp_session', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Signed out successfully.',
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and safe identity' })
  async getMe(@CurrentUser() user: any) {
    if (!user) {
      throw new UnauthorizedException('Authentication required. Please sign in.');
    }

    const safeUser = this.authService.sanitizeUser(user);
    return {
      authenticated: true,
      user: {
        id: safeUser.id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        name: safeUser.name,
        role: safeUser.role,
        status: safeUser.status,
        isActive: safeUser.isActive,
        isEmailVerified: safeUser.isEmailVerified,
        phone: safeUser.phone,
        profilePhoto: safeUser.profilePhoto,
        collegeId: safeUser.collegeId,
        student: safeUser.student,
        faculty: safeUser.faculty,
        companyMentor: safeUser.companyMentor,
        createdAt: safeUser.createdAt,
        lastLoginAt: safeUser.lastLoginAt,
      },
    };
  }

  @Get('admins')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all institutional administrator accounts' })
  async getAdmins() {
    const admins = await this.authService.getAdmins();
    return {
      success: true,
      count: admins.length,
      data: admins,
    };
  }

  @Post('register/student')
  @Public()
  @RateLimit(10, 60, 'Too many registration requests. Please wait a moment.')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Real student multi-step registration (enforces STUDENT role)' })
  async registerStudent(@Body() body: RegisterStudentDto) {
    return this.authService.registerStudent(body);
  }

  @Post('register/faculty')
  @Public()
  @RateLimit(10, 60, 'Too many registration requests. Please wait a moment.')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Real faculty registration with pending institutional approval (enforces FACULTY_MENTOR role)' })
  async registerFaculty(@Body() body: RegisterFacultyDto) {
    return this.authService.registerFaculty(body);
  }

  @Post('register/company')
  @Public()
  @RateLimit(10, 60, 'Too many registration requests. Please wait a moment.')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Real company mentor registration with pending institutional verification (enforces COMPANY_MENTOR role)' })
  async registerCompany(@Body() body: RegisterCompanyDto) {
    return this.authService.registerCompany(body);
  }

  @Post('register/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiBearerAuth()
  @RateLimit(10, 60, 'Too many administrator provisioning requests. Please wait a moment.')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision new institutional administrator account (Authorized Admins Only)' })
  async registerAdmin(
    @Body() body: RegisterAdminDto,
    @CurrentUser() currentUser: any,
  ) {
    if (!currentUser || !['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(currentUser.role?.toUpperCase())) {
      throw new ForbiddenException('Access denied. Only authorized institutional administrators can provision administrator accounts.');
    }
    return this.authService.registerAdmin(body, currentUser);
  }

  @Post('forgot-password')
  @Public()
  @RateLimit(5, 60, 'Too many password reset requests. Please check your inbox.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch password reset link / code with generic non-enumerating response' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @Public()
  @RateLimit(5, 60, 'Too many password reset attempts. Please request a new code if expired.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with single-use cryptographic token or 6-digit code' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Post('verify-email')
  @Public()
  @RateLimit(10, 60, 'Too many email verification attempts.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify account email with cryptographic token or 6-digit code' })
  async verifyEmail(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body);
  }

  @Post('resend-verification')
  @Public()
  @RateLimit(3, 60, 'Too many verification email resend requests. Please wait 60 seconds.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification token and code with anti-abuse rate limiting' })
  async resendVerification(@Body() body: ResendVerificationDto) {
    return this.authService.resendVerification(body);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @RateLimit(5, 60, 'Too many password change attempts. Please wait.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for authenticated user and invalidate other sessions' })
  async changePassword(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Body() body: ChangePasswordDto,
  ) {
    const currentSessionId = (req as any).session?.id;
    return this.authService.changePassword(user.id, body, currentSessionId);
  }
}
