import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all partner companies with search and verification filters' })
  findAll(@Query() query: any) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get company profile, active listings, and mentors' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new company' })
  create(@Body() body: any) {
    return this.companiesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company profile information' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.companiesService.update(id, body);
  }

  @Patch(':id/verify')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'T&P verification of company status' })
  verify(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const verifiedBy = req.user?.name || 'T&P Office';
    return this.companiesService.verifyCompany(id, { ...body, verifiedBy });
  }
}
