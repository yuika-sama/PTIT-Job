export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  company_id?: string;
  company_name?: string; // Tên công ty từ backend
  is_active: boolean;
  created_at: string;
  updated_at: string;
  refresh_token?: string;
}

export type UserRole = 'candidate' | 'employer' | 'admin';

// Auth response types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserRequest {
  email: string;
  password_hash: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  company_id?: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password_hash?: string;
  full_name?: string;
  phone_number?: string;
  role?: UserRole;
  company_id?: string;
  is_active?: boolean;
}

// Auth request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  company_id?: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  company_size?: string;
  address?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: JobType; 
  status: 'draft' | 'published' | 'expired' | 'closed'; 
  expiry_date: string;
  company_name: string;
  category_name: string;
  location_name: string;
  created_at: string; 
  updated_at: string;
  company_id: string;
  category_id: string;
  location_id: string;
}

export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: JobType;
  status: 'draft' | 'published' | 'expired' | 'closed';
  expiry_date: string;
  company_name: string;
  category_name: string;
  location_name: string;
}

// Job Application types
export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;    
  resume_id: string;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: Date;
  user_name?: string;
  user_email?: string;
  job_name?: string;
  file_url?: string;
}

export type ApplicationStatus = 'pending' | 'viewed' | 'shortlisted' | 'rejected' | 'hired';

export interface ApplicationFilters {
  search: string;
  status: string;
  jobTitle: string;
  company: string;
}

export interface CreateJobApplicationRequest {
  user_id: string;
  job_id: string;
  resume_id?: string;
  cover_letter?: string;
}

// Resume types
export interface Resume {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  uploaded_date: string;
}

// Job Category types
export interface JobCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
  job_count?: number; // Extended field for display
  created_at: string;
  updated_at: string;
}

export interface CreateJobCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
}

export interface CategoryFilters {
  search: string;
  status: string;
}

export interface Location {
  id: string;
  city: string;
  slug?: string;
  job_count?: number; 
}

export interface CreateLocationRequest {
  city: string;
  slug?: string;
  job_count?: number;
}

export interface LocationFilters {
  search: string;
  country: string;
  status: string;
}

// API Response types
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

// Error types
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  timestamp: string;
}

export interface LoginRequest{
  email: string;
  password: string;
}

export interface RegisterRequest{
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  company_id?: string;
}