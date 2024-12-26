const express = require('express');
const cors = require('cors');
const flightRoutes = require('./routes/flightRoutes')
const destinationRoutes = require('./routes/destinationRoutes');
const { sequelize,Flight,Destination } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/destinations', destinationRoutes);

const seedFlights = async () => {
  const count = await Flight.count();
  if (count === 0) {
    const dummyFlights = Array(10).fill().map((_, i) => ({
      flight_number: `FL${1000 + i}`,
      departure: ['Paris', 'London', 'New York', 'Tokyo', 'Dubai'][Math.floor(Math.random() * 5)],
      arrival: ['Madrid', 'Berlin', 'Rome', 'Singapore', 'Sydney'][Math.floor(Math.random() * 5)],
      departure_time: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      arrival_time: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000),
      price: Math.floor(Math.random() * 900) + 100
    }));

    await Flight.bulkCreate(dummyFlights);
    console.log('Added 10 dummy flights');
  }
};

const seedDestinations = async () => {
  const count = await Destination.count();
  if (count === 0) {
    const destinations = [
      {
          name:"Voyage à Venice",
          url:"https://cdn.britannica.com/62/153462-050-3D4F41AF/Grand-Canal-Venice.jpg",
          price:673
      },
      {
          name:"Voyage à Genève",
          url:"https://img.lonelyplanet.fr/s3fs-public/styles/wide/public/2024-01/geneve_suisse.jpg.webp?itok=nxsX-Wuj",
          price:970
      },
      {
          name:"Voyage à Amsterdam",
          url:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/43/2c/43/les-maison-typiques-a.jpg?w=1200&h=1200&s=1",
          price:1200
      },
      {
          name:"Voyage à Londres",
          url:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f5/de/london.jpg?w=1400&h=1400&s=1",
          price:5000  
      },
      {
          name:"Voyage à Tokyo",
          url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDoPAzpD-c3vn68GSPlkcFor6yohEiKd6Tg&s",
          price:5000 
      },
      {
          name:"Voyage à AL MADINA",
          url:"https://funci.org/wp-content/uploads/2015/06/madinah-al-munawara.jpg",
          price:9000
      },
      {
          name:"Voyage à Bangkok",
          url:"https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2461072741.jpg",
          price:8000
      },
      {
          name:"Voyage à DOHA",
          url:"https://a.travel-assets.com/findyours-php/viewfinder/images/res70/482000/482003-Doha-And-Vicinity.jpg",
          price:20000
      }
  ]
    await Destination.bulkCreate(destinations);
    console.log('Added destinations');
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

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();