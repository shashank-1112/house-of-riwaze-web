import { normalizeAdminToken, setAdminSession } from "@/lib/adminAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5185";

const ADMIN_LOGIN_PATH =
  import.meta.env.VITE_ADMIN_LOGIN_PATH || "/api/admin/auth/login";

function buildUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

function getPayloadValue(data, keys) {
  if (typeof data === "string") {
    return data;
  }

  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      return data[key];
    }

    if (data?.data?.[key] !== undefined && data?.data?.[key] !== null) {
      return data.data[key];
    }

    if (data?.result?.[key] !== undefined && data?.result?.[key] !== null) {
      return data.result[key];
    }
  }

  return null;
}

function findPayloadValue(data, keys) {
  const directValue = getPayloadValue(data, keys);

  if (directValue) {
    return directValue;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  for (const value of Object.values(data)) {
    const nestedValue = findPayloadValue(value, keys);

    if (nestedValue) {
      return nestedValue;
    }
  }

  return null;
}

function decodeJwtExpiresAt(token) {
  const [, payload] = String(token).split(".");

  if (!payload) {
    return null;
  }

  try {
    const decoded = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.exp ? Number(decoded.exp) * 1000 : null;
  } catch {
    return null;
  }
}

function normalizeExpiresAt(value, token) {
  if (!value) {
    return decodeJwtExpiresAt(token);
  }

  const currentEpochSeconds = Math.floor(Date.now() / 1000);

  if (typeof value === "number") {
    return value < currentEpochSeconds
      ? Date.now() + value * 1000
      : value < 10000000000
        ? value * 1000
        : value;
  }

  if (/^\d+$/.test(value)) {
    return normalizeExpiresAt(Number(value), token);
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? decodeJwtExpiresAt(token) : parsed;
}

export const adminAuthApi = {
  async login({ username, password }) {
    const response = await fetch(buildUrl(ADMIN_LOGIN_PATH), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: String(username),
        password: String(password),
      }),
    });

    if (!response.ok) {
      let message = "Unable to sign in";

      try {
        const error = await response.json();
        message = error.message || error.error || message;
      } catch {
        message = await response.text();
      }

      throw new Error(message);
    }

    const data = await response.json();
    const token = normalizeAdminToken(findPayloadValue(data, [
      "token",
      "accessToken",
      "access_token",
      "bearerToken",
      "bearer_token",
      "authToken",
      "auth_token",
      "jwt",
    ]));

    if (!token) {
      throw new Error("Login response did not include an auth token");
    }

    const user = findPayloadValue(data, ["user", "admin"]);
    const expiresAt = normalizeExpiresAt(
      findPayloadValue(data, [
        "expiresAt",
        "expires_at",
        "expiresIn",
        "expires_in",
        "exp",
      ]),
      token
    );

    setAdminSession({ token, user, expiresAt });

    return {
      token,
      user,
      expiresAt,
    };
  },
};
