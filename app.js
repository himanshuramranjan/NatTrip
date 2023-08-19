const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

// Initialize the app
const app = express();

// define max api req (to max 100 req / hour from a given IP)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in 1 hour' 
});

// Middleware

// set security http headers
app.use(helmet());

// limits the api request
app.use('/api', limiter);

// Parse the data from body into req.body (with 10kb data limit)
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xssClean());

// prevent http parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'difficulty', 'maxGroupSize', 'price']
}));

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
