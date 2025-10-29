import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { loginAdmin, getMe } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { saveTokens } from "@/lib/authStorage";
import useAutoHideMessage from "@/hooks/useAutoHideMessage";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useAutoHideMessage(error, setError);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => loginAdmin(email, password),
    onSuccess: async (data) => {
      setError(""); // Clear any previous errors
      saveTokens(data.accessToken, data.refreshToken);
      try {
        const me = await getMe();
        const roleId = me?.data?.role?._id;
        if (roleId === 1) {
          toast.success("Đăng nhập thành công!");
          navigate("/admin");
        } else {
          setError("Tài khoản không có quyền admin!");
          toast.error("Tài khoản không có quyền admin!");
        }
      } catch (e) {
        setError("Không xác định được quyền tài khoản!");
        toast.error("Không xác định được quyền tài khoản!");
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Đăng nhập thất bại";
      setError(message);
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-gray-500 leading-none"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/reset-password"
              className="text-sm text-[#9b87f5] hover:text-[#7E69AB]"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <div className="text-center text-sm text-red-500 mt-0">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#9b87f5] hover:text-[#7E69AB]">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
