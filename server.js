const express = require("express");
const errorHandler = require("./middleware/errorHandler.js");
const connectDB = require("./config/dbConnection.js");

const dotenv = require("dotenv").config();

connectDB();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(errorHandler)

app.use("/api/contacts", require("./routes/contactRoutes.js"));

app.use("/api/users", require("./routes/userRoutes.js"));


app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})