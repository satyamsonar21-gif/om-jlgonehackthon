import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post() create(@Body() body: any) { return this.applicationsService.create(body); }
  @Get() findAll(@Query() query: any) { return this.applicationsService.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.applicationsService.findOne(id); }
  @Patch(':id/faculty-review') facultyReview(@Param('id') id: string, @Body() body: any) { return this.applicationsService.facultyReview(id, body); }
  @Patch(':id/company-review') companyReview(@Param('id') id: string, @Body() body: any) { return this.applicationsService.companyReview(id, body); }
}
