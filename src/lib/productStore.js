import seedProducts from "@/data/products.json";

const STORAGE_KEY = "zarina-jewels-products";

function safeParseProducts(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : seedProducts;
  } catch {
    return seedProducts;
  }
}

function sortProducts(products, sortBy = "-created_date") {
  if (!sortBy) return products;

  const direction = sortBy.startsWith("-") ? -1 : 1;
  const key = sortBy.replace("-", "");

  return [...products].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (key.includes("date")) {
      return (new Date(aValue || 0) - new Date(bValue || 0)) * direction;
    }

    if (aValue > bValue) return direction;
    if (aValue < bValue) return -direction;

    return 0;
  });
}

export function getProducts(sortBy = "-created_date", limit) {
  const saved = localStorage.getItem(STORAGE_KEY);

  let products;

  if (saved) {
    products = safeParseProducts(saved);
  } else {
    products = seedProducts;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  }

  const sortedProducts = sortProducts(products, sortBy);

  return limit ? sortedProducts.slice(0, limit) : sortedProducts;
}

export function getProductById(id) {
  return getProducts().find((product) => String(product.id) === String(id));
}

export function createProduct(payload) {
  const products = getProducts();

  const now = new Date().toISOString();

  const newProduct = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_date: now,
    updated_date: now,
    created_by: "local-admin",
    is_sample: false,
    ...payload,
  };

  const updatedProducts = [newProduct, ...products];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return newProduct;
}

export function updateProduct(id, payload) {
  const products = getProducts();

  const updatedProducts = products.map((product) => {
    if (String(product.id) !== String(id)) return product;

    return {
      ...product,
      ...payload,
      id: product.id,
      updated_date: new Date().toISOString(),
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return updatedProducts.find((product) => String(product.id) === String(id));
}

export function deleteProduct(id) {
  const products = getProducts();

  const updatedProducts = products.filter(
    (product) => String(product.id) !== String(id)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return { success: true };
}

export function resetProductsToSeed() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  return seedProducts;
}