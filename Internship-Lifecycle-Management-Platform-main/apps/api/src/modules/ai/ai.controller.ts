import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('match-internships')
  @ApiOperation({ summary: 'Get AI recommended internships for current student' })
  matchInternships(@Request() req: any) {
    const studentId = req.user?.student?.id || req.user?.id;
    return this.aiService.matchInternships(studentId);
  }

  @Get('match-internships/:studentId')
  @ApiOperation({ summary: 'Get AI recommended internships for specific student ID' })
  matchInternshipsForStudent(@Param('studentId') studentId: string) {
    return this.aiService.matchInternships(studentId);
  }

  @Get('skill-gap')
  @ApiOperation({ summary: 'Analyze technical skill gaps for current student' })
  analyzeSkillGap(@Request() req: any) {
    const studentId = req.user?.student?.id || req.user?.id;
    return this.aiService.analyzeSkillGap(studentId);
  }

  @Get('skill-gap/:studentId')
  @ApiOperation({ summary: 'Analyze technical skill gaps for specific student' })
  analyzeSkillGapForStudent(@Param('studentId') studentId: string) {
    return this.aiService.analyzeSkillGap(studentId);
  }

  @Post('review-resume')
  @ApiOperation({ summary: 'AI automated resume scoring and ATS compatibility analysis' })
  reviewResume(@Body() body: { resumeText: string }) {
    return this.aiService.reviewResume(body.resumeText);
  }

  @Post('summarize-report')
  @ApiOperation({ summary: 'AI synthesis bullet points for weekly report' })
  summarizeReport(@Body() body: { report: any }) {
    return this.aiService.summarizeReport(body.report);
  }

  @Post('placement-insights')
  @ApiOperation({ summary: 'Generate placement readiness insights' })
  placementInsights(@Body() body: any) {
    return this.aiService.generatePlacementInsights(body);
  }
}
