import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DailyLogsService } from './daily-logs.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Daily Logs')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Post() create(@Body() body: any) { return this.dailyLogsService.create(body); }
  @Get(':internshipId') findByInternship(@Param('internshipId') id: string, @Query() query: any) { return this.dailyLogsService.findByInternship(id); }
  @Patch(':id/acknowledge') acknowledge(@Param('id') id: string) { return this.dailyLogsService.acknowledge(id); }
}
