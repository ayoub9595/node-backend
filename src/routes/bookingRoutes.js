const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

// Get all bookings for the logged-in user
router.get('/my-bookings', bookingController.getUserBookings);

// Get specific booking details
router.get('/:bookingId', bookingController.getBookingDetails);

// Create a new booking
router.post('/', bookingController.createBooking);

// Cancel a booking
router.put('/:bookingId/cancel', bookingController.cancelBooking);

// Make sure to export the router
module.exports = router;  // This is crucial