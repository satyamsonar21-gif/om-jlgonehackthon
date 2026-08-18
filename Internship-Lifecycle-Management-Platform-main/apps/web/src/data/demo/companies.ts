export interface CompanyPartner {
  id: string;
  name: string;
  industry: string;
  location: string;
  mouStatus: 'Active' | 'Under Review' | 'Renewal Pending';
  activeInternsCount: number;
  totalPositions: number;
  rating: number;
  leadMentor: string;
  leadMentorEmail: string;
  logoInitials: string;
}

export const demoCompanies: CompanyPartner[] = [
  {
    id: 'c1',
    name: 'TechCorp Solutions',
    industry: 'Enterprise Software & Cloud',
    location: 'Bangalore, Karnataka',
    mouStatus: 'Active',
    activeInternsCount: 16,
    totalPositions: 25,
    rating: 4.9,
    leadMentor: 'Siddharth Nambiar',
    leadMentorEmail: 'siddharth@techcorp.com',
    logoInitials: 'TC',
  },
  {
    id: 'c2',
    name: 'Innovatech Labs',
    industry: 'AI & Data Intelligence',
    location: 'Hyderabad, Telangana',
    mouStatus: 'Active',
    activeInternsCount: 10,
    totalPositions: 15,
    rating: 4.8,
    leadMentor: 'Arun Iyer',
    leadMentorEmail: 'arun@innovatech.com',
    logoInitials: 'IL',
  },
  {
    id: 'c3',
    name: 'DataSystems Inc',
    industry: 'Data Infrastructure & Analytics',
    location: 'Pune, Maharashtra',
    mouStatus: 'Active',
    activeInternsCount: 8,
    totalPositions: 12,
    rating: 4.7,
    leadMentor: 'Rohan Deshmukh',
    leadMentorEmail: 'rohan@datasystems.com',
    logoInitials: 'DS',
  },
  {
    id: 'c4',
    name: 'GlobalSoft Systems',
    industry: 'Cloud Managed Services',
    location: 'Delhi NCR',
    mouStatus: 'Active',
    activeInternsCount: 6,
    totalPositions: 10,
    rating: 4.6,
    leadMentor: 'Pooja Bhatia',
    leadMentorEmail: 'pooja@globalsoft.com',
    logoInitials: 'GS',
  },
  {
    id: 'c5',
    name: 'CyberShield Security',
    industry: 'Cybersecurity & Audits',
    location: 'Pune, Maharashtra',
    mouStatus: 'Active',
    activeInternsCount: 5,
    totalPositions: 8,
    rating: 4.9,
    leadMentor: 'Vikram Joshi',
    leadMentorEmail: 'vjoshi@cybershield.com',
    logoInitials: 'CS',
  },
];
