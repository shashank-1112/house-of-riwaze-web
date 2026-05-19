import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Gem, Loader2, Lock, User } from "lucide-react";

import { adminAuthApi } from "@/api/adminAuthApi";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { settings } = useStoreSettings();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const stateFrom = location.state?.from;
    const queryFrom = searchParams.get("redirect");

    if (stateFrom?.startsWith("/admin") && stateFrom !== "/admin/login") {
      return stateFrom;
    }

    if (queryFrom?.startsWith("/admin") && queryFrom !== "/admin/login") {
      return queryFrom;
    }

    return "/admin";
  }, [location.state, searchParams]);

  const storeName =
    settings?.store_name || settings?.storeName || "House of Riwaze";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await adminAuthApi.login({ username, password });

      toast({
        title: "Signed in",
        description: "Welcome back to the admin panel.",
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="hidden min-h-screen flex-1 flex-col justify-between border-r border-border bg-foreground p-10 text-background lg:flex">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-3 text-sm font-medium text-background/85 transition-colors hover:text-background"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-background/25 bg-background/10">
            <Gem className="h-5 w-5" />
          </span>
          {storeName}
        </Link>

        <div className="max-w-xl">
          <div className="mb-6 h-px w-24 bg-primary" />
          <h1 className="font-heading text-5xl font-semibold leading-tight">
            Admin access for a refined jewellery catalogue.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-background/70">
            Manage inventory, reports, rates, and storefront settings from one
            protected workspace.
          </p>
        </div>

       <p className="text-lg font-light text-background/85 text-xs italic">
          Jewellery made to be worn with pride and passed on with love.
        </p>
      </section>

      <section className="flex min-h-screen w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:max-w-xl">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-sm font-medium"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <Gem className="h-5 w-5 text-primary" />
              </span>
              {storeName}
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Admin Login
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold">
                Sign in to continue
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use your administrator credentials to access protected tools.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                    className="pl-9"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="px-9"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Return to storefront
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
