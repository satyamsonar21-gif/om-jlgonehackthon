import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('review-resume') reviewResume(@Body() body: { resumeText: string }) { return this.aiService.reviewResume(body.resumeText); }
  @Post('summarize-report') summarizeReport(@Body() body: { report: any }) { return this.aiService.summarizeReport(body.report); }
  @Post('placement-insights') placementInsights(@Body() body: any) { return this.aiService.generatePlacementInsights(body); }
}
