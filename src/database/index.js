const connection = require("./connection");
const UsersRepository = require("./repository/users-repository");

const databaseConnection = connection;

module.exports = { databaseConnection, UsersRepository };