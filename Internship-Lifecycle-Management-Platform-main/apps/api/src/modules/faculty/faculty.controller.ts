import { Controller, Get, Patch, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Faculty')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR')
  @ApiOperation({ summary: 'Get all faculty supervisors' })
  findAll() {
    return this.facultyService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR')
  @ApiOperation({ summary: 'Get faculty supervisor profile by ID' })
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Get(':id/students')
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR')
  @ApiOperation({ summary: 'Get assigned student cohort for faculty supervisor' })
  getStudents(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(userRole);
    if (!isAdmin) {
      const isOwner = user?.faculty?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to view your own assigned student cohort.');
      }
    }
    return this.facultyService.getStudents(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'FACULTY', 'FACULTY_MENTOR')
  @ApiOperation({ summary: 'Update faculty supervisor profile' })
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(userRole);
    if (!isAdmin) {
      const isOwner = user?.faculty?.id === id || user?.id === id;
      if (!isOwner) {
        throw new ForbiddenException('You are only authorized to update your own faculty profile.');
      }
    }
    return this.facultyService.update(id, body);
  }
}

