const express = require('express');
const router = express.Router();
const usersService = require('../services/users.service');

// Get user profile (auth middleware applied globally)
router.get('/profile', async (req, res, next) => {
  try {
    const user = await usersService.getProfile(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const user = await usersService.updateProfile(req.user._id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Add or update vehicles for drivers
router.put('/vehicles', async (req, res, next) => {
  try {
    const user = await usersService.updateVehicles(req.user._id, req.body.vehicles || []);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
