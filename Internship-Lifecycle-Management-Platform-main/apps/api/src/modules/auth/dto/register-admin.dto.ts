import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiPropertyOptional({ example: 'Dr. Vivek Deshmukh' })
  @IsOptional()
  @IsString({ message: 'Full name must be a valid string' })
  name?: string;

  @ApiPropertyOptional({ example: 'Dr. Vivek Deshmukh' })
  @IsOptional()
  @IsString({ message: 'Full name must be a valid string' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'Vivek' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Deshmukh' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'admin.tnp@institution.edu' })
  @IsEmail({}, { message: 'Please provide a valid institutional email address' })
  @IsNotEmpty({ message: 'Official institutional email address is required' })
  email!: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'TNP_ADMIN',
    enum: ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'],
    description: 'Server-sanctioned administrative role tier',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'], {
    message: 'Role must be one of: ADMIN, SUPER_ADMIN, TNP_ADMIN, HOD_ADMIN',
  })
  role?: string;

  @ApiPropertyOptional({ example: 'Central Training & Placement Cell' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Training & Placement Head' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 'G.H. Raisoni College of Engineering' })
  @IsOptional()
  @IsString()
  collegeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collegeId?: string;

  @ApiProperty({ example: 'SecureAdminPassword123!' })
  @IsString({ message: 'Password must be a valid string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiPropertyOptional({ example: 'SecureAdminPassword123!' })
  @IsOptional()
  @IsString({ message: 'Confirm password must be a valid string' })
  confirmPassword?: string;
}
