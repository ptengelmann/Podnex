// Updated server.js file to fix potential duplicate server issues

const app = require('./app');
const http = require('http');
const setupSocket = require('./socketSetup');

// Create HTTP server (instead of just Express)
const server = http.createServer(app);

// Set up Socket.io with the http server
const io = setupSocket(server);

// Use server.listen, not app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// IMPORTANT: Do not use app.listen when using http.createServer
// as it would create a duplicate server instance