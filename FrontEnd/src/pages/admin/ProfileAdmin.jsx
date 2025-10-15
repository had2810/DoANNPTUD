import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Phone, Mail, MapPin, Camera } from "lucide-react";
import userEntity from "@/hooks/useEntityList";
import adminService from "@/services/adminService";
import { toast } from "@/hooks/use-toast";
import { getMe } from "@/services/authService";

import CustomImageUploader from "@/components/images/CustomImageUploader";
import { useIsMobile } from "@/hooks/use-mobile";

const ProfileAdmin = () => {
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [resetUploadPreview, setResetUploadPreview] = useState(false);

  const { data, isLoading, refetch } = userEntity("adminInfo", getMe, {
    enabled: true,
  });

  const adminInfo = data?.data;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (adminInfo) {
      setFormData({
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        phoneNumber: adminInfo.phoneNumber,
        address: adminInfo.address,
      });
    }
  }, [adminInfo]);

  const handleUpdateAdmin = async () => {
    try {
      setIsUploading(true);

      await adminService.updateAdmin(adminInfo._id, {
        ...formData,
        avatar_url: avatarUrl,
      });

      await refetch();
      setResetUploadPreview(true);

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
        variant: "default",
      });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast({
        title: "Cập nhật thất bại",
        description:
          error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ thông tin mật khẩu",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu phải giống nhau",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      await adminService.changePassword(adminInfo._id, {
        oldPassword,
        newPassword,
      });

      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật",
        variant: "default",
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      let description = "Có lỗi xảy ra khi đổi mật khẩu";

      if (errorMessage === "Old password is incorrect") {
        description = "Mật khẩu cũ không chính xác";
      } else if (errorMessage === "Missing old or new password") {
        description = "Vui lòng nhập đầy đủ mật khẩu cũ và mới";
      }

      toast({
        title: "Đổi mật khẩu thất bại",
        description,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div className="mx-auto mt-6 min-h-[calc(100vh-120px)] px-4 md:px-6">
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="w-full md:w-auto flex justify-start overflow-x-auto">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="edit">Chỉnh sửa thông tin</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        {/* Thông tin cá nhân */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className={`${isMobile ? "px-4" : ""} py-6`}>
              <div className="relative mx-auto">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={adminInfo?.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {isLoading ? (
                <div>Đang tải thông tin...</div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {adminInfo.firstName} {adminInfo.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">Admin</p>
                  </div>
                  <div className="space-y-2 text-sm px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{adminInfo?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{adminInfo?.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-700">{adminInfo?.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-md">Giới thiệu</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Xin chào! Tôi là quản trị viên hệ thống với nhiều năm kinh
                    nghiệm trong lĩnh vực phát triển và vận hành các nền tảng
                    web. Với tinh thần trách nhiệm cao và tư duy giải quyết vấn
                    đề hiệu quả, tôi luôn nỗ lực đảm bảo hệ thống hoạt động ổn
                    định, an toàn và thân thiện với người dùng.
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    Ngoài công việc, tôi yêu thích công nghệ mới, đặc biệt là
                    trí tuệ nhân tạo và các giải pháp tối ưu trải nghiệm người
                    dùng.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-md">Thông tin cá nhân</h4>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">
                      {adminInfo?.firstName} {adminInfo?.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{adminInfo?.phoneNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{adminInfo?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{adminInfo?.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Chỉnh sửa thông tin */}
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <h4 className="font-semibold text-md">
                Cập nhật thông tin cá nhân
              </h4>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative mx-auto md:mx-0">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={adminInfo?.avatar_url || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <Label className="block mb-3">Tải ảnh lên</Label>
                  <CustomImageUploader
                    onUploadComplete={(urls) => {
                      setAvatarUrl(urls[0]);
                      setResetUploadPreview(false);
                    }}
                    resetTrigger={resetUploadPreview}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Họ</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Tên</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={adminInfo?.email} readOnly />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email này sẽ được dùng làm tên đăng nhập của bạn
                  </p>
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleUpdateAdmin}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isUploading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Đổi mật khẩu */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <h4 className="font-semibold text-md">Đổi mật khẩu</h4>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-3 top-2 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex items-center gap-2"
                  >
                    {isChangingPassword && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isChangingPassword
                      ? "Đang cập nhật..."
                      : "Cập nhật mật khẩu"}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <h5 className="font-semibold mb-4">
                  Mật khẩu mới cần đảm bảo:
                </h5>
                <div className="divide-y divide-gray-200 border-y rounded-md overflow-hidden">
                  <div className="px-5 py-4">Ít nhất 8 ký tự</div>
                  <div className="px-5 py-4">Ít nhất 1 chữ thường (a-z)</div>
                  <div className="px-5 py-4">Ít nhất 1 chữ hoa (A-Z)</div>
                  <div className="px-5 py-4">Ít nhất 1 số (0-9)</div>
                  <div className="px-5 py-4">Ít nhất 1 ký tự đặc biệt</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileAdmin;
