const router = require("express").Router();
const jwt = require("jsonwebtoken");
router.post("/", (req, res) => {
    const token = req.body.Token;
    if (!token) {
        return res.status(401).send(false);
    }
    jwt.verify(token,process.env.TOKEN_SECRET,(error,data)=>{
        if(!error){
            res.send(true);
        } else{
            res.status(400).send(false);
        }
    })
});


module.exports = router;