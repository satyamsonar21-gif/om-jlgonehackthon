import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post() mark(@Body() body: any) { return this.attendanceService.mark(body); }
  @Get(':internshipId') findByInternship(@Param('internshipId') id: string, @Query() query: any) { return this.attendanceService.findByInternship(id, query); }
  @Get(':internshipId/stats') getStats(@Param('internshipId') id: string) { return this.attendanceService.getStats(id); }
}
