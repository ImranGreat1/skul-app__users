const express = require("express");
const cors = require("cors");
const errorHandler = require("./utils/error-handler");
const { users } = require("./api");

const expressApp = (app) => 
{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    users(app);

    app.use(errorHandler);
}


module.exports = expressApp;
 
