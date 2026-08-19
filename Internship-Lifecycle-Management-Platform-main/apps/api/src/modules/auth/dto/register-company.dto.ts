import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCompanyDto {
  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional()
  @IsString({ message: 'First name must be a valid string' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Nair' })
  @IsOptional()
  @IsString({ message: 'Last name must be a valid string' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'Priya Nair' })
  @IsOptional()
  @IsString({ message: 'Name must be a valid string' })
  name?: string;

  @ApiProperty({ example: 'priya.nair@tcs.com' })
  @IsEmail({}, { message: 'Please provide a valid corporate work email address' })
  @IsNotEmpty({ message: 'Work email address is required' })
  email!: string;

  @ApiPropertyOptional({ example: '+91 9876543212' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Tata Consultancy Services' })
  @IsOptional()
  @IsString({ message: 'Company name must be a string' })
  company?: string;

  @ApiPropertyOptional({ example: 'Lead University Recruiter' })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  designation?: string;

  @ApiPropertyOptional({ example: 'Information Technology & Consulting' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: 'Software & Cloud Engineering' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ example: 'Leading IT consulting company' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Priya Nair' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'contact@tcs.com' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+91 9876543212' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'https://www.tcs.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Pune, Maharashtra' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString({ message: 'Password must be a valid string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiPropertyOptional({ example: 'SecurePassword123!' })
  @IsOptional()
  @IsString({ message: 'Confirm password must be a valid string' })
  confirmPassword?: string;
}
