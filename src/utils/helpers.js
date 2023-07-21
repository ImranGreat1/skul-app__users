const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { COMPANY_EMAIL, COMPANY_EMAIL_PASS } = require("../config");


const createTransport = async (user, password, service = "gmail") => 
{
    const transport = nodemailer.createTransport({
        service,
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user, pass: password },
        tls: {
            rejectUnauthorized: false
        }  
    });

    return transport;
}


const sendMailCompany = async (to, subject, text) => 
{
    const transport = await createTransport(COMPANY_EMAIL, COMPANY_EMAIL_PASS);

    const mailOptions = {
        from: COMPANY_EMAIL,
        to,
        subject,
        text
    }

    const response = await transport.sendMail(mailOptions);

    return response;
}


const promisifyJwtVerify = (token, JWT_SECRET) => 
{
   return new Promise((resolve, reject) => 
   {
       jwt.verify(token, JWT_SECRET, (error, data) => 
       {
           if (error) return reject(error);

           resolve(data);
       })
   })
}


const catchAsync = (func) => 
{
    return (req, res, next) => 
    {
        func(req, res, next).catch(next);
    };
}



module.exports = { sendMailCompany, promisifyJwtVerify, catchAsync }

