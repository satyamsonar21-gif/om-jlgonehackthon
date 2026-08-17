import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Faculty')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  findAll() { return this.facultyService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.facultyService.findOne(id); }

  @Get(':id/students')
  getStudents(@Param('id') id: string) { return this.facultyService.getStudents(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.facultyService.update(id, body); }
}
