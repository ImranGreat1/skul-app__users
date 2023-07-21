const { STATUS_CODES, ERROR_NAMES } = require("./constants");


class AppError extends Error 
{
    constructor(name, statusCode, message, isOperational, errorStack ) 
    {
        super();
        Object.setPrototypeOf(this,new.target.prototype);
        this.name = name;
        this.statusCode = statusCode; 
        this.message = message;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        Error.captureStackTrace(this);
    }
}


// API specific errors
class APIError extends AppError
{
    constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, message = ERROR_NAMES.INTERNAL_ERROR, isOperational = true, errorStack) 
    {
        super(name, statusCode, message, isOperational)
    }
}


class BadRequestError extends AppError 
{
    constructor(message = ERROR_NAMES.BAD_REQUEST) 
    {
        super(ERROR_NAMES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, message, true)
    }

    
}


class NotFoundError extends AppError 
{
    constructor(message = ERROR_NAMES.NOT_FOUND) 
    {
        super(ERROR_NAMES.NOT_FOUND, STATUS_CODES.NOT_FOUND, message, true)
    }
}


class UnAuthorizedError extends AppError 
{
    constructor(message = ERROR_NAMES.UN_AUTHORISED) 
    {
        super(ERROR_NAMES.UN_AUTHORISED, STATUS_CODES.UN_AUTHORISED, message, true)
    }
}


class ValidationError extends AppError
{
    constructor(message = ERROR_NAMES.UN_AUTHORISED) 
    {
        super(ERROR_NAMES.UN_AUTHORISED, STATUS_CODES.UN_AUTHORISED, message, true)
    }
}


module.exports = { APIError, BadRequestError, NotFoundError, ValidationError, UnAuthorizedError };