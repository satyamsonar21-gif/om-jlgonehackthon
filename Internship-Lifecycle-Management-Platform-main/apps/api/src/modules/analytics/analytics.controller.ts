import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin') getAdminAnalytics() { return this.analyticsService.getAdminAnalytics(); }
  @Get('student/:id') getStudentAnalytics(@Param('id') id: string) { return this.analyticsService.getStudentAnalytics(id); }
  @Get('faculty/:id') getFacultyAnalytics(@Param('id') id: string) { return this.analyticsService.getFacultyAnalytics(id); }
  @Get('company/:id') getCompanyAnalytics(@Param('id') id: string) { return this.analyticsService.getCompanyAnalytics(id); }
}
