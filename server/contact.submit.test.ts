import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter, resetContactSubmissionRateLimit } from "./routers";
import type { TrpcContext } from "./_core/context";

const { saveContactSubmissionMock, listContactSubmissionsMock, notifyOwnerMock, updateContactSubmissionStatusMock } = vi.hoisted(() => ({
  saveContactSubmissionMock: vi.fn(),
  listContactSubmissionsMock: vi.fn(),
  notifyOwnerMock: vi.fn(),
  updateContactSubmissionStatusMock: vi.fn(),
}));

vi.mock("./db", () => ({
  saveContactSubmission: saveContactSubmissionMock,
  listContactSubmissions: listContactSubmissionsMock,
  updateContactSubmissionStatus: updateContactSubmissionStatusMock,
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: notifyOwnerMock,
}));

const adminUser = {
  id: 1,
  openId: "owner-open-id",
  name: "VLI Owner",
  email: "owner@vli.com.hk",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  lastSignedIn: new Date("2026-01-01"),
};

const createContext = (user: TrpcContext["user"] = null): TrpcContext => ({
  user,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetContactSubmissionRateLimit();
    saveContactSubmissionMock.mockResolvedValue(undefined);
    listContactSubmissionsMock.mockResolvedValue([]);
    notifyOwnerMock.mockResolvedValue(true);
    updateContactSubmissionStatusMock.mockResolvedValue(undefined);
  });

  it("persists a qualified demo request and sends an owner notification", async () => {
    const caller = appRouter.createCaller(createContext());

    const result = await caller.contact.submit({
      name: "Alex Visitor",
      email: "alex@example.com",
      company: "Example Sports",
      sport: "Drone sports",
      selectedService: "PID tuning service",
      organizationType: "Event organizer",
      message: "We would like to arrange a product demonstration.",
    });

    expect(result).toMatchObject({ success: true, notificationSent: true });
    expect(saveContactSubmissionMock).toHaveBeenCalledWith({
      name: "Alex Visitor",
      email: "alex@example.com",
      company: "Example Sports",
      sport: "Drone sports",
      selectedService: "PID tuning service",
      cartItems: null,
      deliveryAddress: null,
      repairIntake: null,
      organizationType: "Event organizer",
      preferredDate: null,
      message: "We would like to arrange a product demonstration.",
      status: "new",
    });
    expect(notifyOwnerMock).toHaveBeenCalledWith({
      title: "New demo request from Alex Visitor",
      content: expect.stringContaining("Email: alex@example.com"),
    });
  });

  it("rejects an invalid email address before persistence", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.contact.submit({
        name: "Alex Visitor",
        email: "not-an-email",
        message: "Please contact me.",
      }),
    ).rejects.toThrow("Invalid email");

    expect(saveContactSubmissionMock).not.toHaveBeenCalled();
    expect(notifyOwnerMock).not.toHaveBeenCalled();
  });

  it("rejects malformed, oversized, and honeypot form data before persistence", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.contact.submit({ name: "A".repeat(101), email: "alex@example.com", message: "A sufficiently detailed message." })).rejects.toThrow();
    await expect(caller.contact.submit({ name: "Alex\u0000Visitor", email: "alex@example.com", message: "A sufficiently detailed message." })).rejects.toThrow();
    await expect(caller.contact.submit({ name: "Alex Visitor", email: "alex@example.com", message: "A sufficiently detailed message.", website: "https://spam.example" })).rejects.toThrow();

    expect(saveContactSubmissionMock).not.toHaveBeenCalled();
    expect(notifyOwnerMock).not.toHaveBeenCalled();
  });

  it("keeps SQL-like content as data rather than executing it", async () => {
    const caller = appRouter.createCaller(createContext());
    const message = "I need a quote. '; DROP TABLE contactSubmissions; --";

    await caller.contact.submit({ name: "Alex Visitor", email: "alex@example.com", message });

    expect(saveContactSubmissionMock).toHaveBeenCalledWith(expect.objectContaining({ message }));
  });

  it("persists a valid selected service with a service enquiry", async () => {
    const caller = appRouter.createCaller(createContext());

    await caller.contact.submit({
      name: "Alex Visitor",
      email: "alex@example.com",
      selectedService: "Drone Building Course",
      message: "I would like a structured drone building course for our student team.",
    });

    expect(saveContactSubmissionMock).toHaveBeenCalledWith(expect.objectContaining({ selectedService: "Drone Building Course" }));
    expect(notifyOwnerMock).toHaveBeenCalledWith(expect.objectContaining({ content: expect.stringContaining("Selected service: Drone Building Course") }));
  });

  it("persists a complete repair intake and sends its checklist summary to the owner", async () => {
    const caller = appRouter.createCaller(createContext());
    const repairIntake = {
      droneModel: "TOPS Shield 205",
      faultSymptoms: "The drone powers on but the rear-left motor does not spin.",
      priorRepairs: "No previous repairs",
      powerState: "Powers on",
      hasPhotos: true,
    };

    await caller.contact.submit({
      name: "Alex Visitor",
      email: "alex@example.com",
      selectedService: "Drone Repair Service",
      message: "Please advise the appropriate repair assessment process.",
      repairIntake,
    });

    expect(saveContactSubmissionMock).toHaveBeenCalledWith(expect.objectContaining({
      selectedService: "Drone Repair Service",
      repairIntake: JSON.stringify(repairIntake),
      status: "new",
    }));
    expect(notifyOwnerMock).toHaveBeenCalledWith({
      title: "New repair intake from Alex Visitor",
      content: expect.stringContaining("Model: TOPS Shield 205"),
    });
  });

  it("rejects incomplete repair checklists and repair data on unrelated enquiries", async () => {
    const caller = appRouter.createCaller(createContext());
    const base = { name: "Alex Visitor", email: "alex@example.com", message: "Please advise the appropriate repair assessment process." };

    await expect(caller.contact.submit({ ...base, selectedService: "Drone Repair Service", repairIntake: { droneModel: "TOPS Shield 205", faultSymptoms: "Bad", priorRepairs: "No previous repairs", powerState: "Powers on", hasPhotos: false } })).rejects.toThrow("fault symptoms");
    await expect(caller.contact.submit({ ...base, repairIntake: { droneModel: "TOPS Shield 205", faultSymptoms: "Motor failure needs investigation.", priorRepairs: "No previous repairs", powerState: "Powers on", hasPhotos: false } })).rejects.toThrow("Repair intake is only available");
    expect(saveContactSubmissionMock).not.toHaveBeenCalled();
  });

  it("persists cart selections and includes them in the owner pricing notification", async () => {
    const caller = appRouter.createCaller(createContext());
    const cartItems = [
      { sourceId: "i1", name: "FPV Racing Drone", model: "VLI-RACE-5", price: "HK$2,480", quantity: 3 },
      { sourceId: "i2", name: "VTX Antenna", model: "VLI-ANT-01", price: "HK$180", quantity: 1 },
    ];

    const result = await caller.contact.submit({
      name: "Taylor Organizer",
      email: "taylor@example.com",
      company: "Harbour Drone Club",
      sport: "Research / technology",
      deliveryAddress: "Unit 12, 8 Science Park West Avenue, Hong Kong",
      message: "Please confirm availability for our autumn drone sports programme.",
      cartItems,
    });

    expect(result).toMatchObject({ success: true, notificationSent: true });
    expect(saveContactSubmissionMock).toHaveBeenCalledWith(expect.objectContaining({
      name: "Taylor Organizer",
      cartItems: JSON.stringify(cartItems),
      deliveryAddress: "Unit 12, 8 Science Park West Avenue, Hong Kong",
    }));
    expect(notifyOwnerMock).toHaveBeenCalledWith({
      title: "New product pricing request from Taylor Organizer",
      content: expect.stringContaining("Delivery address: Unit 12, 8 Science Park West Avenue, Hong Kong"),
    });
  });

  it("rejects malformed or duplicate cart selections before persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    const baseInput = { name: "Taylor Organizer", email: "taylor@example.com", message: "Please confirm a product quote." };

    await expect(caller.contact.submit({ ...baseInput, cartItems: [{ sourceId: "i1", name: "Drone\u0000", model: "VLI-RACE-5", price: "HK$2,480", quantity: 1 }] })).rejects.toThrow();
    await expect(caller.contact.submit({ ...baseInput, cartItems: [
      { sourceId: "i1", name: "FPV Racing Drone", model: "VLI-RACE-5", price: "HK$2,480", quantity: 1 },
      { sourceId: "i1", name: "FPV Racing Drone", model: "VLI-RACE-5", price: "HK$2,480", quantity: 2 },
    ] })).rejects.toThrow();
    await expect(caller.contact.submit({ ...baseInput, cartItems: [{ sourceId: "i1", name: "FPV Racing Drone", model: "VLI-RACE-5", price: "HK$2,480", quantity: 1 }] })).rejects.toThrow("Delivery address is required");

    expect(saveContactSubmissionMock).not.toHaveBeenCalled();
    expect(notifyOwnerMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated public submissions from one client", async () => {
    const caller = appRouter.createCaller(createContext());
    const input = { name: "Alex Visitor", email: "alex@example.com", message: "A sufficiently detailed request message." };

    for (let index = 0; index < 5; index += 1) {
      await caller.contact.submit(input);
    }

    await expect(caller.contact.submit(input)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("restricts enquiry management to admins and parses repair context for the owner dashboard", async () => {
    const repairIntake = { droneModel: "TOPS Shield 205", faultSymptoms: "Motor issue during takeoff.", priorRepairs: "Unknown", powerState: "Intermittent or unsure", hasPhotos: true };
    listContactSubmissionsMock.mockResolvedValue([{ id: 42, name: "Alex Visitor", email: "alex@example.com", company: null, sport: null, selectedService: "Drone Repair Service", cartItems: null, deliveryAddress: null, repairIntake: JSON.stringify(repairIntake), organizationType: null, preferredDate: null, message: "Repair intake checklist", status: "new", createdAt: new Date("2026-08-17"), updatedAt: new Date("2026-08-17") }]);

    await expect(appRouter.createCaller(createContext()).enquiries.list()).rejects.toMatchObject({ code: "FORBIDDEN" });

    const adminCaller = appRouter.createCaller(createContext(adminUser));
    const entries = await adminCaller.enquiries.list();
    expect(entries).toEqual([expect.objectContaining({ id: 42, kind: "repair", repairIntake })]);
    await adminCaller.enquiries.updateStatus({ id: 42, status: "quoted" });
    expect(updateContactSubmissionStatusMock).toHaveBeenCalledWith(42, "quoted");
  });
});
