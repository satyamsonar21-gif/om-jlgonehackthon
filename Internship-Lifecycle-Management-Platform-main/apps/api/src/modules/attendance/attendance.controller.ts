import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('STUDENT', 'COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Clock daily attendance or verify punch record' })
  mark(@Body() body: any) {
    return this.attendanceService.mark(body);
  }

  @Get('batch/overview')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN')
  @ApiOperation({ summary: 'Get batch attendance overview with automated risk flagging' })
  getBatchOverview(@Query('facultyId') facultyId: string, @Query('threshold') threshold: string) {
    const numThreshold = threshold ? Number(threshold) : 75.0;
    return this.attendanceService.getBatchAttendance(facultyId, numThreshold);
  }

  @Get(':internshipId')
  @ApiOperation({ summary: 'Get attendance logs for an internship' })
  findByInternship(@Param('internshipId') id: string, @Query() query: any) {
    return this.attendanceService.findByInternship(id, query);
  }

  @Get(':internshipId/stats')
  @ApiOperation({ summary: 'Get aggregate attendance statistics (Present, Absent, Leave percentage)' })
  getStats(@Param('internshipId') id: string) {
    return this.attendanceService.getStats(id);
  }
}

