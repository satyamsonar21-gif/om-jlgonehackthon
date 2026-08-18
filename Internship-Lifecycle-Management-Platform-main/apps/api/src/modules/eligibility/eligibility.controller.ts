import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EligibilityService } from './eligibility.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Eligibility')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Get('check/:studentId/:listingId')
  @ApiOperation({ summary: 'Evaluate student eligibility against specific internship criteria' })
  async checkEligibility(
    @Param('studentId') studentId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.eligibilityService.checkEligibility(studentId, listingId);
  }

  @Post('check')
  @ApiOperation({ summary: 'Evaluate eligibility with request body or for current student' })
  async checkEligibilityPost(@Request() req: any, @Body() body: { studentId?: string; listingId: string }) {
    const studentId = body.studentId || req.user?.student?.id;
    return this.eligibilityService.checkEligibility(studentId, body.listingId);
  }
}
