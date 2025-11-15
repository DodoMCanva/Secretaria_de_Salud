const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeRabbitMQ } = require('./services/rabbitmq.service');
const errorHandler = require('../Middleware/errorHandler.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const accessRoutes = require('./routes/access.routes');
const profileRoutes = require('./routes/profile.routes');
const documentRoutes = require('./routes/document.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Medical App Backend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path 
  });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Initialize RabbitMQ and start server
const startServer = async () => {
  try {
    // Initialize RabbitMQ
    await initializeRabbitMQ();
    console.log('✓ RabbitMQ inicializado correctamente');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en puerto ${PORT}`);
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

startServer();

module.exports = app;
