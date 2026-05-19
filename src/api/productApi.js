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

    let message = "API request failed";

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

function toFrontendProduct(product) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,

    category: product.category,
    sub_category: product.subCategory ?? product.sub_category ?? "",

    metal_type: product.metalType ?? product.metal_type ?? "",

    jewellery_type:
      product.jewelleryType ??
      product.jewellery_type ??
      "None",

    metal_color:
      product.metalColor ??
      product.metal_color ??
      "None",

    accessory_type:
      product.accessoryType ??
      product.accessory_type ??
      "None",

    purity: product.purity,

    gross_weight: product.grossWeight ?? product.gross_weight ?? 0,
    net_weight: product.netWeight ?? product.net_weight ?? 0,

    making_charges_type:
      product.makingChargesType ?? product.making_charges_type ?? "per_gram",
    making_charges: product.makingCharges ?? product.making_charges ?? 0,
    price_override: product.priceOverride ?? product.price_override ?? null,

    stock_quantity: product.stockQuantity ?? product.stock_quantity ?? 0,
    min_stock_threshold:
      product.minStockThreshold ?? product.min_stock_threshold ?? 5,

    images: product.images || [],

    description: product.description || "",
    tags: product.tags || "",

    visibility: product.visibility || "Published",
    gender: product.gender || "Unisex",
    occasion: product.occasion || "Any",

    is_featured: product.isFeatured ?? product.is_featured ?? false,

    stone_details: (product.stoneDetails ?? product.stone_details ?? []).map(
      (stone) => ({
        stone_type: stone.stoneType ?? stone.stone_type ?? "",
        carat: stone.carat ?? 0,
        clarity: stone.clarity ?? "",
        cut: stone.cut ?? "",
        color: stone.color ?? "",
        cost: stone.cost ?? 0,
      })
    ),

    try_on_enabled: product.tryOnEnabled ?? product.try_on_enabled ?? false,
    try_on_type: product.tryOnType ?? product.try_on_type ?? "ring",
    try_on_asset: product.tryOnAsset ?? product.try_on_asset ?? "",
    try_on_scale: product.tryOnScale ?? product.try_on_scale ?? 1,
    try_on_offset_x: product.tryOnOffsetX ?? product.try_on_offset_x ?? 0,
    try_on_offset_y: product.tryOnOffsetY ?? product.try_on_offset_y ?? 0,
    try_on_rotation: product.tryOnRotation ?? product.try_on_rotation ?? 0,

    created_date: product.createdDate ?? product.created_date,
    updated_date: product.updatedDate ?? product.updated_date,
  };
}

function toBackendProduct(product) {
  return {
    name: product.name,
    sku: product.sku,

    category: product.category,
    subCategory: product.sub_category ?? product.subCategory ?? "",

    metalType: product.metal_type ?? product.metalType ?? "Gold",

    jewelleryType:
      product.jewellery_type ??
      product.jewelleryType ??
      "None",

    metalColor:
      product.metal_color ??
      product.metalColor ??
      "None",

    accessoryType:
      product.accessory_type ??
      product.accessoryType ??
      "None",

    purity: product.purity ?? "22K",

    grossWeight: Number(product.gross_weight ?? product.grossWeight ?? 0),
    netWeight: Number(product.net_weight ?? product.netWeight ?? 0),

    makingChargesType:
      product.making_charges_type ?? product.makingChargesType ?? "per_gram",
    makingCharges: Number(product.making_charges ?? product.makingCharges ?? 0),

    priceOverride:
      product.price_override === "" ||
      product.price_override === null ||
      product.price_override === undefined
        ? null
        : Number(product.price_override),

    stockQuantity: Number(product.stock_quantity ?? product.stockQuantity ?? 0),
    minStockThreshold: Number(
      product.min_stock_threshold ?? product.minStockThreshold ?? 5
    ),

    images: Array.isArray(product.images) ? product.images : [],

    description: product.description ?? "",
    tags: product.tags ?? "",

    visibility: product.visibility ?? "Published",
    gender: product.gender ?? "Unisex",
    occasion: product.occasion ?? "Any",

    isFeatured: Boolean(product.is_featured ?? product.isFeatured ?? false),

    stoneDetails: Array.isArray(product.stone_details)
      ? product.stone_details.map((stone) => ({
          stoneType: stone.stone_type ?? stone.stoneType ?? "",
          carat: Number(stone.carat ?? 0),
          clarity: stone.clarity ?? "",
          cut: stone.cut ?? "",
          color: stone.color ?? "",
          cost: Number(stone.cost ?? 0),
        }))
      : [],

    tryOnEnabled: Boolean(product.try_on_enabled ?? product.tryOnEnabled),
    tryOnType: product.try_on_type ?? product.tryOnType ?? "ring",
    tryOnAsset: product.try_on_asset ?? product.tryOnAsset ?? "",
    tryOnScale: Number(product.try_on_scale ?? product.tryOnScale ?? 1),
    tryOnOffsetX: Number(product.try_on_offset_x ?? product.tryOnOffsetX ?? 0),
    tryOnOffsetY: Number(product.try_on_offset_y ?? product.tryOnOffsetY ?? 0),
    tryOnRotation: Number(product.try_on_rotation ?? product.tryOnRotation ?? 0),
  };
}

export const productApi = {
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all"
      ) {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    const data = await request(`/api/products${query ? `?${query}` : ""}`);

    return data.map(toFrontendProduct);
  },

  async getAdminProducts(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all"
      ) {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    const data = await request(
      `/api/admin/products${query ? `?${query}` : ""}`
    );

    return data.map(toFrontendProduct);
  },

  async getProductById(id) {
    const data = await request(`/api/products/${id}`);
    return toFrontendProduct(data);
  },

  async getAdminProductById(id) {
    const data = await request(`/api/admin/products/${id}`);
    return toFrontendProduct(data);
  },

  async createProduct(product) {
    const data = await request("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(toBackendProduct(product)),
    });

    return toFrontendProduct(data);
  },

  async updateProduct(id, product) {
    const data = await request(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(toBackendProduct(product)),
    });

    return toFrontendProduct(data);
  },

  async deleteProduct(id) {
    return request(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
  },
};
