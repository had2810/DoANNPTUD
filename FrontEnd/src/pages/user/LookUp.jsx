import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Search,
  Calendar,
  Clock,
  User,
  Wrench,
  AlertCircle,
  Laptop,
  Loader,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import appointmentService from "@/services/appointmentService";
import OrderTracking from "@/components/layout/user/profile/OrderTracking";
import { useSearchParams } from "react-router-dom";

const LookUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // 🔍 Tách phần gọi API thành hàm riêng
  const doLookup = async (phone, code) => {
    setError("");
    setSearchResult(null);
    setIsSearching(true);
    try {
      const result = await appointmentService.lookupAppointment(phone, code);
      if (result && result.appointment) {
        setSearchResult(result);
      } else {
        setError("Không tìm thấy đơn hàng phù hợp với thông tin đã nhập");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Có lỗi xảy ra khi tra cứu");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !orderCode.trim()) {
      setError("Vui lòng nhập đủ thông tin số điện thoại và mã tra cứu");
      return;
    }
    doLookup(phoneNumber, orderCode);
  };

  useEffect(() => {
    const phone = searchParams.get("phone");
    const code = searchParams.get("code");
    if (phone) setPhoneNumber(phone);
    if (code) setOrderCode(code);
    if (phone && code) {
      doLookup(phone, code); // ✅ Tự động tra cứu nếu có param
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center bg-slate-50 p-16">
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-purple-600">
            TRA CỨU THÔNG TIN ĐƠN ĐẶT LỊCH
          </h1>

          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
                <Input
                  type="tel"
                  placeholder="Vui lòng nhập số điện thoại"
                  className="pl-10 py-6 text-base bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Vui lòng nhập mã đơn"
                  className="pl-10 py-6 text-base bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6 text-base font-medium bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                disabled={isSearching}
              >
                {isSearching ? "Đang tra cứu..." : "Tra cứu"}
              </Button>
            </form>
          </div>

          {searchResult &&
            searchResult.appointment &&
            (() => {
              const { appointment, repairStatus } = searchResult;
              return (
                <>
                  <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 text-purple-600">
                      Thông tin đơn hàng
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                      <div className="flex items-start gap-3">
                        <Laptop className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Thiết bị</p>
                          <p className="font-medium">
                            {appointment.deviceTemplateId?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Wrench className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Dịch vụ</p>
                          <p className="font-medium">
                            {appointment.serviceId?.serviceName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Loader className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Trạng thái</p>
                          <p className="font-medium">
                            {repairStatus?.status || "Đang xử lý"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Ngày đặt</p>
                          <p className="font-medium">
                            {new Date(
                              appointment.appointmentTime
                            ).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Hoàn thành</p>
                          <p className="font-medium">
                            {repairStatus?.estimatedCompletionTime
                              ? new Date(
                                  repairStatus.estimatedCompletionTime
                                ).toLocaleString("vi-VN")
                              : "Chưa có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="text-purple-500 mt-1" size={20} />
                        <div>
                          <p className="text-gray-400">Kỹ thuật viên</p>
                          <p className="font-medium">
                            {appointment.employeeId?.fullName ||
                              "Chưa phân công"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <OrderTracking
                    appointment={searchResult.appointment}
                    repairStatus={searchResult.repairStatus}
                  />
                </>
              );
            })()}

          {!searchResult && !isSearching && (
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Vui lòng nhập đầy đủ thông tin để tra cứu đơn hàng của bạn</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LookUp;
