import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Assign a new task to an intern' })
  create(@Body() body: any, @CurrentUser() user: any) {
    const assignedById = body.assignedById || user?.companyMentor?.id;
    return this.tasksService.create({ ...body, assignedById });
  }

  @Get(':internshipId')
  @ApiOperation({ summary: 'Get all sprint tasks for an internship' })
  findByInternship(@Param('internshipId') internshipId: string) {
    return this.tasksService.findByInternship(internshipId);
  }

  @Patch(':id')
  @Roles('STUDENT', 'COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update task status or details (Pending, In Progress, Completed)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, body);
  }
}

