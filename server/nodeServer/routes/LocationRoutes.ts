import { Elysia } from 'elysia';
import { LocationController } from '../controllers/LocationController.js';

export const locationRoutes = new Elysia()
    .group('/locations', (app) => 
        app
            .get('/', LocationController.getAllLocations, {
                detail: { tags: ['Locations'] }
            })
            .get('/:id', LocationController.getLocationById, {
                detail: { tags: ['Locations'] }
            })
            .get('/slug/:slug', LocationController.getLocationBySlug, {
                detail: { tags: ['Locations'] }
            })
            .post('/', LocationController.createLocation, {
                detail: { tags: ['Locations'] }
            })
            .put('/:id', LocationController.updateLocation, {
                detail: { tags: ['Locations'] }
            })
            .delete('/:id', LocationController.deleteLocation, {
                detail: { tags: ['Locations'] }
            })
    )