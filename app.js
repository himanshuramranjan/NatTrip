const express = require('express');

const tourRouter = require('./routes/tourRoutes');

// Initialize the app
const app = express();

// Parse the data from body into req.body (with 10kb data limit)
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/tours', tourRouter);

module.exports = app;
