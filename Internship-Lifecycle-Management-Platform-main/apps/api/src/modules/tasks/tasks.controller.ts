import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post() create(@Body() body: any) { return this.tasksService.create(body); }
  @Get(':internshipId') findByInternship(@Param('internshipId') id: string) { return this.tasksService.findByInternship(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.tasksService.update(id, body); }
}
