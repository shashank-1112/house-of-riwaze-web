import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { settings } = useStoreSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Collections", path: "/products" },
    // { label: "Today's Rates", path: "/rates" },
  ];

  const storeName = settings?.store_name || settings?.storeName || "House of Riwaze";
  const logoUrl = settings?.logo_url || settings?.logoUrl || "";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-8 max-w-[120px] object-contain sm:h-10"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-lg font-semibold text-primary">
                H
              </div>
            )}

            <span className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {storeName}
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-2 border-t border-border pb-4 pt-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}