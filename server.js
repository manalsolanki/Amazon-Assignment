const express = require("express");
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


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

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Database is connect")
})

// Web Server 
const PORT = process.env.PORT 
app.listen(PORT , ()=>{
    console.log("Server is running.");
})