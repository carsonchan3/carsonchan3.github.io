import { desc, eq } from "drizzle-orm";

function parseStoredJson<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
import { drizzle } from "drizzle-orm/mysql2";
import { type EnquiryStatus, InsertUser, users, contactSubmissions, InsertContactSubmission, productsTable, servicesTable } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function saveContactSubmission(data: InsertContactSubmission): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save contact submission: database not available");
    return;
  }

  try {
    await db.insert(contactSubmissions).values(data);
    console.log("[Database] Contact submission saved successfully");
  } catch (error) {
    console.error("[Database] Failed to save contact submission:", error);
    throw error;
  }
}

export async function listContactSubmissions(status?: EnquiryStatus) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list contact submissions: database not available");
    return [];
  }

  const query = db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(250);
  return status ? query.where(eq(contactSubmissions.status, status)) : query;
}

export async function updateContactSubmissionStatus(id: number, status: EnquiryStatus) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  return db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}

export async function listProductsFromDb() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(productsTable).orderBy(productsTable.displayOrder);
  return rows.map((row) => ({
    ...row,
    variants: parseStoredJson<Array<{ name: string; model: string; price: string; imageUrl?: string }>>(row.variants) || [],
  }));
}

export async function upsertProductInDb(data: {
  familyId: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  refNumber: string;
  variants: Array<{ name: string; model: string; price: string; imageUrl?: string }>;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const variantsJson = JSON.stringify(data.variants);
  const existing = await db.select().from(productsTable).where(eq(productsTable.familyId, data.familyId));
  if (existing.length > 0) {
    await db.update(productsTable)
      .set({
        name: data.name,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
        refNumber: data.refNumber,
        variants: variantsJson,
        displayOrder: data.displayOrder ?? existing[0].displayOrder,
      })
      .where(eq(productsTable.familyId, data.familyId));
  } else {
    await db.insert(productsTable).values({
      familyId: data.familyId,
      name: data.name,
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      refNumber: data.refNumber,
      variants: variantsJson,
      displayOrder: data.displayOrder ?? 0,
    });
  }
}


export async function deleteProductFromDb(familyId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productsTable).where(eq(productsTable.familyId, familyId));
}

export async function listServicesFromDb() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(servicesTable).orderBy(servicesTable.displayOrder);
  return rows;
}

export async function upsertServiceInDb(data: {
  serviceId: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  duration: string;
  pricingText: string;
  details: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(servicesTable)
    .values({
      serviceId: data.serviceId,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      duration: data.duration,
      pricingText: data.pricingText,
      details: data.details,
      displayOrder: data.displayOrder ?? 0,
    })
    .onDuplicateKeyUpdate({
      set: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
        duration: data.duration,
        pricingText: data.pricingText,
        details: data.details,
        displayOrder: data.displayOrder ?? 0,
      },
    });
}

export async function deleteServiceFromDb(serviceId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(servicesTable).where(eq(servicesTable.serviceId, serviceId));
}
