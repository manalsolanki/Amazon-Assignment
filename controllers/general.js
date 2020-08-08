const express = require('express')
const router = express.Router()

const productModel = require('../models/products.js');
const CategoryDB = require("../models/product-category");
const ProductDB = require("../models/product-list");

// Object of Category List
const fakeCategoryDB = new CategoryDB();
// object of Product list
// const fakeProductDB = new ProductDB();

// This calls the home page.
router.get("/",(req,res)=>{
    productModel.find({bestSeller:"true"})
    .then((products)=>{
        const filteredProduct = products.map(product=>{
         
            return{
                id:product._id,
                image:product.image  
            }
        })
        res.render("index",{title: "Home" ,products : fakeCategoryDB.getProduct(),bestsellers:filteredProduct})
        console.log(filteredProduct)
    })
    .catch(err=>console.log(`Error occured during pilling data from product.--${err}`));
    // res.render("index",{
    //     title : "Home",
    //     products : fakeCategoryDB.getProduct(),
    //     bestsellers : fakeProductDB.getfeaturedproduct()
    // })
})

// This calls the Product List page.


// This calls the Dashboard 
const renderDashboard = (req,res)=>{
    res.render("dashboard", {
        title : "Welcome Page",  
    })
}




router.get('/dashboard',renderDashboard)
module.exports=router