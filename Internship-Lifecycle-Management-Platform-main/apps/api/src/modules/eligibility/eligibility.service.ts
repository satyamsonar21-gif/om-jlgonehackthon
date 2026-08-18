import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface EligibilityCheckItem {
  criterion: string;
  required: string | number;
  actual: string | number;
  passed: boolean;
  warning?: boolean;
  notes?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  overallScore: number;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'CONDITIONAL';
  checks: {
    cgpa: EligibilityCheckItem;
    backlogs: EligibilityCheckItem;
    department: EligibilityCheckItem;
    passingYear: EligibilityCheckItem;
    skills: EligibilityCheckItem;
    certifications?: EligibilityCheckItem;
    experience?: EligibilityCheckItem;
  };
  passedChecks: number;
  totalChecks: number;
  reasons: string[];
  suggestions: string[];
}

@Injectable()
export class EligibilityService {
  constructor(private prisma: PrismaService) {}

  async checkEligibility(studentId: string, listingId: string): Promise<EligibilityResult> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, college: true },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    const listing = await this.prisma.internshipListing.findUnique({
      where: { id: listingId },
      include: { company: true },
    });
    if (!listing) throw new NotFoundException('Internship listing not found');

    return this.evaluate(student, listing);
  }

  evaluate(student: any, listing: any): EligibilityResult {
    const reasons: string[] = [];
    const suggestions: string[] = [];

    // 1. CGPA Check
    const studentCgpa = student.cgpa || 0;
    const minCgpa = listing.minCgpa || 0.0;
    const cgpaPassed = studentCgpa >= minCgpa;
    if (!cgpaPassed) {
      reasons.push(`CGPA (${studentCgpa.toFixed(2)}) is below the required minimum of ${minCgpa.toFixed(2)}`);
      suggestions.push(`A minimum CGPA of ${minCgpa} is required for this role.`);
    }

    // 2. Backlogs Check
    const studentBacklogs = student.activeBacklogs || 0;
    const maxBacklogs = listing.maxBacklogs ?? 0;
    const backlogsPassed = studentBacklogs <= maxBacklogs;
    if (!backlogsPassed) {
      reasons.push(`Active backlogs (${studentBacklogs}) exceed the allowed maximum (${maxBacklogs})`);
      suggestions.push('Clear active backlogs to satisfy eligibility criteria.');
    }

    // 3. Department Check
    const studentDept = (student.department || '').trim().toLowerCase();
    const eligibleDeptsRaw = (listing.eligibleDepartments || 'ALL').trim();
    let deptPassed = true;
    if (eligibleDeptsRaw.toUpperCase() !== 'ALL' && eligibleDeptsRaw !== '') {
      const depts = eligibleDeptsRaw.split(',').map((d: string) => d.trim().toLowerCase());
      deptPassed = depts.some((d: string) => studentDept.includes(d) || d.includes(studentDept));
    }
    if (!deptPassed) {
      reasons.push(`Department (${student.department}) is not in the eligible branches: ${eligibleDeptsRaw}`);
      suggestions.push(`Open to students in ${eligibleDeptsRaw}.`);
    }

    // 4. Passing Year Check
    const studentYear = student.passingYear || (student.year ? 2026 - (4 - student.year) : 2025);
    const passingYearsRaw = (listing.passingYears || 'ALL').trim();
    let yearPassed = true;
    if (passingYearsRaw.toUpperCase() !== 'ALL' && passingYearsRaw !== '') {
      const years = passingYearsRaw.split(',').map((y: string) => y.trim());
      yearPassed = years.includes(String(studentYear));
    }
    if (!yearPassed) {
      reasons.push(`Graduation year (${studentYear}) does not match target batch (${passingYearsRaw})`);
      suggestions.push(`Open to ${passingYearsRaw} graduating cohorts.`);
    }

    // 5. Skills Check
    const studentSkills = (student.skills || '')
      .split(',')
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);
    const requiredSkillsList = (listing.requiredSkills || '')
      .split(',')
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);

    let matchedSkillsCount = 0;
    const missingSkillsList: string[] = [];

    for (const req of requiredSkillsList) {
      const hasSkill = studentSkills.some((st: string) => st.includes(req) || req.includes(st));
      if (hasSkill) {
        matchedSkillsCount++;
      } else {
        missingSkillsList.push(req);
      }
    }

    const skillsPassed = requiredSkillsList.length === 0 || matchedSkillsCount >= Math.ceil(requiredSkillsList.length * 0.6);
    if (!skillsPassed && missingSkillsList.length > 0) {
      reasons.push(`Missing core skills: ${missingSkillsList.join(', ')}`);
      suggestions.push(`Consider building projects using ${missingSkillsList.join(', ')}.`);
    }

    // Calculations
    const checksArray = [cgpaPassed, backlogsPassed, deptPassed, yearPassed, skillsPassed];
    const passedChecks = checksArray.filter(Boolean).length;
    const totalChecks = checksArray.length;
    const overallScore = Math.round((passedChecks / totalChecks) * 100);

    const isEligible = cgpaPassed && backlogsPassed && deptPassed && yearPassed;

    return {
      eligible: isEligible,
      overallScore,
      status: isEligible ? 'ELIGIBLE' : overallScore >= 60 ? 'CONDITIONAL' : 'NOT_ELIGIBLE',
      checks: {
        cgpa: {
          criterion: 'Minimum CGPA',
          required: minCgpa.toFixed(1),
          actual: studentCgpa.toFixed(2),
          passed: cgpaPassed,
        },
        backlogs: {
          criterion: 'Active Backlogs',
          required: maxBacklogs === 0 ? '0 Backlogs' : `Max ${maxBacklogs}`,
          actual: `${studentBacklogs} Active`,
          passed: backlogsPassed,
        },
        department: {
          criterion: 'Department / Branch',
          required: eligibleDeptsRaw,
          actual: student.department || 'Unknown',
          passed: deptPassed,
        },
        passingYear: {
          criterion: 'Target Batch',
          required: passingYearsRaw,
          actual: String(studentYear),
          passed: yearPassed,
        },
        skills: {
          criterion: 'Required Technical Skills',
          required: listing.requiredSkills || 'General Tech',
          actual: student.skills || 'None specified',
          passed: skillsPassed,
          notes: missingSkillsList.length > 0 ? `Missing: ${missingSkillsList.join(', ')}` : 'All core skills matched',
        },
      },
      passedChecks,
      totalChecks,
      reasons,
      suggestions,
    };
  }
}
