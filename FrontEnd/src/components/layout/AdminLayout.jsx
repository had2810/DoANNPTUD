import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLocation } from "react-router-dom"; // ✅ thêm dòng này

export function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // ✅ dùng hook của react-router
  const isSignupPage = location.pathname === "/admin/signup";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} collapsed={collapsed} />
        <main className={`flex-1 overflow-y-auto ${isSignupPage ? "" : "p-4"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
