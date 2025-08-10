const rideRepository = require('../repositories/ride.repository');
const userRepository = require('../repositories/user.repository');

// Rider requests a ride
async function requestRide(riderId, pickupLocation, destination, fare) {
  const rider = await userRepository.findById(riderId);
  if (!rider || rider.userType !== 'rider') {
    throw new Error('Only riders can request rides');
  }
  const ride = await rideRepository.createRide({
    riderId,
    pickupLocation,
    destination,
    fare,
    status: 'requested'
  });
  return ride;
}

// Driver gets available ride requests
async function getAvailableRides() {
  return rideRepository.findAvailableRides();
}

// Driver accepts a ride
async function acceptRide(rideId, driverId) {
  const driver = await userRepository.findById(driverId);
  if (!driver || driver.userType !== 'driver') {
    throw new Error('Only drivers can accept rides');
  }
  const ride = await rideRepository.findById(rideId);
  if (!ride || ride.status !== 'requested') {
    throw new Error('Ride not available');
  }
  return rideRepository.updateRide(rideId, { driverId, status: 'accepted' });
}

// Update ride status
async function updateStatus(rideId, userId, status) {
  const ride = await rideRepository.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }
  if (ride.driverId?.toString() !== userId && ride.riderId.toString() !== userId) {
    throw new Error('Not authorized');
  }
  const update = { status };
  if (status === 'completed') {
    update.completedAt = new Date();
  }
  return rideRepository.updateRide(rideId, update);
}

// Get ride history for user
async function getRideHistory(userId) {
  return rideRepository.findUserRides(userId);
}

module.exports = {
  requestRide,
  getAvailableRides,
  acceptRide,
  updateStatus,
  getRideHistory
};
