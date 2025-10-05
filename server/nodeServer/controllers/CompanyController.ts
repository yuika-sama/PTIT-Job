// filepath: f:\codingSpace\Asm\PJob\server\nodeServer\controllers\CompanyController.ts
import type { Request, Response } from 'express';
import { CompanyModel } from '../models/CompanyModel.js';

export class CompanyController {
    static async getAllCompanies(req: Request, res: Response) {
        try {
            const companies = await CompanyModel.findAll();
            res.status(200).json({
                success: true,
                data: companies,
                message: 'Companies retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllCompanies:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getCompanyById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const companyId = parseInt(id ?? '');

            if (isNaN(companyId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
            }

            const company = await CompanyModel.findById(companyId);
            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                data: company,
                message: 'Company retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getCompanyById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createCompany(req: Request, res: Response) {
        try {
            const { name, description, website, company_size, logoUrl } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Company name is required'
                });
            }

            const newCompany = await CompanyModel.create({
                name,
                description,
                website,
                company_size,
                logoUrl
            });

            res.status(201).json({
                success: true,
                data: newCompany,
                message: 'Company created successfully'
            });
        } catch (error) {
            console.error('Error in createCompany:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateCompany(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const companyId = parseInt(id ?? '');

            if (isNaN(companyId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
            }

            const updatedCompany = await CompanyModel.update(companyId, req.body);
            if (!updatedCompany) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedCompany,
                message: 'Company updated successfully'
            });
        } catch (error) {
            console.error('Error in updateCompany:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteCompany(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const companyId = parseInt(id ?? '');

            if (isNaN(companyId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
            }

            const deleted = await CompanyModel.delete(companyId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Company deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteCompany:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}