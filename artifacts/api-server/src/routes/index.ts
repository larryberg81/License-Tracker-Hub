import { Router, type IRouter } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
// Keep health checks usable even if an external host has not been configured
// with the existing PostgreSQL database yet. Never create a replacement DB.
router.use(async (req, res, next): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({ error: "The application database is not configured on this host." });
    return;
  }
  const { default: applicationsRouter } = await import("./applications");
  applicationsRouter(req, res, next);
});

export default router;
