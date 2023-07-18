    const mongoose = require("mongoose");

    const connectionString = process.env.CONNECTION_STRING;

    mongoose
    .connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log("Database is connected dude ! "))
    .catch((error) => console.log(error));
