import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader.jsx";

export default function PublicLayout() {
  return (
    <div className="app-shell public-shell">
      <PublicHeader />
      <main className="public-main">
        <Outlet />
      </main>
    </div>
  );
}
