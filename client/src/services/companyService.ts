import { BaseApiService, ApiResponse } from './baseApi';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from './types';

export class CompanyService extends BaseApiService {
  private readonly endpoint = '/companies';

  // Get all companies
  async getAllCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Company[]>> {
    console.log('🔄 Fetching all companies with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

    return this.get<Company[]>(url);
  }

  // Get company by ID
  async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    console.log('🔄 Fetching company with id:', id);
    return this.get<Company>(`${this.endpoint}/${id}`);
  }

  // Create new company
  async createCompany(companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> {
    console.log('🔄 Creating company with data:', companyData);
    return this.post<Company, CreateCompanyRequest>(this.endpoint, companyData);
  }

  // Update company
  async updateCompany(id: string, companyData: UpdateCompanyRequest): Promise<ApiResponse<Company>> {
    console.log('🔄 Updating company with id:', id, 'data:', companyData);
    return this.put<Company, UpdateCompanyRequest>(`${this.endpoint}/${id}`, companyData);
  }

  // Delete company
  async deleteCompany(id: string): Promise<ApiResponse<void>> {
    console.log('🔄 Deleting company with id:', id);
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Search companies by criteria
  async searchCompanies(criteria: {
    name?: string;
    company_size?: string;
    website?: string;
  }): Promise<ApiResponse<Company[]>> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    return this.get<Company[]>(`${this.endpoint}/search?${params.toString()}`);
  }

  // Get company statistics
  async getCompanyStats(): Promise<ApiResponse<{
    total: number;
    bySize: { [key: string]: number };
    withWebsite: number;
    withLogo: number;
  }>> {
    return this.get<{
      total: number;
      bySize: { [key: string]: number };
      withWebsite: number;
      withLogo: number;
    }>(`${this.endpoint}/stats`);
  }
}

export const companyService = new CompanyService();