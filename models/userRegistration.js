const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : [true,"Emial already present"],
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Invalied Email");
            }
        },
    },
    passsword : {
        type : String,
        required : true
    },
    confpasssword : {
        type : String,
        required : true
    },
    tokens : [{
        token:{
            type : String,
            required : true
        }
    }]

});

userSchema.methods.tokengenerateAuthTosken = async function(){
    try{
        const token = await jwt.sign({_id : this._id},"qasedfrtghyujmklopmnhyirqzsxcvbnhg");
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    }catch(err){
        res.status(400).send(err);
    }
} 

userSchema.pre("save", async function(next){
    if (this.isModified("passsword")) {
        this.passsword = await bcrypt.hash(this.passsword,10);
        this.confpasssword = await bcrypt.hash(this.passsword,10);
    }
     
    next();
});

const Register = new mongoose.model("Register",userSchema);

module.exports = Register;