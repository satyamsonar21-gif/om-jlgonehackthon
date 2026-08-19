import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../notifications/email.service';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, RateLimitGuard],
  exports: [AuthService, EmailService, RateLimitGuard],
})
export class AuthModule {}
