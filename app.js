const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

// Initialize the app
const app = express();

// Parse the data from body into req.body (with 10kb data limit)
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/nattrip/tours', tourRouter);
app.use('/api/v1/nattrip/users', userRouter);
app.use('/api/v1/nattrip/reviews', reviewRouter);
app.use('/api/v1/nattrip/bookings', bookingRouter);

// Handle any undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`The ${req.originalUrl} is not defined`, 404));
})

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
