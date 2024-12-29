const { Flight } = require('../models');
const { Op } = require('sequelize');

const flightController = {
  // Get all flights
  getAllFlights: async (req, res) => {
    try {
      const flights = await Flight.findAll();
      res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: 'Error fetching flights' });
    }
  },

  // Get flight by ID
  getFlightById: async (req, res) => {
    try {
      const flight = await Flight.findByPk(req.params.id);
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }
      res.json(flight);
    } catch (error) {
      console.error('Error fetching flight:', error);
      res.status(500).json({ error: 'Error fetching flight' });
    }
  },

  // Search flights by departure, arrival, and date
  searchFlights: async (req, res) => {
    try {
      const { departure, arrival, date } = req.query;
      
      if (!departure && !arrival && !date) {
        return res.status(400).json({ 
          error: 'At least one search parameter (departure, arrival, or date) is required' 
        });
      }

      const whereClause = {};
      
      if (departure) {
        whereClause.departure = {
          [Op.like]: `%${departure}%`
        };
      }
      
      if (arrival) {
        whereClause.arrival = {
          [Op.like]: `%${arrival}%`
        };
      }
      
      if (date) {
        const searchDate = new Date(date);
        
        if (isNaN(searchDate.getTime())) {
          return res.status(400).json({ 
            error: 'Invalid date format. Please use YYYY-MM-DD format' 
          });
        }

        const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
        const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
        
        whereClause.departure_time = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      const flights = await Flight.findAll({
        where: whereClause,
        order: [['departure_time', 'ASC']]
      });
      
      res.json({
        count: flights.length,
        flights: flights
      });

    } catch (error) {
      console.error('Error searching flights:', error);
      res.status(500).json({ error: 'Error searching flights' });
    }
  },

  // Create new flight
  createFlight: async (req, res) => {
    try {
      const flight = await Flight.create(req.body);
      res.status(201).json(flight);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      console.error('Error creating flight:', error);
      res.status(500).json({ error: 'Error creating flight' });
    }
  },

  // Update flight
  updateFlight: async (req, res) => {
    try {
      const [updated] = await Flight.update(req.body, {
        where: { id: req.params.id },
        returning: true
      });

      if (!updated) {
        return res.status(404).json({ error: 'Flight not found' });
      }

      const updatedFlight = await Flight.findByPk(req.params.id);
      res.json(updatedFlight);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      console.error('Error updating flight:', error);
      res.status(500).json({ error: 'Error updating flight' });
    }
  },

  // Delete flight
  deleteFlight: async (req, res) => {
    try {
      const deleted = await Flight.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Flight not found' });
      }

      res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
      console.error('Error deleting flight:', error);
      res.status(500).json({ error: 'Error deleting flight' });
    }
  }
};

module.exports = flightController;