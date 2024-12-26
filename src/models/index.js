const { Sequelize } = require('sequelize');
const config = require('../config/database');
const Flight = require('./flights');
const Destination = require('./destinations');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

const models = {
  Flight: Flight(sequelize),
  Destination: Destination(sequelize),
  sequelize
};

module.exports = models;