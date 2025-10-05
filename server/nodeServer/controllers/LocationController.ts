import type { Request, Response } from 'express';
import { LocationModel } from '../models/LocationModel.js';

export class LocationController {
    static async getAllLocations(req: Request, res: Response) {
        try {
            const locations = await LocationModel.findAll();
            res.status(200).json({
                success: true,
                data: locations,
                message: 'Locations retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllLocations:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getLocationById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const locationId = parseInt(id ?? '');

            if (isNaN(locationId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid location ID'
                });
            }

            const location = await LocationModel.findById(locationId);
            if (!location) {
                return res.status(404).json({
                    success: false,
                    message: 'Location not found'
                });
            }

            res.status(200).json({
                success: true,
                data: location,
                message: 'Location retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getLocationById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getLocationBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;

            const location = await LocationModel.findBySlug(slug ?? '');
            if (!location) {
                return res.status(404).json({
                    success: false,
                    message: 'Location not found'
                });
            }

            res.status(200).json({
                success: true,
                data: location,
                message: 'Location retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getLocationBySlug:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createLocation(req: Request, res: Response) {
        try {
            const { city, slug } = req.body;

            if (!city || !slug) {
                return res.status(400).json({
                    success: false,
                    message: 'City and slug are required'
                });
            }

            const newLocation = await LocationModel.create({ city, slug });
            res.status(201).json({
                success: true,
                data: newLocation,
                message: 'Location created successfully'
            });
        } catch (error) {
            console.error('Error in createLocation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateLocation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const locationId = parseInt(id ?? '');

            if (isNaN(locationId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid location ID'
                });
            }

            const updatedLocation = await LocationModel.update(locationId, req.body);
            if (!updatedLocation) {
                return res.status(404).json({
                    success: false,
                    message: 'Location not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedLocation,
                message: 'Location updated successfully'
            });
        } catch (error) {
            console.error('Error in updateLocation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteLocation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const locationId = parseInt(id ?? '');

            if (isNaN(locationId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid location ID'
                });
            }

            const deleted = await LocationModel.delete(locationId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Location not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Location deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteLocation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}