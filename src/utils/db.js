const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set');
  }
  await mongoose.connect(uri);
  return mongoose;
}

module.exports = {
  connect
};
