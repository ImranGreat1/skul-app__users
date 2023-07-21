const dotEnv = require("dotenv");


if (process.env.NODE_ENV !== "production")
{
    const configFile = `./.env.${process.env.NODE_ENV}`;
    dotEnv.config({ path: configFile });
}
else 
{
    dotEnv.config();
}


module.exports = {
    DB_URL: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_SECRET: process.env.JWT_SECRET,
    COMPANY_EMAIL: process.env.COMPANY_EMAIL,
    COMPANY_EMAIL_PASS: process.env.COMPANY_EMAIL_PASS,
    BASE_URL: process.env.BASE_URL
};