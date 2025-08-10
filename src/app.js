const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./utils/db');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
(async () => {
  try {
    await db.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error', err);
  }
})();

// Routes
app.use('/api/auth', require('./routes/auth'));
// Protect all routes below
app.use(auth);
app.use('/api/users', require('./routes/users'));
app.use('/api/rides', require('./routes/rides'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
