// Updated server.js file to fix potential duplicate server issues

const app = require('./app');
const http = require('http');
const setupSocket = require('./socketSetup');

// Create HTTP server (instead of just Express)
const server = http.createServer(app);

// Set up Socket.io with the http server
const io = setupSocket(server);

// Updated shutdown handler without prom-client dependency
function handleShutdown() {
  console.log('Server shutting down gracefully...');
  
  // Close the server
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  
  // Force close after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

// Use server.listen, not app.listen
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));

// IMPORTANT: Do not use app.listen when using http.createServer
// as it would create a duplicate server instance