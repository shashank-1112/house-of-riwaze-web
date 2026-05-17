import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { productApi } from "@/api/productApi";
import { useMetalRates } from "@/hooks/useMetalRates";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Download,
  RefreshCw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CATEGORIES = [
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Chains",
  "Sets",
  "Other",
];

const METALS = ["Gold", "Silver", "Platinum", "Mixed"];

const JEWELLERY_TYPES = ["Diamond Studded", "Gemstone Studded"];

const METAL_COLORS = [
  "Yellow Gold",
  "Rose Gold",
  "Green Gold",
  "White Gold",
  "Rhodium",
];

const ACCESSORY_TYPES = ["Watch"];

function getProductValue(product, snakeKey, camelKey, fallback = "") {
  return product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
}

function getProductNumber(product, snakeKey, camelKey, fallback = 0) {
  const value = product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeFilterValue(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesFilter(productValue, selectedValue) {
  if (!selectedValue || selectedValue === "all") {
    return true;
  }

  return normalizeFilterValue(productValue) === normalizeFilterValue(selectedValue);
}

function AttributeBadge({ children }) {
  if (!children || children === "None") return null;

  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export default function Inventory() {
  const { calculatePrice } = useMetalRates();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMetal, setFilterMetal] = useState("all");
  const [filterJewelleryType, setFilterJewelleryType] = useState("all");
  const [filterMetalColor, setFilterMetalColor] = useState("all");
  const [filterAccessoryType, setFilterAccessoryType] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");

  const loadProducts = async ({ silent = false } = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await productApi.getAdminProducts({
        limit: 500,
      });

      const sortedProducts = [...(data || [])].sort((a, b) => {
        const aDate = new Date(a.created_date || a.createdDate || 0);
        const bDate = new Date(b.created_date || b.createdDate || 0);

        return bDate - aDate;
      });

      setProducts(sortedProducts);
    } catch (error) {
      toast({
        title: "Failed to load inventory",
        description: error.message,
        variant: "destructive",
      });

      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = product.name || "";
      const sku = product.sku || "";

      const category = product.category || "";
      const metalType = getProductValue(product, "metal_type", "metalType");

      const jewelleryType =
        getProductValue(product, "jewellery_type", "jewelleryType") ||
        getProductValue(product, "jewelry_type", "jewelryType");

      const metalColor = getProductValue(product, "metal_color", "metalColor");

      const accessoryType = getProductValue(
        product,
        "accessory_type",
        "accessoryType"
      );

      const visibility = product.visibility || "";

      const stock = getProductNumber(
        product,
        "stock_quantity",
        "stockQuantity"
      );

      const minStock = getProductNumber(
        product,
        "min_stock_threshold",
        "minStockThreshold",
        5
      );

      if (
        searchValue &&
        !name.toLowerCase().includes(searchValue) &&
        !sku.toLowerCase().includes(searchValue)
      ) {
        return false;
      }

      if (!matchesFilter(category, filterCategory)) return false;
      if (!matchesFilter(metalType, filterMetal)) return false;
      if (!matchesFilter(jewelleryType, filterJewelleryType)) return false;
      if (!matchesFilter(metalColor, filterMetalColor)) return false;
      if (!matchesFilter(accessoryType, filterAccessoryType)) return false;
      if (!matchesFilter(visibility, filterVisibility)) return false;

      if (filterStock === "in_stock" && stock <= 0) {
        return false;
      }

      if (filterStock === "low" && (stock <= 0 || stock > minStock)) {
        return false;
      }

      if (filterStock === "out" && stock > 0) {
        return false;
      }

      return true;
    });
  }, [
    products,
    search,
    filterCategory,
    filterMetal,
    filterJewelleryType,
    filterMetalColor,
    filterAccessoryType,
    filterStock,
    filterVisibility,
  ]);

  const activeFilterCount = [
    filterCategory,
    filterMetal,
    filterJewelleryType,
    filterMetalColor,
    filterAccessoryType,
    filterStock,
    filterVisibility,
  ].filter((filter) => filter !== "all").length + (search.trim() ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const getStockStatus = (product) => {
    const stock = getProductNumber(
      product,
      "stock_quantity",
      "stockQuantity"
    );

    const minStock = getProductNumber(
      product,
      "min_stock_threshold",
      "minStockThreshold",
      5
    );

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className: "text-destructive bg-destructive/10",
      };
    }

    if (stock <= minStock) {
      return {
        label: "Low Stock",
        className: "text-amber-700 bg-amber-100",
      };
    }

    return {
      label: "In Stock",
      className: "text-green-700 bg-green-100",
    };
  };

  const handleDelete = async (id, name) => {
    try {
      await productApi.deleteProduct(id);
      await loadProducts({ silent: true });

      toast({
        title: "Product deleted",
        description: `${name} was removed from inventory.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Metal",
      "Jewellery Type",
      "Metal Color",
      "Accessory Type",
      "Purity",
      "Weight(g)",
      "Stock",
      "Visibility",
      "Price(₹)",
    ];

    const rows = filtered.map((product) => [
      product.name,
      product.sku,
      product.category,
      getProductValue(product, "metal_type", "metalType"),
      getProductValue(product, "jewellery_type", "jewelleryType", "None"),
      getProductValue(product, "metal_color", "metalColor", "None"),
      getProductValue(product, "accessory_type", "accessoryType", "None"),
      product.purity,
      getProductNumber(product, "net_weight", "netWeight"),
      getProductNumber(product, "stock_quantity", "stockQuantity"),
      product.visibility,
      calculatePrice(product),
    ]);

    const escapeCell = (value) => {
      const stringValue = String(value ?? "");
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "house-of-riwaze-inventory.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("all");
    setFilterMetal("all");
    setFilterJewelleryType("all");
    setFilterMetalColor("all");
    setFilterAccessoryType("all");
    setFilterStock("all");
    setFilterVisibility("all");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? "Loading products..."
              : `${filtered.length} of ${products.length} products`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => loadProducts({ silent: true })}
            disabled={isLoading || isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={isLoading || filtered.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Link to="/admin/inventory/add">
            <Button className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border/70 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SlidersHorizontal className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">Filter Inventory</p>
                <p className="text-xs text-muted-foreground">
                  Search and narrow products without reloading data.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {activeFilterCount} active
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="gap-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterMetal} onValueChange={setFilterMetal}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Metal" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Metals</SelectItem>

                {METALS.map((metal) => (
                  <SelectItem key={metal} value={metal}>
                    {metal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVisibility} onValueChange={setFilterVisibility}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMoreFilters((value) => !value)}
              className="h-11 whitespace-nowrap"
            >
              {showMoreFilters ? "Hide" : "More"} Filters
            </Button>
          </div>

          {showMoreFilters && (
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Product Attributes
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Select
                  value={filterJewelleryType}
                  onValueChange={setFilterJewelleryType}
                >
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Jewellery Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Jewellery Types</SelectItem>

                    {JEWELLERY_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterMetalColor}
                  onValueChange={setFilterMetalColor}
                >
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Metal Color" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Metal Colors</SelectItem>

                    {METAL_COLORS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterAccessoryType}
                  onValueChange={setFilterAccessoryType}
                >
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Accessories" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Accessories</SelectItem>

                    {ACCESSORY_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
              {search.trim() && (
                <Badge variant="outline" className="rounded-full">
                  Search: {search}
                </Badge>
              )}

              {filterCategory !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterCategory}
                </Badge>
              )}

              {filterMetal !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterMetal}
                </Badge>
              )}

              {filterJewelleryType !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterJewelleryType}
                </Badge>
              )}

              {filterMetalColor !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterMetalColor}
                </Badge>
              )}

              {filterAccessoryType !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterAccessoryType}
                </Badge>
              )}

              {filterStock !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterStock.replace("_", " ")}
                </Badge>
              )}

              {filterVisibility !== "all" && (
                <Badge variant="outline" className="rounded-full">
                  {filterVisibility}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Metal / Purity</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array(10)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full rounded gold-shimmer" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => {
                const status = getStockStatus(product);

                const metalType = getProductValue(
                  product,
                  "metal_type",
                  "metalType"
                );

                const jewelleryType =
                  getProductValue(
                    product,
                    "jewellery_type",
                    "jewelleryType",
                    "None"
                  ) || "None";

                const metalColor =
                  getProductValue(
                    product,
                    "metal_color",
                    "metalColor",
                    "None"
                  ) || "None";

                const accessoryType =
                  getProductValue(
                    product,
                    "accessory_type",
                    "accessoryType",
                    "None"
                  ) || "None";

                const netWeight = getProductNumber(
                  product,
                  "net_weight",
                  "netWeight"
                );

                const stockQuantity = getProductNumber(
                  product,
                  "stock_quantity",
                  "stockQuantity"
                );

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="h-11 w-11 overflow-hidden rounded-xl bg-muted">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            {product.name?.[0]}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[240px]">
                      <p className="text-sm font-medium">{product.name}</p>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>

                        <AttributeBadge>{jewelleryType}</AttributeBadge>
                        <AttributeBadge>{metalColor}</AttributeBadge>
                        <AttributeBadge>{accessoryType}</AttributeBadge>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      {product.sku}
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{metalType}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.purity}
                      </p>
                    </TableCell>

                    <TableCell className="text-right text-sm">
                      {netWeight}g
                    </TableCell>

                    <TableCell className="text-right text-sm font-semibold">
                      ₹
                      {Number(calculatePrice(product) || 0).toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {stockQuantity}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge className={`text-[10px] ${status.className}`}>
                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px]">
                        {product.visibility}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/inventory/${product.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {product.name}?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This will remove the product from your backend
                                inventory. You can add it again later if needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(product.id, product.name)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}