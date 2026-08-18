import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR', 'COMPANY', 'COMPANY_MENTOR')
  @ApiOperation({ summary: 'Get all students with filtering (Admin/Faculty/T&P/Company)' })
  findAll(@Query() query: any) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student profile by ID or user ID (with ownership check)' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    if (userRole === 'STUDENT') {
      const isOwner = user?.student?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to view your own student profile.');
      }
    }
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student profile (Ownership check for student or Admin)' })
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(userRole);
    if (userRole === 'STUDENT') {
      const isOwner = user?.student?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to update your own student profile.');
      }
      // Students cannot modify verificationStatus or placementReadinessScore directly
      delete body.verificationStatus;
      delete body.verificationRemarks;
      delete body.verifiedAt;
      delete body.verifiedBy;
    } else if (!isAdmin) {
      throw new ForbiddenException('Only the student or an institutional administrator can update this profile.');
    }
    return this.studentsService.update(id, body);
  }

  @Patch(':id/verify')
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'HOD_ADMIN')
  @ApiOperation({ summary: 'T&P verification of student profile (Verify, Reject, Correction Required)' })
  verifyProfile(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const verifiedBy = user?.name || 'T&P Office';
    return this.studentsService.verifyProfile(id, { ...body, verifiedBy });
  }

  @Get(':id/placement-readiness')
  @ApiOperation({ summary: 'Get explainable placement readiness score and dimension breakdown' })
  getPlacementReadiness(@Param('id') id: string) {
    return this.studentsService.getPlacementReadiness(id);
  }
}

