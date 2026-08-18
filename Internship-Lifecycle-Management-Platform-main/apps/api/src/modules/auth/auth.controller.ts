import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with demo email or credentials' })
  async login(@Body() body: { email: string; password?: string }) {
    return this.authService.login(body.email);
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
    return req.user;
  }
}
