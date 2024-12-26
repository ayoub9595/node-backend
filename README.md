# Flight API

A RESTful API for managing flights using Node.js, Express, and Sequelize ORM.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create .env file and update with your database credentials

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

- GET /api/flights - Get all flights
- GET /api/flights/:id - Get a specific flight
- POST /api/flights - Create a new flight
- PUT /api/flights/:id - Update a flight
- DELETE /api/flights/:id - Delete a flight

## Environment Variables

- DB_HOST - Database host
- DB_USER - Database username
- DB_PASSWORD - Database password
- DB_NAME - Database name
- PORT - Server port (default: 3000)