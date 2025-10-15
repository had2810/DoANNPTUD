import { User, UserCog, CalendarDays, History, Key } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import "@/styles/profileOverride.scss";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/user/profile", title: "Thông tin tài khoản", icon: User },
    {
      path: "/user/profile/update",
      title: "Cập nhật tài khoản",
      icon: UserCog,
    },
    {
      path: "/user/profile/orders",
      title: "Đơn đặt lịch của tôi",
      icon: CalendarDays,
    },
    {
      path: "/user/profile/history",
      title: "Lịch sử đặt lịch của tôi",
      icon: History,
    },
    { path: "/user/profile/password", title: "Đổi mật khẩu", icon: Key },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden min-h-screen pt-20">
        <SidebarProvider>
          <Sidebar className="border-r h-full sticky top-16">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Quản lý tài khoản</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <Link to={item.path}>
                          <SidebarMenuButton
                            className={`w-full flex items-center gap-3 px-4 py-2 ${
                              location.pathname === item.path
                                ? "bg-blue-50 text-blue-600"
                                : ""
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {/* Outlet sẽ render các route con ở đây */}
            <Outlet />
          </main>
        </SidebarProvider>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout;
