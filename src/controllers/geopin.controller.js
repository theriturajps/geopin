import { encodeGeoPin, decodeGeoPin, calculateDistance } from '../core/geopin.core.js';
import { buildEncodeResponse, buildDecodeResponse, buildDistanceResponse } from '../utils/response.builder.js';
import { validateCoordinates, validateGeoPin } from '../utils/validators.js';

/**
 * Encode coordinates to GeoPin - POST
 */
export const encodeCoordinatesPost = (req, res) => {
    try {
        const { latitude, longitude, elevation, timestamp } = req.body;
        
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['latitude', 'longitude'],
                optional: ['elevation', 'timestamp']
            });
        }

        if (!validateCoordinates(latitude, longitude)) {
            return res.status(400).json({
                error: 'Invalid coordinates',
                message: 'Coordinates must be valid WGS84 values'
            });
        }

        // Parse and validate elevation
        const parsedElevation = (elevation !== undefined && elevation !== null && elevation !== '') 
            ? parseFloat(elevation) : null;
        
        // Parse and validate timestamp
        const parsedTimestamp = (timestamp !== undefined && timestamp !== null && timestamp !== '') 
            ? parseInt(timestamp) : null;

        const geopin = encodeGeoPin(
            parseFloat(latitude), 
            parseFloat(longitude),
            parsedElevation,
            parsedTimestamp
        );

        const response = buildEncodeResponse(latitude, longitude, parsedElevation, parsedTimestamp, geopin);
        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'ENCODING_ERROR'
        });
    }
};

/**
 * Encode coordinates to GeoPin - GET
 */
export const encodeCoordinatesGet = (req, res) => {
    try {
        const { latitude, longitude, elevation, timestamp } = req.query;
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['latitude', 'longitude'],
                optional: ['elevation', 'timestamp']
            });
        }

        if (!validateCoordinates(latitude, longitude)) {
            return res.status(400).json({
                error: 'Invalid coordinates',
                message: 'Coordinates must be valid WGS84 values'
            });
        }

        // Parse and validate elevation
        const parsedElevation = (elevation !== undefined && elevation !== null && elevation !== '') 
            ? parseFloat(elevation) : null;
        
        // Parse and validate timestamp
        const parsedTimestamp = (timestamp !== undefined && timestamp !== null && timestamp !== '') 
            ? parseInt(timestamp) : null;

        const geopin = encodeGeoPin(
            parseFloat(latitude), 
            parseFloat(longitude),
            parsedElevation,
            parsedTimestamp
        );

        const response = buildEncodeResponse(latitude, longitude, parsedElevation, parsedTimestamp, geopin);
        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'ENCODING_ERROR'
        });
    }
};

/**
 * Decode GeoPin to coordinates - POST
 */
export const decodeGeoPinPost = (req, res) => {
    try {
        const { geopin } = req.body;
        
        if (!geopin) {
            return res.status(400).json({
                error: 'Missing required parameter: geopin',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        if (!validateGeoPin(geopin)) {
            return res.status(400).json({
                error: 'Invalid GeoPin format',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        const result = decodeGeoPin(geopin);
        const response = buildDecodeResponse(geopin, result);
        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'DECODING_ERROR'
        });
    }
};

/**
 * Decode GeoPin to coordinates - GET
 */
export const decodeGeoPinGet = (req, res) => {
    try {
        const { geopin } = req.query;
        
        if (!geopin) {
            return res.status(400).json({
                error: 'Missing required parameter: geopin',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        if (!validateGeoPin(geopin)) {
            return res.status(400).json({
                error: 'Invalid GeoPin format',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        const result = decodeGeoPin(geopin);
        const response = buildDecodeResponse(geopin, result);
        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'DECODING_ERROR'
        });
    }
};

/**
 * Calculate distance between two GeoPins
 */
export const calculateDistanceBetweenGeoPins = (req, res) => {
    try {
        const { geopin1, geopin2 } = req.body;
        
        if (!geopin1 || !geopin2) {
            return res.status(400).json({
                error: 'Missing required parameters: geopin1, geopin2'
            });
        }

        if (!validateGeoPin(geopin1) || !validateGeoPin(geopin2)) {
            return res.status(400).json({
                error: 'Invalid GeoPin format',
                format: 'XXXX-XXXX-XXXX'
            });
        }

        const distance = calculateDistance(geopin1, geopin2);
        const response = buildDistanceResponse(geopin1, geopin2, distance);
        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'DISTANCE_ERROR'
        });
    }
};

/**
 * Batch processing endpoint
 */
export const batchProcess = (req, res) => {
    try {
        const { operation, data } = req.body;
        
        if (!operation || !data || !Array.isArray(data)) {
            return res.status(400).json({
                error: 'Invalid batch request',
                required: {
                    operation: 'encode|decode',
                    data: 'array of coordinates or geopins'
                }
            });
        }

        const results = [];
        const errors = [];

        data.forEach((item, index) => {
            try {
                if (operation === 'encode') {
                    const { latitude, longitude, elevation, timestamp } = item;
                    
                    const parsedElevation = (elevation !== undefined && elevation !== null && elevation !== '') ? parseFloat(elevation) : null;
                    const parsedTimestamp = (timestamp !== undefined && timestamp !== null && timestamp !== '') ? parseInt(timestamp) : null;
                    
                    const geopin = encodeGeoPin(
                        parseFloat(latitude), 
                        parseFloat(longitude),
                        parsedElevation,
                        parsedTimestamp
                    );
                    
                    const response = buildEncodeResponse(latitude, longitude, parsedElevation, parsedTimestamp, geopin);
                    results.push({ index, ...response });
                    
                } else if (operation === 'decode') {
                    const decoded = decodeGeoPin(item.geopin);
                    const response = buildDecodeResponse(item.geopin, decoded);
                    results.push({ index, ...response });
                }
            } catch (error) {
                errors.push({ index, error: error.message, input: item });
            }
        });

        res.json({
            operation,
            processed: data.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
            code: 'BATCH_ERROR'
        });
    }
};