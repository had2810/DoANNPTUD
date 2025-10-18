import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import EmployeeRouter from "@/routes/employee/EmployeeRouter";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  "unresolved-orders": "Đơn hàng chưa giải quyết",
  customers: "Khách hàng",
  conversations: "Conversations",
  calls: "Calls",
  emails: "Emails",
  analytics: "Analytics",
  "personal-calendar": "Lịch làm việc",
  settings: "Settings",
  help: "Help & Support",
};

const Index = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  // Lấy phần sau cùng của path để xác định tiêu đề
  const path =
    location.pathname.split("/").filter(Boolean).pop() || "dashboard";
  const title = TITLES[path] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-200">
        <Header title={title} onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <EmployeeRouter />
        </main>
      </div>
    </div>
  );
};

export default Index;
