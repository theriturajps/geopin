import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes.js';

const app = express();

// Security and CORS configuration
app.use(cors({
    origin: '*', // Allow all origins for free public service
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'GeoPin Military-Grade API',
        version: '1.0.0',
        description: 'Advanced coordinate encoding system with military-grade precision',
        datum: 'WGS84',
        format: 'XXXX-XXXX-XXXX',
        endpoints: {
            encode: {
                get: '/api/encode?latitude=20.5937&longitude=78.9629',
                post: '/api/encode (body: {latitude, longitude})'
            },
            decode: {
                get: '/api/decode?geopin=QT7U-9P3B-ZRLL',
                post: '/api/decode (body: {geopin})'
            },
            validate: '/api/validate?geopin=QT7U-9P3B-ZRLL',
            precision: '/api/precision?geopin=QT7U-9P3B-ZRLL',
            health: '/api/health'
        },
        documentation: 'https://github.com/theriturajps/geopin#readme',
        creator: {
            name: 'Ritu Raj Pratap Singh',
            email: 'iamriturajps@gmail.com',
            github: 'https://github.com/theriturajps',
            linkedin: 'https://www.linkedin.com/in/iamriturajps',
            twitter: 'https://twitter.com/riturajps',
            instagram: 'https://instagram.com/riturajps',
            telegram: 'https://t.me/riturajps'
        },
    });
});

// API routes
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.path} was not found`,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET|POST /api/encode',
            'GET|POST /api/decode',
            'GET /api/validate',
            'GET /api/precision'
        ]
    });
});

export default app;