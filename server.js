import app from "#app";
import db from "#db/client";

import dotenv from "dotenv";
dotenv.config();

console.log("NEWS_API_KEY at server start:", process.env.NEWS_API_KEY);

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
