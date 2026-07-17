import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const licenceTypeEnum = pgEnum("licence_type", [
  "provisional",
  "full_car",
  "full_motorcycle",
  "full_lorry",
  "full_bus",
  "full_minibus",
  "international",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "registered",
  "pending_payment",
  "processing",
  "processed",
]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  trackingCode: text("tracking_code").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth").notNull(),
  licenceType: licenceTypeEnum("licence_type").notNull(),
  licenceCategory: text("licence_category"),
  status: applicationStatusEnum("status").notNull().default("registered"),
  notes: text("notes"),
  estimatedCompletion: text("estimated_completion"),
  licenceImageFront: text("licence_image_front"),
  licenceImageBack: text("licence_image_back"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  trackingCode: true,
  submittedAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
