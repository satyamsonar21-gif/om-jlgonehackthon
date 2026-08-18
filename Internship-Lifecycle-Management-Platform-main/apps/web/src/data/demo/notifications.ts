export interface NotificationItem {
  id: string;
  role: 'student' | 'faculty' | 'company' | 'admin' | 'all';
  title: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  unread: boolean;
  type: 'action' | 'info' | 'success' | 'warning';
  link?: string;
}

export const demoNotifications: NotificationItem[] = [
  {
    id: 'n1',
    role: 'student',
    title: 'Weekly Report Due Tomorrow',
    description: 'Week 5 technical synthesis report deadline is tomorrow at 11:59 PM.',
    timeAgo: '15m ago',
    timestamp: '2026-07-28T10:00:00Z',
    unread: true,
    type: 'warning',
    link: '/student/active/reports',
  },
  {
    id: 'n2',
    role: 'student',
    title: 'Attendance Clocked Successfully',
    description: 'Morning biometric check-in verified for today at 09:12 AM.',
    timeAgo: '2h ago',
    timestamp: '2026-07-28T09:12:00Z',
    unread: false,
    type: 'success',
    link: '/student/active/attendance',
  },
  {
    id: 'n3',
    role: 'faculty',
    title: 'New Weekly Reports Submitted',
    description: '4 students submitted Week 4/5 synthesis reports awaiting academic evaluation.',
    timeAgo: '1h ago',
    timestamp: '2026-07-28T08:30:00Z',
    unread: true,
    type: 'action',
    link: '/faculty/reports',
  },
  {
    id: 'n4',
    role: 'faculty',
    title: 'Attendance Exception Flagged',
    description: 'Vikram Singh (20CS103) attendance dropped below 65% threshold.',
    timeAgo: '3h ago',
    timestamp: '2026-07-28T07:00:00Z',
    unread: true,
    type: 'warning',
    link: '/faculty/students/s3',
  },
  {
    id: 'n5',
    role: 'company',
    title: 'New Candidate Applications',
    description: '5 new candidate dossiers submitted for Full Stack Developer listing.',
    timeAgo: '4h ago',
    timestamp: '2026-07-28T06:00:00Z',
    unread: true,
    type: 'action',
    link: '/company/applications',
  },
  {
    id: 'n6',
    role: 'admin',
    title: 'Cryptographic Certificate Issued',
    description: 'Batch completion certificate generated and signed for Amit Kumar (CERT-2026-089).',
    timeAgo: '5h ago',
    timestamp: '2026-07-28T05:00:00Z',
    unread: false,
    type: 'info',
    link: '/admin/certificates',
  },
];
