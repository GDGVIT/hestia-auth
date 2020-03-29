const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const {Bcrypt} = require("bcrypt-rust-wasm");
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const {updateValidation} = require("../validation");

router.post("/", async (req, res) => {
    const {error} = updateValidation(req.body);
    if (error) {
        return res.status(400).json({"Error":error.details[0].message});
    }
    try {
        const {name, email, phone} = req.body;
        const token = req.header('token');
        if (!token) {
            return res.status(401).json({Error: "Access is denied"});
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const exists = await User.findOne({where: {id: decoded._id}});
        if (exists === null) {
            return res.status(404).json({Error: "User doesnt exist"});
        }
        await User.update({
            name: name,
            email: email,
            phone: phone,
        }, {where: {id: decoded._id}});
        return res.json({"Status": "Updated"});
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;