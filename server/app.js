const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');
const podMembersRoutes = require('./routes/podMembers'); 
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register the auth routes first
app.use('/api/auth', authRoutes);

// Register application routes
app.use('/api/applications', applicationRoutes);

// Register creator routes to handle creator-specific endpoints
app.use('/api/creator', creatorRoutes);

// IMPORTANT: Register pod member routes BEFORE the general pod routes
// This is because the /user-memberships endpoint needs to be matched
// before any /:podId wildcard route
app.use('/api/pods', podMembersRoutes);

// Register general pod routes
app.use('/api/pods', podRoutes);

module.exports = app;