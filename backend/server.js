/**
 * AirBloom Tracker Backend Server
 * Secure API for fetching IoT sensor data from ThingSpeak
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const dataRoutes = require('./routes/dataRoutes');

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/data', dataRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AirBloom Tracker Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/data/health',
      latest: '/api/data/latest',
      history: '/api/data/history?count=20',
      channelInfo: '/api/data/channel-info'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 AirBloom Tracker Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log('\n📋 Available Endpoints:');
  console.log(`   GET  /api/data/health       - Health check`);
  console.log(`   GET  /api/data/latest       - Latest reading`);
  console.log(`   GET  /api/data/history      - Historical data`);
  console.log(`   GET  /api/data/channel-info - Channel info`);
  console.log('='.repeat(50));
  console.log('\n✅ Server is ready to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
