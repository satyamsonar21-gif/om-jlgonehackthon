import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync-user')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  async syncUser(@Request() req: any, @Body() body: any) {
    return this.authService.syncUser(req.clerkUserId, body);
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  async getMe(@Request() req: any) {
    return this.authService.getMe(req.clerkUserId);
  }
}
