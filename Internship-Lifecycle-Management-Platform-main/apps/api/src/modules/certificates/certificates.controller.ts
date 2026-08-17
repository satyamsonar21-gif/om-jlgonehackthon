import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post(':internshipId/generate')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  generate(@Param('internshipId') id: string) { return this.certificatesService.generate(id); }

  @Get(':internshipId')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  findByInternship(@Param('internshipId') id: string) { return this.certificatesService.findByInternship(id); }

  @Get('verify/:code')
  verify(@Param('code') code: string) { return this.certificatesService.verify(code); }
}
