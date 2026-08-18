import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all issued certificates (Admin & Institutional Registry)' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @Post(':internshipId/generate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'COMPANY', 'COMPANY_MENTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate completion certificate with verification hash and QR code' })
  generate(
    @Param('internshipId') internshipId: string,
    @Body() body: { force?: boolean } = {},
  ) {
    return this.certificatesService.generate(internshipId, body.force);
  }

  @Get(':internshipId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get certificate by internship ID' })
  findByInternship(@Param('internshipId') internshipId: string) {
    return this.certificatesService.findByInternship(internshipId);
  }

  @Get('verify/:code')
  @Public()
  @ApiOperation({ summary: 'Public QR certificate verification endpoint' })
  verify(@Param('code') code: string) {
    return this.certificatesService.verify(code);
  }
}
