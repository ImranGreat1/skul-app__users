const { APIError } = require("./app-errors");
const { ERROR_NAMES, STATUS_CODES } = require("./constants");

const sendErrorDev = (err, req, res) =>
{
    const statusCode = err.statusCode === 11000 ? 400 : err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        statusCode,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, req, res) => 
{
    if (err.isOperational) 
    {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
    });
};

const handleCastErrorDB = (err) => 
{
    const message = `Invalid "${err.path}" field: ${err.value}`;
    return new APIError(ERROR_NAMES.INTERNAL_ERROR, STATUS_CODES.INTERNAL_ERROR, message, true);
};


const handleValidationErrorDB = (err) => 
{
    const msg = Object.values(err.errors).map(
        (errorObj) => errorObj.message
    );
    const message = `Validation error: ${msg.join('. ')}`;

    return new APIError(ERROR_NAMES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, message, true);
};


const handleDuplicateKeyErrorDB = (err) => 
{
    const field = Object.keys(err.keyValue).join('');
    const message = `Duplicates error: ${field}`;

    return new APIError(ERROR_NAMES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, message, true);
};

const handleInvalidJWTError = () => 
{
    return new APIError(ERROR_NAMES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, 'Invalid token! Please login again', true);
}
    

const handleJWTExpiredError = () =>
{
    return new APIError(ERROR_NAMES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, 'Your token has expired! Please login again', true);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, next) => 
{
    let error = {  };
    error.message = err.message;
    error.statusCode = err.code || err.statusCode || 500;
    error.name = err.name;
    error.stack = err.stack;

    if (process.env.NODE_ENV === 'development') {
        //
        sendErrorDev(error, req, res);
        //
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleInvalidJWTError();

        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};

module.exports = errorHandler;
