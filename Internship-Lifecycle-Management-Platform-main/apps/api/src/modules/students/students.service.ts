import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.department) where.department = { contains: query.department };
    if (query?.verificationStatus) where.verificationStatus = query.verificationStatus;
    if (query?.search) {
      where.OR = [
        { studentId: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
        { skills: { contains: query.search } },
      ];
    }

    return this.prisma.student.findMany({
      where,
      include: {
        user: true,
        college: true,
        applications: {
          include: { listing: { include: { company: true } } },
        },
        internships: {
          include: {
            company: true,
            facultyMentor: { include: { user: true } },
            certificate: true,
            ppo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [{ id }, { userId: id }, { studentId: id }],
      },
      include: {
        user: true,
        college: true,
        applications: {
          include: {
            listing: { include: { company: true } },
            offerLetter: true,
            tnpVerification: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
          orderBy: { submittedAt: 'desc' },
        },
        internships: {
          include: {
            company: true,
            facultyMentor: { include: { user: true } },
            companyMentor: { include: { user: true } },
            attendanceRecords: { orderBy: { date: 'desc' } },
            dailyLogs: { orderBy: { date: 'desc' } },
            weeklyReports: { orderBy: { weekNumber: 'asc' } },
            feedback: true,
            tasks: true,
            certificate: true,
            ppo: true,
          },
        },
        facultyAssignments: {
          include: { faculty: { include: { user: true } } },
        },
        documents: { orderBy: { createdAt: 'desc' } },
        riskAlerts: { orderBy: { createdAt: 'desc' } },
        aiRecommendations: {
          include: { listing: { include: { company: true } } },
        },
      },
    });

    if (!student) throw new NotFoundException(`Student profile '${id}' not found`);
    return student;
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: true },
    });
    if (!existing) throw new NotFoundException('Student profile not found');

    // Sync user attributes if supplied
    if (data.name || data.phone || data.avatarUrl || data.profilePhoto) {
      await this.prisma.user.update({
        where: { id: existing.userId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.phone ? { phone: data.phone } : {}),
          ...(data.avatarUrl || data.profilePhoto ? { profilePhoto: data.avatarUrl || data.profilePhoto } : {}),
        },
      });
    }

    // Merge data for accurate completion calculation
    const merged = { ...existing, ...data };

    let score = 0;
    const completedSections: string[] = [];
    const missingSections: string[] = [];

    // 1. Basic & Contact Info (10%)
    if (existing.user?.name && existing.user?.email && (existing.user?.phone || merged.phone)) {
      score += 10;
      completedSections.push('Basic Information');
    } else {
      missingSections.push('Contact Information (Phone/Email)');
    }

    // 2. Academic Enrollment (15%)
    if (merged.studentId && merged.department && merged.year) {
      score += 15;
      completedSections.push('Academic Enrollment');
    } else {
      missingSections.push('Academic Details');
    }

    // 3. Academic Metrics / CGPA (10%)
    if (merged.cgpa !== undefined && merged.cgpa !== null && merged.cgpa > 0) {
      score += 10;
      completedSections.push('Academic Metrics (CGPA)');
    } else {
      missingSections.push('CGPA & Performance Metrics');
    }

    // 4. Technical Skills (15%)
    if (merged.skills && (typeof merged.skills === 'string' ? merged.skills.trim().length > 0 : merged.skills.length > 0)) {
      score += 15;
      completedSections.push('Technical Skills');
    } else {
      missingSections.push('Technical Skills');
    }

    // 5. Soft Skills (5%)
    if (merged.softSkills && (typeof merged.softSkills === 'string' ? merged.softSkills.trim().length > 0 : merged.softSkills.length > 0)) {
      score += 5;
      completedSections.push('Soft Skills');
    } else {
      missingSections.push('Soft Skills');
    }

    // 6. Resume Document (15%)
    if (merged.resumeUrl && merged.resumeUrl.trim().length > 0) {
      score += 15;
      completedSections.push('Resume Document');
    } else {
      missingSections.push('Resume Document');
    }

    // 7. Projects & Portfolio (15%)
    if (merged.projects && (typeof merged.projects === 'string' ? merged.projects.trim().length > 0 : merged.projects.length > 0)) {
      score += 15;
      completedSections.push('Projects & Portfolio');
    } else {
      missingSections.push('Projects');
    }

    // 8. Certifications (5%)
    if (merged.certifications && (typeof merged.certifications === 'string' ? merged.certifications.trim().length > 0 : merged.certifications.length > 0)) {
      score += 5;
      completedSections.push('Certifications');
    } else {
      missingSections.push('Certifications');
    }

    // 9. Professional Social Links (5%)
    if (merged.githubUrl || merged.linkedinUrl || merged.portfolioUrl) {
      score += 5;
      completedSections.push('Social / Professional Links');
    } else {
      missingSections.push('LinkedIn & GitHub');
    }

    // 10. Internship Preferences (5%)
    if (merged.preferredDomains || merged.preferredLocation || merged.preferredDurationWeeks) {
      score += 5;
      completedSections.push('Internship Preferences');
    } else {
      missingSections.push('Internship Preferences');
    }

    data.profileCompletion = Math.min(100, Math.max(0, score));

    // Serialize JSON fields if received as arrays/objects
    const updatePayload: any = { ...data };
    delete updatePayload.name;
    delete updatePayload.phone;
    delete updatePayload.profilePhoto;

    if (Array.isArray(updatePayload.skills)) updatePayload.skills = updatePayload.skills.join(', ');
    if (Array.isArray(updatePayload.softSkills)) updatePayload.softSkills = updatePayload.softSkills.join(', ');
    if (typeof updatePayload.projects === 'object' && updatePayload.projects !== null) {
      updatePayload.projects = JSON.stringify(updatePayload.projects);
    }
    if (typeof updatePayload.achievements === 'object' && updatePayload.achievements !== null) {
      updatePayload.achievements = JSON.stringify(updatePayload.achievements);
    }
    if (typeof updatePayload.certifications === 'object' && updatePayload.certifications !== null) {
      updatePayload.certifications = JSON.stringify(updatePayload.certifications);
    }
    if (Array.isArray(updatePayload.preferredDomains)) {
      updatePayload.preferredDomains = updatePayload.preferredDomains.join(', ');
    }

    const updated = await this.prisma.student.update({
      where: { id: existing.id },
      data: updatePayload,
      include: { user: true, college: true },
    });

    return {
      ...updated,
      completionBreakdown: {
        percentage: data.profileCompletion,
        completed: completedSections,
        missing: missingSections,
      },
    };
  }

  async verifyProfile(id: string, body: { status: string; remarks?: string; verifiedBy?: string }) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student not found');

    const previousStatus = student.verificationStatus;

    const updated = await this.prisma.student.update({
      where: { id: student.id },
      data: {
        verificationStatus: body.status,
        verificationRemarks: body.remarks,
        verifiedAt: new Date(),
        verifiedBy: body.verifiedBy || 'T&P Office',
      },
      include: { user: true },
    });

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: `STUDENT_PROFILE_${body.status}`,
        entity: 'Student',
        entityId: student.id,
        userRole: 'TNP_ADMIN',
        previousState: previousStatus,
        newState: body.status,
        reason: body.remarks || `Student profile status changed to ${body.status}`,
      },
    });

    // Send Notification
    await this.prisma.notification.create({
      data: {
        userId: student.userId,
        role: 'STUDENT',
        title: `Profile ${body.status === 'VERIFIED' ? 'Verified ✅' : 'Status Updated'}`,
        message: body.remarks || `Your academic profile has been marked as ${body.status} by T&P Administration.`,
        type: body.status === 'VERIFIED' ? 'SUCCESS' : body.status === 'REJECTED' ? 'ERROR' : 'WARNING',
        link: '/student/profile',
      },
    });

    return updated;
  }

  async getPlacementReadiness(id: string) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }, { studentId: id }] },
      include: {
        user: true,
        college: true,
        internships: {
          orderBy: { createdAt: 'desc' },
          include: {
            feedback: { orderBy: { submittedAt: 'desc' } },
            weeklyReports: { orderBy: { weekNumber: 'asc' } },
            attendanceRecords: { orderBy: { date: 'desc' } },
            company: true,
          },
        },
      },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    const recommendedActions: string[] = [];

    // 1. Technical Skills Score (Max 25)
    let techScore = 0;
    const skillsList = student.skills
      ? student.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    if (skillsList.length >= 6) techScore = 25;
    else if (skillsList.length >= 4) techScore = 20;
    else if (skillsList.length >= 2) techScore = 14;
    else if (skillsList.length >= 1) techScore = 8;
    else {
      techScore = 0;
      recommendedActions.push('Add core technical skills to your profile (target at least 5 skills).');
    }

    // 2. Projects & Portfolio Score (Max 20)
    let projScore = 0;
    let projectCount = 0;
    try {
      if (student.projects) {
        const parsed = JSON.parse(student.projects);
        projectCount = Array.isArray(parsed) ? parsed.length : 1;
      }
    } catch {
      projectCount = student.projects ? 1 : 0;
    }
    projScore += Math.min(15, projectCount * 5);
    if (student.githubUrl && student.githubUrl.trim().length > 0) {
      projScore += 5;
    } else {
      recommendedActions.push('Link your GitHub profile to showcase code repositories.');
    }
    if (projectCount < 2) {
      recommendedActions.push('Document at least 2 full-stack / systems projects on your profile.');
    }

    // 3. Internship Experience & Delivery (Max 25)
    let expScore = 0;
    let expStatus = 'UNAVAILABLE';
    let expDetails = 'No industrial internship records found yet.';
    const latestInternship = student.internships?.[0];

    if (latestInternship) {
      expStatus = 'AVAILABLE';
      // Attendance weight (Max 10)
      const attRate = latestInternship.attendancePercentage || 0;
      if (attRate >= 75) expScore += 10;
      else if (attRate > 0) expScore += Math.round((attRate / 75) * 8);

      // Mentor Feedback / Report weight (Max 15)
      const latestFeedback = latestInternship.feedback?.[0];
      if (latestFeedback) {
        const rating = Number(latestFeedback.overallRating) || 4;
        expScore += Math.round((rating / 5) * 15);
        expDetails = `Evaluated by ${latestInternship.company?.name || 'Mentor'} with ${rating}/5 rating.`;
      } else {
        const approvedReports = latestInternship.weeklyReports.filter((r) => r.status === 'APPROVED').length;
        const reportPts = Math.min(15, approvedReports * 3.5);
        expScore += Math.round(reportPts);
        expDetails = `Active at ${latestInternship.company?.name || 'Company'} (${approvedReports} reports approved, pending final evaluation).`;
        recommendedActions.push('Request mid-term/final evaluation from your corporate mentor.');
      }
    } else {
      recommendedActions.push('Complete an accredited internship to gain 25 practical experience points.');
    }

    // 4. Resume & Profile Credibility (Max 15)
    let resumeScore = 0;
    if (student.resumeUrl && student.resumeUrl.trim().length > 0) {
      resumeScore += 10;
    } else {
      recommendedActions.push('Upload an ATS-compliant PDF resume to earn 10 points.');
    }
    const profilePct = student.profileCompletion || 0;
    if (profilePct >= 80) resumeScore += 5;
    else resumeScore += Math.round((profilePct / 80) * 4);

    // 5. Communication & Soft Skills (Max 15)
    let commScore = 0;
    const softSkillsList = student.softSkills
      ? student.softSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    if (softSkillsList.length > 0) commScore += 5;
    else recommendedActions.push('Specify key soft skills (e.g. Technical Writing, Presentation).');

    const feedbackComm = latestInternship?.feedback?.[0]?.communication;
    if (feedbackComm !== undefined) {
      commScore += Math.round((feedbackComm / 5) * 10);
    } else if (softSkillsList.length >= 3) {
      commScore += 5;
    }

    // Total Overall Placement Readiness Score
    const totalScore = Math.min(100, Math.max(0, techScore + projScore + expScore + resumeScore + commScore));

    let tier = 'NEEDS_IMPROVEMENT';
    let tierLabel = 'Needs Improvement';
    if (totalScore >= 85) {
      tier = 'TIER_1_READY';
      tierLabel = 'Top Tier Placement Ready';
    } else if (totalScore >= 70) {
      tier = 'PLACEMENT_READY';
      tierLabel = 'Industry Ready';
    } else if (totalScore >= 50) {
      tier = 'DEVELOPING';
      tierLabel = 'Developing Competency';
    }

    return {
      studentId: student.id,
      studentName: student.user.name,
      department: student.department,
      cgpa: student.cgpa,
      score: totalScore,
      tier,
      tierLabel,
      breakdown: {
        technicalSkills: {
          score: techScore,
          max: 25,
          skillsCount: skillsList.length,
          skills: skillsList,
          status: skillsList.length > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
        },
        projects: {
          score: projScore,
          max: 20,
          projectCount,
          hasGithub: Boolean(student.githubUrl),
          status: projScore > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
        },
        internshipExperience: {
          score: expScore,
          max: 25,
          status: expStatus,
          details: expDetails,
          attendanceRate: latestInternship?.attendancePercentage || null,
        },
        resumeAndProfile: {
          score: resumeScore,
          max: 15,
          hasResume: Boolean(student.resumeUrl),
          profileCompletion: profilePct,
          status: 'AVAILABLE',
        },
        communication: {
          score: commScore,
          max: 15,
          softSkillsCount: softSkillsList.length,
          softSkills: softSkillsList,
          mentorScore: feedbackComm || null,
          status: softSkillsList.length > 0 || feedbackComm ? 'AVAILABLE' : 'UNAVAILABLE',
        },
      },
      recommendedActions: recommendedActions.slice(0, 4),
      lastUpdated: new Date().toISOString(),
    };
  }
}
