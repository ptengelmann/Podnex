const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');
const podMembersRoutes = require('./routes/podMembers'); 
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const messageRoutes = require('./routes/messageRoutes');
const taskRoutes = require('./routes/taskRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const promClient = require('prom-client');
const profileRoutes = require('./routes/profileRoutes');

// Log environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

// Create upload directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/profiles'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

connectDB();

const app = express();

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Counter for server starts
const serverStartCounter = new promClient.Counter({
  name: 'podnex_server_starts_total',
  help: 'Total number of times the server has started',
});
register.registerMetric(serverStartCounter);

// Counter for graceful shutdowns
const serverShutdownCounter = new promClient.Counter({
  name: 'podnex_server_shutdowns_total',
  help: 'Total number of times the server has shut down gracefully',
});
register.registerMetric(serverShutdownCounter);

// Increment server start counter on startup
serverStartCounter.inc();
console.debug('>Server started, incrementing start counter');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register the auth routes first
app.use('/api/auth', authRoutes);
// Add this near the top of your middleware configuration
app.use('/uploads', express.static('uploads'));

// Direct test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Direct test route works!',
    time: new Date().toISOString()
  });
});

// Add a debug endpoint for auth testing
app.get('/api/auth-test', (req, res) => {
  const token = req.headers.authorization;
  res.json({
    message: 'Auth test endpoint',
    headersReceived: req.headers,
    authorizationHeader: token,
    time: new Date().toISOString()
  });
});

// Register application routes
app.use('/api/applications', applicationRoutes);

// Register creator routes to handle creator-specific endpoints
app.use('/api/creator', creatorRoutes);

// Register message routes
app.use('/api/messages', messageRoutes);

// IMPORTANT: Register pod member routes BEFORE the general pod routes
app.use('/api/pods', podMembersRoutes);

// Register pod task and milestone routes
app.use('/api/pods', taskRoutes);
app.use('/api/pods', milestoneRoutes);
app.use('/api/pods', resourceRoutes);

// Register profile routes
console.log('Registering profile routes...');
app.use('/api/profile', profileRoutes);
console.log('Profile routes registered successfully');

// Register general pod routes
app.use('/api/pods', podRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Expose /metrics endpoint for Prometheus/Grafana
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Add a test to see all registered routes (fixed to avoid crash)
console.log('Listing all registered routes:');
setTimeout(() => {
  if (app._router && app._router.stack) {
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        console.log('Direct route:', r.route.path);
      } else if (r.name === 'router') {
        console.log('Router mounted:', r.regexp.toString());
      }
    });
  } else {
    console.log('Router not initialized yet or structure changed');
  }
}, 1000);


module.exports = app;