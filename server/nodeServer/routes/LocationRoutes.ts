import { Router } from 'express';
import { LocationController } from '../controllers/LocationController.js';

const router = Router();

// GET /api/locations - Get all locations
router.get('/', LocationController.getAllLocations);

// GET /api/locations/:id - Get location by ID
router.get('/:id', LocationController.getLocationById);

// GET /api/locations/slug/:slug - Get location by slug
router.get('/slug/:slug', LocationController.getLocationBySlug);

// POST /api/locations - Create new location
router.post('/', LocationController.createLocation);

// PUT /api/locations/:id - Update location
router.put('/:id', LocationController.updateLocation);

// DELETE /api/locations/:id - Delete location
router.delete('/:id', LocationController.deleteLocation);

export default router;