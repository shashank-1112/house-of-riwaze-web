import { NavLink } from "react-router-dom";
import { BarChart3, Boxes, FileText, Gem, LayoutDashboard, Settings } from "lucide-react";

const links = [
  { label: "Dashboard", to: "/admin/Dashboard", icon: LayoutDashboard },
  { label: "Inventory", to: "/admin/Inventory", icon: Boxes },
  { label: "Product Form", to: "/admin/ProductForm", icon: Gem },
  { label: "Reports", to: "/admin/Reports", icon: BarChart3 },
  { label: "Admin Settings", to: "/admin/AdminSettings", icon: Settings }
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="brand-mark"><Gem size={20} /></span>
        <div>
          <strong>Zarina</strong>
          <small>Admin Studio</small>
        </div>
      </div>

      <nav className="admin-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? "active" : ""}>
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-note">
        <FileText size={18} />
        <span>Daily stock reconciliation pending for 3 SKUs.</span>
      </div>
    </aside>
  );
}
