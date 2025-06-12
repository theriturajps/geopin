import express from 'express';

const router = express.Router();

// Root endpoint with API information
router.get('/', (req, res) => {
    res.json({
        name: 'GeoPin API',
        version: '1.0.0',
        description: 'World\'s Most Advanced Coordinate Encoding System',
        features: [
            'Military-grade precision',
            'Global WGS84 coverage', 
            'Sub-meter accuracy',
            '2D/3D/4D coordinate support',
            'Offline/Online compatibility'
        ],
        format: 'XXXX-XXXX-XXXX',
        dimensions: '2D/3D/4D',
        endpoints: {
            encode: '/api/encode',
            decode: '/api/decode', 
            distance: '/api/distance',
            batch: '/api/batch',
            health: '/health'
        },
        documentation: 'https://github.com/theriturajps/geopin',
        creator: {
            name: 'Ritu Raj Pratap Singh',
            github: 'https://github.com/theriturajps',
            linkedin: 'https://www.linkedin.com/in/iamriturajps'
        }
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
        },
        version: '1.0.0',
        precision: 'military-grade'
    });
});

export default router;