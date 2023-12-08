const mailer= require('nodemailer');

const transporter = mailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'merl.lynch@ethereal.email',
        pass: '7d5VxGAGXGP8F5Zq65'
    }
});

module.exports= transporter;