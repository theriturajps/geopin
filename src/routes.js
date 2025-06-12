import express from 'express';
import { encodeGeoPin, decodeGeoPin, validateGeoPin, getGeoPinPrecision } from './geopin.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        service: 'GeoPin Military-Grade API',
        version: '1.0.0',
        datum: 'WGS84',
        precision: 'Sub-meter accuracy'
    });
});

// Encode coordinates to GeoPin - POST method
router.post('/encode', (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                error: 'Missing coordinates',
                message: 'Both latitude and longitude are required',
                format: { latitude: 'number', longitude: 'number' }
            });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({
                error: 'Invalid coordinates',
                message: 'Latitude and longitude must be valid numbers'
            });
        }

        const geopin = encodeGeoPin(lat, lon);
        const precision = getGeoPinPrecision(geopin);

        res.json({
            geopin,
            input: { latitude: lat, longitude: lon },
            precision: precision.approximateAccuracy,
            datum: 'WGS84',
            format: 'XXXX-XXXX-XXXX'
        });
    } catch (error) {
        res.status(400).json({
            error: 'Encoding failed',
            message: error.message
        });
    }
});

// Encode coordinates to GeoPin - GET method
router.get('/encode', (req, res) => {
    try {
        const { latitude, longitude, lat, lon } = req.query;

        // Support both 'latitude/longitude' and 'lat/lon' parameters
        const inputLat = latitude || lat;
        const inputLon = longitude || lon;

        if (!inputLat || !inputLon) {
            return res.status(400).json({
                error: 'Missing coordinates',
                message: 'Both latitude and longitude parameters are required',
                example: '/encode?latitude=40.7128&longitude=-74.0060'
            });
        }

        const parsedLat = parseFloat(inputLat);
        const parsedLon = parseFloat(inputLon);

        if (isNaN(parsedLat) || isNaN(parsedLon)) {
            return res.status(400).json({
                error: 'Invalid coordinates',
                message: 'Latitude and longitude must be valid numbers'
            });
        }

        const geopin = encodeGeoPin(parsedLat, parsedLon);
        const precision = getGeoPinPrecision(geopin);

        res.json({
            geopin,
            input: { latitude: parsedLat, longitude: parsedLon },
            precision: precision.approximateAccuracy,
            datum: 'WGS84',
            format: 'XXXX-XXXX-XXXX'
        });
    } catch (error) {
        res.status(400).json({
            error: 'Encoding failed',
            message: error.message
        });
    }
});

// Decode GeoPin to coordinates - POST method
router.post('/decode', (req, res) => {
    try {
        const { geopin } = req.body;

        if (!geopin) {
            return res.status(400).json({
                error: 'Missing GeoPin',
                message: 'GeoPin parameter is required',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        const result = decodeGeoPin(geopin);
        const precision = getGeoPinPrecision(geopin);

        res.json({
            ...result,
            geopin,
            approximateAccuracy: precision.approximateAccuracy
        });
    } catch (error) {
        res.status(400).json({
            error: 'Decoding failed',
            message: error.message
        });
    }
});

// Decode GeoPin to coordinates - GET method
router.get('/decode', (req, res) => {
    try {
        const { geopin } = req.query;

        if (!geopin) {
            return res.status(400).json({
                error: 'Missing GeoPin',
                message: 'GeoPin parameter is required',
                example: '/decode?geopin=2A5G-H3K7-M9P4'
            });
        }

        const result = decodeGeoPin(geopin);
        const precision = getGeoPinPrecision(geopin);

        res.json({
            ...result,
            geopin,
            approximateAccuracy: precision.approximateAccuracy
        });
    } catch (error) {
        res.status(400).json({
            error: 'Decoding failed',
            message: error.message
        });
    }
});

// Validate GeoPin format - GET method
router.get('/validate', (req, res) => {
    try {
        const { geopin } = req.query;

        if (!geopin) {
            return res.status(400).json({
                error: 'Missing GeoPin',
                message: 'GeoPin parameter is required'
            });
        }

        const isValid = validateGeoPin(geopin);

        if (isValid) {
            const precision = getGeoPinPrecision(geopin);
            res.json({
                valid: true,
                geopin,
                precision: precision.approximateAccuracy,
                datum: 'WGS84'
            });
        } else {
            res.json({
                valid: false,
                geopin,
                message: 'Invalid GeoPin format'
            });
        }
    } catch (error) {
        res.json({
            valid: false,
            geopin: req.query.geopin,
            error: error.message
        });
    }
});

// Get precision information - GET method
router.get('/precision', (req, res) => {
    try {
        const { geopin } = req.query;

        if (!geopin) {
            return res.status(400).json({
                error: 'Missing GeoPin',
                message: 'GeoPin parameter is required'
            });
        }

        const precision = getGeoPinPrecision(geopin);

        res.json({
            geopin,
            ...precision
        });
    } catch (error) {
        res.status(400).json({
            error: 'Precision analysis failed',
            message: error.message
        });
    }
});

export default router;