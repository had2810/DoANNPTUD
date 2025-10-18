import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Clock,
  User,
  AlertCircle,
  Smartphone,
  Laptop,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import appointmentService from "@/services/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import ConfirmCancelDialog from "@/components/dialogs/ConfirmCancelDialog";

const BookingOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      const allAppointments = res.data || res;

      const bookingsWithStatus = await Promise.all(
        allAppointments.map(async (appt) => {
          try {
            const phone = appt.userId?.phoneNumber;
            const code = appt.orderCode;

            if (!phone || !code) return appt;

            const lookupRes = await appointmentService.lookupAppointment(
              phone,
              code
            );
            const repairStatus = lookupRes?.repairStatus?.status;

            if (repairStatus === "Completed") return null;

            return appt;
          } catch (err) {
            return appt; // Nếu không gọi được thì vẫn giữ lại
          }
        })
      );

      const notCancelled = bookingsWithStatus.filter(
        (item) => item && item.status !== "cancelled"
      );

      notCancelled.sort(
        (a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)
      );
      setBookings(notCancelled || []);
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể tải đơn đặt lịch.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentService.updateAppointment(id, { status: "cancelled" });
      toast({
        title: "Đã hủy đơn",
        description: "Đơn đặt lịch đã được hủy thành công.",
      });
      fetchBookings();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy đơn. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleShowDetail = (booking) => {
    const phone = booking.userId?.phoneNumber;
    const code = booking.orderCode;
    if (phone && code) {
      navigate(
        `/user/lookup?phone=${encodeURIComponent(
          phone
        )}&code=${encodeURIComponent(code)}`
      );
    } else {
      setSelectedBooking(booking);
      setShowDetail(true);
    }
  };

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };

  return (
    <div className="container px-4 md:px-6 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Đơn đặt lịch của tôi</h1>
          <Button asChild>
            <Link to="/user/booking">Đặt lịch mới</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div>Đang tải...</div>
          ) : bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const Icon =
                booking.deviceTemplateId?.type === "Laptop"
                  ? Laptop
                  : Smartphone;
              return (
                <Card
                  key={booking._id || index}
                  className="overflow-hidden border rounded-xl shadow hover:shadow-md transition-shadow"
                >
                  <div className="bg-techmate-purple text-white px-6 py-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">TECHMATE</h2>
                      <p className="text-xs font-medium opacity-75">
                        Phiếu đặt lịch sửa chữa
                      </p>
                    </div>
                    {booking.status === "confirmed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Đã xác nhận
                      </Badge>
                    )}
                    {booking.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Chờ xác nhận
                      </Badge>
                    )}
                  </div>

                  <div className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left */}
                      <div className="flex-1 p-6 border-r border-dashed relative">
                        <div className="flex flex-col space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="text-techmate-purple w-5 h-5 bg-purple-50 rounded-full" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  Dịch vụ
                                </p>
                                <p className="font-bold">
                                  {booking.serviceId?.serviceName ||
                                    booking.service}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-500">
                                Mã đặt lịch
                              </p>
                              <p className="font-bold">
                                {booking.orderCode || booking._id}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                              <CalendarCheck className="text-techmate-purple h-5 w-5 mt-1" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  Ngày đặt lịch
                                </p>
                                <p className="font-bold">
                                  {new Date(
                                    booking.appointmentTime
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="text-techmate-purple h-5 w-5 mt-1" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  Thời gian
                                </p>
                                <p className="font-bold">
                                  {new Date(
                                    booking.appointmentTime
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {booking.employeeId?.fullName && (
                            <div className="flex items-start gap-3">
                              <User className="text-techmate-purple h-5 w-5 mt-1" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  Kỹ thuật viên
                                </p>
                                <p className="font-bold">
                                  {booking.employeeId.fullName}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-50 border border-gray-200 rounded-full" />
                      </div>

                      {/* Right */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Thiết bị
                            </p>
                            <p className="font-bold text-lg">
                              {booking.deviceTemplateId?.name || booking.device}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Vấn đề
                            </p>
                            <p className="font-medium">
                              {booking.description || booking.issue}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t">
                          <Button
                            variant="outline"
                            onClick={() => handleShowDetail(booking)}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openCancelDialog(booking)}
                            disabled={booking.status === "confirmed"}
                            className={
                              booking.status === "confirmed"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          >
                            Hủy đặt lịch
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl shadow">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900">
                Chưa có đơn đặt lịch nào
              </h3>
              <p className="text-gray-500 mt-2 mb-6">
                Bạn chưa đặt lịch dịch vụ nào với TechMate
              </p>
              <Button asChild>
                <Link to="/user/booking">Đặt lịch ngay</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chi tiết đơn */}
      {showDetail && selectedBooking && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowDetail(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>
            <div className="space-y-2">
              <div>
                <b>Mã đơn:</b>{" "}
                {selectedBooking.orderCode || selectedBooking._id}
              </div>
              <div>
                <b>Dịch vụ:</b> {selectedBooking.serviceId?.serviceName}
              </div>
              <div>
                <b>Thiết bị:</b> {selectedBooking.deviceTemplateId?.name}
              </div>
              <div>
                <b>Ngày đặt:</b>{" "}
                {new Date(selectedBooking.appointmentTime).toLocaleString(
                  "vi-VN"
                )}
              </div>
              <div>
                <b>Trạng thái:</b> {selectedBooking.status}
              </div>
              <div>
                <b>Vấn đề:</b> {selectedBooking.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog xác nhận hủy */}
      <ConfirmCancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={() => handleCancel(bookingToCancel?._id)}
        bookingInfo={bookingToCancel}
      />
    </div>
  );
};

export default BookingOrders;
