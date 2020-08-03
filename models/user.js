const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {Schema , model}=require('mongoose');

// const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        firstName : {
            type:String,
            required:true
        },
        lastName : {
            type:String,
            required:true
        },
        email : {
            type:String,
            required:true,
            unique:true
        },
        password : {
            type:String,
            required:true
        },
        typeOfUser:{
            type:String,
            default:"Regular user"
        },
            
        dateCreated:{
            type: Date,
            default:Date.now()
        }

    }
)


userSchema.pre("save", function(next)
{
    // salt random generated charater string.
    // the higher the value the complexity increase.
    bcrypt.genSalt(12)
    .then((salt)=>{
        bcrypt.hash(this.password ,salt)
        .then((encryptPassword) =>{
            this.password = encryptPassword
            next()
        })
        .catch(err=>console.log(`Error occured when hashing ${err}`))

    })
    .catch(err=>console.log(`Error occured when salted ${err}`))

})
const userModel = model('User',userSchema)

// const  userModel = mongoose.model('User', userSchema);

module.exports = userModel;