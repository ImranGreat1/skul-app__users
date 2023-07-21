const { UnAuthorizedError } = require("../../utils/app-errors");
const { promisifyJwtVerify } = require("../../utils/helpers");
const { JWT_SECRET } = require("../../config");
const { catchAsync } = require("../../utils/helpers");
const { User } = require("../../database/models");



const protect = catchAsync(async (req, res, next) => 
{
    // check if token exist
    let token;
    const headers = req.headers;

    if (headers && headers.authorization && headers.authorization.startsWith("Bearer"))
    {
        token = headers.authorization?.split(" ")[1];
    }

    if (!token) next(new UnAuthorizedError("Please log in to get access"));


    // Verify token
    const decoded = await promisifyJwtVerify(token, JWT_SECRET);
    

    // Check if user still exist
    const user = await User.findById(decoded.id);
    if (!user) next(new UnAuthorizedError("The user belonging to this token does no longer exist"));


    // Check if user changed password after the token was issued
    if (user?.passwordChangedAfter(decoded.iat)) next(new UnAuthorizedError("Please log in again! Password has been changed recently"));

    
    // req.user = user;
    res.locals.user = user;

    next();
});


module.exports = { protect };