const ALLOWED_KINDS = new Set([
  "general",
  "service",
  "repair",
  "product-pricing",
  "smart-referee-pricing",
]);

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  phone: 48,
  organisation: 180,
  organisationType: 80,
  selectedService: 160,
  selectedPackage: 160,
  message: 6000,
  payload: 10000,
};

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function originHeaders(origin, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || "https://velocity-lab.com";
  return {
    "access-control-allow-origin": origin === allowedOrigin ? origin : allowedOrigin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function cleanText(value, maxLength = 0) {
  if (typeof value !== "string") return "";
  const cleaned = value.trim().replace(/\u0000/g, "");
  return maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function checkRateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const bucket = Math.floor(Date.now() / 60_000);
  const key = await sha256(`${ip}:${bucket}`);
  const current = await env.ENQUIRIES_DB.prepare(
    "SELECT count FROM submission_rate_limits WHERE bucket_key = ?",
  ).bind(key).first();

  if ((current?.count || 0) >= 5) return false;

  await env.ENQUIRIES_DB.prepare(
    "INSERT INTO submission_rate_limits (bucket_key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(bucket_key) DO UPDATE SET count = count + 1",
  ).bind(key, Date.now() + 2 * 60_000).run();

  if (Math.random() < 0.02) {
    await env.ENQUIRIES_DB.prepare("DELETE FROM submission_rate_limits WHERE expires_at < ?").bind(Date.now()).run();
  }
  return true;
}

async function verifyTurnstile(token, request, env) {
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) form.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

async function sendNotification(env, enquiry) {
  if (!env.RESEND_API_KEY) return false;

  const email = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || "VLI Enquiries <enquiries@velocity-lab.com>",
      to: [env.NOTIFICATION_EMAIL || "info@velocity-lab.com"],
      reply_to: enquiry.email,
      subject: `[VLI] New ${enquiry.kind.replace(/-/g, " ")} enquiry from ${enquiry.name}`,
      text: [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone || "Not provided"}`,
        `Organisation: ${enquiry.organisation || "Not provided"}`,
        `Service: ${enquiry.selectedService || "Not selected"}`,
        `Package: ${enquiry.selectedPackage || "Not selected"}`,
        "",
        enquiry.message,
      ].join("\n"),
    }),
  });
  return email.ok;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://velocity-lab.com";
    const cors = originHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/enquiries") {
      return json({ error: "Not found" }, 404, cors);
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }
    if (origin !== allowedOrigin) {
      return json({ error: "Origin is not allowed" }, 403, cors);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ error: "Invalid JSON payload" }, 400, cors);
    }

    if (cleanText(input.website, 160)) {
      return json({ ok: true }, 201, cors);
    }

    const kind = cleanText(input.kind, 48);
    const name = cleanText(input.name, MAX_LENGTHS.name);
    const email = cleanText(input.email, MAX_LENGTHS.email).toLowerCase();
    const phone = cleanText(input.phone, MAX_LENGTHS.phone);
    const organisation = cleanText(input.organisation, MAX_LENGTHS.organisation);
    const organisationType = cleanText(input.organisationType, MAX_LENGTHS.organisationType);
    const selectedService = cleanText(input.selectedService, MAX_LENGTHS.selectedService);
    const selectedPackage = cleanText(input.selectedPackage, MAX_LENGTHS.selectedPackage);
    const message = cleanText(input.message, MAX_LENGTHS.message);
    const turnstileToken = cleanText(input.turnstileToken, 4096);
    const payload = typeof input.payload === "object" && input.payload ? JSON.stringify(input.payload).slice(0, MAX_LENGTHS.payload) : null;

    if (!ALLOWED_KINDS.has(kind) || !name || !validEmail(email) || !message || !turnstileToken) {
      return json({ error: "Please complete the required form fields." }, 400, cors);
    }

    const [turnstileValid, rateAllowed] = await Promise.all([
      verifyTurnstile(turnstileToken, request, env),
      checkRateLimit(request, env),
    ]);
    if (!rateAllowed) return json({ error: "Too many submissions. Please try again shortly." }, 429, cors);
    if (!turnstileValid) return json({ error: "Verification failed. Please try again." }, 403, cors);

    await env.ENQUIRIES_DB.prepare(
      `INSERT INTO enquiries (
        kind, name, email, phone, organisation, organisation_type,
        selected_service, selected_package, message, payload_json, source_origin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      kind,
      name,
      email,
      phone || null,
      organisation || null,
      organisationType || null,
      selectedService || null,
      selectedPackage || null,
      message,
      payload,
      origin,
    ).run();

    const notificationSent = await sendNotification(env, {
      kind,
      name,
      email,
      phone,
      organisation,
      selectedService,
      selectedPackage,
      message,
    });

    return json({ ok: true, notificationSent }, 201, cors);
  },
};
