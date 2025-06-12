// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        code: 'SERVER_ERROR'
    });
};

// 404 handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET|POST /api/encode',
            'GET|POST /api/decode',
            'POST /api/distance',
            'POST /api/batch',
            'GET /health'
        ]
    });
};