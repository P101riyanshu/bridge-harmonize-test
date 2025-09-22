// API Service Layer for Civic Grievance System

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Check if we should use mock API (for demo purposes)
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || !process.env.REACT_APP_API_URL;

// Import mock API service for demo
import { mockApiService } from './mockApi';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'admin' | 'department';
  department?: string;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  attachments?: string[];
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  assignedTo?: string;
  comments: GrievanceComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface GrievanceComment {
  id: string;
  grievanceId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  head: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    if (USE_MOCK_API) {
      return mockApiService.login(email, password);
    }
    
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<ApiResponse<User>> {
    if (USE_MOCK_API) {
      return mockApiService.register(userData);
    }
    
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    localStorage.removeItem('authToken');
    return { success: true };
  }

  // Grievances
  async getGrievances(params?: {
    status?: string;
    category?: string;
    department?: string;
    citizenId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ grievances: Grievance[]; total: number; page: number; totalPages: number }>> {
    if (USE_MOCK_API) {
      return mockApiService.getGrievances(params);
    }
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/grievances?${queryParams.toString()}`);
  }

  async getGrievance(id: string): Promise<ApiResponse<Grievance>> {
    if (USE_MOCK_API) {
      return mockApiService.getGrievance(id);
    }
    
    return this.request(`/grievances/${id}`);
  }

  async createGrievance(grievanceData: Omit<Grievance, 'id' | 'status' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Grievance>> {
    if (USE_MOCK_API) {
      return mockApiService.createGrievance(grievanceData);
    }
    
    return this.request('/grievances', {
      method: 'POST',
      body: JSON.stringify(grievanceData),
    });
  }

  async updateGrievanceStatus(id: string, status: Grievance['status'], comment?: string): Promise<ApiResponse<Grievance>> {
    if (USE_MOCK_API) {
      return mockApiService.updateGrievanceStatus(id, status, comment);
    }
    
    return this.request(`/grievances/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comment }),
    });
  }

  async assignGrievance(id: string, assignedTo: string): Promise<ApiResponse<Grievance>> {
    return this.request(`/grievances/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assignedTo }),
    });
  }

  // Comments
  async addComment(grievanceId: string, message: string, isInternal: boolean = false): Promise<ApiResponse<GrievanceComment>> {
    return this.request(`/grievances/${grievanceId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ message, isInternal }),
    });
  }

  // Departments
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    if (USE_MOCK_API) {
      return mockApiService.getDepartments();
    }
    
    return this.request('/departments');
  }

  // File upload
  async uploadFile(file: File): Promise<ApiResponse<{ filename: string; url: string }>> {
    if (USE_MOCK_API) {
      return mockApiService.uploadFile(file);
    }
    
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  }

  // Analytics
  async getAnalytics(timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<{
    totalGrievances: number;
    resolvedGrievances: number;
    pendingGrievances: number;
    averageResolutionTime: number;
    departmentStats: { department: string; count: number; resolved: number }[];
    statusDistribution: { status: string; count: number }[];
    monthlyTrends: { month: string; count: number }[];
  }>> {
    if (USE_MOCK_API) {
      return mockApiService.getAnalytics();
    }
    
    return this.request(`/analytics?timeframe=${timeframe}`);
  }
}

export const api = new ApiService();