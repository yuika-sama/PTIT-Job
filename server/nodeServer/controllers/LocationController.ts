import { LocationModel } from '../models/LocationModel.js';
import { validateUUID } from '../utils/uuid.js';

export class LocationController {
    static async getAllLocations(): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const locations = await LocationModel.findAll();
            return {
                success: true,
                data: locations,
                message: 'Locations retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getAllLocations:', error);
            throw new Error('Internal server error');
        }
    }

    static async getLocationById({ params }: { params: { id: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;

            if (!id) {
                throw new Error('Location ID is required');
            }

            const locationId = validateUUID(id, 'Location ID');
            const location = await LocationModel.findById(locationId);
            if (!location) {
                throw new Error('Location not found');
            }

            return {
                success: true,
                data: location,
                message: 'Location retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getLocationById:', error);
            throw error;
        }
    }

    static async getLocationBySlug({ params }: { params: { slug: string } }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { slug } = params;

            if (!slug) {
                throw new Error('Slug is required');
            }

            const location = await LocationModel.findBySlug(slug);
            if (!location) {
                throw new Error('Location not found');
            }

            return {
                success: true,
                data: location,
                message: 'Location retrieved successfully'
            };
        } catch (error) {
            console.error('Error in getLocationBySlug:', error);
            throw error;
        }
    }

    static async createLocation({ body }: { body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { city, slug } = body;

            if (!city || !slug) {
                throw new Error('City and slug are required');
            }

            const newLocation = await LocationModel.create({ city, slug });
            return {
                success: true,
                data: newLocation,
                message: 'Location created successfully'
            };
        } catch (error) {
            console.error('Error in createLocation:', error);
            throw error;
        }
    }

    static async updateLocation({ params, body }: { params: { id: string }; body: any }): Promise<{ success: boolean; data: any; message: string }> {
        try {
            const { id } = params;

            if (!id) {
                throw new Error('Location ID is required');
            }

            const locationId = validateUUID(id, 'Location ID');
            const updatedLocation = await LocationModel.update(locationId, body);
            if (!updatedLocation) {
                throw new Error('Location not found');
            }

            return {
                success: true,
                data: updatedLocation,
                message: 'Location updated successfully'
            };
        } catch (error) {
            console.error('Error in updateLocation:', error);
            throw error;
        }
    }

    static async deleteLocation({ params }: { params: { id: string } }): Promise<{ success: boolean; message: string }> {
        try {
            const { id } = params;

            if (!id) {
                throw new Error('Location ID is required');
            }

            const locationId = validateUUID(id, 'Location ID');
            const deleted = await LocationModel.delete(locationId);
            if (!deleted) {
                throw new Error('Location not found');
            }

            return {
                success: true,
                message: 'Location deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteLocation:', error);
            throw error;
        }
    }
}