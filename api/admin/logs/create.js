import { db } from "../../../lib/db.js";
import { verifyTokenFromReq } from "../../../lib/auth.js";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function handler(req, res) {
  try {
    const user = verifyTokenFromReq(req);

    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "method not allowed" });
    }

    const { title, content, category, pinned, published } = req.body || {};

    if (!title || !content || !category) {
      return res.status(400).json({ error: "missing fields" });
    }

    const allowedCategories = ["DEV", "MUSIC", "LIFE", "RESEARCH"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "invalid category" });
    }

    const slug = `${slugify(title)}-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    await db.execute({
      sql: `
        INSERT INTO logs (
          title,
          slug,
          date,
          category,
          excerpt,
          content,
          featured,
          pinned,
          published
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        title,
        slug,
        today,
        category,
        content,
        content,
        0,
        pinned ? 1 : 0,
        published ? 1 : 0,
      ],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("CREATE LOG ERROR:", error);
    return res.status(500).json({
      error: "internal server error",
      details: error?.message || String(error),
    });
  }
}