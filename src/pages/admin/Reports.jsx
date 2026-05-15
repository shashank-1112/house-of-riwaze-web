import React, { useEffect, useMemo, useState } from "react";

import { productApi } from "@/api/productApi";
import { useMetalRates } from "@/hooks/useMetalRates";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Download,
  IndianRupee,
  AlertTriangle,
  Package,
  RefreshCw,
} from "lucide-react";

function getProductNumber(product, snakeKey, camelKey, fallback = 0) {
  const value = product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getProductValue(product, snakeKey, camelKey, fallback = "") {
  return product?.[snakeKey] ?? product?.[camelKey] ?? fallback;
}

function formatValue(value) {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function Reports() {
  const { calculatePrice, rates } = useMetalRates();
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
        const aDate = new Date(a.created_date || a.createdDate || 0);
        const bDate = new Date(b.created_date || b.createdDate || 0);

        return bDate - aDate;
      });

      setProducts(sortedProducts);
    } catch (error) {
      toast({
        title: "Failed to load reports",
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

  const reportData = useMemo(() => {
    const totalValue = products.reduce((sum, product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const price = Number(calculatePrice(product) || 0);

      return sum + price * stock;
    }, 0);

    const goldProducts = products.filter((product) => {
      return getProductValue(product, "metal_type", "metalType") === "Gold";
    });

    const silverProducts = products.filter((product) => {
      return getProductValue(product, "metal_type", "metalType") === "Silver";
    });

    const diamondProducts = products.filter((product) => {
      return getProductValue(product, "metal_type", "metalType") === "Diamond";
    });

    const goldValue = goldProducts.reduce((sum, product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const price = Number(calculatePrice(product) || 0);

      return sum + price * stock;
    }, 0);

    const silverValue = silverProducts.reduce((sum, product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const price = Number(calculatePrice(product) || 0);

      return sum + price * stock;
    }, 0);

    const diamondValue = diamondProducts.reduce((sum, product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const price = Number(calculatePrice(product) || 0);

      return sum + price * stock;
    }, 0);

    const lowStockProducts = products.filter((product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const threshold = getProductNumber(
        product,
        "min_stock_threshold",
        "minStockThreshold",
        5
      );

      return stock > 0 && stock <= threshold;
    });

    const outOfStockProducts = products.filter((product) => {
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");

      return stock <= 0;
    });

    return {
      totalValue,
      goldProducts,
      silverProducts,
      diamondProducts,
      goldValue,
      silverValue,
      diamondValue,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [products, calculatePrice]);

  const exportFullCSV = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Metal",
      "Purity",
      "Net Weight(g)",
      "Stock",
      "Unit Price(₹)",
      "Total Value(₹)",
      "Status",
    ];

    const rows = products.map((product) => {
      const price = Number(calculatePrice(product) || 0);
      const stock = getProductNumber(product, "stock_quantity", "stockQuantity");
      const threshold = getProductNumber(
        product,
        "min_stock_threshold",
        "minStockThreshold",
        5
      );

      const status =
        stock <= 0
          ? "Out of Stock"
          : stock <= threshold
          ? "Low Stock"
          : "In Stock";

      return [
        product.name,
        product.sku,
        product.category,
        getProductValue(product, "metal_type", "metalType"),
        product.purity,
        getProductNumber(product, "net_weight", "netWeight"),
        stock,
        price,
        price * stock,
        status,
      ];
    });

    const escapeCell = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
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
    anchor.download = `inventory-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    anchor.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    {
      label: "Total Inventory Value",
      value: formatValue(reportData.totalValue),
      icon: IndianRupee,
      desc: `${products.length} products`,
    },
    {
      label: "Gold Inventory",
      value: formatValue(reportData.goldValue),
      icon: Package,
      desc: `${reportData.goldProducts.length} products · 22K rate ₹${Number(
        rates.gold_22k || rates.gold_22k_per_gram || 0
      ).toLocaleString("en-IN")}/g`,
    },
    {
      label: "Silver Inventory",
      value: formatValue(reportData.silverValue),
      icon: Package,
      desc: `${reportData.silverProducts.length} products · Silver rate ₹${Number(
        rates.silver || rates.silver_999_per_gram || 0
      ).toLocaleString("en-IN")}/g`,
    },
    {
      label: "Diamond Inventory",
      value: formatValue(reportData.diamondValue),
      icon: Package,
      desc: `${reportData.diamondProducts.length} products · Including stone costs`,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Reports
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Inventory valuation and stock reports
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
            onClick={exportFullCSV}
            disabled={isLoading || products.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Full Report
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <p className="text-xs text-muted-foreground">
                    {card.label}
                  </p>

                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <p className="text-xl font-bold">
                  {isLoading ? "—" : card.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {isLoading ? "Loading..." : card.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Low Stock Report ({reportData.lowStockProducts.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading stock report...
            </p>
          ) : reportData.lowStockProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              All products are well stocked
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Threshold</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reportData.lowStockProducts.map((product) => {
                  const stock = getProductNumber(
                    product,
                    "stock_quantity",
                    "stockQuantity"
                  );

                  const threshold = getProductNumber(
                    product,
                    "min_stock_threshold",
                    "minStockThreshold",
                    5
                  );

                  const value = Number(calculatePrice(product) || 0) * stock;

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>

                      <TableCell className="font-mono text-xs">
                        {product.sku}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge className="bg-amber-100 text-amber-700">
                          {stock}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center text-muted-foreground">
                        {threshold}
                      </TableCell>

                      <TableCell className="text-right">
                        ₹{value.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg text-destructive">
            Out of Stock ({reportData.outOfStockProducts.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading stock report...
            </p>
          ) : reportData.outOfStockProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No out-of-stock products
            </p>
          ) : (
            <div className="space-y-2">
              {reportData.outOfStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-sm bg-destructive/5 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {product.sku} ·{" "}
                      {getProductValue(product, "metal_type", "metalType")}{" "}
                      {product.purity}
                    </p>
                  </div>

                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}