//jshint esversion:8
const router = require('express').Router();
const Client = require('pg').Client;
const {Bcrypt} = require('bcrypt-rust-wasm');
const jwt = require("jsonwebtoken");
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const {registerValidation, loginValidation} = require("../validation");
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

client.connect(() => {
    console.log("connected to DB");
});

router.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = bcrypt.hashSync(req.body.password);
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    client.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error
        }
        const user = results.rows[0];
        if (user !== undefined) {
            return res.status(400).json({"Error": "Email already exists"});
        }
        client.query('INSERT INTO users (name,email,phone,password) VALUES ($1,$2,$3,$4)', [name, email, phone, password], (err, _results) => {
            if (err) {
                throw err;
            }
            res.status(201).json({"Status": "Added a new user"});
        })

    });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    client.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error
        }
        const user = results.rows[0];
        if (user === undefined) {
            return res.status(404).json({"Error": "User not found"});
        }
        const validPass = bcrypt.verifySync(password, user.password);
        if (!validPass) {
            return res.status(401).json({Status: "Access is denied"});
        }
        const token = jwt.sign({
            _id: user.id
        }, process.env.TOKEN_SECRET);
        res.status(200).header("auth-token", token).json({"Token":token});
    })
});
module.exports = router;