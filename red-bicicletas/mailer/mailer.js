const mailer= require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config=require("../config/config");

let transporter;

if (config.nodeEnv === 'production') {
    transporter = mailer.createTransport(sgTransport({
        auth: {
            api_key: config.sendGridApiKey
        }
    }));
}
else {
    transporter = mailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'merl.lynch@ethereal.email',
            pass: '7d5VxGAGXGP8F5Zq65'
        }
    });
}


module.exports= transporter;