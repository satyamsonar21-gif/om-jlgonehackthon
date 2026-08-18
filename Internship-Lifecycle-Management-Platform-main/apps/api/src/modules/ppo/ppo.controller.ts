import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PpoService } from './ppo.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('PPO Management')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('ppo')
export class PpoController {
  constructor(private readonly ppoService: PpoService) {}

  @Post()
  @Roles('COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Offer or update Pre-Placement Offer (PPO) package' })
  create(@Body() body: any) {
    return this.ppoService.createOrUpdate(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPO records with filtering' })
  findAll(@Query() query: any) {
    return this.ppoService.findAll(query);
  }

  @Patch(':id/respond')
  @Roles('STUDENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Student responds to PPO (Accept / Reject)' })
  respond(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.ppoService.respond(id, {
      ...body,
      studentUserId: req.user?.id,
    });
  }
}
