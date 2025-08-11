import express from "express";
import requireUser from "#middleware/requireUser";
import {
  getMapPinsByUserId,
  createMapPin,
  deleteMapPin,
} from "#db/queries/map";

const mapRouter = express.Router();

mapRouter.get("/mapbox-token", requireUser, (req, res) => {
  if (!process.env.MAPBOX_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Mapbox token not configured" });
  }
  res.json({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
});

mapRouter.get("/pins", requireUser, async (req, res, next) => {
  const pins = await getMapPinsByUserId(req.user.id);

  const formattedPins = pins.map((pin) => ({
    id: pin.id,
    name: pin.name,
    longitude: parseFloat(pin.longitude),
    latitude: parseFloat(pin.latitude),
    address: pin.address,
    notes: pin.notes,
    rating: pin.rating,
    visitedDate: pin.visited_date,
    locationType: pin.location_type,
    createdAt: pin.created_at,
  }));

  res.json(formattedPins);
});

mapRouter.post("/pins", requireUser, async (req, res, next) => {
  const {
    name,
    latitude,
    longitude,
    address,
    notes,
    rating,
    locationType,
    visitedDate,
  } = req.body;

  if (!name || !latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Name, latitude, and longitude are required" });
  }

  const newPin = await createMapPin({
    userId: req.user.id,
    name,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    address,
    notes,
    rating: rating ? parseInt(rating) : null,
    locationType,
    visitedDate,
  });

  const formattedPin = {
    id: newPin.id,
    name: newPin.name,
    longitude: parseFloat(newPin.longitude),
    latitude: parseFloat(newPin.latitude),
    address: newPin.address,
    notes: newPin.notes,
    rating: newPin.rating,
    visitedDate: newPin.visited_date,
    locationType: newPin.location_type,
    createdAt: newPin.created_at,
  };

  res.status(201).json(formattedPin);
});

mapRouter.delete("/pins/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;

  const deleted = await deleteMapPin(id, req.user.id);

  if (!deleted) {
    return res.status(404).json({ error: "Pin not found" });
  }

  res.json({ message: "Pin deleted successfully" });
});

export default mapRouter;
