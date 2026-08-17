import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Delete all data in reverse dependency order
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.task.deleteMany();
  await prisma.mentorFeedback.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.application.deleteMany();
  await prisma.internshipListing.deleteMany();
  await prisma.companyMentor.deleteMany();
  await prisma.facultyStudentAssignment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.college.deleteMany();

  // 1 College
  console.log('Seeding College...');
  const college = await prisma.college.create({
    data: {
      name: "NIT Trichy",
      code: "NITT",
      address: "Tiruchirappalli, Tamil Nadu"
    }
  });

  // 1 Company
  console.log('Seeding Company...');
  const company = await prisma.company.create({
    data: {
      name: "TechCorp Solutions",
      domain: "Software Development",
      website: "https://techcorp.example.com",
      isVerified: true,
      verifiedAt: new Date(),
      description: "Leading software company specializing in enterprise solutions"
    }
  });

  // 5 Users + linked profiles
  console.log('Seeding Users and Profiles...');
  
  const arjunUser = await prisma.user.create({
    data: {
      clerkId: "clerk_student_1",
      email: "arjun@nitt.edu",
      role: "STUDENT",
      name: "Arjun Sharma",
      student: {
        create: {
          studentId: "CS21B001",
          collegeId: college.id,
          department: "Computer Science",
          year: 3,
          cgpa: 8.7,
          skills: "Java,Python,React,Spring Boot",
          resumeUrl: "https://example.com/resume.pdf"
        }
      }
    },
    include: { student: true }
  });

  const priyaUser = await prisma.user.create({
    data: {
      clerkId: "clerk_student_2",
      email: "priya@nitt.edu",
      role: "STUDENT",
      name: "Priya Patel",
      student: {
        create: {
          studentId: "CS21B002",
          collegeId: college.id,
          department: "Computer Science",
          year: 3,
          cgpa: 9.1,
          skills: "Python,Django,PostgreSQL,Docker"
        }
      }
    },
    include: { student: true }
  });

  const rahulUser = await prisma.user.create({
    data: {
      clerkId: "clerk_student_3",
      email: "rahul@nitt.edu",
      role: "STUDENT",
      name: "Rahul Kumar",
      student: {
        create: {
          studentId: "EC21B003",
          collegeId: college.id,
          department: "Electronics",
          year: 3,
          cgpa: 7.8,
          skills: "C++,MATLAB,Embedded Systems"
        }
      }
    },
    include: { student: true }
  });

  const meeraUser = await prisma.user.create({
    data: {
      clerkId: "clerk_faculty_1",
      email: "meera@nitt.edu",
      role: "FACULTY",
      name: "Dr. Meera Iyer",
      faculty: {
        create: {
          facultyId: "FAC001",
          collegeId: college.id,
          department: "Computer Science",
          designation: "Associate Professor"
        }
      }
    },
    include: { faculty: true }
  });

  const sureshUser = await prisma.user.create({
    data: {
      clerkId: "clerk_faculty_2",
      email: "suresh@nitt.edu",
      role: "FACULTY",
      name: "Dr. Suresh Rajan",
      faculty: {
        create: {
          facultyId: "FAC002",
          collegeId: college.id,
          department: "Electronics",
          designation: "Assistant Professor"
        }
      }
    },
    include: { faculty: true }
  });

  const vikramUser = await prisma.user.create({
    data: {
      clerkId: "clerk_mentor_1",
      email: "vikram@techcorp.com",
      role: "COMPANY_MENTOR",
      name: "Vikram Nair",
      companyMentor: {
        create: {
          companyId: company.id,
          designation: "Engineering Manager"
        }
      }
    },
    include: { companyMentor: true }
  });

  const adminUser = await prisma.user.create({
    data: {
      clerkId: "clerk_admin_1",
      email: "admin@nitt.edu",
      role: "ADMIN",
      name: "Admin User"
    }
  });

  // Faculty-Student Assignments
  console.log('Seeding Assignments...');
  await prisma.facultyStudentAssignment.create({
    data: { facultyId: meeraUser.faculty!.id, studentId: arjunUser.student!.id }
  });
  await prisma.facultyStudentAssignment.create({
    data: { facultyId: meeraUser.faculty!.id, studentId: priyaUser.student!.id }
  });
  await prisma.facultyStudentAssignment.create({
    data: { facultyId: sureshUser.faculty!.id, studentId: rahulUser.student!.id }
  });

  // 3 Internship Listings
  console.log('Seeding Listings...');
  const now = new Date();
  const listing1 = await prisma.internshipListing.create({
    data: {
      companyId: company.id,
      title: "Full Stack Developer Intern",
      description: "...",
      domain: "Web Development",
      mode: "ONSITE",
      stipend: 25000,
      openings: 2,
      requiredSkills: "React,Node.js,PostgreSQL",
      startDate: new Date(now.getTime() + 10 * 86400000),
      endDate: new Date(now.getTime() + 70 * 86400000),
      deadline: new Date(now.getTime() + 30 * 86400000),
      status: "OPEN"
    }
  });

  const listing2 = await prisma.internshipListing.create({
    data: {
      companyId: company.id,
      title: "ML Engineering Intern",
      description: "...",
      domain: "Machine Learning",
      mode: "REMOTE",
      stipend: 30000,
      openings: 1,
      requiredSkills: "Python,TensorFlow,PyTorch",
      startDate: new Date(now.getTime() + 15 * 86400000),
      endDate: new Date(now.getTime() + 75 * 86400000),
      deadline: new Date(now.getTime() + 45 * 86400000),
      status: "OPEN"
    }
  });

  const listing3 = await prisma.internshipListing.create({
    data: {
      companyId: company.id,
      title: "DevOps Intern",
      description: "...",
      domain: "Cloud Infrastructure",
      mode: "HYBRID",
      stipend: 20000,
      openings: 1,
      requiredSkills: "Docker,Kubernetes,AWS",
      startDate: new Date(now.getTime() + 5 * 86400000),
      endDate: new Date(now.getTime() + 65 * 86400000),
      deadline: new Date(now.getTime() + 15 * 86400000),
      status: "OPEN"
    }
  });

  // 2 Applications
  console.log('Seeding Applications...');
  const app1 = await prisma.application.create({
    data: {
      studentId: arjunUser.student!.id,
      listingId: listing1.id,
      status: "SELECTED",
      coverLetter: "I am passionate about full-stack development..."
    }
  });

  const app2 = await prisma.application.create({
    data: {
      studentId: priyaUser.student!.id,
      listingId: listing2.id,
      status: "SUBMITTED",
      coverLetter: "With my strong background in Python and ML..."
    }
  });

  // 1 Active Internship
  console.log('Seeding Internship...');
  const internship = await prisma.internship.create({
    data: {
      applicationId: app1.id,
      studentId: arjunUser.student!.id,
      companyId: company.id,
      facultyMentorId: meeraUser.faculty!.id,
      companyMentorId: vikramUser.companyMentor!.id,
      startDate: new Date(now.getTime() - 30 * 86400000),
      endDate: new Date(now.getTime() + 60 * 86400000),
      status: "ACTIVE",
      attendancePercentage: 92.5
    }
  });

  // 10 Attendance Records
  console.log('Seeding Attendance...');
  for (let i = 1; i <= 10; i++) {
    await prisma.attendanceRecord.create({
      data: {
        internshipId: internship.id,
        date: new Date(now.getTime() - i * 86400000),
        status: i === 10 ? "HALF_DAY" : "PRESENT",
        markedById: vikramUser.companyMentor!.id,
        notes: i === 10 ? "Left early" : null
      }
    });
  }

  // 5 Daily Logs
  console.log('Seeding Daily Logs...');
  for (let i = 1; i <= 5; i++) {
    await prisma.dailyLog.create({
      data: {
        internshipId: internship.id,
        date: new Date(now.getTime() - i * 86400000),
        tasksCompleted: "Worked on frontend tickets",
        hoursWorked: 7.5,
        challengesFaced: "CSS alignment issues",
        plansForTomorrow: "Start backend integration"
      }
    });
  }

  // 2 Weekly Reports
  console.log('Seeding Weekly Reports...');
  await prisma.weeklyReport.create({
    data: {
      internshipId: internship.id,
      weekNumber: 1,
      summary: "First week summary",
      keyLearnings: "Onboarding and React setup",
      nextWeekGoals: "Complete frontend",
      status: "APPROVED",
      facultyComments: "Good start!"
    }
  });
  await prisma.weeklyReport.create({
    data: {
      internshipId: internship.id,
      weekNumber: 2,
      summary: "Second week summary",
      keyLearnings: "State management",
      nextWeekGoals: "Backend APIs",
      status: "SUBMITTED"
    }
  });

  // 1 Feedback
  console.log('Seeding Feedback...');
  await prisma.mentorFeedback.create({
    data: {
      internshipId: internship.id,
      mentorId: vikramUser.companyMentor!.id,
      type: "MID_TERM",
      technicalSkills: 4,
      communication: 5,
      problemSolving: 4,
      punctuality: 4,
      teamwork: 4,
      overallRating: 4,
      comments: "Arjun is doing well."
    }
  });

  // 3 Tasks
  console.log('Seeding Tasks...');
  await prisma.task.create({
    data: {
      internshipId: internship.id,
      assignedById: vikramUser.companyMentor!.id,
      title: "Set up CI/CD pipeline",
      status: "COMPLETED"
    }
  });
  await prisma.task.create({
    data: {
      internshipId: internship.id,
      assignedById: vikramUser.companyMentor!.id,
      title: "Implement user authentication",
      status: "IN_PROGRESS"
    }
  });
  await prisma.task.create({
    data: {
      internshipId: internship.id,
      assignedById: vikramUser.companyMentor!.id,
      title: "Write API documentation",
      status: "PENDING"
    }
  });

  // 5 Notifications
  console.log('Seeding Notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: arjunUser.id, title: "Selected", message: "Your application was selected!", type: "SUCCESS" },
      { userId: arjunUser.id, title: "New Task", message: "New task assigned", type: "INFO" },
      { userId: priyaUser.id, title: "Submitted", message: "Application submitted successfully", type: "INFO" },
      { userId: meeraUser.id, title: "Review Pending", message: "Weekly report pending review", type: "WARNING" },
      { userId: adminUser.id, title: "Registration", message: "New company registered", type: "INFO" }
    ]
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
