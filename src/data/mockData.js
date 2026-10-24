// ---------------------------------------------------------------------------
// MOCK DATA LAYER
// ---------------------------------------------------------------------------
// Every admin/* page imports its data from here instead of calling a real API.
// Once the backend is ready, replace each export with a real fetch/axios call
// inside src/api/* and keep the shape identical so the UI doesn't need to change.
// ---------------------------------------------------------------------------

export const departments = [
  'Artificial Intelligence',
  'Data Analysis',
  'Information Systems',
  'Information Technology',
  'Computer Science',
  'Software Engineering',
  'Mobile App Development',
  'General',
];

// Short codes shown on compact surfaces (Examination Archive cards), mirroring
// how the Figma cards display "CS, IS, IT" instead of the full department name.
export const departmentAbbreviations = {
  'Artificial Intelligence': 'AI',
  'Data Analysis': 'DA',
  'Information Systems': 'IS',
  'Information Technology': 'IT',
  'Computer Science': 'CS',
  'Software Engineering': 'SE',
  'Mobile App Development': 'MAD',
  General: 'GEN',
};

export const dashboardStats = {
  totalMaterials: { value: 5678, delta: '+8% from last month', tone: 'green' },
  pendingReviews: { value: 23, delta: '-3% from last month', tone: 'red' },
  overdueBooks: { value: 12, delta: 'Active Red Alerts', tone: 'red' },
  systemDownloads: { value: 12543, delta: '+12% from last month', tone: 'green' },
};

export const overdueBooks = [
  {
    id: 'OD-1001',
    bookTitle: 'Introduction to Algorithms',
    borrowerEmail: 'ahmed@university.edu',
    dueDate: '2026-06-05',
    daysOverdue: 6,
  },
  {
    id: 'OD-1002',
    bookTitle: 'Web Development Guide',
    borrowerEmail: 'fatima@university.edu',
    dueDate: '2026-06-08',
    daysOverdue: 3,
  },
];

// Subject-area demand, matching the categories shown in the real Demand
// Forecasting chart (AI / Web / Data / OS / Math) rather than a weekday axis.
export const demandForecast = [
  { period: 'AI', requests: 62 },
  { period: 'Web', requests: 48 },
  { period: 'Data', requests: 71 },
  { period: 'OS', requests: 39 },
  { period: 'Math', requests: 55 },
];

export const materials = [
  {
    id: 'MAT-2001',
    title: 'Data Structures & Algorithms',
    departments: ['Computer Science', 'Artificial Intelligence'],
    skillLevel: 'Intermediate',
    language: 'English',
    stock: 15,
    type: 'Book',
    addedAt: '2026-05-12',
  },
  {
    id: 'MAT-2002',
    title: 'Advanced Calculus',
    departments: ['Data Analysis', 'Software Engineering'],
    skillLevel: 'Advanced',
    language: 'Arabic',
    stock: 8,
    type: 'Book',
    addedAt: '2026-05-20',
  },
  {
    id: 'MAT-2003',
    title: 'أساسيات الذكاء الاصطناعي',
    departments: ['Artificial Intelligence', 'Data Analysis'],
    skillLevel: 'Beginner',
    language: 'Arabic',
    stock: 21,
    type: 'Document',
    addedAt: '2026-06-01',
  },
];

export const exams = [
  {
    id: 'EX-3001',
    courseCode: 'CS101',
    courseName: 'Introduction to Programming',
    departments: ['Computer Science', 'Information Systems', 'Information Technology'],
    examCategory: 'Final',
    academicYear: '1st Year',
    semester: 'First Semester',
    calendarYear: 2026,
    instructor: 'Dr. Ahmed Mohamed',
  },
  {
    id: 'EX-3002',
    courseCode: 'IS202',
    courseName: 'Database Management Systems',
    departments: ['Information Systems', 'Software Engineering'],
    examCategory: 'Midterm',
    academicYear: '2nd Year',
    semester: 'Second Semester',
    calendarYear: 2025,
    instructor: 'Dr. Fatima Ali',
  },
];

export const graduationProjects = [
  {
    id: 'GP-4001',
    title: 'Smart Library Management System using AI',
    student: 'Ahmed Mohamed',
    major: 'Computer Science',
    advisors: 'Dr. Fatima Ali',
    submittedAt: '2026-06-10',
    status: 'pending', // pending | approved | rejected
    source: 'student', // student | supervisor
  },
  {
    id: 'GP-4002',
    title: 'Health Monitoring App with AI Recommendations',
    student: 'Sarah Khaled',
    major: 'Software Engineering',
    advisors: 'Dr. Mahmoud Hassan',
    submittedAt: '2026-05-28',
    status: 'approved',
    source: 'student',
  },
  {
    id: 'GP-4003',
    title: 'Campus Navigation AR App',
    student: 'Youssef Tarek',
    major: 'Information Technology',
    advisors: 'Dr. Mohamed Adel',
    submittedAt: '2026-06-05',
    status: 'rejected',
    source: 'student',
    rejectionReason: 'Documentation file is missing the system architecture section.',
  },
];

export const circulationRecords = [
  {
    id: 'CIR-5001',
    studentEmail: 'ahmed@university.edu',
    bookTitle: 'Introduction to Algorithms',
    checkoutDate: '2026-06-01',
    dueDate: '2026-06-15',
    status: 'borrowed', // borrowed | returned | overdue
  },
  {
    id: 'CIR-5002',
    studentEmail: 'fatima@university.edu',
    bookTitle: 'Web Development Guide',
    checkoutDate: '2026-05-20',
    dueDate: '2026-06-05',
    status: 'overdue',
  },
];

export const auditStats = {
  totalEvents: 12543,
  todayEvents: 245,
  failedLogins: 89,
  systemChanges: 34,
};

export const auditLogs = [
  {
    id: 'LOG-9001',
    timestamp: '2026-06-09 14:35:22',
    user: 'Ahmed Mohamed',
    action: 'login',
    resource: 'User Authentication',
    details: 'Successful login',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'LOG-9002',
    timestamp: '2026-06-09 14:32:15',
    user: 'Fatima Ali',
    action: 'create',
    resource: 'Material',
    details: 'Added new book: "AI Fundamentals"',
    ipAddress: '192.168.1.105',
    status: 'success',
  },
  {
    id: 'LOG-9003',
    timestamp: '2026-06-09 14:28:45',
    user: 'System Admin',
    action: 'update',
    resource: 'System Settings',
    details: 'Updated backup schedule',
    ipAddress: '192.168.1.1',
    status: 'success',
  },
  {
    id: 'LOG-9004',
    timestamp: '2026-06-09 14:20:33',
    user: 'Mahmoud Hassan',
    action: 'download',
    resource: 'Report',
    details: 'Downloaded monthly statistics report',
    ipAddress: '192.168.1.110',
    status: 'success',
  },
  {
    id: 'LOG-9005',
    timestamp: '2026-06-09 14:15:12',
    user: 'Unknown User',
    action: 'login',
    resource: 'User Authentication',
    details: 'Failed login attempt - invalid password',
    ipAddress: '203.0.113.45',
    status: 'failed',
  },
  {
    id: 'LOG-9006',
    timestamp: '2026-06-09 14:05:42',
    user: 'Ali Mahmoud',
    action: 'delete',
    resource: 'User Account',
    details: 'Deactivated inactive user account',
    ipAddress: '192.168.1.120',
    status: 'success',
  },
];

// Logged-in admin used by the mock AuthContext until real auth is wired up.
export const mockSession = {
  name: 'John Doe',
  email: 'john.doe@maktabti.edu',
  role: 'superAdmin', // superAdmin | supervisor
};
