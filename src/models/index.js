const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create the Sequelize instance first
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

// Import models
const Flight = require('./flights');
const Destination = require('./destinations');
const User = require('./users');
const Booking = require('./bookings');

// Initialize models
const models = {
  Flight: Flight(sequelize),
  Destination: Destination(sequelize),
  User: User(sequelize),
  Booking: Booking(sequelize),
  sequelize
};

// Initialize associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models
module.exports = models;