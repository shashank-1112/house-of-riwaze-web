const STORAGE_KEY = "zarina-jewels-settings";

const defaultSettings = {
  id: "local-settings",
  store_name: "House of Riwaze",
  tagline: "Timeless Elegance, Crafted for You",
  logo_url: "",
  address: "",
  whatsapp: "919876543210",
  email: "",
  instagram: "",
  facebook: "",
  rates_api_key: "",
  default_making_charges: {
    Rings: 450,
    Necklaces: 280,
    Earrings: 320,
    Bracelets: 250,
    Bangles: 250,
    Pendants: 350,
    Chains: 220,
    Sets: 300,
    Other: 250,
  },
};

function safeParseSettings(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function getStoreSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...safeParseSettings(saved),
  };
}

export function saveStoreSettings(payload) {
  const updatedSettings = {
    ...getStoreSettings(),
    ...payload,
    updated_date: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));

  return updatedSettings;
}

export function resetStoreSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
}