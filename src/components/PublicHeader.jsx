import { Link, NavLink } from "react-router-dom";
import { Gem, ShieldCheck } from "lucide-react";

const navItems = [
  { label: "Products", to: "/products" },
  { label: "Rates", to: "/rates" },
  { label: "Admin", to: "/admin/Dashboard" }
];

export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link to="/" className="brand">
        <span className="brand-mark"><Gem size={22} /></span>
        <span>
          <strong>House of Riwaze</strong>
          <small>Luxury inventory & e-commerce</small>
        </span>
      </Link>

      <nav className="public-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "active" : ""}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-pill">
        <ShieldCheck size={16} /> Certified Stock
      </div>
    </header>
  );
}
