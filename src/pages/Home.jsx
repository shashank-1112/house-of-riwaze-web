import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { productApi } from "@/api/productApi";

import HeroCarousel from "@/components/storefront/HeroCarousel";
import CategoryLinks from "@/components/storefront/CategoryLinks";
import ProductCard from "@/components/storefront/ProductCard";
import WhyChooseUs from "@/components/storefront/WhyChooseUs";
import Testimonials from "@/components/storefront/Testimonials";

function isPublishedProduct(product) {
  const visibility = product.visibility || product.status;

  return (
    visibility === "Published" ||
    visibility === "active" ||
    product.isVisible === true
  );
}

function isFeaturedProduct(product) {
  return product.is_featured === true || product.isFeatured === true;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    const loadHomeProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");

      try {
        const data = await productApi.getProducts({
          limit: 100,
        });

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setProducts([]);
        setProductError(error.message || "Failed to load products.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadHomeProducts();
  }, []);

  const { featured, latestProducts, displayProducts } = useMemo(() => {
    const publishedProducts = products.filter(isPublishedProduct);

    const featuredItems = publishedProducts.filter(isFeaturedProduct);

    const latestItems = [...publishedProducts]
      .sort((a, b) => {
        const aDate = new Date(a.created_date || a.createdDate || 0);
        const bDate = new Date(b.created_date || b.createdDate || 0);

        return bDate - aDate;
      })
      .slice(0, 8);

    const displayItems =
      featuredItems.length > 0
        ? featuredItems.slice(0, 6)
        : latestItems.slice(0, 6);

    return {
      featured: featuredItems,
      latestProducts: latestItems,
      displayProducts: displayItems,
    };
  }, [products]);

  return (
    <div>
      <HeroCarousel />
      <CategoryLinks />

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold sm:text-4xl">
                {featured.length > 0 ? "Featured Collections" : "New Arrivals"}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Handpicked pieces you&apos;ll love
              </p>
            </div>

            <Link to="/products" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                className="group gap-2 text-sm uppercase tracking-wider text-primary hover:text-primary/80"
              >
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="aspect-square rounded-sm gold-shimmer" />
                    <div className="h-4 w-3/4 rounded gold-shimmer" />
                    <div className="h-3 w-1/2 rounded gold-shimmer" />
                  </div>
                ))}
            </div>
          ) : productError ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-heading text-xl">Unable to load products</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {productError}
              </p>
            </div>
          ) : displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link to="/products">
                  <Button
                    variant="outline"
                    className="px-8 text-xs uppercase tracking-wider"
                  >
                    View All Collections
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-heading text-xl">No products available</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add published products from admin to show them here.
              </p>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}