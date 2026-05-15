import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { productApi } from "@/api/productApi";
import { useMetalRates } from "@/hooks/useMetalRates";
import { useStoreSettings } from "@/hooks/useStoreSettings";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ChevronLeft,
  Share2,
  Heart,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import ProductCard from "@/components/storefront/ProductCard";

function getProductValue(product, snakeKey, camelKey, fallback = "") {
  return product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
}

function getProductNumber(product, snakeKey, camelKey, fallback = 0) {
  const value = product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeProduct(product) {
  if (!product) return null;

  return {
    ...product,

    id: product.id,
    name: product.name || "",
    sku: product.sku || "",

    category: product.category || "",
    sub_category: getProductValue(product, "sub_category", "subCategory", ""),

    metal_type: getProductValue(product, "metal_type", "metalType", ""),
    purity: product.purity || "",

    gross_weight: getProductNumber(product, "gross_weight", "grossWeight", 0),
    net_weight: getProductNumber(product, "net_weight", "netWeight", 0),

    making_charges_type: getProductValue(
      product,
      "making_charges_type",
      "makingChargesType",
      "per_gram"
    ),

    making_charges: getProductNumber(
      product,
      "making_charges",
      "makingCharges",
      0
    ),

    price_override:
      product.price_override === "" || product.price_override === undefined
        ? product.priceOverride ?? null
        : product.price_override,

    stock_quantity: getProductNumber(
      product,
      "stock_quantity",
      "stockQuantity",
      0
    ),

    min_stock_threshold: getProductNumber(
      product,
      "min_stock_threshold",
      "minStockThreshold",
      5
    ),

    images: Array.isArray(product.images) ? product.images : [],

    description: product.description || "",
    tags: product.tags || "",

    visibility: product.visibility || "Published",
    gender: product.gender || "Unisex",
    occasion: product.occasion || "Any",

    is_featured: Boolean(
      product.is_featured ?? product.isFeatured ?? false
    ),

    stone_details: product.stone_details || product.stoneDetails || [],

    try_on_enabled: Boolean(
      product.try_on_enabled ?? product.tryOnEnabled ?? false
    ),
    try_on_type: getProductValue(product, "try_on_type", "tryOnType", "ring"),
    try_on_asset: getProductValue(product, "try_on_asset", "tryOnAsset", ""),
    try_on_scale: getProductNumber(product, "try_on_scale", "tryOnScale", 1),
    try_on_offset_x: getProductNumber(
      product,
      "try_on_offset_x",
      "tryOnOffsetX",
      0
    ),
    try_on_offset_y: getProductNumber(
      product,
      "try_on_offset_y",
      "tryOnOffsetY",
      0
    ),
    try_on_rotation: getProductNumber(
      product,
      "try_on_rotation",
      "tryOnRotation",
      0
    ),

    created_date: getProductValue(product, "created_date", "createdDate", ""),
    updated_date: getProductValue(product, "updated_date", "updatedDate", ""),
  };
}

function getRateForProduct(product, rates) {
  const metalType = String(product?.metal_type || "").toLowerCase();
  const purity = String(product?.purity || "").toLowerCase();

  if (metalType.includes("silver")) {
    return Number(rates?.silver || 0);
  }

  if (metalType.includes("platinum")) {
    return Number(rates?.platinum || 0);
  }

  if (purity.includes("24")) {
    return Number(rates?.gold_24k || 0);
  }

  if (purity.includes("18")) {
    return Number(rates?.gold_18k || 0);
  }

  return Number(rates?.gold_22k || 0);
}

function getMakingCost(product) {
  const weight = Number(product?.net_weight || 0);
  const charges = Number(product?.making_charges || 0);

  if (product?.making_charges_type === "per_gram") {
    return weight * charges;
  }

  return charges;
}

function getStoneCost(product) {
  return (product?.stone_details || []).reduce((total, stone) => {
    return total + Number(stone.cost || 0);
  }, 0);
}

function calculateFallbackPrice(product, metalRate) {
  const overrideValue = product?.price_override;

  if (
    overrideValue !== null &&
    overrideValue !== undefined &&
    overrideValue !== "" &&
    Number(overrideValue) > 0
  ) {
    return Number(overrideValue);
  }

  const metalCost = Number(product?.net_weight || 0) * Number(metalRate || 0);
  const makingCost = getMakingCost(product);
  const stoneCost = getStoneCost(product);

  return metalCost + makingCost + stoneCost;
}

export default function ProductDetail() {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = id || urlParams.get("id");

  const { calculatePrice, rates } = useMetalRates();
  const { settings } = useStoreSettings();

  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [wishlisted, setWishlisted] = useState(false);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const loadProductDetail = async () => {
      setIsLoading(true);

      try {
        const [productData, productsData] = await Promise.all([
          productApi.getProductById(productId),
          productApi.getProducts({ limit: 500 }),
        ]);

        setProduct(normalizeProduct(productData));
        setAllProducts((productsData || []).map(normalizeProduct));
        setSelectedImage(0);
      } catch (error) {
        toast({
          title: "Failed to load product",
          description: error.message,
          variant: "destructive",
        });

        setProduct(null);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const publishedProducts = allProducts.filter((item) => {
      return (
        item &&
        String(item.id) !== String(product.id) &&
        item.visibility === "Published"
      );
    });

    const sameCategory = publishedProducts.filter((item) => {
      return item.category === product.category;
    });

    if (sameCategory.length > 0) {
      return sameCategory.slice(0, 8);
    }

    const sameMetal = publishedProducts.filter((item) => {
      return item.metal_type === product.metal_type;
    });

    if (sameMetal.length > 0) {
      return sameMetal.slice(0, 8);
    }

    return publishedProducts.slice(0, 8);
  }, [allProducts, product]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-2xl">Product not found</p>

        <Link
          to="/products"
          className="mt-2 inline-block text-sm text-primary underline"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  const metalRate = getRateForProduct(product, rates);
  const metalCost = Number(product.net_weight || 0) * metalRate;
  const makingCost = getMakingCost(product);
  const stoneCost = getStoneCost(product);

  const calculatedPrice = Number(calculatePrice(product) || 0);
  const fallbackPrice = calculateFallbackPrice(product, metalRate);
  const totalPrice = calculatedPrice > 0 ? calculatedPrice : fallbackPrice;

  const images = product.images.length > 0 ? product.images : [null];
  const inStock = Number(product.stock_quantity || 0) > 0;

  const description =
    product.description && product.description.trim()
      ? product.description
      : "No description available for this product.";

  const whatsappMsg = `Hi, I'm interested in ${product.name} (SKU: ${product.sku}). Could you share more details?`;

  const whatsappNumber =
    settings?.whatsapp || settings?.whatsappNumber || settings?.phone || "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${String(whatsappNumber).replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(whatsappMsg)}`
    : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);

      toast({
        title: "Link copied",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setZoomPos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Collections
      </Link>

      <div className="grid gap-8 md:grid-cols-2 sm:gap-12">
        <div>
          <div
            className="relative aspect-square cursor-crosshair overflow-hidden rounded-sm bg-muted"
            onMouseEnter={() => setImageZoom(true)}
            onMouseLeave={() => setImageZoom(false)}
            onMouseMove={handleMouseMove}
          >
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300"
                style={
                  imageZoom
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : {}
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-heading text-4xl text-muted-foreground/20">
                  {product.name?.[0]}
                </span>
              </div>
            )}

            {!inStock && (
              <div className="absolute left-4 top-4">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition sm:h-20 sm:w-20 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-start gap-2">
            {product.metal_type && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase tracking-wider"
              >
                {product.metal_type}
              </Badge>
            )}

            {product.purity && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider"
              >
                {product.purity}
              </Badge>
            )}
          </div>

          <h1 className="mb-1 mt-3 font-heading text-3xl font-semibold sm:text-4xl">
            {product.name}
          </h1>

          <p className="mb-6 text-xs text-muted-foreground">
            SKU: {product.sku}
          </p>

          <p className="mb-6 font-heading text-3xl font-semibold text-foreground">
            ₹{Number(totalPrice || 0).toLocaleString("en-IN")}
          </p>

          <div className="mb-6 space-y-2 rounded-sm bg-secondary/50 p-4">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Price Breakdown
            </h4>

            <div className="flex justify-between text-sm">
              <span>
                Metal Cost ({product.net_weight}g × ₹
                {metalRate.toLocaleString("en-IN")}/g)
              </span>
              <span>₹{metalCost.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Making Charges</span>
              <span>₹{makingCost.toLocaleString("en-IN")}</span>
            </div>

            {stoneCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Stone Cost</span>
                <span>₹{stoneCost.toLocaleString("en-IN")}</span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between text-sm font-semibold">
              <span>Total MRP</span>
              <span>₹{Number(totalPrice || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{product.category || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Weight</span>
              <span>{product.gross_weight}g</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Weight</span>
              <span>{product.net_weight}g</span>
            </div>

            {product.gender && product.gender !== "Unisex" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">For</span>
                <span>{product.gender}</span>
              </div>
            )}

            {product.occasion && product.occasion !== "Any" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occasion</span>
                <span>{product.occasion}</span>
              </div>
            )}
          </div>

          {product.stone_details?.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Stone Details
              </h4>

              {product.stone_details.map((stone, index) => (
                <div
                  key={index}
                  className="mb-2 rounded-sm bg-secondary/30 p-3 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {stone.stone_type || stone.stoneType || "Stone"}
                    </span>

                    <span>
                      ₹{Number(stone.cost || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {[
                      stone.carat && `${stone.carat}ct`,
                      stone.clarity,
                      stone.cut,
                      stone.color,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                className="flex-1 gap-2 rounded-none bg-primary py-5 text-xs uppercase tracking-wider hover:bg-primary/90"
                disabled={!inStock}
                onClick={() =>
                  toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                  })
                }
              >
                <ShoppingCart className="h-4 w-4" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`h-auto rounded-none border-border px-3 ${
                  wishlisted ? "border-red-300 text-red-500" : ""
                }`}
                onClick={() => {
                  setWishlisted((value) => !value);

                  toast({
                    title: wishlisted
                      ? "Removed from Wishlist"
                      : "Added to Wishlist",
                    description: product.name,
                  });
                }}
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? "fill-red-500" : ""}`}
                />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="h-auto rounded-none px-3"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-none border-green-600 py-5 text-xs uppercase tracking-wider text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-border pt-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold">
          Description
        </h2>

        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12 sm:mt-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Related Products
            </h2>

            <Link
              to={`/products?category=${product.category}`}
              className="text-sm uppercase tracking-wider text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}