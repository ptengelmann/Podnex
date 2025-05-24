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
const messageRoutes = require('./routes/messageRoutes'); // New route
const taskRoutes = require('./routes/taskRoutes'); // New route
const milestoneRoutes = require('./routes/milestoneRoutes'); // New route
const resourceRoutes = require('./routes/resourceRoutes');
const promClient = require('prom-client');

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

// Register application routes
app.use('/api/applications', applicationRoutes);

// Register creator routes to handle creator-specific endpoints
app.use('/api/creator', creatorRoutes);

// Register message routes
app.use('/api/messages', messageRoutes); // Add message routes

// IMPORTANT: Register pod member routes BEFORE the general pod routes
// This is because the /user-memberships endpoint needs to be matched
// before any /:podId wildcard route
app.use('/api/pods', podMembersRoutes);


// Register pod task and milestone routes
app.use('/api/pods', taskRoutes); // Add task routes
app.use('/api/pods', milestoneRoutes); // Add milestone routes
app.use('/api/pods', resourceRoutes);

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

module.exports = app;