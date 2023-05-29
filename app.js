const express = require('express');

const tourRouter = require('./routes/tourRoutes');

// Initialize the app
const app = express();

app.use('/api/v1/nattrip', tourRouter);

module.exports = app;
