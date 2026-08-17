import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Internships')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  @Get() findAll(@Query() query: any) { return this.internshipsService.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.internshipsService.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.internshipsService.update(id, body); }
  @Patch(':id/complete') complete(@Param('id') id: string) { return this.internshipsService.complete(id); }
}
