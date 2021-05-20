const nodemailer = require('nodemailer');
const nodeTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'parmarchetan726@gmail.com',
        pass: 'chetan@4484'
    }
});

module.exports = nodeTransporter;
