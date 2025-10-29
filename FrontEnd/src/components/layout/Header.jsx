import { cn } from "@/lib/utils";
import {
  Search,
  Menu,
  Github,
  Bell,
  User,
  Edit,
  Eye,
  Calendar,
  CreditCard,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "@/services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";

export function Header({ toggleSidebar, collapsed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["adminInfo"],
    queryFn: getMe,
  });

  const adminInfo = data?.data;

  return (
    <header className="h-16 px-4 border-b border-gray-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div
          className={cn(
            "relative transition-all duration-300",
            collapsed ? "w-52" : "w-64"
          )}
        >
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ctrl + K"
            className="w-full h-9 pl-8 pr-4 rounded-md bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Github className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-full hover:bg-gray-50">
                <Avatar>
                  <AvatarImage
                    src={adminInfo?.avatar_url || "/default-avatar.png"}
                  />
                  <AvatarFallback>
                    {adminInfo?.firstName?.[0] || "A"}
                    {adminInfo?.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>

                {isLoading ? (
                  <span className="text-sm font-medium">Loading...</span>
                ) : (
                  <span className="text-sm font-medium">
                    {adminInfo.fullName}
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={adminInfo?.avatar_url || "/default-avatar.png"}
                  />
                  <AvatarFallback>
                    {adminInfo?.firstName?.[0] ?? "A"}
                    {adminInfo?.lastName?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isLoading ? (
                    <span className="text-sm font-medium">Đang tải...</span>
                  ) : (
                    <>
                      <h3 className="font-medium">{adminInfo.fullName}</h3>
                      <p className="text-sm text-gray-500">{adminInfo.email}</p>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.reload();
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex border-b">
                <button
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2",
                    activeTab === "profile"
                      ? "text-blue-500 border-blue-500"
                      : "text-gray-500 border-transparent"
                  )}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4" />
                  Hồ sơ
                </button>
                <button
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2",
                    activeTab === "setting"
                      ? "text-blue-500 border-blue-500"
                      : "text-gray-500 border-transparent"
                  )}
                  onClick={() => setActiveTab("setting")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Cài đặt
                </button>
              </div>

              <div className="py-2">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/admin/profile/edit")}
                >
                  <Edit className="h-4 w-4 mr-3" />
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/admin/profile/view")}
                >
                  <Eye className="h-4 w-4 mr-3" />
                  Xem hồ sơ
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/admin/profile/social")}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Lịch cá nhân
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/admin/billing")}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Thanh toán
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Đăng xuất
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={async () => {
          await logout();
          queryClient.clear();
          navigate("/login");
        }}
      />
    </header>
  );
}
