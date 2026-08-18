import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { AuthGuard, Public } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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
    @CurrentUser() user: any,
  ) {
    return this.certificatesService.generate(internshipId, body.force, user?.id);
  }

  @Patch(':internshipId/faculty-approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faculty guide approval for certificate issuance' })
  facultyApprove(@Param('internshipId') internshipId: string, @CurrentUser() user: any) {
    return this.certificatesService.facultyApprove(internshipId, user?.faculty?.id || user?.id);
  }

  @Patch(':internshipId/admin-approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Institutional Admin final signoff and certificate issuance' })
  adminApprove(@Param('internshipId') internshipId: string, @CurrentUser() user: any) {
    return this.certificatesService.adminApproveAndIssue(internshipId, user?.id);
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
  @ApiOperation({ summary: 'Public QR certificate verification endpoint (privacy protected)' })
  verify(@Param('code') code: string) {
    return this.certificatesService.verify(code);
  }
}
