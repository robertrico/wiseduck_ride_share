const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rideshare';

const drivers = [
  {
    name: 'Driver 1',
    email: 'driver1@example.com',
    vehicles: [
      { make: 'Toyota', model: 'Camry', year: 2018, color: 'Blue', licensePlate: 'DRV1A', seats: 4 },
      { make: 'Honda', model: 'Civic', year: 2019, color: 'Black', licensePlate: 'DRV1B', seats: 4 }
    ]
  },
  {
    name: 'Driver 2',
    email: 'driver2@example.com',
    vehicles: [
      { make: 'Ford', model: 'Focus', year: 2017, color: 'Red', licensePlate: 'DRV2A', seats: 4 },
      { make: 'Chevrolet', model: 'Malibu', year: 2018, color: 'White', licensePlate: 'DRV2B', seats: 4 }
    ]
  },
  {
    name: 'Driver 3',
    email: 'driver3@example.com',
    vehicles: [
      { make: 'Nissan', model: 'Altima', year: 2016, color: 'Gray', licensePlate: 'DRV3A', seats: 4 },
      { make: 'Kia', model: 'Optima', year: 2018, color: 'Blue', licensePlate: 'DRV3B', seats: 4 }
    ]
  },
  {
    name: 'Driver 4',
    email: 'driver4@example.com',
    vehicles: [
      { make: 'Hyundai', model: 'Elantra', year: 2019, color: 'Black', licensePlate: 'DRV4A', seats: 4 },
      { make: 'Volkswagen', model: 'Jetta', year: 2020, color: 'Red', licensePlate: 'DRV4B', seats: 4 }
    ]
  },
  {
    name: 'Driver 5',
    email: 'driver5@example.com',
    vehicles: [
      { make: 'Subaru', model: 'Impreza', year: 2017, color: 'Blue', licensePlate: 'DRV5A', seats: 4 }
    ]
  },
  {
    name: 'Driver 6',
    email: 'driver6@example.com',
    vehicles: [
      { make: 'Mazda', model: '3', year: 2018, color: 'White', licensePlate: 'DRV6A', seats: 4 }
    ]
  },
  {
    name: 'Driver 7',
    email: 'driver7@example.com',
    vehicles: [
      { make: 'BMW', model: '3 Series', year: 2016, color: 'Black', licensePlate: 'DRV7A', seats: 4 }
    ]
  },
  {
    name: 'Driver 8',
    email: 'driver8@example.com',
    vehicles: [
      { make: 'Audi', model: 'A4', year: 2019, color: 'Gray', licensePlate: 'DRV8A', seats: 4 }
    ]
  },
  {
    name: 'Driver 9',
    email: 'driver9@example.com',
    vehicles: [
      { make: 'Mercedes', model: 'C-Class', year: 2018, color: 'Silver', licensePlate: 'DRV9A', seats: 4 }
    ]
  },
  {
    name: 'Driver 10',
    email: 'driver10@example.com',
    vehicles: [
      { make: 'Lexus', model: 'IS', year: 2020, color: 'White', licensePlate: 'DRV10A', seats: 4 }
    ]
  }
];

const riders = Array.from({ length: 25 }).map((_, i) => ({
  name: `Rider ${i + 1}`,
  email: `rider${i + 1}@example.com`
}));

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});

  const password = await bcrypt.hash('password', 10);

  const users = [];

  drivers.forEach(driver => {
    users.push({
      ...driver,
      password,
      userType: 'driver'
    });
  });

  riders.forEach(rider => {
    users.push({
      ...rider,
      password,
      userType: 'rider'
    });
  });

  await User.insertMany(users);
  console.log('Database seeded successfully');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed', err);
  mongoose.disconnect();
});
