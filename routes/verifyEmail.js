const router = require("express").Router();
const User = require("../model/User");
const Verified = require("../model/Verified");

router.get("/:token",async(req,res)=>{
    const token = req.params.token;
    const data = await Verified.findOne({where:{token}});
    if(data===null){
        return res.status(400).json({"Error":"Wrong Link"});
    }
    const exists = await User.findOne({where:{email:data.email}});
    if(exists===null){
        return res.status(404).json({"Error":"Email not found"});
    }
    await User.update({verified:true},{where:{email:data.email}});
    res.json({"Message":"Email Verified"});
});

module.exports = router;