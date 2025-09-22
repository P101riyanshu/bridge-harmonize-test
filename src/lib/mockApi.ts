// Mock API Service for Testing - Replace with real backend integration

import { User, Grievance, Department, GrievanceComment } from './api';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Citizen',
    email: 'citizen@demo.com',
    phone: '+1-234-567-8900',
    role: 'citizen'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@demo.com',
    phone: '+1-234-567-8901',
    role: 'admin'
  },
  {
    id: 'dept-1',
    name: 'Department Officer',
    email: 'dept@demo.com',
    phone: '+1-234-567-8902',
    role: 'department',
    department: 'Public Works'
  }
];

const mockDepartments: Department[] = [
  {
    id: 'dept-public-works',
    name: 'Public Works',
    description: 'Roads, infrastructure, and maintenance',
    email: 'publicworks@city.gov',
    phone: '+1-234-567-9001',
    head: 'Sarah Johnson'
  },
  {
    id: 'dept-water',
    name: 'Water Department',
    description: 'Water supply, drainage, and sewage',
    email: 'water@city.gov',
    phone: '+1-234-567-9002',
    head: 'Mike Wilson'
  },
  {
    id: 'dept-health',
    name: 'Health Department',
    description: 'Public health and sanitation',
    email: 'health@city.gov',
    phone: '+1-234-567-9003',
    head: 'Dr. Lisa Chen'
  },
  {
    id: 'dept-transport',
    name: 'Transportation',
    description: 'Public transport and traffic management',
    email: 'transport@city.gov',
    phone: '+1-234-567-9004',
    head: 'Robert Martinez'
  }
];

let mockGrievances: Grievance[] = [
  {
    id: 'grievance-1',
    title: 'Broken street light on Main Street',
    description: 'The street light at the corner of Main Street and Oak Avenue has been broken for over a week. This is creating safety concerns for pedestrians and drivers, especially during night hours.',
    category: 'Road & Infrastructure',
    department: 'Public Works',
    priority: 'medium',
    status: 'in_progress',
    citizenId: 'user-1',
    citizenName: 'John Citizen',
    citizenEmail: 'citizen@demo.com',
    citizenPhone: '+1-234-567-8900',
    location: {
      address: 'Corner of Main Street and Oak Avenue',
      latitude: 40.7128,
      longitude: -74.0060
    },
    assignedTo: 'dept-1',
    comments: [
      {
        id: 'comment-1',
        grievanceId: 'grievance-1',
        userId: 'admin-1',
        userName: 'Admin User',
        userRole: 'admin',
        message: 'Thank you for reporting this issue. We have assigned this to the Public Works department for immediate attention.',
        isInternal: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-2',
        grievanceId: 'grievance-1',
        userId: 'dept-1',
        userName: 'Department Officer',
        userRole: 'department',
        message: 'Our maintenance team has inspected the light and ordered replacement parts. Expected repair completion by end of week.',
        isInternal: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'grievance-2',
    title: 'Water supply interruption in residential area',
    description: 'Residents in the Maple Gardens area have been experiencing frequent water supply interruptions for the past three days. The water pressure is very low even when supply is available.',
    category: 'Water Supply',
    department: 'Water Department',
    priority: 'high',
    status: 'resolved',
    citizenId: 'user-1',
    citizenName: 'John Citizen',
    citizenEmail: 'citizen@demo.com',
    citizenPhone: '+1-234-567-8900',
    location: {
      address: 'Maple Gardens Residential Area'
    },
    comments: [
      {
        id: 'comment-3',
        grievanceId: 'grievance-2',
        userId: 'dept-1',
        userName: 'Water Department',
        userRole: 'department',
        message: 'Issue has been identified and resolved. A faulty valve in the main distribution line was replaced. Water supply should be normal now.',
        isInternal: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'grievance-3',
    title: 'Garbage collection missed for two weeks',
    description: 'The garbage collection service has not visited our street (Pine Street) for the past two weeks. The accumulated waste is causing hygiene issues and attracting pests.',
    category: 'Sanitation',
    department: 'Health Department',
    priority: 'urgent',
    status: 'pending',
    citizenId: 'user-1',
    citizenName: 'John Citizen',
    citizenEmail: 'citizen@demo.com',
    citizenPhone: '+1-234-567-8900',
    location: {
      address: 'Pine Street, Block 5'
    },
    comments: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // Authentication
  async login(email: string, password: string) {
    await delay(1000);
    
    // Simple demo authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      return {
        success: true,
        data: {
          user,
          token: 'mock-jwt-token-' + user.id
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  async register(userData: any) {
    await delay(1000);
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'citizen'
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: newUser
    };
  },

  // Grievances
  async getGrievances(params: any = {}) {
    await delay(800);
    
    let filteredGrievances = [...mockGrievances];
    
    // Apply filters
    if (params.citizenId) {
      filteredGrievances = filteredGrievances.filter(g => g.citizenId === params.citizenId);
    }
    
    if (params.status && params.status !== 'all') {
      filteredGrievances = filteredGrievances.filter(g => g.status === params.status);
    }
    
    if (params.category && params.category !== 'all') {
      filteredGrievances = filteredGrievances.filter(g => g.category === params.category);
    }
    
    if (params.department) {
      filteredGrievances = filteredGrievances.filter(g => g.department === params.department);
    }
    
    // Sort by creation date (newest first)
    filteredGrievances.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedGrievances = filteredGrievances.slice(start, end);
    
    return {
      success: true,
      data: {
        grievances: paginatedGrievances,
        total: filteredGrievances.length,
        page,
        totalPages: Math.ceil(filteredGrievances.length / limit)
      }
    };
  },

  async getGrievance(id: string) {
    await delay(500);
    
    const grievance = mockGrievances.find(g => g.id === id);
    if (!grievance) {
      return {
        success: false,
        error: 'Grievance not found'
      };
    }
    
    return {
      success: true,
      data: grievance
    };
  },

  async createGrievance(grievanceData: any) {
    await delay(1200);
    
    const newGrievance: Grievance = {
      id: 'grievance-' + Date.now(),
      ...grievanceData,
      status: 'pending' as const,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockGrievances.unshift(newGrievance);
    
    return {
      success: true,
      data: newGrievance
    };
  },

  async updateGrievanceStatus(id: string, status: string, comment?: string) {
    await delay(800);
    
    const grievanceIndex = mockGrievances.findIndex(g => g.id === id);
    if (grievanceIndex === -1) {
      return {
        success: false,
        error: 'Grievance not found'
      };
    }
    
    mockGrievances[grievanceIndex].status = status as any;
    mockGrievances[grievanceIndex].updatedAt = new Date().toISOString();
    
    if (status === 'resolved') {
      mockGrievances[grievanceIndex].resolvedAt = new Date().toISOString();
    }
    
    if (comment) {
      const newComment: GrievanceComment = {
        id: 'comment-' + Date.now(),
        grievanceId: id,
        userId: 'admin-1',
        userName: 'System Admin',
        userRole: 'admin',
        message: comment,
        isInternal: false,
        createdAt: new Date().toISOString()
      };
      
      mockGrievances[grievanceIndex].comments.push(newComment);
    }
    
    return {
      success: true,
      data: mockGrievances[grievanceIndex]
    };
  },

  // Departments
  async getDepartments() {
    await delay(300);
    
    return {
      success: true,
      data: mockDepartments
    };
  },

  // File upload
  async uploadFile(file: File) {
    await delay(2000);
    
    // Simulate file upload
    return {
      success: true,
      data: {
        filename: file.name,
        url: `https://example.com/uploads/${file.name}`
      }
    };
  },

  // Analytics
  async getAnalytics() {
    await delay(1000);
    
    const totalGrievances = mockGrievances.length;
    const resolvedGrievances = mockGrievances.filter(g => g.status === 'resolved').length;
    const pendingGrievances = mockGrievances.filter(g => g.status === 'pending').length;
    
    return {
      success: true,
      data: {
        totalGrievances,
        resolvedGrievances,
        pendingGrievances,
        averageResolutionTime: 3.5,
        departmentStats: mockDepartments.map(dept => ({
          department: dept.name,
          count: mockGrievances.filter(g => g.department === dept.name).length,
          resolved: mockGrievances.filter(g => g.department === dept.name && g.status === 'resolved').length
        })),
        statusDistribution: [
          { status: 'pending', count: pendingGrievances },
          { status: 'in_progress', count: mockGrievances.filter(g => g.status === 'in_progress').length },
          { status: 'resolved', count: resolvedGrievances },
          { status: 'rejected', count: mockGrievances.filter(g => g.status === 'rejected').length }
        ],
        monthlyTrends: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 19 },
          { month: 'Mar', count: 3 },
          { month: 'Apr', count: 8 },
          { month: 'May', count: 15 },
          { month: 'Jun', count: 7 }
        ]
      }
    };
  }
};