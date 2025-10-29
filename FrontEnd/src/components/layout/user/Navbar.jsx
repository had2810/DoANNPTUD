import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getMe, logout } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LogOut, User, ShoppingBag, History, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";

const Navbar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getMe,
    onError: (error) => {
      const message = error?.response?.data?.message || "Lỗi không xác định";
      console.error(message);
      navigate("/user/login");
    },
  });

  const userInfo = data?.data;

  return (
    <>
      {/* Placeholder cho fixed header */}
      <div className="h-20" />

      <header className="w-full fixed top-0 left-0 right-0 border-b bg-white shadow-md z-50">
        <div className="max-w-[1400px] mx-auto flex h-20 items-center justify-between px-8">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-techmate-purple flex items-center gap-1 navbar-brand"
          >
            Tech<span className="text-blue-300">Mate</span>
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {[
              { label: "Trang chủ", path: "/" },
              { label: "Dịch vụ", path: "/user/services" },
              { label: "Đặt lịch", path: "/user/booking" },
              { label: "Tra cứu", path: "/user/lookup" },
              { label: "Về chúng tôi", path: "/user/about" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-base relative py-2 group ${
                  isActive(path)
                    ? "text-techmate-purple font-medium border-b-2 border-techmate-purple"
                    : "text-gray-600 hover:text-techmate-purple font-medium"
                }`}
              >
                {label}
                {!isActive(path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-techmate-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                )}
              </Link>
            ))}
          </nav>
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {!userInfo ? (
              <>
                <Link to="/user/login">
                  <Button
                    variant="outline"
                    className="border-techmate-purple text-techmate-purple hover:text-techmate-purple hover:bg-techmate-purple/10 px-6 py-1.5 text-sm font-medium rounded-md"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/user/register">
                  <Button className="bg-techmate-purple hover:bg-techmate-purple/90 text-white px-6 py-1.5 text-sm font-medium rounded-md">
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative group">
                <div className="min-w-64 flex items-center justify-around gap-2 px-4 py-2 bg-green-100 rounded-full hover:bg-green-200 cursor-pointer transition-colors duration-200">
                  <img
                    src={userInfo.avatar_url || "/default-avatar.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{userInfo.email}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-200 group-hover:rotate-180" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <div className="py-1">
                    <Link
                      to="/user/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} />
                      <span>Thông tin tài khoản</span>
                    </Link>
                    <Link
                      to="/user/profile/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ShoppingBag size={16} />
                      <span>Đơn đặt hàng</span>
                    </Link>
                    <Link
                      to="/user/profile/history"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <History size={16} />
                      <span>Lịch sử đặt hàng</span>
                    </Link>
                    <div className="border-t-2 border-gray-200 mx-4"></div>
                    <button
                      onClick={() => setLogoutDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <LogoutConfirmDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
          onConfirm={async () => {
            await logout();
            queryClient.clear();
            navigate("/user/login");
          }}
        />
      </header>
    </>
  );
};

export default Navbar;
