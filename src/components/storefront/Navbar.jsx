import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
  ];

  const storeName =
    settings?.store_name || settings?.storeName || "Rivaazé";

  const logoUrl = settings?.logo_url || settings?.logoUrl || "";

  const getNavClass = ({ isActive }) =>
    `relative text-[13px] font-medium uppercase tracking-[0.18em] transition-colors ${
      isActive
        ? "text-foreground after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-primary after:content-['']"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const getMobileNavClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
          <div className="flex items-center justify-start">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2.5"
              onClick={() => setMobileOpen(false)}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-9 w-9 object-contain sm:h-11 sm:w-11"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-lg font-semibold text-primary sm:h-11 sm:w-11">
                  R
                </div>
              )}

              <span className="truncate font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {storeName}
              </span>
            </Link>
          </div>

          <div className="hidden items-center justify-center gap-9 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={getNavClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <Link to="/products">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle menu"
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
          <div className="border-t border-border pb-4 pt-3 md:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={getMobileNavClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}