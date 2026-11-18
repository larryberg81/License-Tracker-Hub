import type { Request, Response } from "express";
import app from "./app";

// Keep the existing Express /api routes and query parameters after rewriting
// all API requests to the single serverless function.
export default function handler(req: Request, res: Response) {
  const url = new URL(req.url ?? "/", "http://internal");
  const route = url.searchParams.get("__api_path");
  if (route !== null) {
    url.searchParams.delete("__api_path");
    const query = url.searchParams.toString();
    req.url = `/api/${route}${query ? `?${query}` : ""}`;
  }
  return app(req, res);
}
