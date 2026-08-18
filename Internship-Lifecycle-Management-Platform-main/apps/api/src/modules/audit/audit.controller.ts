import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiOperation({ summary: 'Query institutional audit log ledger with filters (Admin only)' })
  findAll(@Query() query: any) {
    return this.auditService.findAll(query);
  }

  @Get('export')
  @Roles('ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN')
  @ApiOperation({ summary: 'Export institutional audit log ledger as CSV (Admin only)' })
  exportCsv(@Query() query: any) {
    return this.auditService.exportCsv(query);
  }
}
