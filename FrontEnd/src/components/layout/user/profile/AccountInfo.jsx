import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  User as UserIcon,
  CalendarDays,
  Handshake,
  Smile,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getMe } from "@/services/authService";
import useEntityList from "@/hooks/useEntityList";

import { formatDate, formatDateTimeFull } from "@/lib/format";

const AccountInfo = () => {
  const { data, isLoading } = useEntityList("userInfo", getMe, {
    enabled: true,
  });

  const userInfo = data?.data;

  if (isLoading || !userInfo) {
    return <div>Đang tải thông tin tài khoản...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Thông tin tài khoản</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <Card className="shadow-md overflow-hidden min-h-[500px]">
            <div className="p-8 flex flex-col items-center">
              <Avatar className="h-40 w-40 mb-4">
                <AvatarImage
                  src={userInfo.avatar_url || null}
                  alt={userInfo.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  {userInfo.lastName.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userInfo.userName}</h2>
              <p className="text-gray-500 mb-4">{userInfo.fullName}</p>

              <div className="w-full space-y-4 mt-2">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-sm text-gray-700">
                    {userInfo.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500" size={18} />
                  <span className="text-sm text-gray-700">
                    {userInfo.phoneNumber}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-1" size={18} />
                  <span className="text-sm text-gray-700">
                    {userInfo.address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-blue-500" size={18} />
                  <span className="text-sm text-gray-700">
                    Tham gia: {formatDate(userInfo.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <Card className="shadow-md mb-8">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>

              <div className="flex items-start gap-3">
                <Handshake className="text-blue-500 mt-[2px]" size={20} />
                <p className="text-gray-700">
                  Chào mừng bạn{" "}
                  <span className="font-medium">{userInfo.fullName}</span>!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Smile className="text-green-500 mt-[2px]" size={28} />
                <p className="text-gray-700">
                  Cảm ơn vì đã đồng hành cùng{" "}
                  <span className="font-semibold">TechMate</span>. Hãy yên tâm
                  trải nghiệm — chúng tôi luôn sẵn sàng để mọi rắc rối công nghệ
                  trở nên nhẹ nhàng và hiệu quả hơn.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
                {/* Họ và tên */}
                <div className="flex items-center gap-3">
                  <UserIcon className="text-blue-500" size={18} />
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Họ và tên</h3>
                    <p className="font-medium">{userInfo.fullName}</p>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500" size={18} />
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">
                      Số điện thoại
                    </h3>
                    <p className="font-medium">{userInfo.phoneNumber}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500" size={18} />
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Email</h3>
                    <p className="font-medium">{userInfo.email}</p>
                  </div>
                </div>

                {/* Ngày tạo tài khoản */}
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-blue-500" size={18} />
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">
                      Ngày tạo tài khoản
                    </h3>
                    <p className="font-medium">
                      {formatDateTimeFull(userInfo.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="text-blue-500 mt-1" size={18} />
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Địa chỉ</h3>
                    <p className="font-medium">{userInfo.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
