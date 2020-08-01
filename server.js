const express = require("express");
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser')

// Environment Varibale
require('dotenv').config({path:"./config/keys.env"})



// Tells Express to set handlebars as its template engine.
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Parse Application
app.use(bodyParser.urlencoded({ extended: false }))


// Static files intialisation
app.use(express.static("public"));



// Load Each controller
const generalContoller = require("./controllers/general")
const userController = require("./controllers/user")

// map each controller to the app object 
app.use("/",generalContoller)
app.use("/user",userController)



// Web Server 
const PORT = process.env.PORT 
app.listen(PORT , ()=>{
    console.log("Server is running.");
})