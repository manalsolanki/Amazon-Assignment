const express = require('express')
const router = express.Router()
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const isAuthenticated = require("../middleware/auth");
const dashboardLoader = require("../middleware/authorization")


const loginRoute = (req, res) => {
    res.render("user/login", {
        title: "Login"
    })
}

const loginPostRoute = (req, res) => {
    const { email, password } = req.body
    // error as object 
    const errors = {}
    const value = { ...req.body }
    // ... spread operator : whatever is there in req.body it will take.It is use to copy value from onr object to another.
    // ... rest 
    if (!(email)) {
        errors.email = "! Please enter a Email Address."
    }
    if (!(password)) {
        errors.password = "! Please enter a Password."
    }

    if (Object.keys(errors).length > 0) {
        res.render("user/login", {
            title: "Login",
            errormessage: errors,
            value: value
        });
    }
    else {
        userModel.findOne({ email: email })
            .then((user) => {

                // email not found
                if (user == null) {
                    errors.validation = "Please Enter a correct email address or password."
                    res.render("user/login", {
                        title: "Login",
                        errormessage: errors,
                        value: value
                    });
                }
                // email found
                else {
                    bcrypt.compare(password, user.password)
                        .then((isMatched) => {
                            if (isMatched) {

                                req.session.userInfo = user;
                                res.redirect("/user/profile")
                            }
                            else {
                                errors.validation = "Please Enter a correct email address or password."
                                res.render("user/login", {
                                    title: "Login",
                                    errormessage: errors,
                                    value: value
                                });
                            }
                        })
                        .catch(err => console.log(err))

                }
            })
            .catch(err => console.log(err))
    }
}


// This calls the Sign Up
const signUpRoute = (req, res) => {
    res.render("user/sign-up", {
        title: "Sign-Up"
    })
}

const signUpPostRoute = (req, res) => {

    const { firstName, lastName, email, password, repassword } = req.body
    const errors = {}
    const values = { ...req.body }

    if (!(firstName)) {
        errors.firstName = "! Please Enter your first name."
    }

    if (!(lastName)) {
        errors.lastName = "! Please Enter your last name."
    }

    if (!(email)) {
        errors.email = "! Please Enter your email."
    }
    else {
        // Validation of email it should have @ and .
        const validateEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if (!(email.match(validateEmail))) {
            errors.email = "! Please enter a proper email address."
        }
    }

    if (!(password)) {
        errors.password = "! Please Enter your password."
    }
    else {
        // validation for Password : length should be 7-16 , should have one special character , one digit and alphabets
        const validatePassword = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#%\*\-+=~\[\]{}<>\?].*).{7,16}$/
        if (!(password.match(validatePassword))) {
            errors.password = "!Please enter a password of length 7-16 ,should consist of digit,alphabet and special character."
        }
    }

    if (!(repassword)) {
        errors.repassword = "! Please Enter your password again."
    }
    else {
        // checks if both password entered are same. 
        if (!(password == repassword)) {
            errors.repassword = "! Please Enter the same Password"

        }
    }

    // Checking for the errors if there are then it will send otherwise it will redirect to the dashboard page.
    if (Object.keys(errors).length > 0) {
        res.render("user/sign-up", {
            title: "Sign-Up",
            errormessage: errors,
            value: values
        });
    }

    // Sending email if all the fields are not null and validated.

    if (Object.keys(errors).length == 0) {

        // Adding the data to the database.
        const user = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,

        })

        user.save()
            .then((user) => {
                res.redirect("/user/login");
                // using Twilio SendGrid's v3 Node.js Library
                // https://github.com/sendgrid/sendgrid-nodejs
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                const msg = {
                    to: `${email}`,
                    from: '97manal@gmail.com',
                    subject: 'Welcome to Amazon',
                    //   text: 'and easy to do anywhere, even with Node.js',
                    html: `<p style ="font-size : 25px"> Hello ${firstName} ${lastName} </p>
                <p style ="color : red "> Welcome to  Amazon </p> 
            <a href="https://amazon-website-assignment.herokuapp.com/">Click Here to BUY</a> `,
                };
                sgMail.send(msg)
                    .then(() => {

                    })
                    .catch(err => {
                        console.log(`Error ${err}`);
                    });
            })
            .catch((err) => {
                errors.email = "Email already exists"
                res.render("user/sign-up", {
                    title: "Sign-up",
                    errormessage: errors,
                    value: values
                })

            })

    }


}
const logoutRoute = (req, res) => {
    req.session.destroy();
    res.redirect("/")
}


router.get("/profile", isAuthenticated, dashboardLoader)

router.get("/login", loginRoute);
router.post("/login", loginPostRoute);
router.get("/sign-up", signUpRoute);
router.post("/sign-up", signUpPostRoute);
router.get("/logout", logoutRoute);
module.exports = router;