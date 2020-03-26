const express = require('express');
const app = require('express-promise-router');
const router = app();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportConf = require("../passport");
const passportGoogle = passport.authenticate('google-plus-token', {session: false});
const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
router.route("/")
    .post(passportGoogle, (req, res) => {
        const name = req.user.displayName;
        const email = req.user.emails[0].value;
        pool.query('SELECT * FROM guser WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error;
            }
            const user = results.rows[0];
            if (user === undefined) {
                pool.query('INSERT INTO guser (name,email) VALUES ($1,$2)', [name, email], (err, results) => {
                    if (err) {
                        throw err;
                    }
                    pool.query('SELECT * FROM guser WHERE email = $1', [email], (error, results) => {
                        if (error) {
                            throw error;
                        }
                        const token = jwt.sign({
                            _id: results.rows[0].id
                        }, process.env.TOKEN_SECRET);
                        res.status(201).json({"Token": token});
                    });
                })
            } else {
                const token = jwt.sign({
                    _id: user.id
                }, process.env.TOKEN_SECRET);
                res.json({"Token": token});
            }
        });
    });

module.exports = router;