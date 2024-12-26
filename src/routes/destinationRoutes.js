// routes/destinationRoutes.js
const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Get all destinations
router.get('/', destinationController.getAllDestinations);

// Get a single destination
router.get('/:id', destinationController.getDestinationById);

// Create a new destination
router.post('/', destinationController.createDestination);

// Update a destination
router.put('/:id', destinationController.updateDestination);

// Delete a destination
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;