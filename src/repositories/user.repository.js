const User = require('../models/User');

async function createUser(data) {
  const user = new User(data);
  return user.save();
}

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findById(id) {
  return User.findById(id);
}

async function updateUser(id, update) {
  return User.findByIdAndUpdate(id, update, { new: true });
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUser
};
