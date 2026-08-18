import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Feedback')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles('COMPANY', 'COMPANY_MENTOR', 'FACULTY', 'FACULTY_MENTOR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit milestone appraisal or internship feedback' })
  create(@Body() body: any) {
    return this.feedbackService.create(body);
  }

  @Get(':internshipId')
  @ApiOperation({ summary: 'Get feedback history for an internship' })
  findByInternship(@Param('internshipId') id: string) {
    return this.feedbackService.findByInternship(id);
  }
}

