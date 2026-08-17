import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('Feedback')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post() create(@Body() body: any) { return this.feedbackService.create(body); }
  @Get(':internshipId') findByInternship(@Param('internshipId') id: string) { return this.feedbackService.findByInternship(id); }
}
