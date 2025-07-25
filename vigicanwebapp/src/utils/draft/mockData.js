// Mock data for admin dashboard
export const mockData = {
  totalApplications: 51341,
  approvedApplications: 2331,
  rejectedApplications: 1055,
  pendingApplications: 1055,
  siteVisitation: 215341,
  conversionRate: 14,
  bounceRate: 38.67,

  applicationsByMonth: [
    {
      month: "Jan",
      applications: 120,
      approved: 80,
      rejected: 20,
      pending: 20,
    },
    {
      month: "Feb",
      applications: 150,
      approved: 100,
      rejected: 30,
      pending: 20,
    },
    {
      month: "Mar",
      applications: 180,
      approved: 120,
      rejected: 40,
      pending: 20,
    },
    {
      month: "Apr",
      applications: 200,
      approved: 140,
      rejected: 30,
      pending: 30,
    },
    {
      month: "May",
      applications: 220,
      approved: 160,
      rejected: 35,
      pending: 25,
    },
    {
      month: "Jun",
      applications: 250,
      approved: 180,
      rejected: 40,
      pending: 30,
    },
  ],

  satisfactionRatings: [
    { stars: 5, count: 45, percentage: 50 },
    { stars: 4, count: 35, percentage: 38 },
    { stars: 3, count: 15, percentage: 17 },
    { stars: 2, count: 8, percentage: 9 },
    { stars: 1, count: 5, percentage: 6 },
  ],

  applicationsByGender: {
    male: 60,
    female: 40,
  },

  recentApplications: [
    {
      id: 1,
      studentName: "John Doe",
      course: "Computer Science",
      school: "University of Manchester",
      status: "pending",
      submittedAt: "2024-01-15",
      documents: ["transcript", "personal_statement", "references"],
    },
    {
      id: 2,
      studentName: "Jane Smith",
      course: "Business Administration",
      school: "Oxford University",
      status: "approved",
      submittedAt: "2024-01-14",
      documents: [
        "transcript",
        "personal_statement",
        "references",
        "portfolio",
      ],
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      course: "Engineering",
      school: "Cambridge University",
      status: "rejected",
      submittedAt: "2024-01-13",
      documents: ["transcript", "personal_statement"],
    },
  ],

  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      role: "student",
      status: "active",
      joinedAt: "2024-01-10",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      role: "student",
      status: "active",
      joinedAt: "2024-01-08",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@vigica.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-12-01",
      lastLogin: "2024-01-15",
    },
  ],

  uploadedFiles: [
    {
      id: 1,
      fileName: "transcript_john_doe.pdf",
      uploadedBy: "John Doe",
      fileType: "application/pdf",
      fileSize: "2.5MB",
      uploadedAt: "2024-01-15",
      status: "approved",
    },
    {
      id: 2,
      fileName: "personal_statement_jane.docx",
      uploadedBy: "Jane Smith",
      fileType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: "1.2MB",
      uploadedAt: "2024-01-14",
      status: "pending",
    },
  ],

  messages: [
    {
      id: 1,
      from: "John Doe",
      email: "john.doe@email.com",
      subject: "Application Status Inquiry",
      message:
        "I would like to know the status of my application for Computer Science.",
      timestamp: "2024-01-15T10:30:00",
      status: "unread",
    },
    {
      id: 2,
      from: "Jane Smith",
      email: "jane.smith@email.com",
      subject: "Document Upload Issue",
      message:
        "I am having trouble uploading my reference letters. Could you please help?",
      timestamp: "2024-01-14T14:22:00",
      status: "read",
    },
  ],

  questions: [
    {
      id: 1,
      question: "What documents are required for application?",
      answer:
        "You need to submit your transcript, personal statement, and two reference letters.",
      category: "Documents",
      isPublic: true,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      question: "How long does the application process take?",
      answer: "The application review process typically takes 2-4 weeks.",
      category: "Process",
      isPublic: true,
      createdAt: "2024-01-08",
    },
  ],
};

// API simulation functions
export const apiSimulation = {
  getApplications: () => Promise.resolve(mockData.recentApplications),
  getUsers: () => Promise.resolve(mockData.users),
  getFiles: () => Promise.resolve(mockData.uploadedFiles),
  getMessages: () => Promise.resolve(mockData.messages),
  getQuestions: () => Promise.resolve(mockData.questions),

  updateApplicationStatus: (id, status) => {
    const app = mockData.recentApplications.find((app) => app.id === id);
    if (app) {
      app.status = status;
      return Promise.resolve(app);
    }
    return Promise.reject(new Error("Application not found"));
  },

  deleteUser: (id) => {
    const index = mockData.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      mockData.users.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error("User not found"));
  },
};
