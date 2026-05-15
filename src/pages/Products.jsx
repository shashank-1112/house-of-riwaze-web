import React, { useEffect, useMemo, useState } from "react";

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
import { Slider } from "@/components/ui/slider";

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
];

const METALS = ["Gold", "Silver", "Diamond", "Platinum", "Mixed"];
const PURITIES = ["18K", "22K", "24K", "925 Silver", "999 Silver", "Platinum"];
const GENDERS = ["Men", "Women", "Unisex"];
const OCCASIONS = ["Bridal", "Casual", "Festival", "Office", "Any"];

const PRICE_MIN = 0;
const PRICE_MAX = 1000000;

export default function Products() {
  const { calculatePrice } = useMetalRates();
  const urlParams = new URLSearchParams(window.location.search);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlParams.get("category") || "all");
  const [metal, setMetal] = useState(urlParams.get("metal") || "all");
  const [purity, setPurity] = useState("all");
  const [gender, setGender] = useState("all");
  const [occasion, setOccasion] = useState(urlParams.get("occasion") || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [showFilters, setShowFilters] = useState(false);

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
      const productMetal = product.metal_type || product.metal || "";
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

      if (category !== "all" && productCategory !== category) return false;
      if (metal !== "all" && productMetal !== metal) return false;
      if (purity !== "all" && productPurity !== purity) return false;
      if (gender !== "all" && productGender !== gender) return false;
      if (occasion !== "all" && productOccasion !== occasion) return false;

      const price = calculatePrice(product);

      if (price < priceRange[0] || price > priceRange[1]) return false;

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
    purity,
    gender,
    occasion,
    sortBy,
    priceRange,
    calculatePrice,
  ]);

  const activeFilters = [
    category,
    metal,
    purity,
    gender,
    occasion,
  ].filter((filter) => filter !== "all").length;

  const hasActiveFilters =
    search.trim() ||
    activeFilters > 0 ||
    priceRange[0] !== PRICE_MIN ||
    priceRange[1] !== PRICE_MAX;

  const clearFilters = () => {
    setCategory("all");
    setMetal("all");
    setPurity("all");
    setGender("all");
    setOccasion("all");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSearch("");
  };

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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                <SelectItem value="all">All</SelectItem>

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

          <div>
            <label className="mb-2 block text-xs text-muted-foreground">
              Price Range: ₹{priceRange[0].toLocaleString("en-IN")} – ₹
              {priceRange[1].toLocaleString("en-IN")}
            </label>

            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
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