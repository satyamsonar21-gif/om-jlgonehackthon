import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit a new internship application with automatic eligibility evaluation' })
  create(@Body() body: any, @Request() req: any) {
    const studentId = body.studentId || req.user?.student?.id;
    return this.applicationsService.create({ ...body, studentId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications with filters (student, company, listing, status)' })
  findAll(@Query() query: any) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details by ID' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition application status across lifecycle milestones' })
  updateStatus(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const changedById = req.user?.id;
    const changedByRole = req.user?.role;
    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById,
      changedByRole,
    });
  }

  @Patch(':id/company-review')
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Company review action (Shortlist, Select, Issue Offer, Reject)' })
  companyReview(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById: req.user?.id,
      changedByRole: 'COMPANY_MENTOR',
    });
  }

  @Patch(':id/faculty-review')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Faculty / T&P review action' })
  facultyReview(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById: req.user?.id,
      changedByRole: req.user?.role || 'FACULTY_MENTOR',
    });
  }
}
