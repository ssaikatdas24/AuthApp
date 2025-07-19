const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 4000;

// body parser
app.use(express.json());
// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// connect to the database
const dbconnect = require("./config/database");
dbconnect.connect();

// route import and mounting
const userRoutes = require("./Routes/user");
app.use("/api/v1", userRoutes);

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});