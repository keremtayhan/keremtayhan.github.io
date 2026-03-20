import { db } from "../../lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "method not allowed" });
    }

    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "missing slug" });
    }

    const result = await db.execute({
      sql: `
        SELECT *
        FROM logs
        WHERE slug = ? AND published = 1
        LIMIT 1
      `,
      args: [slug],
    });

    const log = result.rows[0];

    if (!log) {
      return res.status(404).json({ error: "log not found" });
    }

    return res.status(200).json(log);
  } catch (error) {
    console.error("GET SINGLE LOG ERROR:", error);
    return res.status(500).json({
      error: "internal server error",
      details: error?.message || String(error),
    });
  }
}