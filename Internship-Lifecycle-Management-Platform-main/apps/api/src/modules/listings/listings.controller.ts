import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Internship Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all internship listings with multi-criteria filters' })
  findAll(@Query() query: any, @CurrentUser() user?: any) {
    return this.listingsService.findAll(query, user?.id || user?.student?.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get detailed internship listing with company & eligibility rules' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.listingsService.findOne(id, user?.id || user?.student?.id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create and publish a new internship listing with eligibility criteria' })
  async create(@Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);
    const companyId = isAdmin ? (body.companyId || user?.companyMentor?.companyId) : user?.companyMentor?.companyId;

    if (!companyId) {
      throw new ForbiddenException('A valid company profile is required to publish an internship listing.');
    }

    return this.listingsService.create({ ...body, companyId });
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update internship listing details or eligibility criteria (with ownership check)' })
  async update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);

    if (!isAdmin) {
      const existing = await this.listingsService.findOne(id);
      const userCompanyId = user?.companyMentor?.companyId;
      if (!userCompanyId || existing.companyId !== userCompanyId) {
        throw new ForbiddenException('You are only authorized to modify internship listings belonging to your company.');
      }
    }

    return this.listingsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close an internship listing (with ownership check)' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);

    if (!isAdmin) {
      const existing = await this.listingsService.findOne(id);
      const userCompanyId = user?.companyMentor?.companyId;
      if (!userCompanyId || existing.companyId !== userCompanyId) {
        throw new ForbiddenException('You are only authorized to close internship listings belonging to your company.');
      }
    }

    return this.listingsService.remove(id);
  }
}

