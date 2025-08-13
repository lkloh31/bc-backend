import db from "#db/client";

export async function createMapPin({
  userId,
  name,
  latitude,
  longitude,
  address,
  notes,
  rating,
  locationType,
  visitedDate,
}) {
  const sql = `
    INSERT INTO map (user_id, name, latitude, longitude, address, notes, rating, location_type, visited_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *
    `;
  const {
    rows: [pin],
  } = await db.query(sql, [
    userId,
    name,
    latitude,
    longitude,
    address,
    notes,
    rating,
    locationType,
    visitedDate,
  ]);
  return pin;
}

export async function getMapPinsByUserId(userId) {
  const sql = `
    SELECT * 
    FROM map 
    WHERE user_id = $1 
    ORDER BY created_at DESC
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function updateMapPin({
  id,
  userId,
  name,
  address,
  notes,
  rating,
  locationType,
  visitedDate,
}) {
  const sql = `
    UPDATE map 
    SET 
      name = $3,
      address = $4,
      notes = $5,
      rating = $6,
      location_type = $7,
      visited_date = $8
    WHERE id = $1 AND user_id = $2 
    RETURNING *
    `;
  const {
    rows: [pin],
  } = await db.query(sql, [
    id,
    userId,
    name,
    address,
    notes,
    rating,
    locationType,
    visitedDate,
  ]);
  return pin;
}

export async function deleteMapPin(pinId, userId) {
  const sql = `
    DELETE FROM map 
    WHERE id = $1 AND user_id = $2 
    RETURNING *
    `;
  const {
    rows: [pin],
  } = await db.query(sql, [pinId, userId]);
  return pin;
}
