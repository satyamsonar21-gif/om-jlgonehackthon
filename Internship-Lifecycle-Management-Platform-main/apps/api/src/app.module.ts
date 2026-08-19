import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseAdminModule } from './common/firebase/firebase-admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { InternshipsModule } from './modules/internships/internships.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DailyLogsModule } from './modules/daily-logs/daily-logs.module';
import { WeeklyReportsModule } from './modules/weekly-reports/weekly-reports.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { PpoModule } from './modules/ppo/ppo.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FirebaseAdminModule,
    AuditModule,
    AuthModule,
    StudentsModule,
    FacultyModule,
    CompaniesModule,
    ListingsModule,
    ApplicationsModule,
    EligibilityModule,
    InternshipsModule,
    AttendanceModule,
    DailyLogsModule,
    WeeklyReportsModule,
    FeedbackModule,
    TasksModule,
    CertificatesModule,
    PpoModule,
    AnalyticsModule,
    NotificationsModule,
    UploadsModule,
    ReportsModule,
    AiModule,
  ],
})
export class AppModule {}
