const express = require("express");
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');


'use strict';

// Environment Varibale
require('dotenv').config({path:"./config/keys.env"})



// Tells Express to set handlebars as its template engine.
app.engine("handlebars",exphbs(
    {
        helpers:{
            if_eq  : function(v1,v2){
                return v1===v2 ? 'selected' : '' ;
            },

            if_checked : function(v1,v2){
                return v1===v2 ? 'checked': '';
            }
        }
    }
));
app.set('view engine', 'handlebars');


// Parse Application
app.use(bodyParser.urlencoded({ extended: false }))


// Static files intialisation
app.use(express.static("public"));


// File upload
app.use(fileUpload());


// Load Each controller
const generalContoller = require("./controllers/general")
const userController = require("./controllers/user")
const productController=require("./controllers/product")


// This is to allow specific forms and/links  that were submiited/pressed to send PUT and DELETE request.
app.use((req,res,next)=>{
    if (req.query.method=="PUT")
    {
        req.method="PUT"
    }
    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }
    next();
})


// map each controller to the app object 
app.use("/",generalContoller)
app.use("/user",userController)
app.use("/product",productController)

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Database is connect")
})

// Web Server 
const PORT = process.env.PORT 
app.listen(PORT , ()=>{
    console.log("Server is running.");
})