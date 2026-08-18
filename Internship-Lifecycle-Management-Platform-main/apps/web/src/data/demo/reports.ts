export interface WeeklyReportItem {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  companyName: string;
  weekNumber: number;
  title: string;
  submissionDate: string;
  hoursLogged: number;
  status: 'PENDING' | 'APPROVED' | 'REVISION_NEEDED';
  summary: string;
  deliverables: string[];
  grade?: string;
  facultyFeedback?: string;
  mentorFeedback?: string;
}

export const demoReports: WeeklyReportItem[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'Priya Sharma',
    studentRoll: '20CS101',
    companyName: 'TechCorp Solutions',
    weekNumber: 4,
    title: 'OAuth2 PKCE Flow & Performance Optimization',
    submissionDate: 'Jul 24, 2026',
    hoursLogged: 40,
    status: 'APPROVED',
    summary: 'Configured distributed session management with Redis clustering, implemented PKCE challenge/verifier auth flow, and authored comprehensive Jest unit test suite with 94% branch coverage.',
    deliverables: ['Pull Request #142 (Merged)', 'Redis session store implementation', 'Auth security unit tests'],
    grade: '5.0 / 5.0',
    facultyFeedback: 'Superb architectural breakdown and clean diagramming.',
    mentorFeedback: 'Outstanding velocity, Priya handled the edge cases expertly.',
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'Rahul Patel',
    studentRoll: '20CS102',
    companyName: 'Innovatech Labs',
    weekNumber: 4,
    title: 'Real-time Caching with Redis & High-Throughput Queries',
    submissionDate: 'Jul 23, 2026',
    hoursLogged: 38,
    status: 'PENDING',
    summary: 'Benchmarked PostgreSQL query execution plans using EXPLAIN ANALYZE, added composite indexes on transactional tables, and introduced write-through Redis caching.',
    deliverables: ['Query benchmark document', 'Migration scripts for composite indexes'],
  },
  {
    id: 'r3',
    studentId: 's5',
    studentName: 'Amit Kumar',
    studentRoll: '20CS105',
    companyName: 'TechCorp Solutions',
    weekNumber: 4,
    title: 'Database Index Tuning & Multi-Tenant Partitioning',
    submissionDate: 'Jul 22, 2026',
    hoursLogged: 42,
    status: 'PENDING',
    summary: 'Implemented table partitioning by date range for time-series logs, reducing average lookup latency from 140ms to 12ms.',
    deliverables: ['Postgres partitioning script', 'Latency benchmark dashboard'],
  },
  {
    id: 'r4',
    studentId: 's6',
    studentName: 'Sneha Gupta',
    studentRoll: '20CS106',
    companyName: 'DataSystems Inc',
    weekNumber: 5,
    title: 'Design System Tokens & Accessible WCAG 2.2 Components',
    submissionDate: 'Jul 21, 2026',
    hoursLogged: 36,
    status: 'PENDING',
    summary: 'Refactored shared table and modal components to meet strict WCAG 2.2 AA accessibility guidelines, adding keyboard focus trapping and ARIA roles.',
    deliverables: ['Storybook component library update', 'Axe-core accessibility test pass report'],
  },
];
