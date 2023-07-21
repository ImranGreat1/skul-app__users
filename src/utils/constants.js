const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    FORBIDEEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}


const ERROR_NAMES = {
    INTERNAL_ERROR: "Internal Server Error",
    BAD_REQUEST: "Bad request",
    UN_AUTHORISED: "Validation Error",
    NOT_FOUND: "404 Error: Not Found"
}


const RESPONSES = {
    ERROR: "error",
    SUCCESS: "success"
}


const schemaOptions = {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
};


module.exports = { STATUS_CODES, ERROR_NAMES, RESPONSES, schemaOptions };