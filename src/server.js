const express = require("express");
const { PORT } = require("./config/index");
const { databaseConnection } = require("./database/index");
const expressApp = require("./express-app");


const startServer = async () => 
{
    const app = express()

    await databaseConnection();

    await expressApp(app);

    app.get("/", (req, res, next) => 
    {
        res.send({ greetings: "Hello from users" });
    });

    app.listen(PORT, () => console.log("Users server started..."))
    .on("error", (err) => 
    {
        console.log(err);
        process.exit();
    })
}

startServer();
