import { Controller, Post, Get, Body, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() body: { email: string; password?: string; role?: string }) {
    return this.authService.login(body.email, body.password, body.role);
  }

  @Post('register/student')
  @Public()
  @ApiOperation({ summary: 'Student multi-step registration' })
  async registerStudent(@Body() body: any) {
    return this.authService.registerStudent(body);
  }

  @Post('register/faculty')
  @Public()
  @ApiOperation({ summary: 'Faculty registration with pending institutional approval' })
  async registerFaculty(@Body() body: any) {
    return this.authService.registerFaculty(body);
  }

  @Post('register/company')
  @Public()
  @ApiOperation({ summary: 'Company registration with pending institutional verification' })
  async registerCompany(@Body() body: any) {
    return this.authService.registerCompany(body);
  }

  @Post('register/admin')
  @Public()
  @ApiOperation({ summary: 'Explicitly prohibited public admin registration attempt' })
  async registerAdmin() {
    throw new ForbiddenException(
      'Administrator accounts cannot be registered publicly. Please contact institutional administration.',
    );
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Dispatch password reset verification code' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with 6-digit verification code' })
  async resetPassword(@Body() body: { email: string; token: string; newPassword: string }) {
    return this.authService.resetPassword(body);
  }

  @Post('verify-email')
  @Public()
  @ApiOperation({ summary: 'Verify account email with code' })
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body);
  }

  @Post('resend-verification')
  @Public()
  @ApiOperation({ summary: 'Resend email verification code' })
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerification(body.email);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password for authenticated user' })
  async changePassword(@Request() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.authService.changePassword(req.user.id, body);
  }

  @Get('demo-users')
  @Public()
  @ApiOperation({ summary: 'Get all seeded demo accounts for 1-click role switching' })
  async getDemoUsers() {
    return this.authService.getDemoUsers();
  }

  @Post('switch-role')
  @Public()
  @ApiOperation({ summary: 'Instant role switch endpoint for hackathon jury evaluation' })
  async switchRole(@Body() body: { role: string }) {
    return this.authService.switchRole(body.role);
  }

  @Post('sync-user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synchronize user from Clerk authentication' })
  async syncUser(@Request() req: any, @Body() body: any) {
    const clerkId = req.clerkUserId || body.clerkId || `clerk_${Date.now()}`;
    return this.authService.syncUser(clerkId, body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and stakeholder relations' })
  async getMe(@Request() req: any) {
    return this.authService.sanitizeUser(req.user);
  }
}

