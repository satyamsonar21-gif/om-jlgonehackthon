import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Internships')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active or completed internships with filters' })
  findAll(@Query() query: any) {
    return this.internshipsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed internship enrollment with reports, logs, and attendance' })
  findOne(@Param('id') id: string) {
    return this.internshipsService.findOne(id);
  }

  @Post(':id/join')
  @Roles('STUDENT', 'COMPANY', 'COMPANY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Confirm formal student joining date and details' })
  confirmJoining(@Param('id') id: string, @Body() body: any) {
    return this.internshipsService.confirmJoining(id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update internship enrollment data' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.internshipsService.update(id, body);
  }

  @Patch(':id/complete')
  @Roles('TNP_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'COMPANY', 'COMPANY_MENTOR')
  @ApiOperation({ summary: 'Mark internship as completed once all requirements are fulfilled' })
  complete(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.internshipsService.complete(id, {
      ...body,
      completedById: req.user?.id,
    });
  }
}
