import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiPropertyOptional({
    example: 'a1b2c3d4e5f6...',
    description: 'Cryptographically secure email verification token from URL link',
  })
  @IsOptional()
  @IsString({ message: 'Token must be a valid string' })
  token?: string;

  @ApiPropertyOptional({
    example: 'student@ghrce.edu',
    description: 'Account email address (required if submitting 6-digit code)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: '6-digit email verification code',
  })
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  code?: string;
}

export class ResendVerificationDto {
  @ApiProperty({
    example: 'student@ghrce.edu',
    description: 'Account email address to resend verification instructions to',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email!: string;
}
