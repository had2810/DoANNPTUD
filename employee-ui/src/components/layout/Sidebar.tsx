import {
  Home,
  Users,
  MessageCircle,
  Settings,
  HelpCircle,
  BarChart3,
  Phone,
  Mail,
  LogOut,
  Settings2,
  ShoppingBag,
  Calendar,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutConfirmDialog from "../dialog/LogoutConfirmDialog";
import { clearAuth } from "@/lib/authStorage";
import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/services/authService";
import { getAccessToken } from "@/lib/authStorage";
import { getUnresolvedAppointmentsCount } from "@/services/appontmentService";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["employeeInfo"],
    queryFn: getMe,
    enabled: !!getAccessToken(),
  });
  const employeeInfo = data?.data;

  const { data: unresolvedCountData } = useQuery({
    queryKey: ["unresolvedAppointmentsCount"],
    queryFn: getUnresolvedAppointmentsCount,
    refetchInterval: 10000, // cập nhật tự động mỗi 10 giây
    enabled: !!getAccessToken(),
  });
  const unresolvedCount = unresolvedCountData?.count || 0;

  const menuItems = [
    { id: "dashboard", label: "Trang chủ", icon: Home, path: "/dashboard" },
    {
      id: "unresolved-orders",
      label: `Đơn cần xử lý${
        unresolvedCount > 0 ? ` (${unresolvedCount})` : ""
      }`,
      icon: ShoppingBag,
      path: "/unresolved-orders",
    },
    { id: "customers", label: "Khách hàng", icon: Users, path: "/customers" },
    // {
    //   id: "conversations",
    //   label: "Hội thoại",
    //   icon: MessageCircle,
    //   path: "/conversations",
    // },
    // { id: "calls", label: "Cuộc gọi", icon: Phone, path: "/calls" },
    {
      id: "personal-calendar",
      label: "Lịch làm việc",
      icon: Calendar,
      path: "/personal-calendar",
    },
    {
      id: "weekly-schedule",
      label: "Đăng ký lịch tuần",
      icon: CalendarDays,
      path: "/weekly-schedule",
    },
    // { id: "analytics", label: "Thống kê", icon: BarChart3, path: "/analytics" },
    { id: "settings", label: "Cài đặt", icon: Settings, path: "/settings" },
    { id: "help", label: "Trợ giúp", icon: HelpCircle, path: "/help" },
  ];

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "h-full border-r bg-card py-6 flex flex-col transition-all duration-200",
        collapsed ? "w-16 px-2" : "w-64 px-4"
      )}
    >
      <div
        className={cn("mb-8", collapsed ? "px-0 flex justify-center" : "px-3")}
      >
        {collapsed ? (
          <div className="flex items-center justify-center w-8 h-8">
            <div className="w-6 h-6 bg-blue-500 rounded relative">
              <div
                className="absolute inset-0 bg-white"
                style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-primary">
              Tech<span className="text-blue-300">Mate</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Cổng hỗ trợ khách hàng
            </p>
          </>
        )}
      </div>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )
            }
            end={item.path === "/dashboard"}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto pt-6 border-t group relative">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors group-hover:bg-muted",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium transition-transform group-hover:scale-105">
            {employeeInfo?.avatar_url ? (
              <img
                src={employeeInfo.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              employeeInfo?.lastName?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary">
                {employeeInfo?.fullName || "Loading..."}
              </p>
              <p className="text-xs font-medium text-green-500">Online</p>
            </div>
          )}
        </div>
        {/* Dropdown menu */}
        <div
          className="absolute bottom-14 left-3 w-48 bg-popover border rounded-md shadow-md 
             opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
             transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50"
        >
          <button
            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-muted text-sm transition-colors font-medium"
            onClick={() => navigate("/settings")}
          >
            <Settings2 size={16} />
            Edit Account
          </button>
          <button
            className="w-full flex items-center gap-2 text-left px-4 py-2 text-red-500 hover:bg-muted text-sm transition-colors font-medium"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut size={16} className="text-red-500" />
            Logout
          </button>
        </div>
        <LogoutConfirmDialog
          open={isLogoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
