const sequelize = require("sequelize");
const db = require("../config/connection");

const gUser = db.define('gusers', {
    name: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING,
        primaryKey: true
    }
});

gUser.sync({alter: true})
    .then(() => {
        console.log("Table created");
    })
    .catch(err => {
        console.log(err);
    });

module.exports = gUser;