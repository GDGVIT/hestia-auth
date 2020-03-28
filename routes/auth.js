const router = require('express').Router();
const User = require('../model/User');
const {Bcrypt} = require('bcrypt-rust-wasm');
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require("../validation");
const sgMail = require('@sendgrid/mail');
const Verified = require('../model/Verified');
const cryptoRandomString = require('crypto-random-string');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {compiledFunctionEmail} = require("../compiledPug");
router.post("/register", async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).json({"Error":error.details[0].message});
    }
    try {
        const {name, email, phone, password} = req.body;
        const emailExists = await User.findOne({where: {email}});
        if (emailExists !== null) {
            return res.status(400).json({"Error": "Email Already Exists"});
        }
        await User.create({
            name: name,
            email: email,
            phone: phone,
            password: bcrypt.hashSync(password)
        });
        const token =  cryptoRandomString({length:200, type:'url-safe'});
        await Verified.create({
            email: email,
            token: token
        });
        const text = "https://" + req.hostname + "/api/user/verifyEmail/" + token;
        const emailTemplate = compiledFunctionEmail({
            name: name,
            link: text
        });
        const msg = {
            to: email,
            from: 'test@example.com',
            subject: 'Sending with SendGrid is Fun',
            html: emailTemplate
        };
        await sgMail.send(msg);
        res.status(202).json({
            "Status": "New user added",
            "Verify": "Email sent for verification"
        });
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.post("/login", async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).json({"Error":error.details[0].message});
    }
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (user === null) {
            res.status(404).json({Error: "User Not Found"});
        }
        const validPass = bcrypt.verifySync(password, user.password);
        if (!validPass) {
            return res.status(401).send("Password is wrong");
        }
        //Create a Token
        const token = jwt.sign(
            {
                _id: user.id
            },
            process.env.TOKEN_SECRET
        );
        res.json({"Token": token});
    } catch (err) {
        return res.status(400).json(err);
    }
});
module.exports = router;