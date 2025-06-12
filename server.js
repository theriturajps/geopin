import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🌍 GeoPin API Server running on port ${PORT}`);
    console.log(`📍 Military-grade coordinate encoding system operational`);
    console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

export default app;