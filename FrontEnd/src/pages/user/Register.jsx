import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signupUser } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import NotificationDialog from "@/components/dialogs/NotificationDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z
  .object({
    firstName: z.string().min(2, "Vui lòng nhập họ"),
    lastName: z.string().min(2, "Vui lòng nhập tên"),
    userName: z.string().min(2, "Vui lòng nhập tên người dùng"),
    email: z.string().email("Email không hợp lệ"),
    phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
    address: z.string().min(5, "Vui lòng nhập địa chỉ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: "Bạn cần đồng ý với điều khoản sử dụng!" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      signupUser({
        ...form.getValues(),
        agreedToTerms: undefined, // không gửi trường này lên server
      }),
    onSuccess: () => {
      setShowSuccessDialog(true);
    },
    onError: () => {
      setShowSuccessDialog(true);
    },
  });

  const handleSubmit = (data) => {
    setIsLoading(true);
    mutate();
  };

  const handleSuccessAction = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-techmate-purple">Đăng ký</h1>
            <p className="text-gray-600 mt-2">
              Tạo tài khoản để theo dõi đơn hàng và nhận ưu đãi
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Nhập họ của bạn"
                    className="mt-1"
                  />
                  {form.formState.errors.firstName && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.firstName.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Nhập tên của bạn"
                    className="mt-1"
                  />
                  {form.formState.errors.lastName && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.lastName.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="userName">Tên người dùng</Label>
                  <Input
                    id="userName"
                    {...form.register("userName")}
                    placeholder="Nhập tên người dùng của bạn"
                    className="mt-1"
                  />
                  {form.formState.errors.userName && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.userName.message}
                    </span>
                  )}
                </div>
                <div>
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
                <div>
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    placeholder="Nhập số điện thoại của bạn"
                    className="mt-1"
                  />
                  {form.formState.errors.phoneNumber && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.phoneNumber.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    {...form.register("address")}
                    placeholder="Nhập địa chỉ của bạn"
                    className="mt-1"
                  />
                  {form.formState.errors.address && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.address.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="Tạo mật khẩu"
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
                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...form.register("confirmPassword")}
                      placeholder="Xác nhận mật khẩu"
                      className="mt-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {form.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-6">
                <Checkbox
                  id="terms"
                  checked={form.watch("agreedToTerms")}
                  onCheckedChange={(checked) =>
                    form.setValue("agreedToTerms", checked)
                  }
                />
                <Label htmlFor="terms" className="ml-2">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-techmate-purple hover:underline"
                  >
                    điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-techmate-purple hover:underline"
                  >
                    chính sách bảo mật
                  </Link>
                </Label>
              </div>

              {form.formState.errors.agreedToTerms && (
                <div className="text-red-500 text-sm mb-1">
                  {form.formState.errors.agreedToTerms.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-techmate-purple hover:bg-techmate-purpleLight"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link
                  to="/login"
                  className="text-techmate-purple hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <NotificationDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open);
          if (!open) setIsLoading(false);
        }}
        title="Đăng ký thành công!"
        description="Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email để xác nhận tài khoản."
        actionText="Đăng nhập ngay"
        onAction={handleSuccessAction}
        type="success"
      />

      <Footer />
    </div>
  );
};

export default Register;
