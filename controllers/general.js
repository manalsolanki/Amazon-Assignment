const express = require('express')
const router = express.Router()

const CategoryDB = require("../models/product-category");
const ProductDB = require("../models/product-list");

// Object of Category List
const fakeCategoryDB = new CategoryDB();
// object of Product list
const fakeProductDB = new ProductDB();

// This calls the home page.
router.get("/",(req,res)=>{
    res.render("index",{
        title : "Home",
        products : fakeCategoryDB.getProduct(),
        bestsellers : fakeProductDB.getfeaturedproduct()
    })
})

// This calls the Product List page.

router.get("/product",(req,res)=>{
    res.render("product",{
        title : "Product",
        products : fakeProductDB.getproductdetails()
    })
})

// This calls the Dashboard 
const renderDashboard = (req,res)=>{
    res.render("dashboard", {
        title : "Welcome Page",  
    })
}


router.get('/dashboard',renderDashboard)
module.exports=router