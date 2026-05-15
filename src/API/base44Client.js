import productsData from "@/data/products.json";
import metalRatesData from "@/data/metalRates.json";
import storeSettingsData from "@/data/storeSettings.json";

let products = [...productsData];
let metalRates = { ...metalRatesData };
let storeSettings = { ...storeSettingsData };

const delay = (value, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function normalizeId(id) {
  return String(id);
}

function createEntityStore(getData, setData) {
  return {
    async list() {
      return delay(getData());
    },

    async get(id) {
      const item = getData().find((x) => normalizeId(x.id) === normalizeId(id));
      return delay(item || null);
    },

    async filter(filters = {}) {
      const result = getData().filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null || value === "") return true;
          return String(item[key]).toLowerCase() === String(value).toLowerCase();
        });
      });

      return delay(result);
    },

    async create(payload) {
      const newItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        ...payload,
      };

      setData([...getData(), newItem]);
      return delay(newItem);
    },

    async update(id, payload) {
      let updatedItem = null;

      const updated = getData().map((item) => {
        if (normalizeId(item.id) !== normalizeId(id)) return item;

        updatedItem = {
          ...item,
          ...payload,
          id: item.id,
        };

        return updatedItem;
      });

      setData(updated);
      return delay(updatedItem);
    },

    async delete(id) {
      setData(getData().filter((item) => normalizeId(item.id) !== normalizeId(id)));
      return delay({ success: true });
    },
  };
}

export const base44 = {
  entities: {
    Product: createEntityStore(
      () => products,
      (value) => {
        products = value;
      }
    ),

    Products: createEntityStore(
      () => products,
      (value) => {
        products = value;
      }
    ),

    MetalRate: {
      async list() {
        return delay([metalRates]);
      },

      async get() {
        return delay(metalRates);
      },

      async update(payload) {
        metalRates = {
          ...metalRates,
          ...payload,
          updatedAt: new Date().toISOString(),
        };

        return delay(metalRates);
      },
    },

    StoreSettings: {
      async list() {
        return delay([storeSettings]);
      },

      async get() {
        return delay(storeSettings);
      },

      async update(payload) {
        storeSettings = {
          ...storeSettings,
          ...payload,
        };

        return delay(storeSettings);
      },
    },
  },

  auth: {
    async me() {
      return delay({
        id: "admin-1",
        name: "Admin",
        email: "admin@zarinajewels.com",
        role: "admin",
      });
    },
  },
};