import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { login, getMe } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      login(form.getValues("email"), form.getValues("password")),
    onSuccess: async () => {
      toast.success("Đăng nhập thành công!");
      try {
        const me = await getMe();
        const role = me?.data?.role;
        const roleId = typeof role === "object" ? role?._id : role;

        if (roleId === 1) navigate("/admin");
        else if (roleId === 2) navigate("/employee");
        else if (roleId === 4) navigate("/user");
        else toast.error("Không xác định được quyền tài khoản!");
      } catch (e) {
        toast.error("Không lấy được thông tin tài khoản!");
      }
    },

    onError: (error) => {
      const message = error?.response?.data?.message || "Đăng nhập thất bại";
      form.setError("email", { message });
    },
  });

  const handleSubmit = (data) => {
    mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-techmate-purple">
              Đăng nhập
            </h1>
            <p className="text-gray-600 mt-2">
              Đăng nhập để theo dõi đơn hàng và lịch sửa chữa của bạn
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Nhập email của bạn"
                  className="mt-1"
                />
                {form.formState.errors.email && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-techmate-purple hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Nhập mật khẩu"
                    className="mt-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex items-center mb-6">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-techmate-purple hover:bg-techmate-purpleLight"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link
                  to="/register"
                  className="text-techmate-purple hover:underline"
                >
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
