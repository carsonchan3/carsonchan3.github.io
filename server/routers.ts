import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type EnquiryStatus, enquiryStatusValues } from "../drizzle/schema";
import { listContactSubmissions, saveContactSubmission, updateContactSubmissionStatus, listProductsFromDb, upsertProductInDb, deleteProductFromDb, listServicesFromDb, upsertServiceInDb, deleteServiceFromDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const NAME_PATTERN = /^[^<>]{2,100}$/;
export const productImageAltInput = z.string().optional().transform((value) => value?.trim() || "Product image");
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_SUBMISSIONS = 5;
const MAX_CONTACT_RATE_BUCKETS = 10_000;
const contactRateBuckets = new Map<string, number[]>();
const sportOptions = ["Drone sports", "Basketball", "Football / soccer", "Other sports", "Research / technology", "Drone soccer", "RoboCon competition", "Ground truth", "Other"] as const;
const organizationTypeOptions = ["Sports league or association", "Event organizer", "Technology company", "School or university", "Other organization", "Drone club", "Education provider", "Research team", "Other"] as const;
const selectedServiceOptions = ["PID tuning service", "Drone Building Course", "Advanced drone course for adults", "Drone Repair Service"] as const;
const repairPriorRepairOptions = ["No previous repairs", "Previously repaired", "Unknown"] as const;
const repairPowerStateOptions = ["Powers on", "Does not power on", "Intermittent or unsure"] as const;

const hasNoControlCharacters = (value: string) => !CONTROL_CHARACTER_PATTERN.test(value);
const optionalShortText = (maxLength: number) =>
  z.string().trim().max(maxLength).refine(hasNoControlCharacters, "Contains unsupported control characters").optional().transform((value) => value || undefined);
const optionalChoice = (options: readonly string[]) =>
  z.string().trim().refine((value) => options.includes(value), "Unsupported selection").optional().transform((value) => value || undefined);
const storedImageUrl = z
  .string()
  .trim()
  .refine(
    (value) => /^https:\/\/\S+$/i.test(value) || /^\/manus-storage\/[^/\s].+/.test(value),
    "Upload an image or provide a valid HTTPS image URL",
  );
const cartItemSchema = z.object({
  sourceId: z.string().trim().min(1).max(32).regex(/^[A-Za-z0-9_-]+$/, "Invalid product reference"),
  name: z.string().trim().min(2).max(160).refine(hasNoControlCharacters, "Product name contains unsupported control characters"),
  model: optionalShortText(80),
  price: z.string().trim().regex(/^HK\$\d[\d,]*$/, "Invalid listed price").max(32),
  quantity: z.number().int().min(1).max(99),
}).strict();

const repairIntakeSchema = z.object({
  droneModel: optionalShortText(120),
  faultSymptoms: z.string().trim().max(1_500).refine(hasNoControlCharacters, "Fault symptoms contain unsupported control characters").optional().transform((value) => value || undefined),
  priorRepairs: optionalChoice(repairPriorRepairOptions),
  powerState: optionalChoice(repairPowerStateOptions),
  hasPhotos: z.boolean().optional().default(false),
}).strict();

const contactInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100).refine(hasNoControlCharacters, "Name contains unsupported control characters").refine((value) => NAME_PATTERN.test(value), "Name contains unsupported characters"),
  email: z.string().trim().toLowerCase().email("Invalid email").max(320),
  company: optionalShortText(120),
  sport: optionalChoice(sportOptions),
  selectedService: optionalChoice(selectedServiceOptions),
  cartItems: z.array(cartItemSchema).min(1).max(25).refine((items) => new Set(items.map((item) => item.sourceId)).size === items.length, "Duplicate cart item").optional(),
  deliveryAddress: optionalShortText(500),
  repairIntake: repairIntakeSchema.optional(),
  organizationType: optionalChoice(organizationTypeOptions),
  preferredDate: optionalShortText(40),
  message: z.string().trim().min(10, "Please provide a little more detail").max(4_000, "Message is too long").refine(hasNoControlCharacters, "Message contains unsupported control characters"),
  website: z.string().max(0, "Unable to submit this request").optional().default(""),
}).strict().superRefine((input, context) => {
  if (input.cartItems?.length && !input.deliveryAddress) {
    context.addIssue({ code: "custom", path: ["deliveryAddress"], message: "Delivery address is required for product pricing" });
  }
  if (input.selectedService === "Drone Repair Service") {
    if (!input.repairIntake?.droneModel) context.addIssue({ code: "custom", path: ["repairIntake", "droneModel"], message: "Drone model is required for repair intake" });
    if (!input.repairIntake?.faultSymptoms || input.repairIntake.faultSymptoms.length < 10) context.addIssue({ code: "custom", path: ["repairIntake", "faultSymptoms"], message: "Please provide fault symptoms for repair intake" });
    if (!input.repairIntake?.priorRepairs) context.addIssue({ code: "custom", path: ["repairIntake", "priorRepairs"], message: "Previous repair status is required" });
    if (!input.repairIntake?.powerState) context.addIssue({ code: "custom", path: ["repairIntake", "powerState"], message: "Power-up state is required" });
  } else if (input.repairIntake) {
    context.addIssue({ code: "custom", path: ["repairIntake"], message: "Repair intake is only available for Drone Repair Service" });
  }
});

type StoredCartItem = { sourceId: string; name: string; model?: string; price: string; quantity: number };
type StoredRepairIntake = { droneModel?: string; faultSymptoms?: string; priorRepairs?: string; powerState?: string; hasPhotos?: boolean };

const parseStoredJson = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed as T : null;
  } catch {
    return null;
  }
};

const getEnquiryKind = (submission: { selectedService: string | null; cartItems: string | null }) => {
  if (submission.selectedService === "Drone Repair Service") return "repair" as const;
  if (submission.cartItems) return "product-pricing" as const;
  if (submission.selectedService) return "service" as const;
  return "general" as const;
};

const getContactRateLimitKey = (req: { ip?: string; socket?: { remoteAddress?: string } }) => {
  const clientAddress = req.ip || req.socket?.remoteAddress || "anonymous";
  return clientAddress.slice(0, 128);
};

const enforceContactRateLimit = (req: { ip?: string; socket?: { remoteAddress?: string } }) => {
  const now = Date.now();
  const key = getContactRateLimitKey(req);
  const recentSubmissions = (contactRateBuckets.get(key) ?? []).filter((timestamp) => now - timestamp < CONTACT_RATE_LIMIT_WINDOW_MS);

  if (recentSubmissions.length >= CONTACT_RATE_LIMIT_MAX_SUBMISSIONS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please wait a few minutes before trying again.",
    });
  }

  recentSubmissions.push(now);
  contactRateBuckets.set(key, recentSubmissions);

  if (contactRateBuckets.size > MAX_CONTACT_RATE_BUCKETS) {
    for (const [bucketKey, timestamps] of Array.from(contactRateBuckets.entries())) {
      if (!timestamps.some((timestamp) => now - timestamp < CONTACT_RATE_LIMIT_WINDOW_MS)) {
        contactRateBuckets.delete(bucketKey);
      }
    }
  }
};

export const resetContactSubmissionRateLimit = () => contactRateBuckets.clear();

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(contactInputSchema)
      .mutation(async ({ input, ctx }) => {
        enforceContactRateLimit(ctx.req);
        try {
          // Save contact submission to database
          await saveContactSubmission({
            name: input.name,
            email: input.email,
            company: input.company || null,
            sport: input.sport || null,
            selectedService: input.selectedService || null,
            cartItems: input.cartItems ? JSON.stringify(input.cartItems) : null,
            deliveryAddress: input.deliveryAddress || null,
            repairIntake: input.repairIntake ? JSON.stringify(input.repairIntake) : null,
            organizationType: input.organizationType || null,
            preferredDate: input.preferredDate || null,
            message: input.message,
            status: "new",
          });
          console.info("[Contact] Submission saved", {
            requestType: input.cartItems?.length ? "product-pricing" : input.message.startsWith("[Pricing request") ? "pricing" : "enquiry",
            companyProvided: Boolean(input.company),
            sport: input.sport || "not_provided",
            cartItemCount: input.cartItems?.length || 0,
          });
          const notificationSent = await notifyOwner({
            title: input.selectedService === "Drone Repair Service" ? `New repair intake from ${input.name}` : input.cartItems?.length ? `New product pricing request from ${input.name}` : `New demo request from ${input.name}`,
            content: [
              `Email: ${input.email}`,
              `Company: ${input.company || "Not provided"}`,
              `Sport / use case: ${input.sport || "Not provided"}`,
              `Selected service: ${input.selectedService || "Not provided"}`,
              `Cart items: ${input.cartItems?.length ? input.cartItems.map((item) => `${item.quantity} × ${item.name} (${item.model || "Model not provided"}; ${item.price})`).join(" | ") : "Not provided"}`,
              `Delivery address: ${input.deliveryAddress || "Not provided"}`,
              `Repair intake: ${input.repairIntake ? `Model: ${input.repairIntake.droneModel}; Fault symptoms: ${input.repairIntake.faultSymptoms}; Previous repairs: ${input.repairIntake.priorRepairs}; Power state: ${input.repairIntake.powerState}; Photos available: ${input.repairIntake.hasPhotos ? "Yes" : "No"}` : "Not provided"}`,
              `Organization type: ${input.organizationType || "Not provided"}`,
              `Preferred date: ${input.preferredDate || "Not provided"}`,
              `Message: ${input.message}`,
            ].join("\\n"),
          });
          return {
            success: true,
            notificationSent,
            message: notificationSent
              ? "Contact form submitted successfully"
              : "Contact form saved successfully; owner notification is temporarily unavailable",
          };
        } catch (error) {
          console.error('Failed to save contact submission:', error);
          throw error;
        }
      }),
  }),
  products: router({
    list: publicProcedure.query(async () => {
      return await listProductsFromDb();
    }),
    upsert: adminProcedure
      .input(
        z.object({
          familyId: z.string().min(1),
          name: z.string().min(1),
          category: z.string().min(1),
          description: z.string().min(1),
          imageUrl: storedImageUrl,
          imageAlt: productImageAltInput,
          refNumber: z.string().min(1),
          variants: z.array(
            z.object({
              name: z.string().min(1),
              model: z.string().min(1),
              price: z.string().min(1),
              imageUrl: storedImageUrl.optional().default(""),
            })
          ),
          displayOrder: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertProductInDb(input);
        return { success: true } as const;
      }),
    delete: adminProcedure
      .input(z.object({ familyId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await deleteProductFromDb(input.familyId);
        return { success: true } as const;
      }),
  }),
  services: router({
    list: publicProcedure.query(async () => {
      return await listServicesFromDb();
    }),
    upsert: adminProcedure
      .input(
        z.object({
          serviceId: z.string().min(1),
          title: z.string().min(1),
          subtitle: z.string().min(1),
          description: z.string().min(1),
          imageUrl: storedImageUrl,
          imageAlt: z.string().min(1),
          duration: z.string().min(1),
          pricingText: z.string().min(1),
          details: z.string().min(1),
          displayOrder: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertServiceInDb(input);
        return { success: true } as const;
      }),
    delete: adminProcedure
      .input(z.object({ serviceId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await deleteServiceFromDb(input.serviceId);
        return { success: true } as const;
      }),
  }),
  enquiries: router({
    list: adminProcedure
      .input(z.object({ status: z.enum(enquiryStatusValues).optional(), query: optionalShortText(120) }).optional())
      .query(async ({ input }) => {
        const submissions = await listContactSubmissions(input?.status as EnquiryStatus | undefined);
        const query = input?.query?.toLowerCase();
        return submissions
          .filter((submission) => !query || [submission.name, submission.email, submission.company, submission.selectedService, submission.message].filter(Boolean).some((value) => value?.toLowerCase().includes(query)))
          .map((submission) => ({
            ...submission,
            kind: getEnquiryKind(submission),
            cartItems: parseStoredJson<StoredCartItem[]>(submission.cartItems),
            repairIntake: parseStoredJson<StoredRepairIntake>(submission.repairIntake),
          }));
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(enquiryStatusValues) }))
      .mutation(async ({ input }) => {
        await updateContactSubmissionStatus(input.id, input.status);
        return { success: true } as const;
      }),
  }),
  upload: router({
    image: adminProcedure
      .input(
        z.object({
          filename: z.string().min(1).max(255),
          contentType: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif|svg\+xml)$/),
          base64Data: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, "base64");
        if (buffer.length > 10 * 1024 * 1024) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Image file exceeds 10MB limit" });
        }
        const safeName = input.filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const result = await storagePut(`uploads/${Date.now()}_${safeName}`, buffer, input.contentType);
        return { url: result.url } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
