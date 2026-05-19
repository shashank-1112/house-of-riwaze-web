const ADMIN_TOKEN_KEY = "zarina_admin_token";
const ADMIN_USER_KEY = "zarina_admin_user";
const ADMIN_EXPIRES_AT_KEY = "zarina_admin_expires_at";
const LEGACY_TOKEN_KEYS = ["token", "admin_token"];

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getAdminToken() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const expiresAt = storage.getItem(ADMIN_EXPIRES_AT_KEY);

  if (expiresAt && Number(expiresAt) <= Date.now()) {
    clearAdminSession();
    return null;
  }

  const token =
    storage.getItem(ADMIN_TOKEN_KEY) ||
    LEGACY_TOKEN_KEYS.map((key) => storage.getItem(key)).find(Boolean) ||
    null;

  return normalizeAdminToken(token);
}

export function getAdminUser() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const user = storage.getItem(ADMIN_USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setAdminSession({ token, user, expiresAt }) {
  const storage = getStorage();
  const normalizedToken = normalizeAdminToken(token);

  if (!storage || !normalizedToken) {
    return;
  }

  storage.setItem(ADMIN_TOKEN_KEY, normalizedToken);
  LEGACY_TOKEN_KEYS.forEach((key) => storage.setItem(key, normalizedToken));

  if (user) {
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(ADMIN_USER_KEY);
  }

  if (expiresAt) {
    storage.setItem(ADMIN_EXPIRES_AT_KEY, String(expiresAt));
  } else {
    storage.removeItem(ADMIN_EXPIRES_AT_KEY);
  }
}

export function clearAdminSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ADMIN_TOKEN_KEY);
  LEGACY_TOKEN_KEYS.forEach((key) => storage.removeItem(key));
  storage.removeItem(ADMIN_USER_KEY);
  storage.removeItem(ADMIN_EXPIRES_AT_KEY);
}

export function normalizeAdminToken(token) {
  return String(token || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function getAdminAuthHeaders() {
  const token = getAdminToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}
