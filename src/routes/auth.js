const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
