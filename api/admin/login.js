import { verifyPassword, signToken, authCookie } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  console.log("USERNAME FROM BODY:", username);
  console.log("USERNAME FROM ENV:", process.env.ADMIN_USERNAME);
  console.log("PASSWORD CHECK:", verifyPassword(password));

  if (username !== process.env.ADMIN_USERNAME || !verifyPassword(password)) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const token = signToken();
  res.setHeader("Set-Cookie", authCookie(token));

  return res.status(200).json({ success: true });
}