import { clearAdminSession, getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5185";

function buildUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

async function request(path, options = {}) {
  const isAdminRequest = path.startsWith("/api/admin");
  const headers = {
    "Content-Type": "application/json",
    ...(isAdminRequest ? getAdminAuthHeaders() : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && isAdminRequest) {
      // clearAdminSession();
    }

    let message = "Store settings API request failed";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const storeSettingsApi = {
  getPublicSettings() {
    return request("/api/store-settings");
  },

  getAdminSettings() {
    return request("/api/admin/store-settings");
  },

  updateAdminSettings(settings) {
    return request("/api/admin/store-settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
};
