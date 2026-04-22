// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const guestRoutes = require('./src/routes/guestRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// 1. Connect to database
connectDB();

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/bookings', bookingRoutes);

// 3. Config
const PORT = process.env.PORT || 3000;
const BASE_URI = process.env.BASE_URI || '/api/v1';

// 4. Routes
const apiRoutes = require('./src/routes/apiRoutes');
app.use(BASE_URI, apiRoutes); // ✅ use BASE_URI here
app.use('/guests', guestRoutes);
app.use('/bookings', bookingRoutes);

// 5. Start server
// ONLY start the server if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
app.listen(process.env.PORT || 3000, () => {
console.log(`Server running on port ${process.env.PORT}`);
});
}

module.exports = app; // Export the app for testing
