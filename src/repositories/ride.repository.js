const Ride = require('../models/Ride');

async function createRide(data) {
  const ride = new Ride(data);
  return ride.save();
}

async function findById(id) {
  return Ride.findById(id);
}

async function findAvailableRides() {
  return Ride.find({ status: 'requested' });
}

async function updateRide(id, update) {
  return Ride.findByIdAndUpdate(id, update, { new: true });
}

async function findUserRides(userId) {
  return Ride.find({ $or: [{ riderId: userId }, { driverId: userId }] }).sort({ createdAt: -1 });
}

module.exports = {
  createRide,
  findById,
  findAvailableRides,
  updateRide,
  findUserRides
};
