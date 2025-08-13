import express from "express";
const router = express.Router();

import {
  getRatesFromAPI,
  getRateByCodeFromAPI,
} from "../db/queries/exchange.js";

// GET /daily/exchange - get all rates from API
router.get("/", async (req, res) => {
  const base = req.query.base || "USD";
  try {
    const rates = await getRatesFromAPI(base);
    res.json(rates);
  } catch (err) {
    console.error("Error fetching rates:", err);
    res.status(500).json({ error: "Failed to fetch rates from API" });
  }
});

// GET /daily/exchange/:code - get a specific currency rate from API
router.get("/:code", async (req, res) => {
  const base = req.query.base || "USD";
  try {
    const currency = await getRateByCodeFromAPI(req.params.code, base);
    if (!currency) {
      return res.status(404).json({ error: "Currency not found" });
    }
    res.json(currency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch currency from API" });
  }
});

export default router;
