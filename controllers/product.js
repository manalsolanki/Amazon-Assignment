const express = require('express')
const router = express.Router()
const productModel = require('../models/products.js');


router.get("/list",(req,res)=>{
    productModel.find()
    .then((products)=>{
        const filteredProduct = products.map(product=>{
         
            return{
                id:product._id,
                name:product.name,
                price:product.price,
                description:product.description,
                category:product.category,
                quantity:product.quantity,
                bestSeller:product.bestSeller
                
            }
        })
        res.render("product/list",{data : filteredProduct})
    })
    .catch(err=>console.log(`Error occured during pilling data from product.--${err}`))
    
})


// This calls the inventory Page.

router.get("/add",(req,res)=>{
    res.render("product/inventoryClerk",{
        title:"Inventory-Clerk"
    })
})

router.post("/add",(req,res)=>{
    const newProduct = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
        category : req.body.category,
        quantity : req.body.quantity,
        bestSeller : req.body.bestSeller,
    }
    const values = { ...req.body}
    const errors = { }
    if(newProduct.quantity < 1)
    {
        errors.quantity="Qunatity should not be less than 0. "
    }
    if(Object.keys(errors).length > 0 )
    {
        res.render("product/inventoryClerk" , {
            title: "Add",
            errormessage :errors,
            value : values
        });
    }
    

    if(Object.keys(errors).length==0)
    {
        
        const product = new productModel(newProduct ) 

        product.save()
        .then((product)=>{
            res.redirect("/product/list");
        })
        .catch(err=>console.log(err))
    }
  
})


router.delete('/delete/:id',(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/product/list")
     } )
    .catch(err=>console.log(err))
})
module.exports=router