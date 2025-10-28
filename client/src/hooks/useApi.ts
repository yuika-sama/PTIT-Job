import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import { jobApplicationService } from '../services/jobApplicationService';
import { resumeService } from '../services/resumeService';
import { jobCategoryService, locationService } from '../services/categoryLocationService';
import {
  User,
  Job,
  Company,
  JobApplication,
  Resume,
  JobCategory,
  Location,
  CreateUserRequest,
  UpdateUserRequest,
  CreateJobRequest,
  CreateCompanyRequest,
  CreateJobApplicationRequest,
  LoginRequest
} from '../services/types';
import { authService } from '../services/authService';
import { RegisterRequest } from '../services/types';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; message: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useLayoutEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// User hooks
export function useUsers() {
  return useApi(() => userService.getAllUsers());
}

export function useUser(id: string) {
  return useApi(() => userService.getUserById(id), [id]);
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: CreateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.createUser(userData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateUser(id, userData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

export function useUpdateCurrentUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCurrentUser = async (userData: UpdateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateCurrentUser(userData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCurrentUser, loading, error };
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.changePassword(oldPassword, newPassword);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
}

// Job hooks
export function useJobs() {
  return useApi(() => jobService.getAllJobs());
}

export function useJob(id: string) {
  return useApi(() => jobService.getJobById(id), [id]);
}

export function useFeaturedJobs() {
  return useApi(() => jobService.getFeaturedJobs());
}

export function useSearchJobs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Job[]>([]);

  const searchJobs = async (criteria: {
    title?: string;
    company_id?: number;
    location_id?: number;
    category_id?: number;
    job_type?: string;
    experience_level?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.searchJobs(criteria);
      if (response.success) {
        setResults(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { searchJobs, results, loading, error };
}

// Company hooks
export function useCompanies() {
  return useApi(() => companyService.getAllCompanies());
}

export function useCompany(id: string) {
  return useApi(() => companyService.getCompanyById(id), [id]);
}

// Job Application hooks
export function useJobApplications() {
  return useApi(() => jobApplicationService.getAllApplications());
}

export function useUserApplications(userId: string) {
  return useApi(() => jobApplicationService.getApplicationsByUser(userId), [userId]);
}

export function useJobApplicationsForJob(jobId: string) {
  return useApi(() => jobApplicationService.getApplicationsByJob(jobId), [jobId]);
}

export function useResumes(){
  return useApi(() => resumeService.getAllResumes());
}

export function useCreateJobApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApplication = async (applicationData: CreateJobApplicationRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApplicationService.createApplication(applicationData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createApplication, loading, error };
}

// Resume hooks
export function useUserResumes(userId: number) {
  return useApi(() => resumeService.getResumesByUser(userId), [userId]);
}

export function useUploadResume() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadResume = async (file: File, userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resumeService.uploadResume(file, userId);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload resume';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadResume, loading, error };
}

// Category and Location hooks
export function useJobCategories() {
  return useApi(() => jobCategoryService.getAllCategories());
}

export function useLocations() {
  return useApi(() => locationService.getAllLocations());
}

export function useSearchLocations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);

  const searchLocations = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.searchLocations(query);
      if (response.success) {
        setResults(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { searchLocations, results, loading, error };
}

export function useLogin(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = async (body: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(body);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { login, loading, error };
}

export function useRegister(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const register = async (body: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(body);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { register, loading, error };
}