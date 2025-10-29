import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getMe } from "@/services/authService";
import useEntityList from "@/hooks/useEntityList";

import { useEffect } from "react";
import CustomImageUploader from "@/components/images/CustomImageUploader";
import customerService from "@/services/customerService";

const UpdateAccount = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [resetUploadPreview, setResetUploadPreview] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar_url: "",
  });

  const { data, error, isLoading, refetch } = useEntityList("userInfo", getMe, {
    enabled: true,
  });

  const userInfo = data?.data;

  useEffect(() => {
    console.log("[UpdateAccount] userInfo:", userInfo);
    if (userInfo && !resetUploadPreview) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phoneNumber: userInfo.phoneNumber || "",
        address: userInfo.address || "",
        avatar_url: userInfo.avatar_url || "",
      });
    }
  }, [userInfo, resetUploadPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      await customerService.updateCustomer(userInfo._id, formData);

      await refetch(); // Refresh the data after updating

      toast({
        title: "Cập nhật tài khoản thành công",
        description: `Thông tin tài khoản của ${formData.firstName} ${formData.lastName} đã được cập nhật.`,
        variant: "default",
      });
      setResetUploadPreview(true);
      setTimeout(() => setResetUploadPreview(false), 0);
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Cập nhật tài khoản thất bại",
        description: "Đã xảy ra lỗi trong quá trình cập nhật tài khoản.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Cập nhật tài khoản</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar upload */}
          <div className="lg:col-span-1">
            <Card className="shadow-md ">
              <CardContent className="p-6 min-h-[458px]">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="h-40 w-40">
                      <AvatarImage
                        src={formData.avatar_url}
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl">
                        {formData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex flex-col items-center gap-3">
                    <CustomImageUploader
                      onUploadComplete={(urls) => {
                        setFormData((prev) => ({
                          ...prev,
                          avatar_url: urls[0],
                        }));
                      }}
                      resetTrigger={resetUploadPreview}
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Cho phép JPG, PNG hoặc GIF. Kích thước tối đa 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Thông tin cá nhân */}
          <div className="lg:col-span-2">
            <Card className="shadow-md mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Thông tin cá nhân
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-500" />
                      <Label htmlFor="firstName">Họ</Label>
                    </div>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-500" />
                      <Label htmlFor="lastName">Tên</Label>
                    </div>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-blue-500" />
                      <Label htmlFor="phone">Số điện thoại</Label>
                    </div>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-blue-500" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-blue-500" />
                      <Label htmlFor="address">Địa chỉ</Label>
                    </div>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3} // hoặc bạn có thể chỉnh rows theo ý muốn
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-700 text-white"
                  >
                    Cập nhật thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccount;
