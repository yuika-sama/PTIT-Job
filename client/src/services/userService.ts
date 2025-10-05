import { BaseApiService, ApiResponse } from './baseApi';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse
} from './types';

export class UserService extends BaseApiService {
  private readonly endpoint = '/users';

  // Get all users
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(this.endpoint);
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    console.log('🔄 Creating user with data:', userData);
    return this.post<User, CreateUserRequest>(this.endpoint, userData);
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    console.log('🔄 Updating user with id:', id, 'data:', userData);
    return this.put<User, UpdateUserRequest>(`${this.endpoint}/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    console.log('🔄 Deleting user with id:', id);
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Get users with pagination
  async getUsersPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>(
      `${this.endpoint}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Search users by criteria
  async searchUsers(criteria: {
    email?: string;
    full_name?: string;
    role?: string;
    company_id?: number;
  }): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.get<User[]>(`${this.endpoint}/search?${params.toString()}`);
  }

  // Get current user profile (requires authentication)
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/profile`);
  }

  // Update current user profile
  async updateCurrentUser(userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.put<User, UpdateUserRequest>(`${this.endpoint}/profile`, userData);
  }

  // Admin dashboard specific methods
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    byRole: { [key: string]: number };
  }>> {
    return this.get<{
      total: number;
      active: number;
      byRole: { [key: string]: number };
    }>(`${this.endpoint}/stats`);
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<ApiResponse<User>> {
    console.log('🔄 Toggling user status for id:', id);
    return this.patch<User>(`${this.endpoint}/${id}/toggle-status`);
  }
}

// Export singleton instance
export const userService = new UserService(); 