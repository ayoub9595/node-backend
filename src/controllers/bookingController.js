const { Booking, Flight, User } = require('../models');

const bookingController = {
  // Get all bookings for a user
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const bookings = await Booking.findAll({
        where: { userId },
        include: {
          model: Flight,
          as: 'flight',
          attributes: ['flight_number', 'departure', 'arrival', 'departure_time', 'arrival_time', 'price']
        },
        order: [['createdAt', 'DESC']] // Order by booking creation date instead
      });

      res.json({
        count: bookings.length,
        bookings: bookings
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  },

  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const userId = req.user.id;
      const { flightId, seat_number } = req.body;

      // Check if flight exists
      const flight = await Flight.findByPk(flightId);
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }

      // Check if booking already exists
      const existingBooking = await Booking.findOne({
        where: { 
          userId, 
          flightId,
          status: 'confirmed'
        }
      });

      if (existingBooking) {
        return res.status(400).json({ error: 'You have already booked this flight' });
      }

      const booking = await Booking.create({
        userId,
        flightId,
        seat_number,
        status: 'confirmed'
      });

      // Fetch the created booking with flight details
      const bookingWithDetails = await Booking.findByPk(booking.id, {
        include: [{
          model: Flight,
          as: 'flight'
        }]
      });

      res.status(201).json(bookingWithDetails);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Error creating booking' });
    }
  },

  // Cancel a booking
  cancelBooking: async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookingId } = req.params;

      const booking = await Booking.findOne({
        where: { 
          id: bookingId,
          userId
        }
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ error: 'Booking is already cancelled' });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ error: 'Error cancelling booking' });
    }
  },

  // Get a specific booking details
  getBookingDetails: async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookingId } = req.params;

      const booking = await Booking.findOne({
        where: { 
          id: bookingId,
          userId
        },
        include: [{
          model: Flight,
          as: 'flight'
        }]
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ error: 'Error fetching booking details' });
    }
  }
};

module.exports = bookingController;