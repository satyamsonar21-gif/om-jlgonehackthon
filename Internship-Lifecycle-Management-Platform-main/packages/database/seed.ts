import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive ILMP database seed for GHR Hackathon...');

  // 1. Clear existing data in reverse foreign-key dependency order
  console.log('🧹 Clearing existing database records...');
  await prisma.aIRecommendation.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.riskAlert.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.pPO.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.task.deleteMany();
  await prisma.mentorFeedback.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.tNPVerification.deleteMany();
  await prisma.offerLetter.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.internshipListing.deleteMany();
  await prisma.facultyStudentAssignment.deleteMany();
  await prisma.companyMentor.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.college.deleteMany();

  // 2. Seed College
  console.log('🏛️ Seeding College...');
  const college = await prisma.college.create({
    data: {
      name: 'G.H. Raisoni College of Engineering (GHRCE)',
      code: 'GHRCE',
      address: 'CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra 440016',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150',
    },
  });

  // 3. Seed Companies
  console.log('🏢 Seeding Companies...');
  const techNova = await prisma.company.create({
    data: {
      name: 'TechNova Solutions',
      domain: 'Enterprise SaaS & Cloud Systems',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
      website: 'https://technova.example.com',
      description: 'Global provider of enterprise cloud infrastructure, AI integrations, and full-stack SaaS solutions.',
      contactPerson: 'Vikram Nair',
      contactEmail: 'mentor@technova.com',
      contactPhone: '+91 98230 11223',
      location: 'Pune, Maharashtra',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      verificationRemarks: 'Corporate MoU and tax identification verified by T&P cell.',
      verifiedAt: new Date(Date.now() - 90 * 86400000),
      verifiedBy: 'Prof. Sanjay Verma',
    },
  });

  const cloudScale = await prisma.company.create({
    data: {
      name: 'CloudScale Technologies',
      domain: 'DevOps, SRE & Cloud Security',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150',
      website: 'https://cloudscale.example.com',
      description: 'Specialists in high-throughput Kubernetes orchestration, cloud migration, and CI/CD pipelines.',
      contactPerson: 'Neha Kapoor',
      contactEmail: 'neha@cloudscale.io',
      contactPhone: '+91 98221 44556',
      location: 'Bengaluru, Karnataka',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      verificationRemarks: 'Official university hiring partner 2024-2026.',
      verifiedAt: new Date(Date.now() - 60 * 86400000),
      verifiedBy: 'Prof. Sanjay Verma',
    },
  });

  const apexInnovations = await prisma.company.create({
    data: {
      name: 'Apex Fintech Innovations',
      domain: 'Fintech & Security Auditing',
      logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
      website: 'https://apexinnovations.example.com',
      description: 'Next-generation payment gateway and compliance auditing solutions.',
      contactPerson: 'Aditya Mehta',
      contactEmail: 'aditya@apexinnovations.com',
      contactPhone: '+91 98111 77889',
      location: 'Mumbai, Maharashtra',
      isVerified: false,
      verificationStatus: 'PENDING',
      verificationRemarks: 'MoU submitted; pending T&P verification.',
    },
  });

  // 4. Seed Users & Stakeholder Profiles
  console.log('👥 Seeding Stakeholder Users & Profiles...');

  // Student 1: Aarav Patil (Canonical Hero Student)
  const aaravUser = await prisma.user.create({
    data: {
      clerkId: 'user_student_aarav',
      email: 'aarav.patil@ghrce.edu',
      role: 'STUDENT',
      name: 'Aarav Patil',
      phone: '+91 98765 43210',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      collegeId: college.id,
      student: {
        create: {
          studentId: 'IT22B042',
          collegeId: college.id,
          department: 'Information Technology',
          year: 4,
          passingYear: 2025,
          cgpa: 8.4,
          backlogsCount: 0,
          activeBacklogs: 0,
          tenthMarks: 91.5,
          twelfthMarks: 88.0,
          verificationStatus: 'VERIFIED',
          verificationRemarks: 'All marksheets and identities verified by T&P Office.',
          verifiedAt: new Date(Date.now() - 75 * 86400000),
          verifiedBy: 'Prof. Sanjay Verma',
          skills: 'React,Node.js,TypeScript,JavaScript,PostgreSQL,SQL,Docker,Git',
          certifications: 'AWS Certified Cloud Practitioner,Meta Front-End Developer Certificate',
          experience: 'Web Development Lead at GHR Developer Club (1 year)',
          resumeUrl: 'https://storage.ilmp.edu/resumes/aarav_patil_resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/aarav-patil',
          githubUrl: 'https://github.com/aaravpatil',
          portfolioUrl: 'https://aaravpatil.dev',
          profileCompletion: 100.0,
          placementReadinessScore: 94.0,
        },
      },
    },
    include: { student: true },
  });

  // Student 2: Priya Sharma (Active Ongoing Intern)
  const priyaUser = await prisma.user.create({
    data: {
      clerkId: 'user_student_priya',
      email: 'priya.sharma@ghrce.edu',
      role: 'STUDENT',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      collegeId: college.id,
      student: {
        create: {
          studentId: 'CS21B018',
          collegeId: college.id,
          department: 'Computer Science',
          year: 4,
          passingYear: 2025,
          cgpa: 9.1,
          backlogsCount: 0,
          activeBacklogs: 0,
          tenthMarks: 94.0,
          twelfthMarks: 92.5,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(Date.now() - 60 * 86400000),
          verifiedBy: 'Prof. Sanjay Verma',
          skills: 'Python,FastAPI,PostgreSQL,Docker,Kubernetes,PyTorch,React',
          certifications: 'Google Cloud Associate Cloud Engineer',
          resumeUrl: 'https://storage.ilmp.edu/resumes/priya_sharma_resume.pdf',
          profileCompletion: 95.0,
          placementReadinessScore: 96.0,
        },
      },
    },
    include: { student: true },
  });

  // Student 3: Rahul Kumar (Pending Verification)
  const rahulUser = await prisma.user.create({
    data: {
      clerkId: 'user_student_rahul',
      email: 'rahul.kumar@ghrce.edu',
      role: 'STUDENT',
      name: 'Rahul Kumar',
      phone: '+91 98765 43212',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      collegeId: college.id,
      student: {
        create: {
          studentId: 'EC21B029',
          collegeId: college.id,
          department: 'Electronics',
          year: 3,
          passingYear: 2026,
          cgpa: 7.8,
          backlogsCount: 1,
          activeBacklogs: 0,
          verificationStatus: 'PENDING',
          skills: 'C++,Embedded Systems,MATLAB,Python,IoT,FreeRTOS',
          profileCompletion: 80.0,
          placementReadinessScore: 76.0,
        },
      },
    },
    include: { student: true },
  });

  // Student 4: Sneha Deshmukh (Ineligible Example for Testing Filter Rules)
  const snehaUser = await prisma.user.create({
    data: {
      clerkId: 'user_student_sneha',
      email: 'sneha.deshmukh@ghrce.edu',
      role: 'STUDENT',
      name: 'Sneha Deshmukh',
      phone: '+91 98765 43213',
      profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      collegeId: college.id,
      student: {
        create: {
          studentId: 'ME22B005',
          collegeId: college.id,
          department: 'Mechanical',
          year: 3,
          passingYear: 2026,
          cgpa: 6.2,
          backlogsCount: 2,
          activeBacklogs: 2,
          verificationStatus: 'VERIFIED',
          skills: 'AutoCAD,SolidWorks,Python,ANSYS',
          profileCompletion: 85.0,
          placementReadinessScore: 62.0,
        },
      },
    },
    include: { student: true },
  });

  // Faculty 1: Dr. Rajesh Kumar (Canonical Faculty Guide)
  const rajeshUser = await prisma.user.create({
    data: {
      clerkId: 'user_faculty_rajesh',
      email: 'rajesh.kumar@university.edu',
      role: 'FACULTY_MENTOR',
      name: 'Dr. Rajesh Kumar',
      phone: '+91 98220 99881',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      collegeId: college.id,
      faculty: {
        create: {
          facultyId: 'FAC_IT_001',
          collegeId: college.id,
          department: 'Information Technology',
          designation: 'Associate Professor & Academic Internship Coordinator',
        },
      },
    },
    include: { faculty: true },
  });

  // Faculty 2: Dr. Meera Iyer
  const meeraUser = await prisma.user.create({
    data: {
      clerkId: 'user_faculty_meera',
      email: 'meera.iyer@university.edu',
      role: 'FACULTY_MENTOR',
      name: 'Dr. Meera Iyer',
      phone: '+91 98220 99882',
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      collegeId: college.id,
      faculty: {
        create: {
          facultyId: 'FAC_CS_002',
          collegeId: college.id,
          department: 'Computer Science',
          designation: 'Professor & Senior Research Guide',
        },
      },
    },
    include: { faculty: true },
  });

  // Company Mentor 1: Vikram Nair (TechNova Solutions)
  const vikramUser = await prisma.user.create({
    data: {
      clerkId: 'user_mentor_vikram',
      email: 'mentor@techcorp.com',
      role: 'COMPANY_MENTOR',
      name: 'Vikram Nair',
      phone: '+91 98230 11223',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      companyMentor: {
        create: {
          companyId: techNova.id,
          designation: 'Engineering Lead & Industry Mentor',
        },
      },
    },
    include: { companyMentor: true },
  });

  // Company Mentor 2: Neha Kapoor (CloudScale Tech)
  const nehaUser = await prisma.user.create({
    data: {
      clerkId: 'user_mentor_neha',
      email: 'neha@cloudscale.io',
      role: 'COMPANY_MENTOR',
      name: 'Neha Kapoor',
      phone: '+91 98221 44556',
      profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      companyMentor: {
        create: {
          companyId: cloudScale.id,
          designation: 'Principal DevOps Architect',
        },
      },
    },
    include: { companyMentor: true },
  });

  // T&P Admin: Prof. Sanjay Verma
  const tnpAdminUser = await prisma.user.create({
    data: {
      clerkId: 'user_tnp_verma',
      email: 'tnp.admin@university.edu',
      role: 'TNP_ADMIN',
      name: 'Prof. Sanjay Verma',
      phone: '+91 98220 55443',
      collegeId: college.id,
    },
  });

  // Institutional Root Admin / HOD: Dr. Ananya Joshi
  const rootAdminUser = await prisma.user.create({
    data: {
      clerkId: 'user_admin_root',
      email: 'admin.root@institution.edu',
      role: 'ADMIN',
      name: 'Dr. Ananya Joshi',
      phone: '+91 98220 11000',
      collegeId: college.id,
    },
  });

  // 5. Seed Faculty-Student Assignments
  console.log('📌 Seeding Faculty Assignments...');
  await prisma.facultyStudentAssignment.create({
    data: {
      facultyId: rajeshUser.faculty!.id,
      studentId: aaravUser.student!.id,
      assignedBy: tnpAdminUser.id,
      status: 'ACTIVE',
    },
  });
  await prisma.facultyStudentAssignment.create({
    data: {
      facultyId: meeraUser.faculty!.id,
      studentId: priyaUser.student!.id,
      assignedBy: tnpAdminUser.id,
      status: 'ACTIVE',
    },
  });

  // 6. Seed Internship Listings with Structured Eligibility Rules
  console.log('💼 Seeding Internship Listings...');
  const now = new Date();

  const listingFullStack = await prisma.internshipListing.create({
    data: {
      companyId: techNova.id,
      title: 'Full Stack Developer Intern',
      description: 'Join our agile core engineering team building high-scale React, TypeScript, Node.js, and PostgreSQL microservices.',
      domain: 'Enterprise Web Development',
      mode: 'HYBRID',
      location: 'Pune, Maharashtra / Remote',
      stipend: 15000,
      openings: 5,
      durationWeeks: 8,
      startDate: new Date(now.getTime() - 60 * 86400000),
      endDate: new Date(now.getTime() - 4 * 86400000),
      deadline: new Date(now.getTime() - 65 * 86400000),
      status: 'PUBLISHED',
      // Eligibility Rules
      minCgpa: 7.0,
      maxBacklogs: 0,
      eligibleDepartments: 'Information Technology,Computer Science',
      passingYears: '2024,2025',
      requiredSkills: 'React,Node.js,JavaScript,SQL',
      requiredCertifications: 'None mandatory (Cloud or Web certs preferred)',
      experienceRequirement: 'Prior web development project or internship experience',
    },
  });

  const listingCloudDevOps = await prisma.internshipListing.create({
    data: {
      companyId: cloudScale.id,
      title: 'Cloud Infrastructure & DevOps Intern',
      description: 'Hands-on orchestration of Kubernetes clusters, CI/CD pipeline automation, and cloud cost telemetry.',
      domain: 'Cloud & Infrastructure',
      mode: 'REMOTE',
      location: 'Bengaluru / Remote',
      stipend: 20000,
      openings: 3,
      durationWeeks: 12,
      startDate: new Date(now.getTime() - 30 * 86400000),
      endDate: new Date(now.getTime() + 60 * 86400000),
      deadline: new Date(now.getTime() + 15 * 86400000),
      status: 'PUBLISHED',
      // Eligibility Rules
      minCgpa: 7.5,
      maxBacklogs: 0,
      eligibleDepartments: 'Computer Science,Information Technology,Electronics',
      passingYears: '2025,2026',
      requiredSkills: 'Docker,Kubernetes,AWS,Linux',
      requiredCertifications: 'AWS or GCP Associate preferred',
    },
  });

  const listingMachineLearning = await prisma.internshipListing.create({
    data: {
      companyId: techNova.id,
      title: 'Applied AI / ML Engineer Intern',
      description: 'Develop LLM evaluation frameworks, embedding search retrieval (RAG), and fine-tuning pipelines.',
      domain: 'Artificial Intelligence',
      mode: 'REMOTE',
      location: 'Pune / Remote',
      stipend: 25000,
      openings: 2,
      durationWeeks: 10,
      startDate: new Date(now.getTime() + 10 * 86400000),
      endDate: new Date(now.getTime() + 80 * 86400000),
      deadline: new Date(now.getTime() + 5 * 86400000),
      status: 'PUBLISHED',
      // Eligibility Rules
      minCgpa: 8.0,
      maxBacklogs: 0,
      eligibleDepartments: 'Computer Science,Information Technology',
      passingYears: '2025,2026',
      requiredSkills: 'Python,PyTorch,FastAPI,Machine Learning',
    },
  });

  // 7. Seed Canonical Application 1 (Aarav Patil - Completed Full Lifecycle)
  console.log('🚀 Seeding Canonical Completed Lifecycle Application (Aarav Patil)...');

  const appAarav = await prisma.application.create({
    data: {
      studentId: aaravUser.student!.id,
      listingId: listingFullStack.id,
      status: 'PPO_STATUS_UPDATED',
      coverLetter: 'I have strong experience building full-stack web applications with React and Node.js. Excited to contribute to TechNova.',
      resumeUrl: 'https://storage.ilmp.edu/resumes/aarav_patil_resume.pdf',
      eligibilitySnapshot: JSON.stringify({
        eligible: true,
        overallScore: 94,
        status: 'ELIGIBLE',
        checks: {
          cgpa: { criterion: 'CGPA', required: 7.0, actual: 8.4, passed: true },
          backlogs: { criterion: 'Active Backlogs', required: 0, actual: 0, passed: true },
          department: { criterion: 'Department', required: 'IT/CSE', actual: 'Information Technology', passed: true },
          skills: { criterion: 'Required Skills', required: 'React, Node.js, SQL', actual: 'React, Node.js, SQL', passed: true },
        },
      }),
      companyRemarks: 'Outstanding technical assessment and communication. Selected for 8-week internship.',
      submittedAt: new Date(now.getTime() - 65 * 86400000),
      shortlistedAt: new Date(now.getTime() - 64 * 86400000),
      selectedAt: new Date(now.getTime() - 62 * 86400000),
    },
  });

  // Status history for Aarav
  await prisma.applicationStatusHistory.createMany({
    data: [
      { applicationId: appAarav.id, fromStatus: null, toStatus: 'SUBMITTED', changedById: aaravUser.id, changedByRole: 'STUDENT', createdAt: new Date(now.getTime() - 65 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'SUBMITTED', toStatus: 'SHORTLISTED', changedById: vikramUser.id, changedByRole: 'COMPANY_MENTOR', createdAt: new Date(now.getTime() - 64 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'SHORTLISTED', toStatus: 'SELECTED', changedById: vikramUser.id, changedByRole: 'COMPANY_MENTOR', createdAt: new Date(now.getTime() - 62 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'SELECTED', toStatus: 'OFFER_ISSUED', changedById: vikramUser.id, changedByRole: 'COMPANY_MENTOR', createdAt: new Date(now.getTime() - 62 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'OFFER_ISSUED', toStatus: 'OFFER_ACCEPTED', changedById: aaravUser.id, changedByRole: 'STUDENT', createdAt: new Date(now.getTime() - 61 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'OFFER_ACCEPTED', toStatus: 'TNP_VERIFIED', changedById: tnpAdminUser.id, changedByRole: 'TNP_ADMIN', createdAt: new Date(now.getTime() - 60 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'TNP_VERIFIED', toStatus: 'FACULTY_ASSIGNED', changedById: tnpAdminUser.id, changedByRole: 'TNP_ADMIN', createdAt: new Date(now.getTime() - 60 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'FACULTY_ASSIGNED', toStatus: 'JOINED', changedById: aaravUser.id, changedByRole: 'STUDENT', createdAt: new Date(now.getTime() - 60 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'JOINED', toStatus: 'COMPLETED', changedById: tnpAdminUser.id, changedByRole: 'TNP_ADMIN', createdAt: new Date(now.getTime() - 4 * 86400000) },
      { applicationId: appAarav.id, fromStatus: 'COMPLETED', toStatus: 'PPO_STATUS_UPDATED', changedById: vikramUser.id, changedByRole: 'COMPANY_MENTOR', createdAt: new Date(now.getTime() - 2 * 86400000) },
    ],
  });

  // Offer Letter for Aarav
  const offerAarav = await prisma.offerLetter.create({
    data: {
      applicationId: appAarav.id,
      companyId: techNova.id,
      studentId: aaravUser.student!.id,
      stipend: 15000,
      designation: 'Full Stack Engineering Intern',
      offerLetterUrl: 'https://storage.ilmp.edu/offers/aarav_technova_offer.pdf',
      terms: 'Standard 8-week hybrid internship with 40 working hours per week.',
      joiningDate: new Date(now.getTime() - 60 * 86400000),
      expiryDate: new Date(now.getTime() - 55 * 86400000),
      status: 'ACCEPTED',
      studentRemarks: 'Excited to accept the offer!',
      respondedAt: new Date(now.getTime() - 61 * 86400000),
      issuedAt: new Date(now.getTime() - 62 * 86400000),
    },
  });

  // T&P Verification for Aarav
  await prisma.tNPVerification.create({
    data: {
      applicationId: appAarav.id,
      offerLetterId: offerAarav.id,
      verifiedById: tnpAdminUser.id,
      verifiedByRole: 'TNP_ADMIN',
      status: 'VERIFIED',
      remarks: 'Offer letter terms align with institutional internship guidelines.',
      verifiedAt: new Date(now.getTime() - 60 * 86400000),
    },
  });

  // Internship Enrollment for Aarav
  const internshipAarav = await prisma.internship.create({
    data: {
      applicationId: appAarav.id,
      studentId: aaravUser.student!.id,
      companyId: techNova.id,
      facultyMentorId: rajeshUser.faculty!.id,
      companyMentorId: vikramUser.companyMentor!.id,
      startDate: new Date(now.getTime() - 60 * 86400000),
      endDate: new Date(now.getTime() - 4 * 86400000),
      actualJoiningDate: new Date(now.getTime() - 60 * 86400000),
      joiningStatus: 'JOINED',
      joiningLetterUrl: 'https://storage.ilmp.edu/joining/aarav_joining_letter.pdf',
      status: 'COMPLETED',
      attendancePercentage: 96.0,
      completionApprovedAt: new Date(now.getTime() - 4 * 86400000),
      completionRemarks: 'All 8 weekly synthesis reports approved, attendance > 95%, mentor rating 5/5.',
      placementReadinessScore: 95.0,
    },
  });

  // 15 Attendance records for Aarav
  for (let i = 1; i <= 15; i++) {
    await prisma.attendanceRecord.create({
      data: {
        internshipId: internshipAarav.id,
        date: new Date(now.getTime() - (60 - i * 3) * 86400000),
        status: i === 12 ? 'HALF_DAY' : 'PRESENT',
        markedById: vikramUser.companyMentor!.id,
        notes: i === 12 ? 'Attended university mid-sem exam in morning' : 'On-time daily sprint standup',
      },
    });
  }

  // 8 Daily Logs for Aarav
  for (let i = 1; i <= 8; i++) {
    await prisma.dailyLog.create({
      data: {
        internshipId: internshipAarav.id,
        date: new Date(now.getTime() - (55 - i * 5) * 86400000),
        tasksCompleted: `Completed Sprint ${i} tasks: API endpoint implementation, schema refactoring, and automated Jest tests.`,
        hoursWorked: 8.0,
        challengesFaced: 'Optimizing Redis cache invalidation for session tokens.',
        plansForTomorrow: 'Connect frontend TanStack query hooks to backend REST endpoints.',
        skillsUsed: 'React,Node.js,TypeScript,PostgreSQL',
        acknowledgedAt: new Date(now.getTime() - (54 - i * 5) * 86400000),
        acknowledgedById: vikramUser.companyMentor!.id,
      },
    });
  }

  // 8 Weekly Reports for Aarav (All Approved)
  for (let w = 1; w <= 8; w++) {
    await prisma.weeklyReport.create({
      data: {
        internshipId: internshipAarav.id,
        weekNumber: w,
        summary: `Week ${w} Synthesis: Architected module components, authoring unit tests with 90%+ code coverage.`,
        keyLearnings: `Gained production mastery in TypeScript decorators, Prisma transaction isolation, and React 19 concurrent features.`,
        issuesFaced: 'Initial CORS pre-flight handling resolved via API gateway configuration.',
        nextWeekGoals: `Complete Phase ${w + 1} deliverables ahead of production deployment.`,
        hoursWorked: 40.0,
        fileUrl: `https://storage.ilmp.edu/reports/aarav_week_${w}_report.pdf`,
        status: 'APPROVED',
        facultyComments: `Excellent technical depth and rigorous documentation. Approved.`,
        reviewedById: rajeshUser.faculty!.id,
        reviewedAt: new Date(now.getTime() - (60 - w * 7) * 86400000),
        submittedAt: new Date(now.getTime() - (61 - w * 7) * 86400000),
      },
    });
  }

  // 2 Evaluations for Aarav (Mid-Term & Final)
  await prisma.mentorFeedback.create({
    data: {
      internshipId: internshipAarav.id,
      mentorId: vikramUser.companyMentor!.id,
      evaluatorRole: 'COMPANY_MENTOR',
      type: 'MID_TERM',
      technicalSkills: 5,
      communication: 5,
      problemSolving: 5,
      punctuality: 5,
      teamwork: 5,
      professionalism: 5,
      overallRating: 5,
      comments: 'Aarav has shown exceptional architecture skills and fast execution during the first half of the internship.',
      submittedAt: new Date(now.getTime() - 30 * 86400000),
    },
  });

  await prisma.mentorFeedback.create({
    data: {
      internshipId: internshipAarav.id,
      mentorId: vikramUser.companyMentor!.id,
      evaluatorRole: 'COMPANY_MENTOR',
      type: 'FINAL',
      technicalSkills: 5,
      communication: 5,
      problemSolving: 5,
      punctuality: 5,
      teamwork: 5,
      professionalism: 5,
      overallRating: 5,
      comments: 'Exceeded all senior engineering benchmarks. Unanimously recommended for Full-Time Pre-Placement Offer (PPO).',
      submittedAt: new Date(now.getTime() - 4 * 86400000),
    },
  });

  // Certificate with QR Code for Aarav
  const certNumberAarav = 'CERT-2026-NITT-8492';
  const verifyUrlAarav = `http://localhost:3000/verify/${certNumberAarav}`;
  const qrDataUrlAarav = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrlAarav)}`;

  await prisma.certificate.create({
    data: {
      internshipId: internshipAarav.id,
      certificateNumber: certNumberAarav,
      verificationHash: '0x8f4d92a6c1e5b30748291a7d6e4b9c10f823a9d1',
      issuedAt: new Date(now.getTime() - 3 * 86400000),
      pdfUrl: 'https://storage.ilmp.edu/certificates/aarav_cert_2026.pdf',
      qrCode: qrDataUrlAarav,
      isRevoked: false,
      metadata: JSON.stringify({
        studentName: 'Aarav Patil',
        companyName: 'TechNova Solutions',
        duration: '8 Weeks',
        grade: 'Distinction / Grade A+',
      }),
    },
  });

  // Pre-Placement Offer (PPO) for Aarav
  await prisma.pPO.create({
    data: {
      internshipId: internshipAarav.id,
      studentId: aaravUser.student!.id,
      companyId: techNova.id,
      status: 'ACCEPTED',
      packageLpa: 14.5,
      designation: 'Associate Software Engineer (Core Systems)',
      offerLetterUrl: 'https://storage.ilmp.edu/ppo/aarav_technova_ppo.pdf',
      remarks: 'Full-time offer accepted by student. Joining post graduation in July 2025.',
      offeredAt: new Date(now.getTime() - 3 * 86400000),
      respondedAt: new Date(now.getTime() - 1 * 86400000),
    },
  });

  // 8. Seed Application 2 (Priya Sharma - Live Active Internship)
  console.log('🔄 Seeding Active In-Progress Internship (Priya Sharma)...');

  const appPriya = await prisma.application.create({
    data: {
      studentId: priyaUser.student!.id,
      listingId: listingCloudDevOps.id,
      status: 'IN_PROGRESS',
      coverLetter: 'Passionate about Kubernetes and high-availability cloud architecture. Google Cloud Associate certified.',
      resumeUrl: 'https://storage.ilmp.edu/resumes/priya_sharma_resume.pdf',
      submittedAt: new Date(now.getTime() - 35 * 86400000),
      selectedAt: new Date(now.getTime() - 32 * 86400000),
    },
  });

  const offerPriya = await prisma.offerLetter.create({
    data: {
      applicationId: appPriya.id,
      companyId: cloudScale.id,
      studentId: priyaUser.student!.id,
      stipend: 20000,
      designation: 'DevOps & Cloud Systems Intern',
      status: 'ACCEPTED',
      joiningDate: new Date(now.getTime() - 30 * 86400000),
      issuedAt: new Date(now.getTime() - 32 * 86400000),
    },
  });

  await prisma.tNPVerification.create({
    data: {
      applicationId: appPriya.id,
      offerLetterId: offerPriya.id,
      verifiedById: tnpAdminUser.id,
      status: 'VERIFIED',
      remarks: 'Verified and approved for 12-week remote internship.',
      verifiedAt: new Date(now.getTime() - 30 * 86400000),
    },
  });

  const internshipPriya = await prisma.internship.create({
    data: {
      applicationId: appPriya.id,
      studentId: priyaUser.student!.id,
      companyId: cloudScale.id,
      facultyMentorId: meeraUser.faculty!.id,
      companyMentorId: nehaUser.companyMentor!.id,
      startDate: new Date(now.getTime() - 30 * 86400000),
      endDate: new Date(now.getTime() + 60 * 86400000),
      actualJoiningDate: new Date(now.getTime() - 30 * 86400000),
      joiningStatus: 'JOINED',
      status: 'ACTIVE',
      attendancePercentage: 93.3,
      placementReadinessScore: 96.0,
    },
  });

  // Priya Attendance & Reports
  for (let i = 1; i <= 10; i++) {
    await prisma.attendanceRecord.create({
      data: {
        internshipId: internshipPriya.id,
        date: new Date(now.getTime() - (30 - i * 2) * 86400000),
        status: 'PRESENT',
        markedById: nehaUser.companyMentor!.id,
      },
    });
  }

  await prisma.weeklyReport.create({
    data: {
      internshipId: internshipPriya.id,
      weekNumber: 1,
      summary: 'Configured Kubernetes local minikube and helm charts for staging environment.',
      keyLearnings: 'Helm templating and ingress controller setup.',
      nextWeekGoals: 'Author GitHub Actions CI/CD workflows for container images.',
      status: 'APPROVED',
      facultyComments: 'Strong start. Keep up the good work.',
      reviewedById: meeraUser.faculty!.id,
      reviewedAt: new Date(now.getTime() - 21 * 86400000),
    },
  });

  await prisma.weeklyReport.create({
    data: {
      internshipId: internshipPriya.id,
      weekNumber: 2,
      summary: 'Implemented Prometheus metrics scrape configuration and custom Grafana dashboards.',
      keyLearnings: 'PromQL queries and alertmanager routing.',
      nextWeekGoals: 'Stress-test ingress throughput under simulated DDoS load.',
      status: 'SUBMITTED', // Pending in Faculty Queue
      submittedAt: new Date(now.getTime() - 2 * 86400000),
    },
  });

  // Tasks for Priya
  await prisma.task.create({
    data: {
      internshipId: internshipPriya.id,
      title: 'Automate Docker multi-stage build pipelines',
      status: 'COMPLETED',
      assignedById: nehaUser.companyMentor!.id,
    },
  });
  await prisma.task.create({
    data: {
      internshipId: internshipPriya.id,
      title: 'Integrate Vault secrets injector in Kubernetes cluster',
      status: 'IN_PROGRESS',
      assignedById: nehaUser.companyMentor!.id,
    },
  });
  await prisma.task.create({
    data: {
      internshipId: internshipPriya.id,
      title: 'Author disaster recovery runbook',
      status: 'PENDING',
      assignedById: nehaUser.companyMentor!.id,
    },
  });

  // 9. Seed Application 3 (Rahul Kumar - Shortlisted at TechNova)
  console.log('📑 Seeding Pipeline Application (Rahul Kumar)...');
  await prisma.application.create({
    data: {
      studentId: rahulUser.student!.id,
      listingId: listingFullStack.id,
      status: 'SHORTLISTED',
      coverLetter: 'Interested in backend API systems and embedded hardware bridges.',
      submittedAt: new Date(now.getTime() - 10 * 86400000),
      shortlistedAt: new Date(now.getTime() - 8 * 86400000),
      companyRemarks: 'Shortlisted for technical interview scheduled this Thursday.',
    },
  });

  // 10. Seed AI Recommendations
  console.log('🤖 Seeding AI Recommendations...');
  await prisma.aIRecommendation.create({
    data: {
      studentId: aaravUser.student!.id,
      listingId: listingFullStack.id,
      matchScore: 96.0,
      eligibilityScore: 100.0,
      skillMatchScore: 94.0,
      matchedSkills: 'React,Node.js,TypeScript,PostgreSQL,SQL',
      missingSkills: '',
      explanation: 'Exceptional skill overlap (94%) with React and Node.js. CGPA (8.4) comfortably exceeds minimum 7.0 requirement. Verified 0 active backlogs.',
      recommendations: 'Apply immediately; top 5% candidate profile.',
    },
  });

  await prisma.aIRecommendation.create({
    data: {
      studentId: priyaUser.student!.id,
      listingId: listingCloudDevOps.id,
      matchScore: 95.0,
      eligibilityScore: 100.0,
      skillMatchScore: 92.0,
      matchedSkills: 'Docker,Kubernetes,FastAPI,PostgreSQL',
      missingSkills: 'AWS',
      explanation: 'High match score with strong Docker and Kubernetes foundational experience. CGPA (9.1) is in the top 1st percentile.',
      recommendations: 'Review AWS IAM and VPC fundamentals to achieve 100% role fit.',
    },
  });

  // 11. Seed Documents & Vault
  console.log('📂 Seeding Institutional Documents...');
  await prisma.document.create({
    data: {
      title: 'Aarav Patil - Verified Resume',
      type: 'RESUME',
      fileUrl: 'https://storage.ilmp.edu/resumes/aarav_patil_resume.pdf',
      fileName: 'aarav_patil_resume.pdf',
      fileSize: 412000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      uploadedById: aaravUser.id,
      studentId: aaravUser.student!.id,
      verifiedById: tnpAdminUser.id,
      verifiedAt: new Date(now.getTime() - 75 * 86400000),
    },
  });

  await prisma.document.create({
    data: {
      title: 'TechNova Solutions - Formal Offer Letter',
      type: 'OFFER_LETTER',
      fileUrl: 'https://storage.ilmp.edu/offers/aarav_technova_offer.pdf',
      fileName: 'aarav_technova_offer.pdf',
      fileSize: 520000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      uploadedById: vikramUser.id,
      studentId: aaravUser.student!.id,
      companyId: techNova.id,
      internshipId: internshipAarav.id,
      verifiedById: tnpAdminUser.id,
      verifiedAt: new Date(now.getTime() - 60 * 86400000),
    },
  });

  await prisma.document.create({
    data: {
      title: 'Official Internship Completion Certificate',
      type: 'COMPLETION_CERTIFICATE',
      fileUrl: 'https://storage.ilmp.edu/certificates/aarav_cert_2026.pdf',
      fileName: 'aarav_cert_2026.pdf',
      fileSize: 680000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      uploadedById: rootAdminUser.id,
      studentId: aaravUser.student!.id,
      internshipId: internshipAarav.id,
      verifiedById: rootAdminUser.id,
      verifiedAt: new Date(now.getTime() - 3 * 86400000),
    },
  });

  // 12. Seed Risk Alerts for Faculty Monitoring
  console.log('⚠️ Seeding Risk Alerts...');
  await prisma.riskAlert.create({
    data: {
      internshipId: internshipPriya.id,
      studentId: priyaUser.student!.id,
      facultyMentorId: meeraUser.faculty!.id,
      riskLevel: 'LOW',
      riskType: 'LATE_REPORT',
      description: 'Week 2 report submission was submitted 1 day past the scheduled weekly deadline.',
      isResolved: true,
      resolvedAt: new Date(now.getTime() - 1 * 86400000),
      resolvedRemarks: 'Student was participating in college hackathon with prior faculty approval.',
    },
  });

  // 13. Seed Immutable Audit Ledger
  console.log('📜 Seeding Institutional Audit Log Ledger...');
  const auditEntries = [
    { action: 'STUDENT_PROFILE_VERIFIED', entity: 'Student', entityId: aaravUser.student!.id, userRole: 'TNP_ADMIN', userId: tnpAdminUser.id, previousState: 'PENDING', newState: 'VERIFIED', reason: 'Verified marksheets and enrollment.' },
    { action: 'COMPANY_VERIFIED', entity: 'Company', entityId: techNova.id, userRole: 'TNP_ADMIN', userId: tnpAdminUser.id, previousState: 'PENDING', newState: 'VERIFIED', reason: 'Corporate MoU signed.' },
    { action: 'INTERNSHIP_LISTING_PUBLISHED', entity: 'InternshipListing', entityId: listingFullStack.id, userRole: 'COMPANY_MENTOR', userId: vikramUser.id, previousState: 'DRAFT', newState: 'PUBLISHED', reason: 'Approved by placement coordinator.' },
    { action: 'OFFER_ACCEPTED', entity: 'OfferLetter', entityId: offerAarav.id, userRole: 'STUDENT', userId: aaravUser.id, previousState: 'ISSUED', newState: 'ACCEPTED', reason: 'Student accepted offer on portal.' },
    { action: 'TNP_PLACEMENT_APPROVED', entity: 'TNPVerification', entityId: appAarav.id, userRole: 'TNP_ADMIN', userId: tnpAdminUser.id, previousState: 'PENDING', newState: 'VERIFIED', reason: 'Placement recorded in university registry.' },
    { action: 'CERTIFICATE_CRYPTOGRAPHICALLY_ISSUED', entity: 'Certificate', entityId: certNumberAarav, userRole: 'ADMIN', userId: rootAdminUser.id, previousState: 'PENDING', newState: 'ISSUED', reason: 'Internship completion criteria 100% satisfied.' },
    { action: 'PPO_ACCEPTED', entity: 'PPO', entityId: aaravUser.student!.id, userRole: 'STUDENT', userId: aaravUser.id, previousState: 'OFFERED', newState: 'ACCEPTED', reason: 'Student accepted full-time package (14.5 LPA).' },
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: {
        ...entry,
        ipAddress: '192.168.1.100',
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 30 + 1) * 86400000),
      },
    });
  }

  // 14. Seed Notifications
  console.log('🔔 Seeding User Notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: aaravUser.id, role: 'STUDENT', title: 'PPO Confirmed 🎉', message: 'Congratulations! Your Pre-Placement Offer from TechNova Solutions has been confirmed in the registry.', type: 'SUCCESS', link: '/student/certificates' },
      { userId: priyaUser.id, role: 'STUDENT', title: 'Weekly Report 2 Submitted', message: 'Your Week 2 technical synthesis report is currently in Faculty Review queue.', type: 'INFO', link: '/student/active/reports' },
      { userId: rajeshUser.id, role: 'FACULTY_MENTOR', title: 'Cohort Update', message: 'Aarav Patil has successfully completed the 8-week internship program at TechNova Solutions.', type: 'SUCCESS', link: '/faculty/students' },
      { userId: meeraUser.id, role: 'FACULTY_MENTOR', title: 'Report Awaiting Review', message: 'Priya Sharma submitted Week 2 Synthesis Report for CloudScale Technologies.', type: 'WARNING', link: '/faculty/reports' },
      { userId: vikramUser.id, role: 'COMPANY_MENTOR', title: 'New Applicant Shortlisted', message: 'Rahul Kumar (Electronics, CGPA 7.8) is shortlisted for Full Stack Developer position.', type: 'INFO', link: '/company/applications' },
      { userId: tnpAdminUser.id, role: 'TNP_ADMIN', title: 'Company Registration Request', message: 'Apex Fintech Innovations submitted partnership verification request.', type: 'INFO', link: '/admin/companies' },
    ],
  });

  console.log('✅ Deterministic seed completed successfully! All lifecycle scenarios ready for live jury demo.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
