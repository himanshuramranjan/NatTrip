// handles the error globally
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
}