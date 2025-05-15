const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');
const podMembersRoutes = require('./routes/podMembers'); 
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const messageRoutes = require('./routes/messageRoutes'); // New route
const taskRoutes = require('./routes/taskRoutes'); // New route
const milestoneRoutes = require('./routes/milestoneRoutes'); // New route
const resourceRoutes = require('./routes/resourceRoutes');


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

module.exports = app;