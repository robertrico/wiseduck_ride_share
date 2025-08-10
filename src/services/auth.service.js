const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

// Register a new user
async function register(userData) {
  const existing = await userRepository.findByEmail(userData.email);
  if (existing) {
    throw new Error('Email already in use');
  }
  const hashed = await bcrypt.hash(userData.password, 10);
  const user = await userRepository.createUser({ ...userData, password: hashed });
  return user;
}

// Login user and return JWT token
async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
}

module.exports = {
  register,
  login
};
