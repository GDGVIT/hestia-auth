const Sequelize = require('sequelize');
console.log("Sequelize imported");
const dotEnv = require('dotenv');
console.log("dotenv imported");
dotEnv.config();
console.log("dotenv configured");
const sequelize = new Sequelize(process.env.DATABASE_URL_NODE, {
    dialect: 'postgres'
});
console.log("Attempted db conn");

module.exports = sequelize;

console.log("Module exported");