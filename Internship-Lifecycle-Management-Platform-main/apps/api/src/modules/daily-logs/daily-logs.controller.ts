import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DailyLogsService } from './daily-logs.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Daily Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit daily work activity log' })
  create(@Body() body: any) {
    return this.dailyLogsService.create(body);
  }

  @Get(':internshipId')
  @ApiOperation({ summary: 'Get daily logs for an internship' })
  findByInternship(@Param('internshipId') id: string) {
    return this.dailyLogsService.findByInternship(id);
  }

  @Patch(':id/acknowledge')
  @Roles('COMPANY', 'COMPANY_MENTOR', 'FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Acknowledge/verify student daily work log' })
  acknowledge(@Param('id') id: string) {
    return this.dailyLogsService.review(id, { status: 'REVIEWED' });
  }

  @Patch(':id/review')
  @Roles('COMPANY', 'COMPANY_MENTOR', 'FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Review or flag student daily work log with notes' })
  review(@Param('id') id: string, @Body() body: any) {
    return this.dailyLogsService.review(id, body);
  }
}

