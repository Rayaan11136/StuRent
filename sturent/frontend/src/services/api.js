import * as mock from "./mockApi.js";

const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  if (!BASE) {
    const err = new Error("API base URL is not configured");
    err.code = "NO_API";
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(body.message || body.error || "Request failed");
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return { ...body, source: "aws" };
  } finally {
    clearTimeout(timer);
  }
}

export async function getProperties() {
  try {
    return await request("/properties");
  } catch {
    return mock.mockGetProperties();
  }
}

export async function getProperty(id) {
  try {
    return await request(`/properties/${encodeURIComponent(id)}`);
  } catch {
    return mock.mockGetProperty(id);
  }
}

export async function matchProperties(preferences) {
  try {
    return await request("/match", {
      method: "POST",
      body: JSON.stringify(preferences)
    });
  } catch {
    return mock.mockMatch(preferences);
  }
}

export async function getNearby(propertyId) {
  try {
    return await request(`/properties/${encodeURIComponent(propertyId)}/nearby`);
  } catch {
    return mock.mockNearby(propertyId);
  }
}

export async function explainMatch(payload) {
  try {
    return await request("/explain-match", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  } catch {
    return mock.mockExplain(payload);
  }
}

export function isUsingRemoteApi() {
  return Boolean(BASE);
}
