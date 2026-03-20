import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { parse } from "cookie";

const COOKIE_NAME = "imdat_admin_token";

export function verifyPassword(password) {
  return bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH);
}

export function signToken() {
  return jwt.sign(
    { username: process.env.ADMIN_USERNAME },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyTokenFromReq(req) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function authCookie(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`;
}

export function clearAuthCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}