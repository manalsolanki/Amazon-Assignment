const express = require("express");
const exphbs  = require('express-handlebars');
const app = express();
const PORT = 3000;

const CategoryDB = require("./models/product-category");
const ProductDB = require("./models/product-list");



// Tells Express to set handlebars as its template engine.
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Static files intialisation
app.use(express.static("public"));


// Object of Category List
const fakeCategoryDB = new CategoryDB();
// object of Product list
const fakeProductDB = new ProductDB();



// This calls the home page.
app.get("/",(req,res)=>{
    res.render("index",{
        title : "Home",
        products : fakeCategoryDB.getProduct(),
        bestsellers : fakeProductDB.getfeaturedproduct()
    })
})



// This calls the Product List page.

app.get("/product",(req,res)=>{
    res.render("product",{
        title : "Product",
        products : fakeProductDB.getproductdetails()
    })
})



// This calls the login Page

app.get("/login",(req,res)=>{
    res.render("login",{
        title:"Login"
    })

})



// This calls the Sign Up
app.get("/sign-up",(req,res)=>{
    res.render("sign-up",{
        title:"Sign-Up"
    })

})


// Web Server 
app.listen(PORT , ()=>{
    console.log("Server is running.");
})