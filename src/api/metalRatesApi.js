const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5185";

function buildUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Metal rates API request failed";

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

export const metalRatesApi = {
  getLatestRates() {
    return request("/api/metal-rates");
  },

  refreshLiveRates() {
    return request("/api/admin/metal-rates/refresh", {
      method: "POST",
    });
  },
};
