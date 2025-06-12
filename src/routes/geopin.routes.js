import express from 'express';
import { encodeCoordinatesPost, encodeCoordinatesGet, decodeGeoPinPost, decodeGeoPinGet, calculateDistanceBetweenGeoPins, batchProcess } from '../controllers/geopin.controller.js';

const router = express.Router();

// Encode coordinates to GeoPin
router.post('/encode', encodeCoordinatesPost);
router.get('/encode', encodeCoordinatesGet);

// Decode GeoPin to coordinates
router.post('/decode', decodeGeoPinPost);
router.get('/decode', decodeGeoPinGet);

// Calculate distance between GeoPins
router.post('/distance', calculateDistanceBetweenGeoPins);

// Batch processing
router.post('/batch', batchProcess);

export default router;