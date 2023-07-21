const moment = require("moment");
const validator = require("validator");
const { sendMailCompany } = require("./helpers");
const { schemaOptions } = require("./constants");

const phoneValidate = {
    message: 'The provided phone number is not valid',
    validator: (value) => {
        if (validator.isMobilePhone(value)) {
            return true;
        }
        return false;
    },
};

const emailValidate = {
    message: 'The provided email is not valid',
    validator: (value) => {
        if (validator.isEmail(value)) {
            return true;
        }
        return false;
    },
};

const getNow = () => moment();

const requiredError = (fieldName) => {
    const transformedName = fieldName[0].toUpperCase() + fieldName.substring(1);
    const message = `${transformedName} is required`;

    return message;
};

const formatData = (data) => 
{
    if (data) return { data }
    else 
    {
        throw new Error("Data not found");
    }
} 


module.exports = { 
    sendMailCompany, 
    schemaOptions, 
    phoneValidate, 
    emailValidate,
    getNow,
    requiredError,
    formatData 
};
