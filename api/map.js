import express from "express";
const router = express.Router();

import {
  getLocationsByUserId,
  addLocation,
  updateLocation,
  deleteLocation,
  getLocationById,
} from "#db/queries/map";

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

// Get all locations for the logged-in user
router.get("/locations", async (req, res, next) => {
  try {
    const locations = await getLocationsByUserId(req.user.id);
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

// POST Add a new location for the logged-in user
router.post(
  "/locations",
  requireBody(["name", "latitude", "longitude"]),
  async (req, res, next) => {
    try {
      const locationData = {
        ...req.body,
        userId: req.user.id,
      };
      const newLocation = await addLocation(locationData);
      res.status(201).json(newLocation);
    } catch (error) {
      next(error);
    }
  }
);

// PUT Update a specific location
router.put("/locations/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingLocation = await getLocationById(id);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found." });
    }
    if (existingLocation.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this location." });
    }

    const updatedLocation = await updateLocation(id, req.body);
    res.json(updatedLocation);
  } catch (error) {
    next(error);
  }
});

router.delete("/locations/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingLocation = await getLocationById(id);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found." });
    }
    if (existingLocation.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this location." });
    }

    await deleteLocation(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default router;