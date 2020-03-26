const router = require('express').Router();
const jwt = require("jsonwebtoken");
const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
router.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
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