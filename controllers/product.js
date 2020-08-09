const express = require('express')
const router = express.Router()
const productModel = require('../models/products.js');
const userModel = require('../models/user');
const path = require("path");
const isAuthenticated = require("../middleware/auth");

// This calls the Product Page.
router.get("/", (req, res) => {
    productModel.find({ category: "electronics" })
        .then((products) => {
            const filteredProduct = products.map(product => {

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    bestSeller: product.bestSeller,
                    image: product.image,

                }

            })
            res.render("product/product", { title: "Product", products: filteredProduct })
        })
        .catch(err => console.log(`Error occured during pilling data from product.--${err}`))

})

router.post("/", (req, res) => {
    const newCategory = req.body.category
    productModel.find({ category: newCategory })
        .then((products) => {
            const filteredProduct = products.map(product => {

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    bestSeller: product.bestSeller,
                    image: product.image,

                }

            })
            res.render("product/product", { title: "Product", products: filteredProduct,  newCategory })
        })
        .catch(err => console.log(`Error occured during pilling data from product.--${err}`))

})



// This Route is for the lisitng of all products.
router.get("/list",isAuthenticated, (req, res) => {
    if(req.session.userInfo.typeOfUser == "Admin")
    {
        productModel.find()
        .then((products) => {
            const filteredProduct = products.map(product => {

                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    quantity: product.quantity,
                    bestSeller: product.bestSeller,
                    image: product.image
                }
            })
            res.render("product/list", { data: filteredProduct })
        })
        .catch(err => console.log(`Error occured during pilling data from product.--${err}`))
    }
    else
    {
        res.redirect("/user/login")
    }
    

})


// This calls the inventory Page.

router.get("/add",isAuthenticated, (req, res) => {
 console.log(req.session.userInfo.typeOfUser)
    if(req.session.userInfo.typeOfUser == "Admin")
    {

        res.render("product/inventoryClerk", {
            title: "Inventory-Clerk"
        })
    }
    else
    {
        console.log(req.session.userInfo.typeOfUser )
        res.redirect("/user/login")
    }
   
})

router.post("/add", (req, res) => {

    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        bestSeller: req.body.bestSeller,
    }


    const product = new productModel(newProduct)

    product.save()
        .then((product) => {

            req.files.image.name = `${product._id}${req.files.image.name}`
            req.files.image.mv(`public/uploads/${req.files.image.name}`)
                .then(() => {
                    productModel.updateOne({ _id: product._id }, { image: req.files.image.name })
                        .then(() => {
                            res.redirect(`/product/list`);
                        })
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))


})

router.get('/edit/:id', isAuthenticated,(req, res) => {
    productModel.findById(req.params.id)
        .then((product) => {
            const { _id, name, description, price, bestSeller, category, image, quantity } = product
            res.render('product/editProduct', { _id, name, description, price, bestSeller, category, image, quantity })
           
        })
        .catch(err => console.log(err))
})

router.put('/update/:id', (req, res) => {
   
    const product = {
        _id:req.params.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        bestSeller: req.body.bestSeller,
        
    }
    
    productModel.updateOne({_id:product._id},product)
        .then(()=>{
            res.redirect("/product/list")
        })
        .catch(err=>console.log(err))
    // req.files.image.name = `${product._id}${req.files.image.name}`
    // product.image=req.files.image.name 
    // req.files.image.mv(`public/uploads/${req.files.image.name}`)
    // .then(()=>{
    //     productModel.updateOne({_id:product._id},product)
    //     .then(()=>{
    //         res.redirect("/product/list")
    //     })
    //     .catch(err=>console.log(err))
    // })
    // .catch(err=>console.log(err))

})

router.delete('/delete/:id', isAuthenticated,(req, res) => {
    productModel.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/product/list")
        })
        .catch(err => console.log(err))
})



// This route is for the description Page.
router.get(`/description/:id`, (req, res) => {

    productModel.findById(req.params.id)
        .then((product) => {
            const { _id, name, description, price, quantity, image } = product
            res.render("product/description", {
                _id, name, description, price, quantity, image
            })
        })
        .catch(err => console.log(err))

})

router.get('/cart',(req,res)=>{
    
    const productDetail = req.session.userInfo.cart
    console.log(productDetail)
    // if(req.session.userInfo.typeOfUser == "Admin")
    // {
        res.render("product/shopping-cart")
        
    //  }
    // else{
    //     res.redirect("/user/login")
    //  }
  
})
router.post('/description/:id', (req, res) => {
  
    if(req.session.userInfo.typeOfUser == "Admin")
    {
        res.redirect("/user/login")
    }
    else
    {  
        const newCart = [{quantity:req.body.quantity , product_id :req.params.id}]
        userModel.updateOne({ email: req.session.userInfo.email }, {$push : { cart:newCart} })
        .then(()=>{
            res.render("product/shopping-cart")
        })
        .catch(err=>console.log(err))
        
    }
  
})



module.exports = router