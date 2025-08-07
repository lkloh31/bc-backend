import app from "#app";
import db from "#db/client";

import cors from "cors";
app.use(cors({ origin: /localhost/ }));

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
