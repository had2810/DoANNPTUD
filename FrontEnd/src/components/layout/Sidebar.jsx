import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  Home,
  LogIn,
  BookUser,
  UserRoundCog,
  Calendar,
  CalendarClock,
  Wrench,
  Laptop,
  Settings,
  Cpu,
  Receipt,
  CreditCard,
  ChevronDown,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Navigation",
    items: [
      {
        title: "Dashboard",
        icon: Home,
        href: "/admin",
      },
    ],
  },
  {
    title: "Quản lý người dùng",
    items: [
      {
        title: "Danh sách khách hàng",
        icon: BookUser,
        href: "/admin/customer",
      },
      {
        title: "Quản lý nhân viên",
        icon: UserRoundCog,
        href: "/admin/employee",
      },
      // {
      //   title: "Quản lý quyền",
      //   icon: UserRoundCog,
      //   href: "/admin/role",
      // },
    ],
  },
  {
    title: "Lịch hẹn & Sửa chữa",
    items: [
      {
        title: "Lịch hẹn sửa chữa",
        icon: Calendar,
        href: "/admin/appointment-list",
      },
      {
        title: "Lịch làm việc nhân viên ",
        icon: CalendarClock,
        href: "/admin/employee-work",
      },
      {
        title: "Trạng thái sửa chữa ",
        icon: Wrench,
        href: "/admin/repair-status-device",
      },
    ],
  },
  {
    title: "Thiết bị – Dịch vụ – Linh kiện",
    items: [
      {
        title: "Thiết bị",
        icon: Laptop,
        href: "/admin/device-template",
      },
      {
        title: "Dịch vụ",
        icon: Settings,
        href: "/admin/service",
      },
      // {
      //   title: "Linh kiện",
      //   icon: Cpu,
      //   href: "/admin/equipment-list",
      // },
    ],
  },
  // {
  //   title: "Hóa đơn – Thanh toán",
  //   items: [
  //     {
  //       title: "Hóa đơn",
  //       icon: Receipt,
  //       href: "/admin/invoice",
  //     },
  //     {
  //       title: "Thanh toán",
  //       icon: CreditCard,
  //       href: "/admin/payment",
  //     },
  //   ],
  // },
];

export function Sidebar({ collapsed }) {
  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8">
          <div className="w-6 h-6 bg-blue-500 rounded relative">
            <div
              className="absolute inset-0 bg-white"
              style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
            ></div>
          </div>
        </div>
        {!collapsed && (
          <h1 className="text-lg font-semibold text-gray-800">TechMate</h1>
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {group.title}
                </p>
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mx-2",
                      isActive
                        ? "bg-purple-600 text-white font-medium"
                        : "hover:bg-gray-100 text-gray-600 hover:text-black"
                    )
                  }
                  end={item.href === "/admin"}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-900">
                  Documentation
                </p>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
