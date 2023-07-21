const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


const signToken = (id, expiryTime) => 
{
    const token = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: expiryTime
    });

    return token;
}


const decodeToken = (token) => 
{
    return new Promise((resolve, reject) => 
    {
        try 
        {
            const decoded = jwt.verify(
                token,
                JWT_SECRET
            );
            resolve(decoded);
        } 
        catch (err) 
        {
            reject(err);
        }
    })
}


module.exports = { signToken, decodeToken };