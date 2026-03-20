import { clearAuthCookie } from "../../lib/auth.js";

export default async function handler(req, res) {
  res.setHeader("Set-Cookie", clearAuthCookie());
  return res.status(200).json({ success: true });
}