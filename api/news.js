import express from "express";
const router = express.Router();

import { getNews, saveArticle } from "../db/queries/news.js";

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "fabianacarvalho",
  host: "localhost",
  database: "bc",
  password: "your_pg_password",
  port: 5432,
});

router.get("/", async (req, res) => {
  const { q = "latest", page = 1 } = req.query;
  const client = await pool.connect();
  try {
    // 1. Fetch latest articles from API
    const articles = await getNews(q, page);
    for (const article of articles) {
      await saveArticle(article);
    }

    // 2. Get the newest 50 articles from DB
    const { rows } = await client.query(
      `SELECT * FROM news 
   WHERE title ILIKE $1 OR description ILIKE $1
   ORDER BY published_at DESC 
   LIMIT 50`,
      [`%${q}%`]
    );

    // 3. Prevent caching so it's always fresh
    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

export default router;
