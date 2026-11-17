import type { Request, Response } from "express";
import app from "./app";

// Vercel rewrites to one function. Preserve the Express /api prefix and query
// parameters explicitly instead of depending on platform rewrite semantics.
export default function handler(req: Request, res: Response) {
  const url = new URL(req.url ?? "/", "http://internal");
  const route = url.searchParams.get("__api_path") ?? "";
  url.searchParams.delete("__api_path");
  const query = url.searchParams.toString();
  req.url = `/api/${route}${query ? `?${query}` : ""}`;
  return app(req, res);
}
