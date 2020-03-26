//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
dotEnv.config();
app.use(cors());
app.get("/", (_req, res) => {
    res.json({Response: "Server is up and running"});
});

app.listen(process.env.PORT, () => {
    console.log("Server is up and running");
});
const auth = require("./routes/auth");
const oAuth = require("./routes/oAuth");
const oAuthApp = require("./routes/oAuthApp");
const verify = require("./routes/verify");

app.use("/api/user", auth);
app.use("/api/user/oAuth", oAuth);
app.use("/api/user/oAuthApp",oAuthApp);
app.use("/api/user/verify", verify);