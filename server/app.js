const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/pods', podRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

// Serve static assets from the public folder
console.log('Public folder path:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// API 404 handler - with named parameter as required by Express v5
app.use('/api/*apiPath', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.originalUrl}`
  });
});

// Single route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route with named parameter (required in Express v5)
// Use *pagePath format instead of * wildcard
app.get('*pagePath', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error serving application');
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;
