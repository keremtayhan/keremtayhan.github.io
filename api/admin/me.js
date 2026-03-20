import { verifyTokenFromReq } from "../../lib/auth.js";

export default async function handler(req, res) {
  const user = verifyTokenFromReq(req);

  if (!user) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user,
  });
}