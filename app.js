import morgan from "morgan";
import express from "express";
const app = express();
import cors from "cors";

export default app;

import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(
  cors({
    origin: "http://localhost:5174",
  })
);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/admin", usersRouter);

app.use((err, req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      // CHANGE THIS to send JSON
      return res.status(400).json({ message: err.message });
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      // CHANGE THIS to send JSON
      return res.status(400).json({ message: err.detail });
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
