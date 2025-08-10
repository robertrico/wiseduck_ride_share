const userRepository = require('../repositories/user.repository');

// Get user profile by ID
async function getProfile(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

// Update user profile
async function updateProfile(id, data) {
  const user = await userRepository.updateUser(id, data);
  return user;
}

// Add or update vehicles for a driver
async function updateVehicles(id, vehicles) {
  const user = await userRepository.findById(id);
  if (!user || user.userType !== 'driver') {
    throw new Error('Only drivers can update vehicles');
  }
  user.vehicles = vehicles;
  return user.save();
}

module.exports = {
  getProfile,
  updateProfile,
  updateVehicles
};
