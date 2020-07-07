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



// This calls the login Page

router.get("/login",(req,res)=>{
    res.render("login",{
        title:"Login"
    })

})

router.post("/login" ,(req,res)=>{
    const {email,password} = req.body
    const errors = { }
    const value ={...req.body} 
    // ... spread operator : whatever is there in req.body it will take.It is use to copy value from onr object to another.
    // ... rest 
    if(!(email))
    {
        errors.email = "! Please enter a Email Address."
    }
    if(!(password))
    {
        errors.password = "! Please enter a Password."
    }
    
    if(Object.keys(errors).length > 0 )
    {
        res.render("login" , {
            title: "Login",
            errormessage :errors,
            value : value
        });
    }
    else{
        res.redirect("/");
    }

    
})






// This calls the Sign Up
router.get("/sign-up",(req,res)=>{
    
    res.render("sign-up",{
        title:"Sign-Up"
    })

})

router.post("/sign-up" ,(req,res)=>{

    const {firstName,lastName,email,password,repassword} = req.body
    const errors = { }
    const values = { ...req.body}

    if(!(firstName))
    {
        errors.firstName = "! Please Enter your first name."
    }

    if(!(lastName))
    {
        errors.lastName = "! Please Enter your last name."
    }
  
    if(!(email))
    {
        errors.email = "! Please Enter your email."
    }

    if(!(password))
    {
        errors.password = "! Please Enter your password."
    }

    if(!(repassword))
    {
        errors.repassword = "! Please Enter your password again."
    }

    if(Object.keys(errors).length > 0 )
    {
        res.render("sign-up" , {
            title: "Sign-Up",
            errormessage :errors,
            value : values
        });
    }
    else{
        res.redirect("/");
    }

    

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
    to: `${email}`,
    from: '97manal@gmail.com',
    subject: 'Sign Up on Amazon',
    //   text: 'and easy to do anywhere, even with Node.js',
    html: `Hello ${firstName} ${lastName} Welcome to Amazon 
          <a src="/">Click here</a> `,
    };
    sgMail.send(msg)
    . then(()=>{
        res.redirect("/");
    })
    . catch(err=>{
        console.log(`Error ${err}`);
    });
    
    
})


module.exports=router