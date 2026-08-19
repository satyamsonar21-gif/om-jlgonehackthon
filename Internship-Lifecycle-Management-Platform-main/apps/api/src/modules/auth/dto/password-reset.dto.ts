import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'student@ghrce.edu',
    description: 'Registered user account email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email!: string;
}

export class ResetPasswordDto {
  @ApiPropertyOptional({
    example: 'a1b2c3d4e5f6...',
    description: 'Cryptographically secure password reset token from email URL link',
  })
  @IsOptional()
  @IsString({ message: 'Token must be a valid string' })
  token?: string;

  @ApiPropertyOptional({
    example: 'student@ghrce.edu',
    description: 'Account email (required if using 6-digit verification code)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: '6-digit password reset code',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'New account password (minimum 8 characters with letters and numbers)',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;

  @ApiPropertyOptional({
    example: 'NewSecurePassword123!',
    description: 'Password confirmation matching newPassword',
  })
  @IsOptional()
  @IsString()
  confirmPassword?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'CurrentPassword123!',
    description: 'Existing account password',
  })
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'New account password (minimum 8 characters with letters and numbers)',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;

  @ApiPropertyOptional({
    example: 'NewSecurePassword123!',
    description: 'Password confirmation matching newPassword',
  })
  @IsOptional()
  @IsString()
  confirmPassword?: string;
}
