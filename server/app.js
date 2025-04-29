const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const podRoutes = require('./routes/pods');
const applicationRoutes = require('./routes/applications');


connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/pods', podRoutes);
app.use('/api/applications', applicationRoutes);



app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;
