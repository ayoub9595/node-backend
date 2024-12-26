const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Destination = sequelize.define('Destination', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'destinations'
  });
  
  return Destination;
};