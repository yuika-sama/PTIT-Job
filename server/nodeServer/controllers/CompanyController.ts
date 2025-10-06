// filepath: f:\codingSpace\Asm\PJob\server\nodeServer\controllers\CompanyController.ts
import { CompanyModel } from '../models/CompanyModel.js';
import { validateUUID } from '../utils/uuid.js';

export class CompanyController {
    static async getAllCompanies(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const companies = await CompanyModel.findAll();
            return {
                success: true,
                data: companies,
                message: 'Companies retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllCompanies:', error);
            throw new Error('Internal server error');
        }
    }

    static async getCompanyById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const companyId = validateUUID(id, 'Company ID');

            const company = await CompanyModel.findById(companyId);
            if (!company) {
                throw new Error('Company not found');
            }

            return {
                success: true,
                data: company,
                message: 'Company retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getCompanyById:', error);
            throw error;
        }
    }

    static async createCompany({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { name, description, website, company_size, logoUrl, address } = body;

            if (!name) {
                throw new Error('Company name is required');
            }

            const newCompany = await CompanyModel.create({
                name,
                description,
                website,
                company_size,
                logoUrl,
                address
            });

            return {
                success: true,
                data: newCompany,
                message: 'Company created successfully'
            };
        } catch (error) {
            console.error('Error in createCompany:', error);
            throw error;
        }
    }

    static async updateCompany({ params, body }: { params: { id: string }; body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;
            const companyId = validateUUID(id, 'Company ID');

            const updatedCompany = await CompanyModel.update(companyId, body);
            if (!updatedCompany) {
                throw new Error('Company not found');
            }

            return {
                success: true,
                data: updatedCompany,
                message: 'Company updated successfully'
            };
        } catch (error) {
            console.error('Error in updateCompany:', error);
            throw error;
        }
    }

    static async deleteCompany({ params }: { params: { id: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { id } = params;
            const companyId = validateUUID(id, 'Company ID');

            const deleted = await CompanyModel.delete(companyId);
            if (!deleted) {
                throw new Error('Company not found');
            }

            return {
                success: true,
                message: 'Company deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteCompany:', error);
            throw error;
        }
    }
}