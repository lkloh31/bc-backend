import morgan from "morgan";
import express from "express";
import cors from "cors";

import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import newsRouter from "#api/news";
import weatherRouter from "./api/weather.js";
import exchangeRouter from "#api/exchange";
import mapRouter from "#api/map";

const app = express();

// ---- CORS
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow Postman/curl (no Origin)
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Express 5-safe wildcard for preflights:
app.options(/.*/, cors(corsOptions));
// ---- end CORS

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(getUserFromToken);

// routes
app.use("/users", usersRouter);
app.use("/daily/news", newsRouter);
app.use("/daily/weather", weatherRouter);
app.use("/daily/exchange", exchangeRouter);
app.use("/map", mapRouter);

// pg error handler
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).json({ message: err.message });
    case "23505":
    case "23503":
      return res.status(400).json({ message: err.detail });
    default:
      next(err);
  }
});

// fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
