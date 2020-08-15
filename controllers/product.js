const express = require('express')
const router = express.Router()
const productModel = require('../models/products.js');
const userModel = require('../models/user');
const path = require("path");
const isAuthenticated = require("../middleware/auth");
const { runInNewContext } = require('vm');
const { compareSync } = require('bcryptjs');

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
            res.render("product/product", { title: "Product", products: filteredProduct, newCategory })
        })
        .catch(err => console.log(`Error occured during pilling data from product.--${err}`))

})



// This Route is for the lisitng of all products.
router.get("/list", isAuthenticated, (req, res) => {
    if (req.session.userInfo.typeOfUser == "Admin") {
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
    else {
        res.redirect("/user/login")
    }


})


// This calls the inventory Page.

router.get("/add", isAuthenticated, (req, res) => {
    console.log(req.session.userInfo.typeOfUser)
    if (req.session.userInfo.typeOfUser == "Admin") {

        res.render("product/inventoryClerk", {
            title: "Inventory-Clerk"
        })
    }
    else {
        console.log(req.session.userInfo.typeOfUser)
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
            console.log(req.files.image.mimetype)
            if ((req.files.image.mimetype) == "image/jpeg" || (req.files.image.mimetype) == "image/jpg" || (req.files.image.mimetype) == "image/png") {

                req.files.image.mv(`public/uploads/${req.files.image.name}`)
                    .then(() => {
                        productModel.updateOne({ _id: product._id }, { image: req.files.image.name })
                            .then(() => {
                                res.redirect(`/product/list`);
                            })
                            .catch(err => console.log(err))

                    })
                    .catch(err => console.log(err))
            }
            else {
                const error = "Please upload a appropriate file."
                res.render("product/inventoryClerk", { title: "Product add", error, newProduct })
            }

        })
        .catch(err => console.log(err))


})

router.get('/edit/:id', isAuthenticated, (req, res) => {
    productModel.findById(req.params.id)
        .then((product) => {
            const { _id, name, description, price, bestSeller, category, image, quantity } = product
            res.render('product/editProduct', { _id, name, description, price, bestSeller, category, image, quantity })

        })
        .catch(err => console.log(err))
})

router.put('/update/:id', (req, res) => {

    const product = {
        _id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        bestSeller: req.body.bestSeller,

    }

    productModel.updateOne({ _id: product._id }, product)
        .then(() => {
            res.redirect("/product/list")
        })
        .catch(err => console.log(err))
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

router.delete('/delete/:id', isAuthenticated, (req, res) => {
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

router.get('/cart', isAuthenticated, (req, res) => {
    let amount = 0
    let error = ""
    const email = req.session.userInfo._id
    userModel.findById(email)
        .then((user) => {
            const productDetail = user.cart

            // Promise.all([newProduct]).then((finalProduct)=>console.log(finalProduct))
            let finalProduct = [];


            let promiseArr = productDetail.map(eachproduct => {
                return productModel.findById(eachproduct.product_id)
                    .then((product) => {
                        if (eachproduct.quantity < 1) {
                            const error = "This item wont be counted because quanity is zero"
                        }
                        amount = amount + product.price * eachproduct.quantity
                        const newProduct = {
                            id: product._id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            image: product.image,
                            quantity: eachproduct.quantity,
                            each_amount: product.price * eachproduct.quantity

                        }
                        return (newProduct)
                        // finalProduct.push(newProduct)
                        // console.log(finalProduct)
                    })

                    .catch((err) => console.log(err))

            })
            Promise.all(promiseArr).then(data => {
                res.render("product/shopping-cart", {
                    data: data, amount, error
                })
            })
        })
        .catch(err => console.log(err))
    // console.log(productDetails

})

// router.post('/cart', isAuthenticated, (req, res) => {
//     userModel.updateOne({ _id: req.session._id }, {$set: {cart: [] }})
//         .then(() => {
//             const sgMail = require('@sendgrid/mail');
//             sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
//             const msg = {
//                 to: `${req.session.userInfo.email}`,
//                 from: '97manal@gmail.com',
//                 subject: 'Thanks for ordering from Amazon',
//                 //   text: 'and easy to do anywhere, even with Node.js',
//                 html: `<p style ="font-size : 25px"> Thank you for shopping with us of amount </p>
//     <p style ="color : red "> Please Visit again here for Shopping. </p> 
// <a href="https://amazon-website-assignment.herokuapp.com/">Click Here to BUY</a> `,
//             };

//             console.log(msg)
//             sgMail.send(msg)
//                 .then(() => {
//                     res.redirect("/");

//                 })
//                 .catch(err => {
//                     console.log(`Error ${err}`);
//                 });
//         })
//         .catch(err => console.log(err))

// })
router.post('/cart', isAuthenticated, (req, res) => {

    userModel.updateOne({ _id: req.session.userInfo._id }, { $set: { cart: [] } })
        .then(() => {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                to: `${req.session.userInfo.email}`,
                from: '97manal@gmail.com',
                subject: 'Thanks for ordering from Amazon',
                //   text: 'and easy to do anywhere, even with Node.js',
                html: `<p style ="font-size : 25px"> Thank you for shopping with us of amount </p>
    <p style ="color : red "> Please Visit again here for Shopping. </p> 
<a href="https://amazon-website-assignment.herokuapp.com/">Click Here to BUY</a> `,
            };
            sgMail.send(msg)
                .then(() => {
                    res.redirect("/");

                })
                .catch(err => {
                    console.log(`Error ${err}`);
                })

        })
        .catch(err => console.log(err))

})





router.post('/description/:id', (req, res) => {
    if (req.session.userInfo) {
        if (req.session.userInfo.typeOfUser == "Admin") {
            res.redirect("/user/login")
        }
        else {
            console.log(req.body.quantity)


            const newCart = [{ quantity: req.body.quantity, product_id: req.params.id }]
            userModel.updateOne({ email: req.session.userInfo.email }, { $push: { cart: newCart } })
                .then(() => {
                    res.redirect("/product/cart")
                })
                .catch(err => console.log(err))


        }
    }
    else {
        res.redirect('/user/login')
    }
})



module.exports = router