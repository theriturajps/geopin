export function buildEncodeResponse(latitude, longitude, elevation, timestamp, geopin) {
    const response = {
        geopin,
        coordinates: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        },
        precision: 'sub-meter',
        format: 'XXXX-XXXX-XXXX',
        dimensions: '2D'
    };

    // Only include elevation if provided and valid
    if (elevation !== null && elevation !== undefined && !isNaN(elevation)) {
        response.coordinates.elevation = parseFloat(elevation);
        response.dimensions = '3D';
    }

    // Only include timestamp if provided and valid
    if (timestamp !== null && timestamp !== undefined && !isNaN(timestamp)) {
        response.coordinates.timestamp = parseInt(timestamp);
        response.dimensions = response.dimensions === '3D' ? '4D' : '3D (temporal)';
    }

    return response;
}


export function buildDecodeResponse(geopin, result) {
    return {
        geopin,
        coordinates: {
            latitude: result.latitude,
            longitude: result.longitude
        },
        precision: result.precision,
        bounds: result.bounds,
        accuracy: 'military-grade',
        dimensions: '2D'
    };
}

export function buildDistanceResponse(geopin1, geopin2, distance) {
    return {
        geopin1,
        geopin2,
        distance: {
            meters: Math.round(distance * 100) / 100,
            kilometers: Math.round(distance / 10) / 100,
            miles: Math.round(distance / 1609.344 * 100) / 100,
            nauticalMiles: Math.round(distance / 1852 * 100) / 100
        },
        precision: 'WGS84-compliant'
    };
}