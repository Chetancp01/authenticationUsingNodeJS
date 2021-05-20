const jwt = require('jsonwebtoken');
const Register = require("../models/userRegistration");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"qasedfrtghyujmklopmnhyirqzsxcvbnhg");

        const user = await Register.findOne({_id : verifyUser._id});
        
        req.token = token;
        req.user = user;

        next();
    }catch(err) {
        res.status(400).send(err);
    }
}

module.exports = auth;