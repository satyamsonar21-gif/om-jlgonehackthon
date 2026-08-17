import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WeeklyReportsService } from './weekly-reports.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Weekly Reports')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('weekly-reports')
export class WeeklyReportsController {
  constructor(private readonly weeklyReportsService: WeeklyReportsService) {}

  @Post() create(@Body() body: any) { return this.weeklyReportsService.create(body); }
  @Get(':internshipId') findByInternship(@Param('internshipId') id: string) { return this.weeklyReportsService.findByInternship(id); }
  @Get('pending/:facultyId') getPending(@Param('facultyId') facultyId: string) { return this.weeklyReportsService.getPending(facultyId); }
  @Patch(':id/review') review(@Param('id') id: string, @Body() body: any) { return this.weeklyReportsService.review(id, body); }
}
