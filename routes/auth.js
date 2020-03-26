const router = require('express').Router();
const User = require('../model/User');
const {Bcrypt} = require('bcrypt-rust-wasm');
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require("../validation");

router.post("/register", async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const {name, email, phone, password} = req.body;
        const emailExists = await User.findOne({where: {email}});
        if (emailExists !== null) {
            return res.status(400).json({"Error": "Email Already Exists"});
        }
        const user = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: bcrypt.hashSync(password)
        });
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

router.post("/login", async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where:{email}});
        if(user === null){
            res.status(404).json({Error:"User Not Found"});
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