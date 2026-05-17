import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { productApi } from "@/api/productApi";
import { useMetalRates } from "@/hooks/useMetalRates";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import { toast } from "@/components/ui/use-toast";

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

const PURITIES = ["18K", "22K", "24K", "925 Silver", "999 Silver", "Platinum"];
const GENDERS = ["Men", "Women", "Unisex"];
const OCCASIONS = ["Bridal", "Casual", "Festival", "Office", "Any"];

function parsePrice(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function normalizeFilterValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function matchesFilter(productValue, selectedValue) {
  if (!selectedValue || selectedValue === "all") {
    return true;
  }

  return normalizeFilterValue(productValue) === normalizeFilterValue(selectedValue);
}

export default function Products() {
  const { calculatePrice } = useMetalRates();
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key) => searchParams.get(key) || "all";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(getParam("category"));
  const [metal, setMetal] = useState(getParam("metal"));
  const [jewelleryType, setJewelleryType] = useState(getParam("jewelleryType"));
  const [metalColor, setMetalColor] = useState(getParam("metalColor"));
  const [accessoryType, setAccessoryType] = useState(getParam("accessoryType"));
  const [purity, setPurity] = useState("all");
  const [gender, setGender] = useState("all");
  const [occasion, setOccasion] = useState(getParam("occasion"));
  const [sortBy, setSortBy] = useState("newest");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const minPriceValue = parsePrice(minPrice);
  const maxPriceValue = parsePrice(maxPrice);

  useEffect(() => {
    setCategory(getParam("category"));
    setMetal(getParam("metal"));
    setJewelleryType(getParam("jewelleryType"));
    setMetalColor(getParam("metalColor"));
    setAccessoryType(getParam("accessoryType"));
    setOccasion(getParam("occasion"));
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const data = await productApi.getProducts({
          limit: 500,
        });

        setProducts(data);
      } catch (error) {
        toast({
          title: "Failed to load products",
          description: error.message,
          variant: "destructive",
        });

        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const productName = product.name || "";
      const sku = product.sku || "";

      const productCategory = product.category || "";
      const productMetal = product.metal_type || product.metalType || "";

      const productJewelleryType =
        product.jewellery_type ||
        product.jewelleryType ||
        product.jewelry_type ||
        product.jewelryType ||
        "";

      const productMetalColor =
        product.metal_color ||
        product.metalColor ||
        "";

      const productAccessoryType =
        product.accessory_type ||
        product.accessoryType ||
        "";

      const productPurity = product.purity || "";
      const productGender = product.gender || "";
      const productOccasion = product.occasion || "";

      const searchText = search.trim().toLowerCase();

      if (
        searchText &&
        !productName.toLowerCase().includes(searchText) &&
        !sku.toLowerCase().includes(searchText)
      ) {
        return false;
      }

      if (!matchesFilter(productCategory, category)) return false;
      if (!matchesFilter(productMetal, metal)) return false;
      if (!matchesFilter(productJewelleryType, jewelleryType)) return false;
      if (!matchesFilter(productMetalColor, metalColor)) return false;
      if (!matchesFilter(productAccessoryType, accessoryType)) return false;
      if (!matchesFilter(productPurity, purity)) return false;
      if (!matchesFilter(productGender, gender)) return false;
      if (!matchesFilter(productOccasion, occasion)) return false;

      const price = Number(calculatePrice(product) || 0);

      if (minPriceValue !== null && price < minPriceValue) return false;
      if (maxPriceValue !== null && price > maxPriceValue) return false;

      return true;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => calculatePrice(a) - calculatePrice(b));
        break;

      case "price-high":
        result.sort((a, b) => calculatePrice(b) - calculatePrice(a));
        break;

      case "newest":
        result.sort((a, b) => {
          const aDate = new Date(a.created_date || a.createdAt || 0);
          const bDate = new Date(b.created_date || b.createdAt || 0);

          return bDate - aDate;
        });
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    category,
    metal,
    jewelleryType,
    metalColor,
    accessoryType,
    purity,
    gender,
    occasion,
    sortBy,
    minPriceValue,
    maxPriceValue,
    calculatePrice,
  ]);

  const dropdownFilterCount = [
    category,
    metal,
    jewelleryType,
    metalColor,
    accessoryType,
    purity,
    gender,
    occasion,
  ].filter((filter) => filter !== "all").length;

  const priceFilterCount = minPrice.trim() || maxPrice.trim() ? 1 : 0;
  const activeFilters = dropdownFilterCount + priceFilterCount;
  const hasActiveFilters = search.trim() || activeFilters > 0;

  const clearFilters = () => {
    setCategory("all");
    setMetal("all");
    setJewelleryType("all");
    setMetalColor("all");
    setAccessoryType("all");
    setPurity("all");
    setGender("all");
    setOccasion("all");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSearchParams({});
  };

  const priceSummary =
    minPriceValue !== null || maxPriceValue !== null
      ? `${minPriceValue !== null ? formatPrice(minPriceValue) : "Any"} – ${
          maxPriceValue !== null ? formatPrice(maxPriceValue) : "Any"
        }`
      : "Any price";

  const hasInvalidPriceRange =
    minPriceValue !== null &&
    maxPriceValue !== null &&
    minPriceValue > maxPriceValue;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-3xl font-semibold sm:text-5xl">
          Our Collections
        </h1>

        <p className="text-sm text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "piece" : "pieces"} of timeless
          elegance
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-background pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters((value) => !value)}
            className="relative gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters

            {activeFilters > 0 && (
              <Badge className="flex h-5 min-w-5 items-center justify-center bg-primary px-1.5 text-[10px] text-primary-foreground">
                {activeFilters}
              </Badge>
            )}
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 space-y-4 rounded-sm border border-border bg-card p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Filters</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={metal} onValueChange={setMetal}>
              <SelectTrigger>
                <SelectValue placeholder="Metal" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Metals</SelectItem>

                {METALS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={jewelleryType} onValueChange={setJewelleryType}>
              <SelectTrigger>
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

            <Select value={metalColor} onValueChange={setMetalColor}>
              <SelectTrigger>
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

            <Select value={accessoryType} onValueChange={setAccessoryType}>
              <SelectTrigger>
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

            <Select value={purity} onValueChange={setPurity}>
              <SelectTrigger>
                <SelectValue placeholder="Purity" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Purities</SelectItem>

                {PURITIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>

                {GENDERS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger>
                <SelectValue placeholder="Occasion" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Occasions</SelectItem>

                {OCCASIONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="text-sm font-medium">Price Range</label>

              <span className="text-xs text-muted-foreground">
                {priceSummary}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Minimum Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="No minimum"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Maximum Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="No maximum"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {hasInvalidPriceRange && (
              <p className="mt-3 text-xs text-destructive">
                Minimum price should be less than maximum price.
              </p>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square rounded-sm gold-shimmer" />
                <div className="h-4 w-3/4 rounded gold-shimmer" />
                <div className="h-3 w-1/2 rounded gold-shimmer" />
              </div>
            ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="mb-2 font-heading text-2xl text-muted-foreground">
            No products found
          </p>

          <p className="mb-4 text-sm text-muted-foreground">
            Try adjusting your filters
          </p>

          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}