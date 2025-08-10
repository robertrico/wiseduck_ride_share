const mongoose = require('mongoose');

// Embedded vehicle schema for drivers
const vehicleSchema = new mongoose.Schema({
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  color: { type: String },
  licensePlate: { type: String },
  seats: { type: Number }
});

const locationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  userType: { type: String, enum: ['driver', 'rider'], required: true },
  vehicles: [vehicleSchema],
  location: locationSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
