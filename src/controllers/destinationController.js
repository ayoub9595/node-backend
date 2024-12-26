const { Destination } = require('../models');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching destinations", error: error.message });
    }
};

// Get a single destination by ID
exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: "Error fetching destination", error: error.message });
    }
};

// Create a new destination
exports.createDestination = async (req, res) => {
    try {
        const { name, url, price } = req.body;
        const newDestination = await Destination.create({
            name,
            url,
            price
        });
        res.status(201).json(newDestination);
    } catch (error) {
        res.status(400).json({ message: "Error creating destination", error: error.message });
    }
};

// Update a destination
exports.updateDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url, price } = req.body;
        
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        await destination.update({
            name,
            url,
            price
        });

        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: "Error updating destination", error: error.message });
    }
};

// Delete a destination
exports.deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destination.findByPk(id);
        
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        await destination.destroy();
        res.json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting destination", error: error.message });
    }
};