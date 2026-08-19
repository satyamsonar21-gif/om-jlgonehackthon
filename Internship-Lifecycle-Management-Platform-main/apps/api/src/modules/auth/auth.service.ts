import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

import { EmailService } from '../notifications/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'ilmp_production_secure_jwt_secret_2026';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
  name: string;
  exp: number;
}

@Injectable()
export class AuthService {
  private emailService: EmailService;

  constructor(
    private prisma: PrismaService,
    emailService?: EmailService,
  ) {
    this.emailService = emailService || new EmailService();
  }

  // ─── CRYPTOGRAPHIC & TOKEN HELPERS ──────────────────────────────────────────

  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return `scrypt:${salt}:${derivedKey.toString('hex')}`;
  }

  verifyPassword(password: string, storedHash?: string | null): boolean {
    if (!storedHash) return false;

    try {
      if (storedHash.startsWith('scrypt:')) {
        const [, salt, hash] = storedHash.split(':');
        if (!salt || !hash) return false;
        const derivedKey = crypto.scryptSync(password, salt, 64);
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derivedKey);
      }

      // Backward-compatible PBKDF2 verification for pre-existing hashes
      if (storedHash.includes(':')) {
        const parts = storedHash.split(':');
        const salt = parts[0];
        const hash = parts[1];
        if (!salt || !hash) return false;
        const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
      }
    } catch {
      return false;
    }

    return false;
  }

  async createSession(
    userId: string,
    reqMeta?: { ipAddress?: string; userAgent?: string },
  ): Promise<{ rawToken: string; session: any }> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const sessionTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days

    const session = await this.prisma.session.create({
      data: {
        userId,
        sessionTokenHash,
        expiresAt,
        lastUsedAt: new Date(),
        ipAddress: reqMeta?.ipAddress || null,
        userAgent: reqMeta?.userAgent || null,
        isValid: true,
      },
    });

    return { rawToken, session };
  }

  async revokeSessionByToken(token: string): Promise<boolean> {
    if (!token) return false;
    const sessionTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.prisma.session.updateMany({
      where: { sessionTokenHash },
      data: { isValid: false },
    });
    return true;
  }

  async revokeSessionById(sessionId: string): Promise<boolean> {
    if (!sessionId) return false;
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isValid: false },
    });
    return true;
  }

  async validateSession(rawToken: string): Promise<any | null> {
    if (!rawToken || typeof rawToken !== 'string') return null;
    const sessionTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const session = await this.prisma.session.findFirst({
      where: {
        sessionTokenHash,
        isValid: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            student: { include: { college: true } },
            faculty: { include: { college: true } },
            companyMentor: { include: { company: true } },
          },
        },
      },
    });

    if (!session || !session.user) return null;

    if (session.user.isActive === false || session.user.status === 'SUSPENDED') {
      return null;
    }

    // Update lastUsedAt asynchronously
    this.prisma.session
      .update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {});

    return { session, user: session.user };
  }

  createJwtToken(user: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status || 'ACTIVE',
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verifyJwtToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${parts[0]}.${parts[1]}`)
        .digest('base64url');

      if (expectedSignature !== parts[2]) return null;

      const payload: TokenPayload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString('utf8'),
      );

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  generateCode(digits: number = 6): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  sanitizeUser(user: any): any {
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    delete sanitized.resetToken;
    delete sanitized.resetTokenExpires;
    delete sanitized.emailVerificationCode;
    delete sanitized.emailVerificationExpires;
    return sanitized;
  }

  private validatePasswordStrength(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      throw new BadRequestException('Password must contain both letters and numbers.');
    }
  }

  private async getOrCreateDefaultCollege(collegeName?: string) {
    let college = await this.prisma.college.findFirst({
      where: collegeName ? { name: { contains: collegeName } } : undefined,
    });
    if (!college) {
      college = await this.prisma.college.create({
        data: {
          name: collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
          code: 'GHRCE-' + crypto.randomBytes(2).toString('hex').toUpperCase(),
          address: 'CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra',
        },
      });
    }
    return college;
  }

  // ─── REGISTRATION: STUDENT ──────────────────────────────────────────────────

  async registerStudent(dto: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
    enrollmentNumber?: string;
    studentId?: string;
    department?: string;
    year?: number;
    semester?: number;
    collegeName?: string;
    collegeId?: string;
    skills?: string | string[];
    resumeUrl?: string;
    cgpa?: number;
    passingYear?: number;
  }) {
    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.password);

    const email = (dto.email || '').toLowerCase().trim();
    if (!email) {
      throw new BadRequestException('Email address is required.');
    }

    const studentRollNumber = (dto.enrollmentNumber || dto.studentId || '').trim();
    if (!studentRollNumber) {
      throw new BadRequestException('Enrollment / Student ID is required.');
    }

    const firstName = (dto.firstName || '').trim();
    const lastName = (dto.lastName || '').trim();
    const fullName = (dto.name || `${firstName} ${lastName}`).trim();

    if (!fullName) {
      throw new BadRequestException('Full name is required.');
    }

    // 3. Execute inside a Prisma Transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Check duplicate email
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('An account with this email address already exists. Please sign in.');
      }

      // Check duplicate enrollment / studentId
      const existingStudent = await tx.student.findUnique({ where: { studentId: studentRollNumber } });
      if (existingStudent) {
        throw new ConflictException('A student account with this enrollment / roll number already exists.');
      }

      // Resolve College
      let college = await tx.college.findFirst({
        where: dto.collegeId
          ? { id: dto.collegeId }
          : dto.collegeName
            ? { name: { contains: dto.collegeName } }
            : undefined,
      });
      if (!college) {
        college = await tx.college.create({
          data: {
            name: dto.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
            code: 'GHRCE-' + crypto.randomBytes(2).toString('hex').toUpperCase(),
            address: 'CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra',
          },
        });
      }

      const skillsString = Array.isArray(dto.skills)
        ? dto.skills.join(',')
        : dto.skills || 'JavaScript,React,Node.js';

      const passwordHash = this.hashPassword(dto.password);
      const verificationCode = this.generateCode(6);

      // Create User and Student profile atomically
      // Role is SERVER-ENFORCED to 'STUDENT'
      const user = await tx.user.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          name: fullName,
          phone: dto.phone || null,
          passwordHash,
          role: 'STUDENT', // SERVER-ENFORCED ROLE
          status: 'ACTIVE',
          isActive: true,
          isEmailVerified: false, // REQUIRES EMAIL VERIFICATION
          emailVerified: null,
          emailVerificationCode: verificationCode,
          emailVerificationExpires: new Date(Date.now() + 24 * 3600 * 1000),
          collegeId: college.id,
          student: {
            create: {
              studentId: studentRollNumber,
              collegeId: college.id,
              department: dto.department || 'Computer Science & Engineering',
              year: Number(dto.year) || 3,
              semester: dto.semester ? Number(dto.semester) : 6,
              passingYear: dto.passingYear ? Number(dto.passingYear) : 2026,
              cgpa: dto.cgpa !== undefined ? Number(dto.cgpa) : 8.5,
              backlogsCount: 0,
              activeBacklogs: 0,
              skills: skillsString,
              resumeUrl: dto.resumeUrl || 'https://storage.ilmp.edu/resumes/sample_resume.pdf',
              profileCompletion: 85.0,
              placementReadinessScore: 88.0,
              verificationStatus: 'VERIFIED',
            },
          },
        },
        include: {
          student: { include: { college: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'STUDENT_REGISTERED',
          entity: 'User',
          entityId: user.id,
          userId: user.id,
          userRole: 'STUDENT',
          newState: 'ACTIVE',
          reason: 'Student self-registration completed',
        },
      });

      return user;
    });

    // Generate and dispatch cryptographic verification token
    await this.generateEmailVerificationToken(result.id, result.email, result.name);

    const jwtToken = this.createJwtToken(result);

    return {
      success: true,
      token: jwtToken,
      user: this.sanitizeUser(result),
      role: 'STUDENT',
      status: 'ACTIVE',
      message: 'Student account created successfully! Please verify your email address.',
    };
  }

  // ─── REGISTRATION: FACULTY ──────────────────────────────────────────────────

  async registerFaculty(dto: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    officialEmail?: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
    employeeId?: string;
    facultyId?: string;
    department?: string;
    designation?: string;
    collegeName?: string;
    collegeId?: string;
  }) {
    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.password);

    const email = (dto.officialEmail || dto.email || '').toLowerCase().trim();
    if (!email) {
      throw new BadRequestException('Official email address is required.');
    }

    const employeeId = (dto.employeeId || dto.facultyId || '').trim();
    if (!employeeId) {
      throw new BadRequestException('Employee ID / Faculty ID is required.');
    }

    const firstName = (dto.firstName || '').trim();
    const lastName = (dto.lastName || '').trim();
    const fullName = (dto.name || `${firstName} ${lastName}`).trim();

    if (!fullName) {
      throw new BadRequestException('Full name is required.');
    }

    // 3. Execute inside a Prisma Transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Check duplicate email
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('An account with this institutional email already exists. Please sign in.');
      }

      // Check duplicate employee ID
      const existingFaculty = await tx.faculty.findUnique({ where: { facultyId: employeeId } });
      if (existingFaculty) {
        throw new ConflictException('A faculty profile with this Employee/Faculty ID already exists.');
      }

      // Resolve College
      let college = await tx.college.findFirst({
        where: dto.collegeId
          ? { id: dto.collegeId }
          : dto.collegeName
            ? { name: { contains: dto.collegeName } }
            : undefined,
      });
      if (!college) {
        college = await tx.college.create({
          data: {
            name: dto.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
            code: 'GHRCE-' + crypto.randomBytes(2).toString('hex').toUpperCase(),
            address: 'CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra',
          },
        });
      }

      const passwordHash = this.hashPassword(dto.password);
      const verificationCode = this.generateCode(6);

      // Create User and Faculty profile atomically
      // Role is SERVER-ENFORCED to 'FACULTY_MENTOR'
      const user = await tx.user.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          name: fullName,
          phone: dto.phone || null,
          passwordHash,
          role: 'FACULTY_MENTOR', // SERVER-ENFORCED ROLE
          status: 'PENDING_APPROVAL', // SECURITY: Requires institutional clearance
          isActive: true,
          isEmailVerified: false, // REQUIRES EMAIL VERIFICATION
          emailVerified: null,
          emailVerificationCode: verificationCode,
          collegeId: college.id,
          faculty: {
            create: {
              facultyId: employeeId,
              collegeId: college.id,
              department: dto.department || 'Computer Science & Engineering',
              designation: dto.designation || 'Assistant Professor',
              phone: dto.phone || null,
              verificationStatus: 'PENDING',
            },
          },
        },
        include: {
          faculty: { include: { college: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'FACULTY_REGISTERED_PENDING_APPROVAL',
          entity: 'User',
          entityId: user.id,
          userId: user.id,
          userRole: 'FACULTY_MENTOR',
          newState: 'PENDING_APPROVAL',
          reason: 'Faculty registration awaiting administrator review and approval',
        },
      });

      return user;
    });

    // Generate and dispatch cryptographic verification token
    await this.generateEmailVerificationToken(result.id, result.email, result.name);

    const jwtToken = this.createJwtToken(result);

    return {
      success: true,
      token: jwtToken,
      user: this.sanitizeUser(result),
      role: 'FACULTY_MENTOR',
      status: 'PENDING_APPROVAL',
      message:
        'Faculty registration submitted successfully. Please verify your institutional email address.',
    };
  }

  // ─── REGISTRATION: COMPANY ──────────────────────────────────────────────────

  async registerCompany(dto: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    workEmail?: string;
    phone?: string;
    company?: string;
    companyName?: string;
    domain?: string;
    website?: string;
    designation?: string;
    location?: string;
    industry?: string;
    description?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    password: string;
    confirmPassword?: string;
  }) {
    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.password);

    const email = (dto.workEmail || dto.email || dto.contactEmail || '').toLowerCase().trim();
    if (!email) {
      throw new BadRequestException('Work email address is required.');
    }

    const compName = (dto.company || dto.companyName || dto.name || '').trim();
    if (!compName) {
      throw new BadRequestException('Company name is required.');
    }

    const firstName = (dto.firstName || '').trim();
    const lastName = (dto.lastName || '').trim();
    const contactPersonName = (
      dto.contactPerson || (firstName && lastName ? `${firstName} ${lastName}` : firstName || compName)
    ).trim();

    // 3. Execute inside a Prisma Transaction
    const { user, company } = await this.prisma.$transaction(async (tx) => {
      // Check duplicate user email
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('An account with this email address already exists. Please sign in.');
      }

      // Reuse existing Company record if it matches by name (case-insensitive)
      let companyRecord = await tx.company.findFirst({
        where: { name: { equals: compName } },
      });

      if (!companyRecord) {
        companyRecord = await tx.company.create({
          data: {
            name: compName,
            domain: dto.domain || dto.industry || 'Technology & Software Engineering',
            industry: dto.industry || 'Information Technology',
            website: dto.website || `https://${compName.toLowerCase().replace(/\s+/g, '')}.com`,
            description: dto.description || 'Enterprise Technology Partner',
            contactPerson: contactPersonName,
            contactEmail: email,
            contactPhone: dto.phone || dto.contactPhone || null,
            location: dto.location || 'Maharashtra, India',
            isVerified: false, // SECURITY: Requires institutional clearance
            verificationStatus: 'PENDING',
          },
        });
      }

      const passwordHash = this.hashPassword(dto.password);

      // Create User and CompanyMentor profile atomically
      // Role is SERVER-ENFORCED to 'COMPANY_MENTOR'
      const newUser = await tx.user.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          name: contactPersonName,
          phone: dto.phone || dto.contactPhone || null,
          passwordHash,
          role: 'COMPANY_MENTOR', // SERVER-ENFORCED ROLE
          status: 'PENDING_APPROVAL', // SECURITY: Pending admin clearance
          isActive: true,
          isEmailVerified: false, // REQUIRES EMAIL VERIFICATION
          emailVerified: null,
          companyMentor: {
            create: {
              companyId: companyRecord.id,
              designation: dto.designation || 'Talent Acquisition & Corporate Mentor',
            },
          },
        },
        include: {
          companyMentor: { include: { company: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'COMPANY_REGISTERED_PENDING_APPROVAL',
          entity: 'Company',
          entityId: companyRecord.id,
          userId: newUser.id,
          userRole: 'COMPANY_MENTOR',
          newState: 'PENDING_APPROVAL',
          reason: 'Company registration submitted for institutional review',
        },
      });

      return { user: newUser, company: companyRecord };
    });

    // Generate and dispatch cryptographic verification token
    await this.generateEmailVerificationToken(user.id, user.email, user.name);

    const jwtToken = this.createJwtToken(user);

    return {
      success: true,
      token: jwtToken,
      user: this.sanitizeUser(user),
      company,
      role: 'COMPANY_MENTOR',
      status: 'PENDING_APPROVAL',
      message:
        'Company registration submitted successfully. Please verify your work email address.',
    };
  }

  // ─── REGISTRATION: ADMIN ────────────────────────────────────────────────────

  async registerAdmin(
    dto: {
      firstName?: string;
      lastName?: string;
      name?: string;
      fullName?: string;
      email: string;
      phone?: string;
      password: string;
      confirmPassword?: string;
      role?: string;
      department?: string;
      designation?: string;
      collegeName?: string;
      collegeId?: string;
    },
    creatorUser?: any,
  ) {
    // 0. Strict Server-Side Authorization Check
    if (creatorUser) {
      const creatorRole = (creatorUser.role || '').toUpperCase();
      if (!['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(creatorRole)) {
        throw new ForbiddenException(
          `Access denied. Role '${creatorUser.role}' is not authorized to provision administrator accounts.`,
        );
      }
    } else {
      // If admins already exist in database, require logged-in admin identity
      const existingAdminCount = await this.prisma.user.count({
        where: {
          role: { in: ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'] },
        },
      });
      if (existingAdminCount > 0) {
        throw new UnauthorizedException(
          'Authentication required. Only logged-in institutional administrators can provision admin accounts.',
        );
      }
    }

    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.password);

    const email = (dto.email || '').toLowerCase().trim();
    if (!email) {
      throw new BadRequestException('Institutional email address is required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Please enter a valid email address.');
    }

    const firstName = (dto.firstName || '').trim();
    const lastName = (dto.lastName || '').trim();
    const fullName = (dto.fullName || dto.name || (firstName && lastName ? `${firstName} ${lastName}` : firstName)).trim();

    if (!fullName) {
      throw new BadRequestException('Full name is required.');
    }

    // 3. Server-enforced Administrative Role Validation
    let assignedRole = 'ADMIN';
    const candidateRole = (dto.role || '').toUpperCase().trim();
    if (candidateRole && ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'].includes(candidateRole)) {
      assignedRole = candidateRole;
    }

    // 4. Atomic Database Transaction
    const user = await this.prisma.$transaction(async (tx) => {
      // Check duplicate email
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('An account with this email address already exists. Please sign in or use another email.');
      }

      // Resolve College
      let college = await tx.college.findFirst({
        where: dto.collegeId
          ? { id: dto.collegeId }
          : dto.collegeName
            ? { name: { contains: dto.collegeName } }
            : undefined,
      });
      if (!college) {
        college = await tx.college.create({
          data: {
            name: dto.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
            code: 'GHRCE-' + crypto.randomBytes(2).toString('hex').toUpperCase(),
            address: 'CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra',
          },
        });
      }

      const passwordHash = this.hashPassword(dto.password);

      // Create Admin User
      const newAdmin = await tx.user.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          name: fullName,
          phone: dto.phone || null,
          passwordHash,
          role: assignedRole, // SERVER-VALIDATED ROLE
          status: 'ACTIVE',
          isActive: true,
          isEmailVerified: true,
          emailVerified: new Date(),
          collegeId: college.id,
        },
      });

      // Audit Log Entry with foreign-key safety
      let auditUserId = newAdmin.id;
      if (creatorUser?.id && creatorUser.id !== newAdmin.id) {
        const creatorExists = await tx.user.findUnique({ where: { id: creatorUser.id } });
        if (creatorExists) {
          auditUserId = creatorExists.id;
        }
      }

      await tx.auditLog.create({
        data: {
          action: 'ADMIN_ACCOUNT_CREATED',
          entity: 'User',
          entityId: newAdmin.id,
          userId: auditUserId,
          userRole: creatorUser?.role || assignedRole,
          newState: 'ACTIVE',
          reason: `Administrator account provisioned with role ${assignedRole}`,
          metadata: JSON.stringify({
            department: dto.department || 'Central Administration',
            designation: dto.designation || 'Administrator',
            role: assignedRole,
            creator: creatorUser?.email || 'SYSTEM_AUTH',
          }),
        },
      });

      return newAdmin;
    });

    const jwtToken = this.createJwtToken(user);

    return {
      success: true,
      token: jwtToken,
      user: this.sanitizeUser(user),
      role: user.role,
      status: user.status,
      message: `Administrator account for ${user.name} provisioned successfully with role ${user.role}!`,
    };
  }

  async getAdmins() {
    const admins = await this.prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN', 'TNP_ADMIN', 'HOD_ADMIN'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return admins.map((a) => this.sanitizeUser(a));
  }

  // ─── LOGIN & SESSION ────────────────────────────────────────────────────────

  async login(
    credentialsOrEmail: { email: string; password?: string; role?: string } | string,
    passwordParam?: any,
    reqMeta?: { ipAddress?: string; userAgent?: string },
  ) {
    let email = '';
    let password = '';
    let meta = reqMeta;

    if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
      email = credentialsOrEmail.email;
      password = credentialsOrEmail.password || '';
      if (typeof passwordParam === 'object') {
        meta = passwordParam as any;
      }
    } else if (typeof credentialsOrEmail === 'string') {
      email = credentialsOrEmail;
      password = typeof passwordParam === 'string' ? passwordParam : '';
    }

    if (!email || !email.trim()) {
      throw new BadRequestException('Email is required.');
    }

    if (!password || !password.trim()) {
      throw new BadRequestException('Password is required.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password. Please verify your credentials.');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException('This account has been deactivated. Please contact administration.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Your account has been suspended by the administrator.');
    }

    // Verify Password
    if (user.passwordHash) {
      const isMatch = this.verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password. Please verify your credentials.');
      }
    } else {
      throw new UnauthorizedException('Invalid email or password. Please verify your credentials.');
    }

    // Create persistent database session
    const { rawToken } = await this.createSession(user.id, meta);

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      success: true,
      message: 'Signed in successfully.',
      sessionToken: rawToken,
      token: rawToken,
      user: this.sanitizeUser(user),
      role: user.role,
      status: user.status || 'ACTIVE',
    };
  }

  async getMe(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { clerkId: identifier }, { email: identifier }],
      },
      include: {
        student: { include: { college: true } },
        faculty: { include: { college: true } },
        companyMentor: { include: { company: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return this.sanitizeUser(user);
  }

  // ─── PASSWORD RECOVERY & VERIFICATION ───────────────────────────────────────

  async forgotPassword(dtoOrEmail: { email: string } | string) {
    const emailStr = typeof dtoOrEmail === 'object' ? dtoOrEmail.email : dtoOrEmail;
    if (!emailStr || !emailStr.trim()) {
      throw new BadRequestException('Email address is required.');
    }

    const normalizedEmail = emailStr.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always return generic response to prevent user enumeration
    const genericResponse = {
      success: true,
      message:
        'If an account exists with this email address, password reset instructions have been dispatched.',
    };

    if (!user) {
      return genericResponse;
    }

    // Generate cryptographic raw token & 6-digit code
    const rawToken = crypto.randomBytes(32).toString('hex');
    const sixDigitCode = crypto.randomInt(100000, 999999).toString();
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    // Invalidate existing unused password reset tokens
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Create PasswordResetToken record with SHA-256 hash
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Store 6-digit code on user for code-based UI input
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: sixDigitCode,
        resetTokenExpires: expiresAt,
      },
    });

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET_REQUESTED',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        userRole: user.role,
        reason: 'Cryptographic password reset token generated',
      },
    });

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    // Dispatch email safely
    try {
      await this.emailService.sendPasswordReset(user.email, user.name, resetUrl);
    } catch {
      // Safe fallback if live email provider is not configured
    }

    return genericResponse;
  }

  async resetPassword(dto: {
    token?: string;
    email?: string;
    code?: string;
    newPassword: string;
    confirmPassword?: string;
  }) {
    if (!dto.token && (!dto.email || !dto.code)) {
      throw new BadRequestException(
        'Please provide a valid password reset token or your email and 6-digit reset code.',
      );
    }

    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.newPassword);

    let targetUserId: string | null = null;
    let tokenRecordId: string | null = null;

    // 3A. Verification via URL Token
    if (dto.token && dto.token.trim()) {
      const tokenHash = crypto.createHash('sha256').update(dto.token.trim()).digest('hex');

      const tokenRecord = await this.prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new BadRequestException('Invalid or unrecognized password reset token.');
      }

      if (tokenRecord.usedAt !== null) {
        throw new BadRequestException('This password reset token has already been used.');
      }

      if (tokenRecord.expiresAt < new Date()) {
        throw new BadRequestException(
          'This password reset token has expired. Please request a new password reset link.',
        );
      }

      targetUserId = tokenRecord.userId;
      tokenRecordId = tokenRecord.id;
    }
    // 3B. Verification via Email + 6-digit Code
    else if (dto.email && dto.code) {
      const normalizedEmail = dto.email.toLowerCase().trim();
      const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

      if (!user || !user.resetToken) {
        throw new BadRequestException('Invalid or expired password reset request.');
      }

      if (user.resetToken !== dto.code.trim()) {
        throw new BadRequestException('Invalid verification code.');
      }

      if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
        throw new BadRequestException('The verification code has expired. Please request a new code.');
      }

      targetUserId = user.id;
    }

    if (!targetUserId) {
      throw new BadRequestException('Invalid password reset request.');
    }

    const newPasswordHash = this.hashPassword(dto.newPassword);

    // 4. Update Password, Mark Token Used, Invalidate ALL active Sessions in Transaction
    await this.prisma.$transaction(async (tx) => {
      // Update User Password Hash & clear reset codes
      await tx.user.update({
        where: { id: targetUserId },
        data: {
          passwordHash: newPasswordHash,
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      // Mark used token
      if (tokenRecordId) {
        await tx.passwordResetToken.update({
          where: { id: tokenRecordId },
          data: { usedAt: new Date() },
        });
      }

      // Invalidate all pending reset tokens for this user
      await tx.passwordResetToken.updateMany({
        where: { userId: targetUserId, usedAt: null },
        data: { usedAt: new Date() },
      });

      // SECURITY: Invalidate all existing sessions to force re-login on all devices
      await tx.session.updateMany({
        where: { userId: targetUserId, isValid: true },
        data: { isValid: false },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'PASSWORD_RESET_COMPLETED',
          entity: 'User',
          entityId: targetUserId,
          userId: targetUserId,
          userRole: 'USER',
          reason: 'Password successfully reset and all prior sessions invalidated',
        },
      });
    });

    return {
      success: true,
      message:
        'Your password has been reset successfully. All active sessions have been signed out. Please sign in with your new credentials.',
    };
  }

  // ─── EMAIL VERIFICATION HELPERS ─────────────────────────────────────────────

  async generateEmailVerificationToken(
    userId: string,
    email: string,
    name: string,
  ): Promise<{ rawToken: string; sixDigitCode: string; expiresAt: Date }> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const sixDigitCode = crypto.randomInt(100000, 999999).toString();
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

    // Invalidate existing pending tokens
    await this.prisma.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Create single-use token record in DB
    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    // Update user record with 6-digit code for code-based verification
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationCode: sixDigitCode,
        emailVerificationExpires: expiresAt,
      },
    });

    const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

    // Dispatch email safely
    try {
      await this.emailService.sendAccountVerification(email, name, verifyUrl);
    } catch {
      // Graceful fallback in environments without live mail server
    }

    return { rawToken, sixDigitCode, expiresAt };
  }

  async verifyEmail(dto: { token?: string; email?: string; code?: string }) {
    if (!dto.token && (!dto.email || !dto.code)) {
      throw new BadRequestException(
        'Please provide a verification token or your email address and 6-digit verification code.',
      );
    }

    // 1. Direct Token Verification (Link Flow)
    if (dto.token && dto.token.trim()) {
      const tokenHash = crypto.createHash('sha256').update(dto.token.trim()).digest('hex');

      const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new BadRequestException('Invalid or unrecognized verification token.');
      }

      if (tokenRecord.usedAt !== null) {
        throw new BadRequestException('This verification token has already been used.');
      }

      if (tokenRecord.expiresAt < new Date()) {
        throw new BadRequestException(
          'This verification token has expired. Please request a new verification email.',
        );
      }

      // Mark token as used and verify user atomically
      await this.prisma.$transaction([
        this.prisma.emailVerificationToken.update({
          where: { id: tokenRecord.id },
          data: { usedAt: new Date() },
        }),
        this.prisma.user.update({
          where: { id: tokenRecord.userId },
          data: {
            isEmailVerified: true,
            emailVerified: new Date(),
            emailVerificationCode: null,
            emailVerificationExpires: null,
          },
        }),
        this.prisma.auditLog.create({
          data: {
            action: 'EMAIL_VERIFIED_VIA_TOKEN',
            entity: 'User',
            entityId: tokenRecord.userId,
            userId: tokenRecord.userId,
            userRole: tokenRecord.user.role,
            reason: 'Email verified using single-use cryptographic token',
          },
        }),
      ]);

      return {
        success: true,
        message: 'Email address verified successfully! Your account is now verified.',
      };
    }

    // 2. Email + 6-digit Code Verification
    if (dto.email && dto.code) {
      const normalizedEmail = dto.email.toLowerCase().trim();
      const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

      if (!user) {
        throw new NotFoundException('User account not found.');
      }

      if (user.isEmailVerified) {
        return { success: true, message: 'Email address is already verified.' };
      }

      if (!user.emailVerificationCode || user.emailVerificationCode !== dto.code.trim()) {
        throw new BadRequestException('Invalid email verification code.');
      }

      if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
        throw new BadRequestException('The verification code has expired. Please request a new code.');
      }

      // Mark user as verified and invalidate pending tokens
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            emailVerified: new Date(),
            emailVerificationCode: null,
            emailVerificationExpires: null,
          },
        }),
        this.prisma.emailVerificationToken.updateMany({
          where: { userId: user.id, usedAt: null },
          data: { usedAt: new Date() },
        }),
        this.prisma.auditLog.create({
          data: {
            action: 'EMAIL_VERIFIED_VIA_CODE',
            entity: 'User',
            entityId: user.id,
            userId: user.id,
            userRole: user.role,
            reason: 'Email verified using 6-digit verification code',
          },
        }),
      ]);

      return {
        success: true,
        message: 'Email address verified successfully! Your account is now verified.',
      };
    }

    throw new BadRequestException('Invalid verification payload.');
  }

  async resendVerification(dtoOrEmail: { email: string } | string) {
    const emailStr = typeof dtoOrEmail === 'object' ? dtoOrEmail.email : dtoOrEmail;
    if (!emailStr || !emailStr.trim()) {
      throw new BadRequestException('Email address is required.');
    }

    const normalizedEmail = emailStr.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      // Safe generic message to avoid user enumeration
      return {
        success: true,
        message: 'If an account exists with this email address, a new verification link has been dispatched.',
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('This account email address is already verified.');
    }

    // Rate-limiting check: prevent spamming resend within 60 seconds
    const recentToken = await this.prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentToken) {
      throw new BadRequestException(
        'Please wait at least 60 seconds before requesting another verification email.',
      );
    }

    // Invalidate old tokens and generate a fresh one
    const result = await this.generateEmailVerificationToken(user.id, user.email, user.name);

    await this.prisma.auditLog.create({
      data: {
        action: 'EMAIL_VERIFICATION_RESENT',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        userRole: user.role,
        reason: 'User requested email verification resend',
      },
    });

    return {
      success: true,
      message: 'A fresh verification email and code have been dispatched to your email address.',
      expiresAt: result.expiresAt,
    };
  }

  async changePassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string; confirmPassword?: string },
    currentSessionId?: string,
  ) {
    if (!dto.currentPassword) {
      throw new BadRequestException('Current password is required.');
    }

    if (!dto.newPassword) {
      throw new BadRequestException('New password is required.');
    }

    // 1. Password Confirmation Check
    if (dto.confirmPassword !== undefined && dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    // 2. Validate Password Strength
    this.validatePasswordStrength(dto.newPassword);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User account not found.');
    }

    // 3. Verify Current Password
    if (!user.passwordHash || !this.verifyPassword(dto.currentPassword, user.passwordHash)) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    // 4. Reject Identical Old/New Password
    if (this.verifyPassword(dto.newPassword, user.passwordHash)) {
      throw new BadRequestException('New password cannot be the same as your current password.');
    }

    const newPasswordHash = this.hashPassword(dto.newPassword);

    // 5. Update Password and Invalidate Other Active Sessions in Transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      // Invalidate other active sessions
      if (currentSessionId) {
        await tx.session.updateMany({
          where: {
            userId,
            id: { not: currentSessionId },
            isValid: true,
          },
          data: { isValid: false },
        });
      } else {
        await tx.session.updateMany({
          where: { userId, isValid: true },
          data: { isValid: false },
        });
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'PASSWORD_CHANGED',
          entity: 'User',
          entityId: userId,
          userId,
          userRole: user.role,
          reason: 'User successfully updated password and invalidated other sessions',
        },
      });
    });

    return {
      success: true,
      message: 'Password updated successfully. Other active sessions have been signed out.',
    };
  }
}
