import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStoreSettings } from '@/hooks/useStoreSettings';
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Add Product', path: '/admin/inventory/add', icon: Plus },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const { settings } = useStoreSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const { data: lowStockCount = 0 } = useQuery({
  //   queryKey: ['low-stock-count'],
  //   queryFn: async () => {
  //     const products = await base44.entities.Product.list('-created_date', 500);
  //     return products.filter(p => p.stock_quantity <= (p.min_stock_threshold || 5) && p.stock_quantity > 0).length;
  //   },
  //   initialData: 0,
  // });

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-border">
          <h2 className="font-heading text-xl font-semibold">{settings.store_name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.label === 'Inventory' && lowStockCount > 0 && (
                  <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5 h-5">
                    <AlertTriangle className="w-3 h-3 mr-0.5" />
                    {lowStockCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-heading text-lg font-semibold">{settings.store_name} Admin</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}