const sequelize = require("sequelize");
const db = require("../config/connection");

const Verified = db.define('verified', {
    email: {
        type: sequelize.STRING,
        primaryKey: true
    },
    token: {
        type: sequelize.STRING
    }
}, {
    freezeTableName: true
});

Verified.sync({alter: true})
    .then(() => {
        console.log("Table Created");
    })
    .catch(err => {
        console.log(err);
    });

module.exports = Verified;