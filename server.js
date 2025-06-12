import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('\n🌍 GeoPin Military-Grade API Server');
    console.log('=============================================================');
    console.log('\n📡 API Endpoints:');
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Encode:       http://localhost:${PORT}/api/encode`);
    console.log(`   Decode:       http://localhost:${PORT}/api/decode`);
    console.log(`   Validate:     http://localhost:${PORT}/api/validate`);
    console.log(`   Precision:    http://localhost:${PORT}/api/precision`);
    console.log('\n🔧 Ready for military, scientific, and commercial use\n');
    console.log('=============================================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT received, shutting down gracefully...');
    process.exit(0);
});