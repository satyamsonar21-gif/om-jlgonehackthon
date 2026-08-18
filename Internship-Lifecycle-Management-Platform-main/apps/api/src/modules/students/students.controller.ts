import { Controller, Get, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students with filtering (Admin/Faculty/T&P)' })
  findAll(@Query() query: any) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student profile by ID or user ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student profile and re-calculate completeness score' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.update(id, body);
  }

  @Patch(':id/verify')
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'T&P verification of student profile (Verify, Reject, Correction Required)' })
  verifyProfile(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const verifiedBy = req.user?.name || 'T&P Office';
    return this.studentsService.verifyProfile(id, { ...body, verifiedBy });
  }
}
