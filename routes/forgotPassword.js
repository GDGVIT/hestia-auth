const router = require('express').Router();
const User = require('../model/User');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cryptoRandomString = require('crypto-random-string');
const PasswordChange = require("../model/PasswordChange");
const {compiledFunctionForgotPassword} = require("../compiledPug");

router.post("/", async(req, res) => {
    const email = req.body.email;
    const exists = await User.findOne({where: {email: email}});
    if(exists===null){
        return res.status(404).json({"Error":"Email Not Found"});
    }
    const token =  cryptoRandomString({length:200, type:'url-safe'});
    const link = 'https://'+req.hostname+"/api/user/changePassword/"+token;
    const emailTemplate = compiledFunctionForgotPassword({
        name: exists.name,
        link: link
    });
    const msg = {
        to: email,
        from: 'dscvitvellore@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        html: emailTemplate
    };
    await sgMail.send(msg);
    await PasswordChange.create({
        email: email,
        token: token
    });
    res.json({"Status":"Email sent successfully"});
});

module.exports = router;