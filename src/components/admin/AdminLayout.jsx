import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { productApi } from "@/api/productApi";

import {
  LayoutDashboard,
  Package,
  Plus,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  AlertTriangle,
  LogOut,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Inventory", path: "/admin/inventory", icon: Package },
  { label: "Add Product", path: "/admin/inventory/add", icon: Plus },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

function normalizePath(pathname) {
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned || "/";
}

function isNavItemActive(pathname, itemPath) {
  if (itemPath === "/admin") {
    return pathname === "/admin";
  }

  if (itemPath === "/admin/inventory") {
    return (
      pathname === "/admin/inventory" ||
      /^\/admin\/inventory\/[^/]+\/edit$/.test(pathname)
    );
  }

  return pathname === itemPath;
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { settings } = useStoreSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = normalizePath(location.pathname);

  const storeName =
    settings?.store_name || settings?.storeName || "House of Riwaze";

  const { data: lowStockCount = 0 } = useQuery({
    queryKey: ["low-stock-count"],
    queryFn: async () => {
      const products = await productApi.getAdminProducts({
        limit: 500,
      });

      return products.filter((product) => {
        const stock = Number(
          product.stock_quantity ?? product.stockQuantity ?? 0
        );

        const threshold = Number(
          product.min_stock_threshold ?? product.minStockThreshold ?? 5
        );

        return stock > 0 && stock <= threshold;
      }).length;
    },
    initialData: 0,
    staleTime: 1000 * 60,
  });

  const handleLogout = () => {
    // Temporary until admin auth is added.
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform lg:sticky lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-heading text-xl font-semibold">{storeName}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Admin Panel</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />

                {item.label}

                {item.label === "Inventory" && lowStockCount > 0 && (
                  <Badge className="ml-auto h-5 bg-destructive px-1.5 text-[10px] text-destructive-foreground">
                    <AlertTriangle className="mr-0.5 h-3 w-3" />
                    {lowStockCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            View Store
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <span className="font-heading text-lg font-semibold">
            {storeName} Admin
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}