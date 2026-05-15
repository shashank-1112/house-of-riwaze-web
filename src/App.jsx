import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Storefront Pages
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Rates from "@/pages/Rates";

// Admin Pages
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Inventory from "@/pages/admin/Inventory";
import ProductForm from "@/pages/admin/ProductForm";
import Reports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/AdminSettings";
import About from "@/pages/About";

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
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />
            {/* <Route path="/rates" element={<Rates />} /> */}
          </Route>

          {/* Admin Panel */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/inventory/add" element={<ProductForm />} />
            <Route path="/admin/inventory/:id/edit" element={<ProductForm />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

          </Route>

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                  <h1 className="text-3xl font-heading font-semibold">
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