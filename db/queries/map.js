import db from "#db/client";

/**
 * Retrieves all map locations for a specific user.
 * @param {number} userId - The ID of the user whose locations are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of location objects.
 */
export async function getLocationsByUserId(userId) {
  const sql = `
    SELECT *
    FROM map
    WHERE user_id = $1
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

/**
 * Retrieves a single map location by its ID.
 * @param {number} locationId - The ID of the location to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the location object, or null if not found.
 */
export async function getLocationById(locationId) {
    const sql = `
    SELECT *
    FROM map
    WHERE id = $1
    `;
    const {
        rows: [location],
    } = await db.query(sql, [locationId]);
    return location;
}


/**
 * Adds a new location to the map table for a specific user.
 * @param {Object} locationData - An object containing the location details.
 * @param {string} locationData.name - The name of the location.
 * @param {string} locationData.address - The address of the location.
 * @param {number} locationData.latitude - The latitude coordinate.
 * @param {number} locationData.longitude - The longitude coordinate.
 * @param {string} [locationData.location_type] - The type of location (e.g., 'been_there', 'want_to_go').
 * @param {string} [locationData.notes] - User's notes about the location.
 * @param {number} [locationData.rating] - User's rating of the location.
 * @param {Date} [locationData.visited_date] - The date the location was visited.
 * @param {number} locationData.userId - The ID of the user adding the location.
 * @returns {Promise<Object>} A promise that resolves to the newly created location object.
 */
export async function addLocation({
  name,
  address,
  latitude,
  longitude,
  location_type,
  notes,
  rating,
  visited_date,
  userId,
}) {
  const sql = `
    INSERT INTO map
      (name, address, latitude, longitude, location_type, notes, rating, visited_date, user_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const {
    rows: [location],
  } = await db.query(sql, [
    name,
    address,
    latitude,
    longitude,
    location_type,
    notes,
    rating,
    visited_date,
    userId,
  ]);
  return location;
}

/**
 * Updates an existing location in the map table.
 * @param {number} locationId - The ID of the location to update.
 * @param {Object} updates - An object containing the fields to update.
 * @returns {Promise<Object>} A promise that resolves to the updated location object.
 */
export async function updateLocation(locationId, updates) {
    // Dynamically build the SET part of the query to only update provided fields
    const { rows: [existingLocation] } = await db.query('SELECT * FROM map WHERE id = $1', [locationId]);
    if (!existingLocation) return null;

    const newValues = { ...existingLocation, ...updates };

    const sql = `
        UPDATE map
        SET name = $2, address = $3, latitude = $4, longitude = $5, location_type = $6, notes = $7, rating = $8, visited_date = $9
        WHERE id = $1
        RETURNING *
    `;
    const { rows: [updatedLocation] } = await db.query(sql, [
        locationId,
        newValues.name,
        newValues.address,
        newValues.latitude,
        newValues.longitude,
        newValues.location_type,
        newValues.notes,
        newValues.rating,
        newValues.visited_date
    ]);
    return updatedLocation;
}


/**
 * Deletes a location from the map table.
 * @param {number} locationId - The ID of the location to delete.
 * @returns {Promise<Object>} A promise that resolves to the deleted location object.
 */
export async function deleteLocation(locationId) {
  const sql = `
    DELETE FROM map
    WHERE id = $1
    RETURNING *
  `;
  const {
    rows: [location],
  } = await db.query(sql, [locationId]);
  return location;
}