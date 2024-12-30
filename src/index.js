const express = require('express');
const cors = require('cors');
const flightRoutes = require('./routes/flightRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes.js');
const { sequelize, Flight, Destination, User } = require('./models');
const { Op } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

const cleanupOldFlights = async () => {
  const today = new Date();
  const deletedCount = await Flight.destroy({
    where: {
      [Op.or]: [
        { departure_time: { [Op.lt]: today } },
        { arrival_time: { [Op.lt]: today } }
      ]
    }
  });
  console.log(`Deleted ${deletedCount} old flights`);
};

const seedFlights = async () => {
  const count = await Flight.count();
  if (count === 0) {
    const cities = [
      'Paris', 'London', 'New York', 'Tokyo', 'Dubai',
      'Madrid', 'Berlin', 'Rome', 'Singapore', 'Sydney',
      'Barcelona', 'Amsterdam', 'Hong Kong', 'Seoul', 'Istanbul',
      'Vienna', 'Prague', 'Bangkok', 'Mumbai', 'Cairo'
    ];

    const dummyFlights = Array(1000).fill().map((_, i) => {
      const departureCity = cities[Math.floor(Math.random() * cities.length)];
      let arrivalCity;
      do {
        arrivalCity = cities[Math.floor(Math.random() * cities.length)];
      } while (arrivalCity === departureCity);

      const baseDate = new Date();
      const departureDate = new Date(baseDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000));
      const flightDuration = (Math.random() * 12 + 2) * 60 * 60 * 1000;
      const arrivalDate = new Date(departureDate.getTime() + flightDuration);

      return {
        flight_number: `FL${10000 + i}`,
        departure: departureCity,
        arrival: arrivalCity,
        departure_time: departureDate,
        arrival_time: arrivalDate,
        price: Math.floor(Math.random() * 1500) + 200
      };
    });

    await Flight.bulkCreate(dummyFlights);
    console.log('Added 1000 dummy flights');
  } else {
    await cleanupOldFlights();
  }
};

const seedDestinations = async () => {
  const count = await Destination.count();
  if (count === 0) {
    const newDestinations = [
      {
        name: "Voyage à Venice",
        url: "https://cdn.britannica.com/62/153462-050-3D4F41AF/Grand-Canal-Venice.jpg",
        price: 673
      },
      {
        name: "Voyage à Genève",
        url: "https://img.lonelyplanet.fr/s3fs-public/styles/wide/public/2024-01/geneve_suisse.jpg.webp?itok=nxsX-Wuj",
        price: 970
      },
      {
        name: "Voyage à Amsterdam",
        url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/43/2c/43/les-maison-typiques-a.jpg?w=1200&h=1200&s=1",
        price: 1200
      },
      {
        name: "Voyage à Londres",
        url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f5/de/london.jpg?w=1400&h=1400&s=1",
        price: 5000
      },
      {
        name: "Voyage à Tokyo",
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDoPAzpD-c3vn68GSPlkcFor6yohEiKd6Tg&s",
        price: 5000
      },
      {
        name: "Voyage à AL MADINA",
        url: "https://funci.org/wp-content/uploads/2015/06/madinah-al-munawara.jpg",
        price: 9000
      },
      {
        name: "Voyage à Bangkok",
        url: "https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2461072741.jpg",
        price: 8000
      },
      {
        name: "Voyage à DOHA",
        url: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/482000/482003-Doha-And-Vicinity.jpg",
        price: 20000
      }
    ];

    await Destination.bulkCreate(newDestinations,{individualHooks: true});
    console.log('Added destinations');
  }
};

const seedUsers = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      const users = [
        {
          email: 'ayoub95@example.com',
          firstName: 'Ayoub',
          lastName: 'Badia',
          password: '123456'
        },
        {
          email: 'aymane04@example.com',
          firstName: 'Aymane',
          lastName: 'Badia',
          password: '123456'
        },
      ];

      await User.bulkCreate(users, {
        individualHooks: true
      });
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized');

    await seedFlights();
    await seedDestinations();
    await seedUsers();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();