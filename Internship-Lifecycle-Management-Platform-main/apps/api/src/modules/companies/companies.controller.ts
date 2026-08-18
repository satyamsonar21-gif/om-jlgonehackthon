import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new company' })
  create(@Body() body: any) {
    return this.companiesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company profile information (with ownership check)' })
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const userRole = (user?.role || '').toUpperCase();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN'].includes(userRole);

    if (!isAdmin) {
      const companyId = user?.companyMentor?.companyId;
      if (!companyId || companyId !== id) {
        throw new ForbiddenException('You are only authorized to modify your own company profile.');
      }
      // Company mentors cannot self-verify their company
      delete body.isVerified;
      delete body.verificationStatus;
      delete body.verifiedAt;
      delete body.verifiedBy;
    }

    return this.companiesService.update(id, body);
  }

  @Patch(':id/verify')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'HOD_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'T&P verification of company status' })
  verify(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    const verifiedBy = user?.name || 'T&P Office';
    return this.companiesService.verifyCompany(id, { ...body, verifiedBy });
  }
}

