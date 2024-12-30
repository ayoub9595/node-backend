const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    seat_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'bookings'
  });

  // Define associations in the model
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Booking.belongsTo(models.Flight, {
      foreignKey: 'flightId',
      as: 'flight'
    });
  };

  return Booking;
};