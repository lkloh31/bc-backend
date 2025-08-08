const db = require('../client');

// Get all map pins for specific user
const getMapPinsByUserId = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM map_pins WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Create a new map pin
const createMapPin = async ({ userId, name, latitude, longitude, address, notes, rating }) => {
  const { rows: [pin] } = await db.query(
    `INSERT INTO map_pins (user_id, name, latitude, longitude, address, notes, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, name, latitude, longitude, address, notes, rating]
  );
  return pin;
};

module.exports = {
  getMapPinsByUserId,
  createMapPin,
};