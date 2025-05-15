const app = require('./app');
const http = require('http');
const setupSocket = require('./socketSetup');

// Create HTTP server (instead of just Express)
const server = http.createServer(app);

// Set up Socket.io after your database connection
const io = setupSocket(server);

// ONLY use server.listen, not app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// REMOVE THIS LINE - it creates a duplicate server instance
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));