import { db } from "../../../lib/db.js";
import { verifyTokenFromReq } from "../../../lib/auth.js";

export default async function handler(req, res) {
  try {
    const user = verifyTokenFromReq(req);

    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "missing id" });
    }

    if (req.method === "PUT") {
      const { title, content, category, pinned, published } = req.body || {};

      if (!title || !content || !category) {
        return res.status(400).json({ error: "missing fields" });
      }

      const allowedCategories = ["DEV", "MUSIC", "LIFE", "RESEARCH"];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: "invalid category" });
      }

      await db.execute({
        sql: `
          UPDATE logs
          SET
            title = ?,
            category = ?,
            excerpt = ?,
            content = ?,
            pinned = ?,
            published = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [
          title,
          category,
          content,
          content,
          pinned ? 1 : 0,
          published ? 1 : 0,
          id,
        ],
      });

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await db.execute({
        sql: `DELETE FROM logs WHERE id = ?`,
        args: [id],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "method not allowed" });
  } catch (error) {
    console.error("UPDATE/DELETE LOG ERROR:", error);
    return res.status(500).json({
      error: "internal server error",
      details: error?.message || String(error),
    });
  }
}