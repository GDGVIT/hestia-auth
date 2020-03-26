const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require('dotenv');
const db = require("./config/connection");

dotEnv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cors());

db.authenticate()
    .then(()=>{
        console.log("Connected to database");
    })
    .catch(err =>{
        console.log(err);
    });

app.get("/",(req,res)=>{
   res.send("Server is up and running");
});

app.listen(process.env.PORT,()=>{
   console.log("Server is up and running");
});

const auth = require('./routes/auth');
const oAuth = require("./routes/oAuth");
const oAuthApp = require('./routes/oAuthApp');
const verify = require("./routes/verify");
app.use("/api/user",auth);
app.use("/api/user/oAuth",oAuth);
app.use("/api/user/oAuthApp",oAuthApp);
app.use("/api/user/verify", verify);