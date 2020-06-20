const express = require("express");
const exphbs  = require('express-handlebars');
const app = express();
const PORT = 3000;

const CategoryDB = require("./models/product-category");


// Tells Express to set handlebars as its template engine.

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static("public"));

const fakeDB = new CategoryDB();


app.get("/",(req,res)=>{
    res.render("index",{
        title : "Home",
        products : fakeDB.getProduct()
    })
})


// Web Server 

app.listen(PORT , ()=>{
    console.log("Server is running.");
})