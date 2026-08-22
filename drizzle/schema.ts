import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const enquiryStatusValues = ["new", "in_review", "awaiting_customer", "quoted", "resolved", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatusValues)[number];

// Contact form submissions table
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  sport: varchar("sport", { length: 120 }),
  selectedService: varchar("selectedService", { length: 120 }),
  cartItems: text("cartItems"),
  deliveryAddress: text("deliveryAddress"),
  repairIntake: text("repairIntake"),
  organizationType: varchar("organizationType", { length: 120 }),
  preferredDate: varchar("preferredDate", { length: 40 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", enquiryStatusValues).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

export const productsTable = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  familyId: varchar("familyId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageAlt: varchar("imageAlt", { length: 255 }).notNull(),
  refNumber: varchar("refNumber", { length: 64 }).notNull(),
  variants: text("variants").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DbProduct = typeof productsTable.$inferSelect;
export type InsertDbProduct = typeof productsTable.$inferInsert;


export const servicesTable = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: varchar("serviceId", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageAlt: varchar("imageAlt", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 120 }).notNull(),
  pricingText: varchar("pricingText", { length: 255 }).notNull(),
  details: text("details").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DbService = typeof servicesTable.$inferSelect;
export type InsertDbService = typeof servicesTable.$inferInsert;

export const mediaAssetTypeValues = ["image", "video", "logo"] as const;
export type MediaAssetType = (typeof mediaAssetTypeValues)[number];

/**
 * Registry metadata for managed media. The original storage URL remains stable;
 * this table supplies a human-readable name and an owner-editable page/placement
 * grouping so assets can be found without relying on hashed file names.
 */
export const mediaAssets = mysqlTable("mediaAssets", {
  id: int("id").autoincrement().primaryKey(),
  assetKey: varchar("assetKey", { length: 160 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  pageKey: varchar("pageKey", { length: 80 }).notNull(),
  pageLabel: varchar("pageLabel", { length: 120 }).notNull(),
  placementKey: varchar("placementKey", { length: 120 }).notNull(),
  placementLabel: varchar("placementLabel", { length: 255 }).notNull(),
  assetType: mysqlEnum("assetType", mediaAssetTypeValues).notNull(),
  storageUrl: varchar("storageUrl", { length: 500 }).notNull().unique(),
  altText: varchar("altText", { length: 500 }),
  sourceType: varchar("sourceType", { length: 80 }).notNull(),
  sourceReference: varchar("sourceReference", { length: 160 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
