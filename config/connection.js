const Sequelize = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    pool: {
        max: 50000,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;