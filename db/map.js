const express = require('express');
const mapRouter = express.Router();
const { getMapPinsByUserId, createMapPin } = require('../db/queries/map');
const { requireUser } = require('../middleware/requireUser');

// Get all pins for logged-in user
mapRouter.get('/pins', requireUser, async (req, res, next) => {
  try {
    const pins = await getMapPinsByUserId(req.user.id);
    res.send(pins);
  } catch (error) {
    next(error);
  }
});

// Create new pin for logged-in user
mapRouter.post('/pins', requireUser, async (req, res, next) => {
  try {
    const { name, latitude, longitude, address, notes, rating } = req.body;
    const newPin = await createMapPin({ 
      userId: req.user.id,
      name,
      latitude,
      longitude, 
      address, 
      notes, 
      rating
    });
    res.status(201).send(newPin);
  } catch (error) {
    next(error);
  }
});


module.exports = mapRouter;