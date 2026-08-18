import { Controller, Get, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiOperation({ summary: 'Campus-wide institutional KPI analytics (Admin/T&P only)' })
  getAdminAnalytics() {
    return this.analyticsService.getAdminAnalytics();
  }

  @Get('student/:id')
  @Roles('STUDENT', 'FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN')
  @ApiOperation({ summary: 'Student placement readiness and skills telemetry' })
  getStudentAnalytics(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    if (userRole === 'STUDENT') {
      const isOwner = user?.student?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to view your own placement telemetry.');
      }
    }
    return this.analyticsService.getStudentAnalytics(id);
  }

  @Get('faculty/:id')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiOperation({ summary: 'Faculty supervised cohort metrics' })
  getFacultyAnalytics(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(userRole);
    if (!isAdmin) {
      const isOwner = user?.faculty?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to view your own cohort analytics.');
      }
    }
    return this.analyticsService.getFacultyAnalytics(id);
  }

  @Get('company/:id')
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN')
  @ApiOperation({ summary: 'Company recruitment funnel telemetry' })
  getCompanyAnalytics(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);
    if (!isAdmin) {
      const isOwner = user?.companyMentor?.companyId === id || user?.companyMentor?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to view your own company recruitment analytics.');
      }
    }
    return this.analyticsService.getCompanyAnalytics(id);
  }
}

