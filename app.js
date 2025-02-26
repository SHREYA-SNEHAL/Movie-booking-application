const express = require('express');

//for EJS
const path=require("path");
//Define Routes
const registerRouter=require("./userRoutes");

const cookieParser=require('cookie-parser');

const app = express();
const PORT=8000;

//SET EJS view engine
app.set("view engine","ejs");//Set EJS as the view engine
app.set("views",path.resolve("./views"));


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Middleware to parse JSON bodies
app.use(express.json());
// Use the user routes
app.use('/auth', registerRouter);



// Start the server
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
