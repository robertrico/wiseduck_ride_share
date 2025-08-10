const express = require('express');
const router = express.Router();
const ridesService = require('../services/rides.service');

// Request a ride (riders only)
router.post('/request', async (req, res, next) => {
  try {
    const { pickupLocation, destination, fare } = req.body;
    const ride = await ridesService.requestRide(
      req.user._id,
      pickupLocation,
      destination,
      fare
    );
    res.json({ success: true, data: ride });
  } catch (err) {
    next(err);
  }
});

// Get available ride requests (drivers)
router.get('/available', async (req, res, next) => {
  try {
    if (req.user.userType !== 'driver') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const rides = await ridesService.getAvailableRides();
    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
});

// Accept a ride (drivers)
router.put('/:id/accept', async (req, res, next) => {
  try {
    const ride = await ridesService.acceptRide(req.params.id, req.user._id);
    res.json({ success: true, data: ride });
  } catch (err) {
    next(err);
  }
});

// Update ride status
router.put('/:id/status', async (req, res, next) => {
  try {
    const ride = await ridesService.updateStatus(
      req.params.id,
      req.user._id.toString(),
      req.body.status
    );
    res.json({ success: true, data: ride });
  } catch (err) {
    next(err);
  }
});

// Get user's ride history
router.get('/history', async (req, res, next) => {
  try {
    const rides = await ridesService.getRideHistory(req.user._id);
    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
