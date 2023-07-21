const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => 
{
    try 
    {
        mongoose.set('strictQuery', false);
        await mongoose.connect(DB_URL, {});

        console.log("DB Connected!");
    } 
    catch (error) 
    {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }
} 