const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🎭 ═══════════════════════════════════════════════════');
  console.log('🎭  DRAMADO API - Where Productivity Meets Drama!');
  console.log('🎭 ═══════════════════════════════════════════════════');
  console.log(`🚀  Server running in ${config.NODE_ENV} mode`);
  console.log(`📡  Listening on port ${PORT}`);
  console.log(`🌐  API URL: http://localhost:${PORT}`);
  console.log(`💻  Client URL: ${config.CLIENT_URL}`);
  console.log('🎭 ═══════════════════════════════════════════════════');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});
