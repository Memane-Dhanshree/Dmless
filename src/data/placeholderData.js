// Placeholder data for DmLess – consistent with business logic

export const initialJobs = {
  internships: [
    {
      id: 'job-i-1',
      title: 'Frontend Developer Intern',
      status: 'Active',
      type: 'Internship',
      totalApplicants: 47,
      shortlisted: 12,
      knockedOut: 35,
      link: 'https://dmless.io/jobs/job-i-1',
    },
    {
      id: 'job-i-2',
      title: 'Data Science Intern',
      status: 'Active',
      type: 'Internship',
      totalApplicants: 28,
      shortlisted: 8,
      knockedOut: 20,
      link: 'https://dmless.io/jobs/job-i-2',
    },
  ],
  fullTime: [
    {
      id: 'job-f-1',
      title: 'Senior Software Engineer',
      status: 'Active',
      type: 'Full-time',
      totalApplicants: 89,
      shortlisted: 24,
      knockedOut: 65,
      link: 'https://dmless.io/jobs/job-f-1',
    },
  ],
};

export const jobsSummary = {
  internships: {
    totalJobs: 2,
    totalApplicants: 75,
    totalKnockedOut: 55,
    totalShortlisted: 20,
  },
  fullTime: {
    totalJobs: 1,
    totalApplicants: 89,
    totalKnockedOut: 65,
    totalShortlisted: 24,
  },
};

export const initialHackathons = [
  {
    id: 'hack-1',
    title: 'Build for Good 2025',
    status: 'Active',
    totalRegistrations: 156,
    totalSubmissions: 42,
    totalFinalists: 12,
    link: 'https://dmless.io/hackathons/hack-1',
  },
  {
    id: 'hack-2',
    title: 'AI Innovation Challenge',
    status: 'Closed',
    totalRegistrations: 203,
    totalSubmissions: 78,
    totalFinalists: 20,
    link: 'https://dmless.io/hackathons/hack-2',
  },
];

export const hackathonsSummary = {
  totalHackathons: 2,
  totalRegistrations: 359,
  totalSubmissions: 120,
  totalFinalists: 32,
};

export const initialReferrals = [
  {
    id: 'ref-1',
    title: 'Engineering Referral Q1 2025',
    status: 'Active',
    totalReferrals: 34,
    accepted: 8,
    rejected: 26,
    link: 'https://dmless.io/referrals/ref-1',
  },
];

export const referralsSummary = {
  totalCampaigns: 1,
  totalReferrals: 34,
  totalAccepted: 8,
  totalRejected: 26,
};

export const platformDistribution = [
  { name: 'LinkedIn', value: 45, color: '#0A66C2' },
  { name: 'Instagram', value: 28, color: '#E4405F' },
  { name: 'WhatsApp', value: 18, color: '#25D366' },
  { name: 'Others', value: 9, color: '#6B7280' },
];

export const initialNotifications = [
  { id: 'n1', type: 'applicant', message: 'New applicant applied to Frontend Developer Intern', campaignId: 'job-i-1', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', type: 'screening', message: 'Candidate passed screening for Senior Software Engineer', campaignId: 'job-f-1', read: false, createdAt: new Date().toISOString() },
  { id: 'n3', type: 'hackathon', message: 'Hackathon submission received for Build for Good 2025', campaignId: 'hack-1', read: true, createdAt: new Date().toISOString() },
  { id: 'n4', type: 'referral', message: 'Referral submitted for Engineering Referral Q1 2025', campaignId: 'ref-1', read: true, createdAt: new Date().toISOString() },
];

export const initialUser = {
  name: 'Alex Recruiter',
  email: 'alex@company.com',
  phone: '+1 555 123 4567',
};

export const talentPoolCandidates = [
  { id: 'c1', name: 'Jordan Lee', skills: ['React', 'Node.js'], experience: 2, location: 'Remote', contact: 'jordan.lee@email.com', source: 'Job' },
  { id: 'c2', name: 'Sam Chen', skills: ['Python', 'ML'], experience: 4, location: 'Hybrid', contact: 'sam.chen@email.com', source: 'Hackathon' },
  { id: 'c3', name: 'Riley Smith', skills: ['Java', 'AWS'], experience: 5, location: 'Onsite', contact: 'riley@email.com', source: 'Referral' },
];

export const analyticsTrendData = [
  { name: 'Week 1', applicants: 40, shortlisted: 10 },
  { name: 'Week 2', applicants: 65, shortlisted: 18 },
  { name: 'Week 3', applicants: 52, shortlisted: 14 },
  { name: 'Week 4', applicants: 78, shortlisted: 22 },
];

// Placeholder participants per hackathon (for Participants tab)
export const hackathonParticipantsByCampaign = {
  'hack-1': [
    { id: 'p1', name: 'Alex Kim', email: 'alex.kim@email.com', registeredAt: '2025-01-10', submitted: true },
    { id: 'p2', name: 'Jamie Park', email: 'jamie.p@email.com', registeredAt: '2025-01-11', submitted: false },
    { id: 'p3', name: 'Morgan Lee', email: 'morgan.lee@email.com', registeredAt: '2025-01-12', submitted: true },
  ],
  'hack-2': [
    { id: 'p4', name: 'Casey Brown', email: 'casey@email.com', registeredAt: '2025-01-05', submitted: true },
    { id: 'p5', name: 'Riley Davis', email: 'riley.d@email.com', registeredAt: '2025-01-06', submitted: true },
  ],
};

// Placeholder selected referrals per campaign (for Selected tab)
export const referralSelectedByCampaign = {
  'ref-1': [
    { id: 's1', name: 'Jordan Taylor', email: 'jordan.t@email.com', referredBy: 'Employee A', selectedAt: '2025-01-15' },
    { id: 's2', name: 'Sam Wilson', email: 'sam.w@email.com', referredBy: 'Employee B', selectedAt: '2025-01-16' },
  ],
};

// Placeholder shortlisted candidates per job (for Shortlisted tab)
export const jobShortlistedByCampaign = {
  'job-i-1': [
    { id: 'sh1', name: 'Emma Clark', email: 'emma.c@email.com', appliedAt: '2025-01-14', score: 4 },
    { id: 'sh2', name: 'Noah Lewis', email: 'noah.l@email.com', appliedAt: '2025-01-13', score: 5 },
  ],
  'job-f-1': [
    { id: 'sh3', name: 'Olivia Martinez', email: 'olivia.m@email.com', appliedAt: '2025-01-12', score: 5 },
  ],
};
