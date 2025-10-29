import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword, resetPassword } from "@/services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If token exists => show reset form, otherwise show request form
  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra email.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Gửi thất bại";
      toast.error(msg);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(token, newPassword);
      toast.success("Đổi mật khẩu thành công. Bạn sẽ được chuyển hướng tới trang đăng nhập.");
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Đổi mật khẩu thất bại";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{token ? "Thiết lập mật khẩu mới" : "Quên mật khẩu"}</h1>
          <p className="text-sm text-gray-500">
            {token
              ? "Nhập mật khẩu mới cho tài khoản của bạn"
              : "Nhập email, chúng tôi sẽ gửi link đặt lại mật khẩu"}
          </p>
        </div>

        {!token ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi liên kết"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newpassword">Mật khẩu mới</Label>
              <Input
                id="newpassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}

        <div className="text-center text-sm">
          <Link to="/login" className="text-[#9b87f5] hover:text-[#7E69AB]">
            Quay về đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
