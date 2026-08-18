import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a new task to an intern' })
  create(@Body() body: any, @Request() req: any) {
    const assignedById = body.assignedById || req.user?.companyMentor?.id;
    return this.tasksService.create({ ...body, assignedById });
  }

  @Get(':internshipId')
  @ApiOperation({ summary: 'Get all sprint tasks for an internship' })
  findByInternship(@Param('internshipId') internshipId: string) {
    return this.tasksService.findByInternship(internshipId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task status or details (Pending, In Progress, Completed)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, body);
  }
}
