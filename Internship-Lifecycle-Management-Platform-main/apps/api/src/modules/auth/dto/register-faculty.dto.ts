import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterFacultyDto {
  @ApiPropertyOptional({ example: 'Dr. Ramesh' })
  @IsOptional()
  @IsString({ message: 'First name must be a valid string' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString({ message: 'Last name must be a valid string' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'Dr. Ramesh Sharma' })
  @IsOptional()
  @IsString({ message: 'Name must be a valid string' })
  name?: string;

  @ApiProperty({ example: 'ramesh.sharma@ghrce.edu' })
  @IsEmail({}, { message: 'Please provide a valid institutional email address' })
  @IsNotEmpty({ message: 'Official email address is required' })
  email!: string;

  @ApiPropertyOptional({ example: '+91 9876543211' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'FAC-CSE-019', description: 'Unique Institutional Employee / Faculty ID' })
  @IsOptional()
  @IsString({ message: 'Employee ID must be a valid string' })
  employeeId?: string;

  @ApiPropertyOptional({ example: 'FAC-CSE-019', description: 'Unique Faculty ID' })
  @IsOptional()
  @IsString({ message: 'Faculty ID must be a valid string' })
  facultyId?: string;

  @ApiPropertyOptional({ example: 'Computer Science and Engineering' })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  department?: string;

  @ApiPropertyOptional({ example: 'Associate Professor & Internship Coordinator' })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  designation?: string;

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
