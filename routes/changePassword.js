const router = require('express').Router();
const {Bcrypt} = require("bcrypt-rust-wasm");
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const PasswordChange = require("../model/PasswordChange");
const User = require("../model/User");

router.post("/:token",async(req,res)=>{
    const token = req.params.token;
    const exists = await PasswordChange.findOne({where:{token:token}});
    if(exists===null){
        return res.status(404).json({"Error":"User not found"});
    }
    const password = bcrypt.hashSync(req.body.password);
    await User.update({
        password:password
    },{where:{email:exists.email}});
    res.json({"Status":"Password Successfully Updated"});
});

module.exports = router;