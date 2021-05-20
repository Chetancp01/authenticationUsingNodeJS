const Register = require('../models/userRegistration');
const nodemail = require('../config/nodemailer');
const bcrypt = require('bcryptjs');
const multer = require('multer');

module.exports.signIn = async (req, res) => {

    try {
        //get data from login page
        const email = req.body.email;
        const password = req.body.passsword;
        
        //get data from database usind emailid
        const userEmail = await Register.findOne({email : email});

        //check password 
        const isMatch = await bcrypt.compare(password,userEmail.passsword);

        //generate token
        const token = await userEmail.tokengenerateAuthTosken();
        
        //set cookie on browser
        res.cookie("jwt",token,{
            expires: new Date(Date.now() + 60000000),
            httpOnly:true
        }); 

        //check if password are match then login user
        if (isMatch) {
            res.status(201).json({"name" : userEmail.name,"email" :  userEmail.email});
        }else{
            res.json({"error" : "Invalid login Details"});
        }

    }catch (err) {
        res.status(400).json({"error" : err});
    }

}

module.exports.signUp = async (req,res) => {
    
    try {
        //get value from register page
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.passsword;
        const confpasssword = req.body.confpasssword;

        //check conditions if password and confpasssword are match
        if (password === confpasssword) {

            //get model register schema
            const user = new Register(req.body);

            //generate token
            const token = await user.tokengenerateAuthTosken();

            //set cookie on browser
            res.cookie("jwt",token,{
                expires: new Date(Date.now() + 60000000),
                httpOnly:true
            });

            //save date and return response
            await user.save();
            res.status(200).json({"name" : name});

            //send welcome mail
            const mailOptions = {
                from: 'parmarchetan726@gmail.com',
                to: email,
                subject: 'Welcome to windsonTrack',
                text: 'Your registration has been successfully completed' 
            }
            
            nodemail.sendMail(mailOptions,function(error,info){
                if (error) {
                    res.status(400).json({"error" : error});
                }else {
                    res.status(200).json({"error" : info.response});
                }
            });

        }else{
            res.status(404).json({"error" : "Password does not match"});
        }
        
    }catch (err) {
        res.status(400).json({"error" : err});
    }


}

module.exports.signOut = async (req,res) => {
    try{
        //get current token for logout
        req.user.tokens = req.user.tokens.filter((currentElem) => {
            return currentElem.token != req.token;
        })

        //clear cookie from browser
        res.clearCookie("jwt");

        //save data
        await req.user.save();
        
        res.status(200).json({"status" : "successfully logout"});
    }catch(err) {
        res.status(404).json({"error" : err});
    }
}

module.exports.allsignOut = async (req,res) => {
    try{
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.status(200).json({"status" : "successfully logout all device"});
    }catch(err) {
        res.status(404).json({"error" : err});
    }
}

//upload file (CSV)
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, res, cb) => {
    if(res.mimetype === 'text/csv') {
        cb(null,true);
    }else {
        cb(null,false);
    }
}

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter:fileFilter
});

module.exports.fileupload = async (req, res) => {
    try {
        res.json({"fileinfo" : req.file});
    }catch (err) {
        res.status(400).json(err);
    }
}

module.exports.filename = upload.single('profileimage');

