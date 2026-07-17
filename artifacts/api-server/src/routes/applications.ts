import { Router, type IRouter } from "express";
import { eq, ilike, or, desc } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";
import {
  TrackApplicationQueryParams,
  TrackApplicationResponse,
  ListApplicationsQueryParams,
  ListApplicationsResponse,
  CreateApplicationBody,
  CreateApplicationResponse,
  GetApplicationParams,
  GetApplicationResponse,
  UpdateApplicationParams,
  UpdateApplicationBody,
  UpdateApplicationResponse,
  DeleteApplicationParams,
  GetStatsResponse,
  AdminLoginBody,
  AdminLoginResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateTrackingCode(): string {
  const L = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const N = "0123456789";
  const r = (set: string) => set[Math.floor(Math.random() * set.length)];
  // Format: [5 letters][6 digits][2 letters][1 digit][2 letters] [2 digits]  e.g. KHANX902077SN9JU 35
  return (
    r(L) + r(L) + r(L) + r(L) + r(L) +
    r(N) + r(N) + r(N) + r(N) + r(N) + r(N) +
    r(L) + r(L) +
    r(N) +
    r(L) + r(L) +
    " " +
    r(N) + r(N)
  );
}

const STATUS_LABELS: Record<string, string> = {
  registered: "Registered",
  pending_payment: "Pending Payment",
  processing: "Processing",
  processed: "Processed",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  registered: "Your application has been received and registered in our system.",
  pending_payment: "Your application is awaiting payment. Please complete the payment to proceed.",
  processing: "Your application is being reviewed and processed by our team.",
  processed: "Your application has been fully processed. Your licence will be dispatched shortly.",
};

const LICENCE_TYPE_LABELS: Record<string, string> = {
  provisional: "Provisional Licence",
  full_car: "Full Car Licence (Category B)",
  full_motorcycle: "Full Motorcycle Licence (Category A)",
  full_lorry: "Full Lorry Licence (Category C)",
  full_bus: "Full Bus Licence (Category D)",
  full_minibus: "Full Minibus Licence (Category D1)",
  international: "International Driving Permit (IDP)",
};

// Public tracking endpoint
router.get("/applications/track", async (req, res): Promise<void> => {
  const parsed = TrackApplicationQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }
  const { code } = parsed.data;
  // Normalise: strip all spaces and uppercase, then match against stored code
  // (stored codes may contain a space, e.g. "ZVAKL651161FT5TL 72")
  const normalised = code.replace(/\s+/g, '').toUpperCase();
  const results = await db
    .select()
    .from(applicationsTable)
    .where(
      or(
        eq(applicationsTable.trackingCode, normalised),
        eq(applicationsTable.trackingCode, code.toUpperCase()),
        // match stored codes that have a space by stripping their space too
        ilike(applicationsTable.trackingCode, normalised.slice(0, -2) + ' ' + normalised.slice(-2)),
      )
    )
    .limit(1);

  if (!results.length) {
    res.status(404).json({ error: "Application not found. Please check your tracking code." });
    return;
  }
  const app = results[0];
  const data = TrackApplicationResponse.parse({
    trackingCode: app.trackingCode,
    fullName: app.fullName,
    licenceType: LICENCE_TYPE_LABELS[app.licenceType] || app.licenceType,
    status: app.status,
    statusLabel: STATUS_LABELS[app.status] || app.status,
    statusDescription: STATUS_DESCRIPTIONS[app.status] || "",
    submittedAt: app.submittedAt.toISOString(),
    estimatedCompletion: app.estimatedCompletion ?? null,
    notes: app.notes ?? null,
    licenceImageFront: app.licenceImageFront ?? null,
    licenceImageBack: app.licenceImageBack ?? null,
  });
  res.json(data);
});

// Admin: list applications
router.get("/admin/applications", async (req, res): Promise<void> => {
  const parsed = ListApplicationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }
  const { status, search } = parsed.data;
  let query = db.select().from(applicationsTable).$dynamic();

  if (status) {
    query = query.where(eq(applicationsTable.status, status as any));
  } else if (search) {
    query = query.where(
      or(
        ilike(applicationsTable.fullName, `%${search}%`),
        ilike(applicationsTable.email, `%${search}%`),
        ilike(applicationsTable.trackingCode, `%${search}%`)
      )
    );
  }

  const apps = await query.orderBy(desc(applicationsTable.submittedAt));
  const data = ListApplicationsResponse.parse(
    apps.map((a) => ({
      ...a,
      email: a.email ?? null,
      phone: a.phone ?? null,
      licenceCategory: a.licenceCategory ?? null,
      notes: a.notes ?? null,
      estimatedCompletion: a.estimatedCompletion ?? null,
      submittedAt: a.submittedAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }))
  );
  res.json(data);
});

// Admin: create application
router.post("/admin/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const trackingCode = generateTrackingCode();
  const [created] = await db
    .insert(applicationsTable)
    .values({
      ...parsed.data,
      trackingCode,
      status: parsed.data.status ?? "registered",
    })
    .returning();
  const data = CreateApplicationResponse.parse({
    ...created,
    email: created.email ?? null,
    phone: created.phone ?? null,
    licenceCategory: created.licenceCategory ?? null,
    referenceNumber: created.referenceNumber ?? null,
    notes: created.notes ?? null,
    estimatedCompletion: created.estimatedCompletion ?? null,
    licenceImageFront: created.licenceImageFront ?? null,
    licenceImageBack: created.licenceImageBack ?? null,
    submittedAt: created.submittedAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
  res.status(201).json(data);
});

// Admin: get application by id
router.get("/admin/applications/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetApplicationParams.safeParse({ id: parseInt(rawId, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }
  const results = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, parsed.data.id))
    .limit(1);

  if (!results.length) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const a = results[0];
  const data = GetApplicationResponse.parse({
    ...a,
    email: a.email ?? null,
    phone: a.phone ?? null,
    licenceCategory: a.licenceCategory ?? null,
    referenceNumber: a.referenceNumber ?? null,
    notes: a.notes ?? null,
    estimatedCompletion: a.estimatedCompletion ?? null,
    licenceImageFront: a.licenceImageFront ?? null,
    licenceImageBack: a.licenceImageBack ?? null,
    submittedAt: a.submittedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  });
  res.json(data);
});

// Admin: update application
router.patch("/admin/applications/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateApplicationParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }
  const bodyParsed = UpdateApplicationBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const [updated] = await db
    .update(applicationsTable)
    .set({ ...bodyParsed.data, updatedAt: new Date() })
    .where(eq(applicationsTable.id, paramsParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const data = UpdateApplicationResponse.parse({
    ...updated,
    email: updated.email ?? null,
    phone: updated.phone ?? null,
    licenceCategory: updated.licenceCategory ?? null,
    referenceNumber: updated.referenceNumber ?? null,
    notes: updated.notes ?? null,
    estimatedCompletion: updated.estimatedCompletion ?? null,
    licenceImageFront: updated.licenceImageFront ?? null,
    licenceImageBack: updated.licenceImageBack ?? null,
    submittedAt: updated.submittedAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
  res.json(data);
});

// Admin: delete application
router.delete("/admin/applications/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteApplicationParams.safeParse({ id: parseInt(rawId, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }
  await db.delete(applicationsTable).where(eq(applicationsTable.id, parsed.data.id));
  res.status(204).send();
});

// Admin: stats
router.get("/admin/stats", async (req, res): Promise<void> => {
  const all = await db
    .select()
    .from(applicationsTable)
    .orderBy(desc(applicationsTable.submittedAt));

  const counts = { registered: 0, pending_payment: 0, processing: 0, processed: 0 };
  for (const a of all) {
    if (a.status in counts) counts[a.status as keyof typeof counts]++;
  }
  const recentApplications = all.slice(0, 5).map((a) => ({
    ...a,
    phone: a.phone ?? null,
    licenceCategory: a.licenceCategory ?? null,
    notes: a.notes ?? null,
    estimatedCompletion: a.estimatedCompletion ?? null,
    submittedAt: a.submittedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  const data = GetStatsResponse.parse({
    total: all.length,
    ...counts,
    recentApplications,
  });
  res.json(data);
});

// Admin: login
router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { username, password } = parsed.data;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dvla_admin_2025";

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  // Simple token: base64 encoded timestamp + credentials hash
  const token = Buffer.from(`${username}:${Date.now()}:uk-licence-admin`).toString("base64");
  const data = AdminLoginResponse.parse({ token, message: "Login successful" });
  res.json(data);
});

export default router;
