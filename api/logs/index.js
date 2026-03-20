import { db } from "../../lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "method not allowed" });
    }

    const result = await db.execute(`
      SELECT *
      FROM logs
      WHERE published = 1
      ORDER BY pinned DESC, date DESC, created_at DESC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET LOGS ERROR:", error);
    return res.status(500).json({
      error: "internal server error",
      details: error?.message || String(error),
    });
  }
}