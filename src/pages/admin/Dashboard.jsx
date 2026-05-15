import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { productApi } from "@/api/productApi";
import { useMetalRates } from "@/hooks/useMetalRates";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import {
  Package,
  AlertTriangle,
  Eye,
  EyeOff,
  Layers,
  IndianRupee,
  Plus,
  RefreshCw,
  CheckCircle2,
  FileText,
  Star,
} from "lucide-react";

function formatInventoryValue(value) {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getProductDate(product) {
  return new Date(product.created_date || product.createdDate || 0);
}

export default function Dashboard() {
  const { calculatePrice } = useMetalRates();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        return getProductDate(b) - getProductDate(a);
      });

      setProducts(sortedProducts);
    } catch (error) {
      toast({
        title: "Failed to load dashboard",
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

  const dashboardData = useMemo(() => {
    const totalProducts = products.length;

    const publishedProducts = products.filter((product) => {
      return product.visibility === "Published";
    }).length;

    const draftProducts = products.filter((product) => {
      return product.visibility === "Draft";
    }).length;

    const hiddenProducts = products.filter((product) => {
      return product.visibility === "Hidden";
    }).length;

    const inStock = products.filter((product) => {
      return Number(product.stock_quantity || 0) > 0;
    }).length;

    const outOfStock = products.filter((product) => {
      return Number(product.stock_quantity || 0) <= 0;
    }).length;

    const lowStock = products.filter((product) => {
      const stock = Number(product.stock_quantity || 0);
      const threshold = Number(product.min_stock_threshold || 5);

      return stock > 0 && stock <= threshold;
    });

    const categories = new Set(
      products.map((product) => product.category).filter(Boolean),
    ).size;

    const totalValue = products.reduce((sum, product) => {
      const stock = Number(product.stock_quantity || 0);
      const price = Number(calculatePrice(product) || 0);

      return sum + price * stock;
    }, 0);

    const featuredProducts = products.filter((product) => {
      return product.is_featured === true || product.isFeatured === true;
    }).length;

    return {
      totalProducts,
      publishedProducts,
      draftProducts,
      hiddenProducts,
      inStock,
      outOfStock,
      lowStock,
      categories,
      totalValue,
      featuredProducts,
    };
  }, [products, calculatePrice]);

  const stats = [
    {
      label: "Total Products",
      value: dashboardData.totalProducts,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "In Stock",
      value: dashboardData.inStock,
      icon: Eye,
      color: "text-green-600",
    },
    {
      label: "Out of Stock",
      value: dashboardData.outOfStock,
      icon: EyeOff,
      color: "text-destructive",
    },
    {
      label: "Low Stock",
      value: dashboardData.lowStock.length,
      icon: AlertTriangle,
      color: "text-amber-600",
    },
    {
      label: "Categories",
      value: dashboardData.categories,
      icon: Layers,
      color: "text-primary",
    },
    {
      label: "Inventory Value",
      value: formatInventoryValue(dashboardData.totalValue),
      icon: IndianRupee,
      color: "text-green-600",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your jewellery inventory
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

          <Link to="/admin/inventory/add">
            <Button className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-xl font-bold sm:text-2xl">
                      {isLoading ? "—" : stat.value}
                    </p>
                  </div>

                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Published</p>
                <p className="mt-1 text-xl font-semibold">
                  {isLoading ? "—" : dashboardData.publishedProducts}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Draft</p>
                <p className="mt-1 text-xl font-semibold">
                  {isLoading ? "—" : dashboardData.draftProducts}
                </p>
              </div>

              <FileText className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Featured</p>
                <p className="mt-1 text-xl font-semibold">
                  {isLoading ? "—" : dashboardData.featuredProducts}
                </p>
              </div>

              <Star className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!isLoading && dashboardData.lowStock.length > 0 && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {dashboardData.lowStock.slice(0, 10).map((product) => (
                <Link
                  key={product.id}
                  to={`/admin/inventory/${product.id}/edit`}
                  className="flex items-center justify-between rounded-sm px-3 py-2 transition-colors hover:bg-secondary"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>

                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-amber-300 text-amber-600"
                  >
                    {product.stock_quantity} left
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-lg">
              Recent Products
            </CardTitle>

            <Link to="/admin/inventory">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-sm px-2 py-2.5"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-sm gold-shimmer" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded gold-shimmer" />
                      <div className="h-3 w-1/3 rounded gold-shimmer" />
                    </div>
                  </div>
                ))}
            </div>
          ) : products.length > 0 ? (
            products.slice(0, 5).map((product) => (
              <Link
                key={product.id}
                to={`/admin/inventory/${product.id}/edit`}
                className="flex items-center gap-3 rounded-sm px-2 py-2.5 transition-colors hover:bg-secondary"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-muted">
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

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {product.metal_type} · {product.purity}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  ₹
                  {Number(calculatePrice(product) || 0).toLocaleString("en-IN")}
                </p>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="font-heading text-lg">No products yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first product to see dashboard insights.
              </p>

              <Link to="/admin/inventory/add">
                <Button className="mt-4 gap-2 bg-primary">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
