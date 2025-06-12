import { WGS84_BOUNDS, GEOPIN_CHARSET } from '../core/geopin.core.js';

/**
 * Validate WGS84 coordinates
 */
export function validateCoordinates(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    return (
        !isNaN(latitude) && 
        !isNaN(longitude) &&
        latitude >= WGS84_BOUNDS.minLat && 
        latitude <= WGS84_BOUNDS.maxLat &&
        longitude >= WGS84_BOUNDS.minLon && 
        longitude <= WGS84_BOUNDS.maxLon
    );
}

/**
 * Validate GeoPin format
 */
export function validateGeoPin(geopin) {
    if (!geopin || typeof geopin !== 'string') {
        return false;
    }
    
    const cleanPin = geopin.replace(/-/g, '').toUpperCase();
    
    return (
        cleanPin.length === 12 &&
        /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/.test(cleanPin)
    );
}

/**
 * Validate elevation value
 */
export function validateElevation(elevation) {
    if (elevation === null || elevation === undefined) {
        return true; // Optional parameter
    }
    
    const elev = parseFloat(elevation);
    return !isNaN(elev) && elev >= WGS84_BOUNDS.minElevation && elev <= WGS84_BOUNDS.maxElevation;
}

/**
 * Validate timestamp value
 */
export function validateTimestamp(timestamp) {
    if (timestamp === null || timestamp === undefined) {
        return true; // Optional parameter
    }
    
    const ts = parseInt(timestamp);
    return !isNaN(ts) && ts > 0;
}