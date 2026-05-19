import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Storefront Layout + Pages
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Rates from "@/pages/Rates";

// Admin Layout + Pages
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import Dashboard from "@/pages/admin/Dashboard";
import Inventory from "@/pages/admin/Inventory";
import ProductForm from "@/pages/admin/ProductForm";
import Reports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLogin from "@/pages/admin/Login";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* Public Storefront */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Keep these only if old links still use them */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />

            <Route path="/rates" element={<Rates />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/add" element={<ProductForm />} />
            <Route path="inventory/:id/edit" element={<ProductForm />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="text-center">
                  <h1 className="font-heading text-3xl font-semibold">
                    Page Not Found
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    The page you are looking for does not exist.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>

        <Toaster richColors position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
