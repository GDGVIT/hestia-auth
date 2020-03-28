const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require('dotenv');
const db = require("./config/connection");
const pug = require('pug');
dotEnv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

db.authenticate()
    .then(() => {
        console.log("Connected to database");
    })
    .catch(err => {
        console.log(err);
    });

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.listen(process.env.PORT, () => {
    console.log("Server is up and running");
});
app.set('view engine', 'pug');
app.set('views', __dirname + "/public/views");

const auth = require('./routes/auth');
const oAuth = require("./routes/oAuth");
const oAuthApp = require('./routes/oAuthApp');
const verify = require("./routes/verify");
const updateUser = require("./routes/updateUser");
const verifyEmail = require("./routes/verifyEmail");
const forgotPassword = require("./routes/forgotPassword");
const changePassword = require("./routes/changePassword");
app.use("/api/user", auth);
app.use("/api/user/oAuth", oAuth);
app.use("/api/user/oAuthApp", oAuthApp);
app.use("/api/user/verify", verify);
app.use("/api/user/updateUser", updateUser);
app.use("/api/user/verifyEmail", verifyEmail);
app.use("/api/user/forgotPassword", forgotPassword);
app.use("/api/user/changePassword",changePassword);