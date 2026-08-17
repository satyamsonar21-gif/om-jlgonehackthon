import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Internship Listings')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get() findAll(@Query() query: any) { return this.listingsService.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.listingsService.findOne(id); }
  @Post() create(@Body() body: any) { return this.listingsService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.listingsService.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.listingsService.remove(id); }
}
