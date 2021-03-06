const Sequelize = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL_NODE, {
    dialect: 'postgres'
});

module.exports = sequelize;

console.log("Module exported");