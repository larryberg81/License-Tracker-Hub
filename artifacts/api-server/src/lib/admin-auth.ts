import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import type { RequestHandler } from "express";

export interface AdminConfig {
  username: string;
  password: string;
  secret: string;
}

export function getAdminConfig(): AdminConfig | null {
  const { ADMIN_USERNAME: username, ADMIN_PASSWORD: password, SESSION_SECRET: secret } = process.env;
  return username && password && secret && secret.length >= 32
    ? { username, password, secret }
    : null;
}

function signature(payload: string, config: AdminConfig) {
  // Changing either credentials or the session secret invalidates old tokens.
  return createHmac("sha256", config.secret)
    .update(JSON.stringify([config.username, config.password, payload]))
    .digest("base64url");
}

export function sameValue(a: string, b: string): boolean {
  const left = createHmac("sha256", "credential-comparison").update(a).digest();
  const right = createHmac("sha256", "credential-comparison").update(b).digest();
  return timingSafeEqual(left, right);
}

export function createAdminToken(config: AdminConfig, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({
    sub: config.username,
    exp: now + 60 * 60 * 1000,
    nonce: randomBytes(16).toString("hex"),
  })).toString("base64url");
  return `${payload}.${signature(payload, config)}`;
}

export function verifyAdminToken(token: string, config: AdminConfig, now = Date.now()): boolean {
  try {
    if (token.length > 2048) return false;
    const [payload, sig, extra] = token.split(".");
    if (!payload || !sig || extra || !sameValue(sig, signature(payload, config))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.sub === config.username && typeof data.exp === "number" && data.exp > now;
  } catch {
    return false;
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.path === "/login" && req.method === "POST") {
    next();
    return;
  }
  const config = getAdminConfig();
  if (!config) {
    res.status(503).json({ error: "Admin access is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and a SESSION_SECRET of at least 32 characters." });
    return;
  }
  const token = req.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !verifyAdminToken(token, config)) {
    res.status(401).json({ error: "Please sign in again." });
    return;
  }
  next();
};
