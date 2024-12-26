const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Flight = sequelize.define('Flight', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    flight_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    departure: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    arrival: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    timestamps: true,
    underscored: true
  });

  return Flight;
};