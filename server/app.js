const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');
const podMembersRoutes = require('./routes/podMembers'); 
const authRoutes = require('./routes/authRoutes');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// IMPORTANT: Route order matters in Express!
// Register the auth routes first
app.use('/api/auth', authRoutes);

// Register application routes
app.use('/api/applications', applicationRoutes);

// The critical change: Create a separate route for creator-pods to avoid conflicts
app.use('/api/creator', require('./routes/creatorRoutes'));

// Register pod routes 
app.use('/api/pods', podRoutes);

// Register pod member routes - these should always come AFTER the general pod routes
app.use('/api/pods', podMembersRoutes);

module.exports = app;