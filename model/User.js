const sequelize = require("sequelize");
const db = require("../config/connection");

const User = db.define('users', {
    name: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
    phone: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    }
},{timestamps: false});

module.exports = User;