import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async reviewResume(resumeText: string) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `You are an expert HR recruiter and career coach. Analyze this resume for a student applying for internships.

Resume:
${resumeText}

Return a JSON object with these exact fields:
- score: number (0-100)
- strengths: string[] (3-5 items)
- improvements: string[] (3-5 items)
- missingKeywords: string[]
- atsCompatibility: boolean
- summary: string (2 sentences)

Return ONLY the JSON object, no markdown, no explanation.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      return { score: 0, strengths: [], improvements: ['Unable to process resume at this time'], missingKeywords: [], atsCompatibility: false, summary: 'AI review unavailable' };
    }
  }

  async summarizeReport(report: any) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Summarize this internship weekly report into exactly 3 concise bullet points focusing on key achievements:

Summary: ${report.summary}
Key Learnings: ${report.keyLearnings}
Issues: ${report.issuesFaced || 'None'}

Return a JSON array of exactly 3 strings. Return ONLY the JSON array.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return { bullets: JSON.parse(cleanText) };
    } catch (error) {
      return { bullets: [report.summary?.substring(0, 100) || 'Report submitted'] };
    }
  }

  async generatePlacementInsights(data: any) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `You are a placement counselor. Generate personalized insights for this student:

Attendance: ${data.attendancePercentage}%
Report Submission Rate: ${data.reportSubmissionRate}%
Task Completion: ${data.taskCompletionRate}%
Mentor Rating: ${data.mentorRating}/5
Placement Score: ${data.placementScore}/100

Return a JSON object with:
- insights: string[] (3-4 personalized recommendations)
- strengths: string[] (2-3 strong areas)
- areasForImprovement: string[] (2-3 areas)
- overallAssessment: string (1 sentence)

Return ONLY the JSON object.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      return { insights: ['Keep up your good work!'], strengths: [], areasForImprovement: [], overallAssessment: 'Keep improving.' };
    }
  }
}
