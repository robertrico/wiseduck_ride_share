# Ride Share App

Basic ride-sharing API built with Node.js, Express and MongoDB. Includes user authentication, vehicle management for drivers and simple ride request/accept flow.

## Features
- User registration and login with JWT authentication
- User profiles with embedded vehicle information for drivers
- Riders can request rides
- Drivers can view and accept ride requests
- Ride status tracking and history

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update values:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Scripts
- `npm start` – start the server
- `npm run dev` – start with nodemon
- `npm test` – run placeholder tests
- `npm run seed` – populate the database with sample data

## Database Seeding
To load sample users, ride requests and rides into the database, run:
```
npm run seed
```
See `seeded.md` for details on the seeded records.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/vehicles`

### Rides
- `POST /api/rides/request`
- `GET /api/rides/available`
- `PUT /api/rides/:id/accept`
- `PUT /api/rides/:id/status`
- `GET /api/rides/history`

## License
MIT
