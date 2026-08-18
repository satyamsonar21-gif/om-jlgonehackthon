import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit a new internship application with automatic eligibility evaluation' })
  async create(@Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);

    let studentId = body.studentId;
    if (userRole === 'STUDENT') {
      const ownStudentId = user?.student?.id;
      if (!ownStudentId) {
        throw new ForbiddenException('No verified student profile linked to your user account.');
      }
      if (studentId && studentId !== ownStudentId) {
        throw new ForbiddenException('You are only authorized to submit applications for your own student profile.');
      }
      studentId = ownStudentId;
    }

    return this.applicationsService.create({ ...body, studentId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications scoped by role (student, company, or institutional)' })
  findAll(@Query() query: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const scopedQuery = { ...query };

    // Automatic role-based scoping
    if (userRole === 'STUDENT') {
      scopedQuery.studentId = user?.student?.id;
    } else if (userRole === 'COMPANY' || userRole === 'COMPANY_MENTOR') {
      scopedQuery.companyId = user?.companyMentor?.companyId;
    }

    return this.applicationsService.findAll(scopedQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details by ID (with ownership check)' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const application = await this.applicationsService.findOne(id);
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR'].includes(userRole);

    if (!isAdmin) {
      if (userRole === 'STUDENT') {
        if (application.studentId !== user?.student?.id) {
          throw new ForbiddenException('You are only authorized to view your own applications.');
        }
      } else if (userRole === 'COMPANY' || userRole === 'COMPANY_MENTOR') {
        const companyId = user?.companyMentor?.companyId;
        if (!companyId || (application.listing && application.listing.companyId !== companyId)) {
          throw new ForbiddenException('You are only authorized to view applicants for your company listings.');
        }
      }
    }

    return application;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition application status across lifecycle milestones' })
  updateStatus(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const changedById = user?.id;
    const changedByRole = user?.role;
    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById,
      changedByRole,
    });
  }

  @Patch(':id/company-review')
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Company review action (Shortlist, Select, Issue Offer, Reject)' })
  async companyReview(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);

    if (!isAdmin) {
      const application = await this.applicationsService.findOne(id);
      const companyId = user?.companyMentor?.companyId;
      if (!companyId || (application.listing && application.listing.companyId !== companyId)) {
        throw new ForbiddenException('You are only authorized to evaluate applicants for your company listings.');
      }
    }

    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById: user?.id,
      changedByRole: 'COMPANY_MENTOR',
    });
  }

  @Patch(':id/faculty-review')
  @Roles('FACULTY', 'FACULTY_MENTOR', 'TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Faculty / T&P review action' })
  facultyReview(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.applicationsService.updateStatus(id, {
      ...body,
      changedById: user?.id,
      changedByRole: user?.role || 'FACULTY_MENTOR',
    });
  }
}

