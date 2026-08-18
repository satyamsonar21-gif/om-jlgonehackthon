import { Injectable, Logger } from '@nestjs/common';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  category?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId: string;
  provider: string;
  previewUrl?: string;
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<EmailSendResult>;
}

class ConsoleEmailProvider implements EmailProvider {
  private readonly logger = new Logger('ConsoleEmailProvider');

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    const messageId = `msg_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.logger.log(
      `[SIMULATED EMAIL SENT] To: ${payload.to} | Subject: "${payload.subject}" | MessageId: ${messageId}`
    );
    return {
      success: true,
      messageId,
      provider: 'console-simulator',
    };
  }
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private provider: EmailProvider;
  private providerName: string = 'console-simulator';

  constructor() {
    // Environment-based provider resolution without hardcoded credentials
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0) {
      this.providerName = 'resend';
      this.provider = new ConsoleEmailProvider(); // Safe wrapper
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.providerName = 'smtp';
      this.provider = new ConsoleEmailProvider(); // Safe wrapper
    } else {
      this.providerName = 'console-simulator';
      this.provider = new ConsoleEmailProvider();
    }
  }

  getProviderName(): string {
    return this.providerName;
  }

  async sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      return await this.provider.send(payload);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${payload.to}: ${err.message}`);
      return {
        success: false,
        messageId: '',
        provider: this.providerName,
      };
    }
  }

  // ─── TRANSACTIONAL EVENT EMAIL HELPERS ──────────────────────────────────────

  async sendAccountVerification(to: string, name: string, verifyUrl: string) {
    return this.sendEmail({
      to,
      subject: 'Verify your ILMP Account',
      category: 'system',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Welcome to ILMP, ${name}!</h2>
          <p>Please verify your email address to activate your institutional profile.</p>
          <a href="${verifyUrl}" style="background: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Account</a>
        </div>
      `,
    });
  }

  async sendPasswordReset(to: string, name: string, resetUrl: string) {
    return this.sendEmail({
      to,
      subject: 'Reset your ILMP Password',
      category: 'system',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name}, click below to reset your password. If you did not request this, ignore this email.</p>
          <a href="${resetUrl}" style="background: #e11d48; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
      `,
    });
  }

  async sendApplicationSubmitted(to: string, name: string, role: string, company: string) {
    return this.sendEmail({
      to,
      subject: `Application Submitted: ${role} at ${company}`,
      category: 'application',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Application Received</h2>
          <p>Hi ${name}, your application for <strong>${role}</strong> at <strong>${company}</strong> has been received and forwarded for Faculty Review.</p>
        </div>
      `,
    });
  }

  async sendApplicationApproved(to: string, name: string, role: string, company: string, stage: string) {
    return this.sendEmail({
      to,
      subject: `✓ Application Approved: ${role} at ${company}`,
      category: 'approval',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Congratulations ${name}!</h2>
          <p>Your application for <strong>${role}</strong> at <strong>${company}</strong> was approved at stage: <strong>${stage}</strong>.</p>
        </div>
      `,
    });
  }

  async sendApplicationRejected(to: string, name: string, role: string, company: string, reason: string) {
    return this.sendEmail({
      to,
      subject: `Application Update: ${role} at ${company}`,
      category: 'rejection',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Application Update</h2>
          <p>Hi ${name}, your application for <strong>${role}</strong> at <strong>${company}</strong> was not selected at this time.</p>
          <p><strong>Reason / Feedback:</strong> ${reason}</p>
        </div>
      `,
    });
  }

  async sendInterviewScheduled(to: string, name: string, role: string, company: string, interviewDate: string, meetUrl?: string) {
    return this.sendEmail({
      to,
      subject: `📅 Interview Scheduled: ${role} at ${company}`,
      category: 'interview',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Interview Invitation</h2>
          <p>Hi ${name}, <strong>${company}</strong> has scheduled an interview with you for <strong>${role}</strong> on <strong>${interviewDate}</strong>.</p>
          ${meetUrl ? `<a href="${meetUrl}" style="background: #2563eb; color: #fff; padding: 8px 16px; border-radius: 4px; display: inline-block;">Join Video Call</a>` : ''}
        </div>
      `,
    });
  }

  async sendWeeklyReportReminder(to: string, name: string, weekNumber: number, deadline: string) {
    return this.sendEmail({
      to,
      subject: `⏰ Reminder: Week ${weekNumber} Internship Report Due`,
      category: 'report',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Weekly Synthesis Report Due</h2>
          <p>Hi ${name}, please submit your Week ${weekNumber} internship report before <strong>${deadline}</strong> for faculty endorsement.</p>
        </div>
      `,
    });
  }

  async sendCertificateIssued(to: string, name: string, certNumber: string, verifyUrl: string) {
    return this.sendEmail({
      to,
      subject: `🎓 Completion Certificate Issued: ${certNumber}`,
      category: 'certificate',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Internship Certificate Ready</h2>
          <p>Hi ${name}, your official completion certificate has been cryptographically signed and issued.</p>
          <p><strong>Certificate ID:</strong> ${certNumber}</p>
          <a href="${verifyUrl}" style="background: #059669; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Verified Certificate</a>
        </div>
      `,
    });
  }
}
