import express from "express";
import requestIp from "request-ip";

const router = express.Router();

import {
  createUser,
  getUserByEmailAndPassword,
  getUserById,
  deleteUser,
  updateUser,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["name", "email", "password"]), async (req, res) => {
    const { name, email, password } = req.body;

    // Get client IP
    // const clientIp = requestIp.getClientIp(req) || "8.8.8.8"; // fallback for testing
    const clientIp = requestIp.getClientIp(req);
    const ipToUse =
      clientIp === "::1" || clientIp === "127.0.0.1" ? "8.8.8.8" : clientIp;

    let location;

    // If location not provided by client, fetch from GeoJS
    if (!location) {
      const geoRes = await fetch(
        `https://get.geojs.io/v1/ip/geo/${ipToUse}.json`
      );
      const geoData = await geoRes.json();

      if (geoData.latitude && geoData.longitude) {
        location = `${geoData.latitude},${geoData.longitude}`;
      } else {
        location = null;
      }
    }

    const created_at = new Date();

    const user = await createUser(name, email, password, location, created_at);


    const token = await createToken({ id: user.id });
    res.status(201).send({token});

  });

router
  .route("/login")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) return res.status(401).send("Invalid email or password.");


    const token = await createToken({ id: user.id });
    res.send({token});

  });

router.route("/:id").get(requireUser, async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a positive integer.");

  const user = await getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.send(user);
});

router.delete("/:id", requireUser, async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a positive integer.");

  if (req.user.id !== Number(id)) {
    return res.status(403).send("You can only delete your own user.");
  }

  const user = await getUserById(id);
  if (!user) return res.status(404).send("User not found.");

  await deleteUser(id);

  res.sendStatus(204);
});

router.put("/:id", requireUser, async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a positive integer.");

  if (req.user.id !== Number(id)) {
    return res.status(403).send("You can only update your own user.");
  }

  const existing = await getUserById(id);
  if (!existing) return res.status(404).json({ error: "User not found" });

  const {
    name = existing.name,
    email = existing.email,
    password = existing.password,
    location = existing.location,
  } = req.body;

  const user = await updateUser({
    id,
    name,
    email,
    password,
    location,
  });

  res.send(user);
});

export default router;
