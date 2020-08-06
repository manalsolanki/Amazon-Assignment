const express = require('express')
const router = express.Router()
const productModel = require('../models/products.js');
const path = require("path");


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
                bestSeller:product.bestSeller,
                image:product.image

                
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
    
   
     const product = new productModel(newProduct ) 

        product.save()
        .then((product)=>{

            req.files.image.name = `${product._id}${req.files.image.name }`
            req.files.image.mv(`public/uploads/${req.files.image.name}`)
            .then(()=>{
                productModel.updateOne({_id:product._id},{image :req.files.image.name })
                .then(()=>{
                    res.redirect(`/product/list`);
                })
                .catch(err=>console.log(err))

            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    
  
})


router.delete('/delete/:id',(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/product/list")
     } )
    .catch(err=>console.log(err))
})




router.get('/description',(req,res)=>{
    res.render("product/description")
})
module.exports=router