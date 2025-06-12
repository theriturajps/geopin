import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import routes
import geoPinRoutes from './routes/geopin.routes.js';
import systemRoutes from './routes/system.routes.js';

// Import middleware
import { requestLogger } from './middleware/logging.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/', systemRoutes);
app.use('/api', geoPinRoutes);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

export default app;