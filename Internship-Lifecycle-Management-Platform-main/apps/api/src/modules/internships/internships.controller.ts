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
import { InternshipsService } from './internships.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Internships')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active or completed internships with filters scoped by role' })
  findAll(@Query() query: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const scopedQuery = { ...query };

    if (userRole === 'STUDENT') {
      scopedQuery.studentId = user?.student?.id;
    } else if (userRole === 'COMPANY' || userRole === 'COMPANY_MENTOR') {
      scopedQuery.companyId = user?.companyMentor?.companyId;
    }

    return this.internshipsService.findAll(scopedQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed internship enrollment (with ownership check)' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const internship = await this.internshipsService.findOne(id);
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR'].includes(userRole);

    if (!isAdmin) {
      if (userRole === 'STUDENT') {
        if (internship.studentId !== user?.student?.id) {
          throw new ForbiddenException('You are only authorized to view your own internship enrollment.');
        }
      } else if (userRole === 'COMPANY' || userRole === 'COMPANY_MENTOR') {
        const companyId = user?.companyMentor?.companyId;
        if (!companyId || internship.companyId !== companyId) {
          throw new ForbiddenException('You are only authorized to view interns within your company.');
        }
      }
    }

    return internship;
  }

  @Post(':id/join')
  @Roles('STUDENT', 'COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Confirm formal student joining date and details' })
  confirmJoining(@Param('id') id: string, @Body() body: any) {
    return this.internshipsService.confirmJoining(id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update internship enrollment data' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.internshipsService.update(id, body);
  }

  @Patch(':id/complete')
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'HOD_ADMIN', 'COMPANY', 'COMPANY_MENTOR')
  @ApiOperation({ summary: 'Mark internship as completed once all requirements are fulfilled' })
  complete(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.internshipsService.complete(id, {
      ...body,
      completedById: user?.id,
    });
  }
}

