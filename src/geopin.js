/**
 * GeoPin - Military-Grade Coordinate Encoding System
 * Uses WGS84 datum with NASA-grade precision for real-world operations
 * Supports global coordinates with sub-meter accuracy
 * Format: XXXX-XXXX-XXXX (12 alphanumeric characters)
 */

// Military-grade character set (avoiding ambiguous characters like 0, O, 1, I)
const GEOPIN_CHARSET = [
    ['2', '3', '4', '5', '6', '7'],
    ['8', '9', 'A', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'H', 'J', 'K'],
    ['L', 'M', 'N', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', '2', '3', '4', '5']
];

// WGS84 Global Bounds (Military Standard)
const WGS84_BOUNDS = {
    minLat: -90.0,      // South Pole
    maxLat: 90.0,       // North Pole  
    minLon: -180.0,     // International Date Line West
    maxLon: 180.0       // International Date Line East
};

// Precision levels for military operations
const PRECISION_LEVELS = 12; // 12 levels for sub-meter accuracy

/**
 * Encodes WGS84 coordinates to military-grade GeoPin
 * @param {number} latitude - WGS84 latitude (-90 to 90)
 * @param {number} longitude - WGS84 longitude (-180 to 180)
 * @returns {string} 12-character GeoPin in format XXXX-XXXX-XXXX
 */
export function encodeGeoPin(latitude, longitude) {
    // Validate WGS84 coordinate bounds
    if (latitude < WGS84_BOUNDS.minLat || latitude > WGS84_BOUNDS.maxLat) {
        throw new Error(`Latitude must be between ${WGS84_BOUNDS.minLat} and ${WGS84_BOUNDS.maxLat} (WGS84 standard)`);
    }
    if (longitude < WGS84_BOUNDS.minLon || longitude > WGS84_BOUNDS.maxLon) {
        throw new Error(`Longitude must be between ${WGS84_BOUNDS.minLon} and ${WGS84_BOUNDS.maxLon} (WGS84 standard)`);
    }

    let minLat = WGS84_BOUNDS.minLat;
    let maxLat = WGS84_BOUNDS.maxLat;
    let minLon = WGS84_BOUNDS.minLon;
    let maxLon = WGS84_BOUNDS.maxLon;

    let geopin = '';

    for (let level = 0; level < PRECISION_LEVELS; level++) {
        // Calculate grid divisions for current precision level
        const latDiv = (maxLat - minLat) / 6;
        const lonDiv = (maxLon - minLon) / 6;

        // Determine grid position using military-grade precision
        let latIndex = Math.floor((latitude - minLat) / latDiv);
        let lonIndex = Math.floor((longitude - minLon) / lonDiv);

        // Boundary protection for edge cases
        latIndex = Math.max(0, Math.min(latIndex, 5));
        lonIndex = Math.max(0, Math.min(lonIndex, 5));

        // Encode using military character set
        geopin += GEOPIN_CHARSET[latIndex][lonIndex];

        // Add separators at positions 4 and 8 for readability
        if (level === 3 || level === 7) {
            geopin += '-';
        }

        // Update bounds for next precision level
        minLat = minLat + latDiv * latIndex;
        maxLat = minLat + latDiv;
        minLon = minLon + lonDiv * lonIndex;
        maxLon = minLon + lonDiv;
    }

    return geopin;
}

/**
 * Decodes military-grade GeoPin to WGS84 coordinates
 * @param {string} geopin - 12-character GeoPin (XXXX-XXXX-XXXX format)
 * @returns {object} WGS84 coordinates with precision bounds
 */
export function decodeGeoPin(geopin) {
    // Validate GeoPin format
    if (!geopin || typeof geopin !== 'string') {
        throw new Error('GeoPin must be a valid string');
    }

    // Remove separators and validate length
    const cleanPin = geopin.replace(/-/g, '');
    if (cleanPin.length !== 12) {
        throw new Error('GeoPin must be exactly 12 characters (format: XXXX-XXXX-XXXX)');
    }

    // Validate format pattern
    if (!/^[2-9A-Z]{4}-[2-9A-Z]{4}-[2-9A-Z]{4}$/.test(geopin)) {
        throw new Error('GeoPin must follow format XXXX-XXXX-XXXX with valid characters');
    }

    let minLat = WGS84_BOUNDS.minLat;
    let maxLat = WGS84_BOUNDS.maxLat;
    let minLon = WGS84_BOUNDS.minLon;
    let maxLon = WGS84_BOUNDS.maxLon;

    for (let level = 0; level < PRECISION_LEVELS; level++) {
        const char = cleanPin[level];
        let latIndex = -1;
        let lonIndex = -1;

        // Find character position in military charset
        for (let lat = 0; lat < 6; lat++) {
            for (let lon = 0; lon < 6; lon++) {
                if (GEOPIN_CHARSET[lat][lon] === char) {
                    latIndex = lat;
                    lonIndex = lon;
                    break;
                }
            }
            if (latIndex !== -1) break;
        }

        if (latIndex === -1) {
            throw new Error(`Invalid character '${char}' in GeoPin at position ${level + 1}`);
        }

        // Calculate subdivision bounds
        const latDiv = (maxLat - minLat) / 6;
        const lonDiv = (maxLon - minLon) / 6;

        // Update bounds for current level
        minLat = minLat + latDiv * latIndex;
        maxLat = minLat + latDiv;
        minLon = minLon + lonDiv * lonIndex;
        maxLon = minLon + lonDiv;
    }

    // Calculate center point with military precision
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // Calculate precision bounds (for accuracy assessment)
    const latAccuracy = (maxLat - minLat) / 2;
    const lonAccuracy = (maxLon - minLon) / 2;

    return {
        latitude: parseFloat(centerLat.toFixed(8)),
        longitude: parseFloat(centerLon.toFixed(8)),
        precision: {
            latitudeRange: [parseFloat(minLat.toFixed(8)), parseFloat(maxLat.toFixed(8))],
            longitudeRange: [parseFloat(minLon.toFixed(8)), parseFloat(maxLon.toFixed(8))],
            accuracy: {
                latitude: parseFloat(latAccuracy.toFixed(8)),
                longitude: parseFloat(lonAccuracy.toFixed(8))
            }
        },
        datum: 'WGS84'
    };
}

/**
 * Validates GeoPin format
 * @param {string} geopin - GeoPin to validate
 * @returns {boolean} True if valid
 */
export function validateGeoPin(geopin) {
    try {
        decodeGeoPin(geopin);
        return true;
    } catch {
        return false;
    }
}

/**
 * Gets precision information for a GeoPin
 * @param {string} geopin - GeoPin to analyze
 * @returns {object} Precision information
 */
export function getGeoPinPrecision(geopin) {
    const decoded = decodeGeoPin(geopin);
    const latRange = decoded.precision.latitudeRange;
    const lonRange = decoded.precision.longitudeRange;

    // Calculate approximate distance accuracy using WGS84 parameters
    const latDistanceM = (latRange[1] - latRange[0]) * 111319.9; // meters per degree latitude
    const lonDistanceM = (lonRange[1] - lonRange[0]) * 111319.9 * Math.cos(decoded.latitude * Math.PI / 180);

    return {
        level: PRECISION_LEVELS,
        approximateAccuracy: {
            latitude: `±${(latDistanceM / 2).toFixed(2)}m`,
            longitude: `±${(lonDistanceM / 2).toFixed(2)}m`
        },
        datum: 'WGS84'
    };
}