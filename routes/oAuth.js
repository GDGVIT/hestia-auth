const express = require('express');
const app = require('express-promise-router');
const router = app();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportConf = require("../passport");
const passportGoogle = passport.authenticate('google-plus-token', {session: false});
const Client = require('pg').Client;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
client.connect();
router.route("/")
    .post(passportGoogle, (req, res) => {
        const name = req.user.displayName;
        const email = req.user.emails[0].value;
        client.query('SELECT * FROM guser WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error;
            }
            const user = results.rows[0];
            if (user === undefined) {
                client.query('INSERT INTO guser (name,email) VALUES ($1,$2)', [name, email], (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log(results);
                    client.query('SELECT * FROM guser WHERE email = $1', [email], (error, results) => {
                        if (error) {
                            throw error;
                        }
                        const token = jwt.sign({
                            _id: results.rows[0].id
                        }, process.env.TOKEN_SECRET);
                        res.status(201).json({"Status": "Added a new user", "Token": token});
                    });
                })
            } else {
                const token = jwt.sign({
                    _id: user.id
                }, process.env.TOKEN_SECRET);
                res.json({"token": token});
            }
        });
    });

module.exports = router;