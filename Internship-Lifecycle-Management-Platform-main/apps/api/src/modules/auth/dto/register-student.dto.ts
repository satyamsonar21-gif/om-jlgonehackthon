import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterStudentDto {
  @ApiPropertyOptional({ example: 'Aarav' })
  @IsOptional()
  @IsString({ message: 'First name must be a valid string' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Patil' })
  @IsOptional()
  @IsString({ message: 'Last name must be a valid string' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'Aarav Patil' })
  @IsOptional()
  @IsString({ message: 'Name must be a valid string' })
  name?: string;

  @ApiProperty({ example: 'aarav.patil@ghrce.edu' })
  @IsEmail({}, { message: 'Please provide a valid educational email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email!: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'BT22CSE042', description: 'Unique College Enrollment / Roll Number' })
  @IsOptional()
  @IsString({ message: 'Enrollment Number must be a valid string' })
  enrollmentNumber?: string;

  @ApiPropertyOptional({ example: 'BT22CSE042', description: 'Unique Student / Roll ID' })
  @IsOptional()
  @IsString({ message: 'Student ID must be a valid string' })
  studentId?: string;

  @ApiPropertyOptional({ example: 'Computer Science and Engineering' })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  department?: string;

  @ApiPropertyOptional({ example: 3, description: 'Academic Year (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Academic Year must be a number' })
  @Min(1, { message: 'Year must be at least 1' })
  @Max(5, { message: 'Year must not exceed 5' })
  year?: number;

  @ApiPropertyOptional({ example: 6, description: 'Academic Semester (1-10)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  semester?: number;

  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  passingYear?: number;

  @ApiPropertyOptional({ example: 8.75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cgpa?: number;

  @ApiPropertyOptional({ example: 'React, TypeScript, Node.js, Python, PostgreSQL' })
  @IsOptional()
  skills?: any;

  @ApiPropertyOptional({ example: 'https://storage.ilmp.edu/resumes/my_resume.pdf' })
  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: 'G.H. Raisoni College of Engineering' })
  @IsOptional()
  @IsString()
  collegeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collegeId?: string;

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
