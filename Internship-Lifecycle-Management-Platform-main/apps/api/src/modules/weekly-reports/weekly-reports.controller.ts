import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WeeklyReportsService } from './weekly-reports.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Weekly Reports')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('weekly-reports')
export class WeeklyReportsController {
  constructor(private readonly weeklyReportsService: WeeklyReportsService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit weekly technical synthesis report' })
  create(@Body() body: any) {
    return this.weeklyReportsService.create(body);
  }

  @Get('internship/:internshipId')
  @ApiOperation({ summary: 'Get all weekly reports for an internship' })
  findByInternship(@Param('internshipId') internshipId: string) {
    return this.weeklyReportsService.findByInternship(internshipId);
  }

  @Get('pending')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get pending weekly reports in Faculty review queue' })
  getPendingAll(@Request() req: any) {
    const facultyId = req.user?.faculty?.id || req.user?.id;
    return this.weeklyReportsService.getPending(facultyId);
  }

  @Get('pending/:facultyId')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get pending reports by specific faculty ID' })
  getPending(@Param('facultyId') facultyId: string) {
    return this.weeklyReportsService.getPending(facultyId);
  }

  @Patch(':id/review')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Faculty review and score weekly report (Approve, Revision Requested, Reject)' })
  review(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const reviewedById = req.user?.faculty?.id || req.user?.id;
    return this.weeklyReportsService.review(id, { ...body, reviewedById });
  }
}
