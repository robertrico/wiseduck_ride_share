const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number }
});

const rideSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  pickupLocation: locationSchema,
  destination: locationSchema,
  status: { type: String, enum: ['requested', 'accepted', 'in_progress', 'completed'], default: 'requested', index: true },
  fare: { type: Number },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Ride', rideSchema);
