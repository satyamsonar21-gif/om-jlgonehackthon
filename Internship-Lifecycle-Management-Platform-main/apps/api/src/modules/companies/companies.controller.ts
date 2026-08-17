import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get() findAll() { return this.companiesService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.companiesService.findOne(id); }
  @Post() create(@Body() body: any) { return this.companiesService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.companiesService.update(id, body); }
  @Patch(':id/verify') verify(@Param('id') id: string) { return this.companiesService.verify(id); }
}
