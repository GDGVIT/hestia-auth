const sequelize = require("sequelize");
const db = require("../config/connection");

const gUser = db.define('gusers',{
    name: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    }
});

module.exports = gUser;