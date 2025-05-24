// Updated server.js file to fix potential duplicate server issues

const app = require('./app');
const http = require('http');
const setupSocket = require('./socketSetup');

// Create HTTP server (instead of just Express)
const server = http.createServer(app);

// Set up Socket.io with the http server
const io = setupSocket(server);

// Graceful shutdown handling
function handleShutdown() {
  try {
    // Increment shutdown counter
    const promClient = require('prom-client');
    const register = promClient.register || promClient.Registry.globalRegistry;
    const counter = register.getSingleMetric('podnex_server_shutdowns_total');
    if (counter) counter.inc();
  } catch (e) {
    console.error('Error incrementing shutdown counter:', e);
  }
  console.log('Server shutting down gracefully...');
  process.exit(0);
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

// Use server.listen, not app.listen
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));

// IMPORTANT: Do not use app.listen when using http.createServer
// as it would create a duplicate server instance