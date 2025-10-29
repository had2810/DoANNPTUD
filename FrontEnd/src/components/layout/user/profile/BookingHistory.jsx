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
    Receipt,
    Printer,
    TicketCheck,
  } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  import appointmentService from "@/services/appointmentService";
  import { useToast } from "@/components/ui/use-toast";
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
  import { Separator } from "@/components/ui/separator";

  const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchBookings = async () => {
    // Debug: log toàn bộ lịch hẹn lấy được
    console.log('=== [BookingHistory] Fetching appointments... ===');
      setLoading(true);
      try {
        const res = await appointmentService.getMyAppointments();
        const allAppointments = res.data || res;

        const bookingsWithStatusAndInvoice = await Promise.all(
        allAppointments.map(async (appt) => {
          try {
            console.log('[BookingHistory] Appointment:', appt);
            const phone = appt.userId?.phoneNumber;
            const code = appt.orderCode;
            let repairStatus = null;
            let invoice = null;
            if (phone && code) {
              const lookupRes = await appointmentService.lookupAppointment(phone, code);
              repairStatus = lookupRes?.repairStatus?.status || null;
            }
            // Lấy invoice cho từng booking
            if (appt._id && appt.userId?._id) {
              try {
                const invoiceRes = await import("@/services/invoiceService").then(mod => mod.default.findInvoice(appt._id, appt.userId._id));
                // Fix: lấy đúng object invoice bên trong response
                invoice = invoiceRes?.data?.invoice || invoiceRes?.invoice || invoiceRes?.data || invoiceRes || null;
              } catch (e) {
                invoice = null;
              }
            }
            // Debug: log invoice từng booking
            console.log('[BookingHistory] Invoice for booking', appt._id, invoice);
            return {
              ...appt,
              repairStatus,
              invoice,
            };
          } catch (err) {
            return { ...appt, repairStatus: null, invoice: null };
          }
        })
      );

        const historyBookings = bookingsWithStatusAndInvoice.filter(
          (item) => {
            // Hiển thị nếu trạng thái là cancelled, hoặc invoice đã Paid, hoặc repairStatus đã Completed
            return (
              item.status === "cancelled" ||
              item.invoice?.status === "Paid" ||
              item.repairStatus === "Completed"
            );
          }
        );

        historyBookings.sort(
          (a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)
        );
        setBookings(historyBookings || []);
    // Debug: log danh sách bookings đã có invoice
    console.log('[BookingHistory] Bookings with invoice:', historyBookings);
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử đặt lịch.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchBookings();
    }, []);

    const isCompleted = (booking) => booking.repairStatus === "Completed";

    const handleShowDetail = (booking) => {
      const phone = booking.userId?.phoneNumber;
      const code = booking.orderCode;
      if (phone && code) {
        navigate(
          `/user/lookup?phone=${encodeURIComponent(
            phone
          )}&code=${encodeURIComponent(code)}`
        );
      }
    };

    return (
      <div className="container px-4 md:px-6 py-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Lịch sử đặt lịch của tôi</h1>

          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div>Đang tải...</div>
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => {
                // Debug: log giá tiền từng booking khi render
                console.log('[BookingHistory] Render booking:', booking._id, 'Invoice:', booking.invoice);
                const Icon =
                  booking.deviceTemplateId?.type === "Laptop"
                    ? Laptop
                    : Smartphone;

                const isDone = isCompleted(booking);
                const status = isDone ? "Completed" : booking.status;
                const headerClass =
                  status === "Completed"
                    ? "bg-green-500"
                    : status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-200";
                const badgeClass =
                  status === "Completed"
                    ? "bg-green-700 text-white font-bold"
                    : status === "cancelled"
                    ? "bg-red-700 text-white font-bold"
                    : "bg-gray-400 text-white font-bold";

                return (
                  <Card
                    key={booking._id || index}
                    className="overflow-hidden border rounded-xl shadow hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`text-white px-6 py-4 flex justify-between items-center ${headerClass}`}
                    >
                      <div>
                        <h2 className="text-xl font-bold">TECHMATE</h2>
                        <p className="text-xs font-medium opacity-75">
                          Vé sửa chữa #{booking.orderCode}
                        </p>
                      </div>
                      <Badge className={badgeClass}>
                        {isDone ? "Hoàn thành" : "Đã hủy"}
                      </Badge>
                    </div>

                    <div className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* LEFT */}
                        <div className="flex-1 p-6 border-r border-dashed relative">
                          <div className="flex flex-col space-y-6">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={`text-${status}-500 bg-${status}-50 h-5 w-5 rounded-full`}
                                />
                                <div>
                                  <p className="text-xs text-gray-500">Dịch vụ</p>
                                  <p className="font-bold">
                                    {booking.serviceId?.serviceName}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Mã đặt lịch
                                </p>
                                <p className="font-bold">{booking.orderCode}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex items-start gap-3">
                                <CalendarCheck className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Ngày thực hiện
                                  </p>
                                  <p className="font-bold">
                                    {new Date(
                                      booking.appointmentTime
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">
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
                                <User className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">
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

                        {/* RIGHT */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-gray-500">Thiết bị</p>
                              <p className="font-bold text-lg">
                                {booking.deviceTemplateId?.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Vấn đề</p>
                              <p className="font-medium">{booking.description}</p>
                            </div>

                            {isDone && (
                              <Collapsible className="mt-4">
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full flex justify-between items-center"
                                  >
                                    <span>Chi tiết thanh toán</span>
                                    <Receipt className="h-4 w-4" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 bg-gray-50 p-4 rounded-md">
                                  {booking.items && booking.items.length > 0 ? (
                                    booking.items.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between py-1"
                                      >
                                        <p>{item.name}</p>
                                        <p>{item.price}</p>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">
                                      Không có chi tiết thanh toán
                                    </p>
                                  )}
                                  <Separator className="my-2" />
                                  <div className="flex justify-between">
                                    <p className="font-medium">
                                      Tổng thanh toán:
                                    </p>
                                    <p className="font-bold text-green-600 text-lg">
                                      {/* Hiển thị giá tiền từ object invoice nếu có */}
                                      {(() => {
                                        const invoiceObj = booking.invoice?.invoice || booking.invoice;
                                        if (invoiceObj?.totalAmount) return `${invoiceObj.totalAmount.toLocaleString('vi-VN')}₫`;
                                        if (invoiceObj?.total) return `${invoiceObj.total.toLocaleString('vi-VN')}₫`;
                                        if (invoiceObj?.amount) return `${invoiceObj.amount.toLocaleString('vi-VN')}₫`;
                                        if (booking.total) return `${booking.total.toLocaleString('vi-VN')}₫`;
                                        return "0₫";
                                      })()}
                                    </p>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>

                          <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t">
                            {isDone ? (
                              <>
                                <Button variant="outline" className="flex gap-2">
                                  <Printer className="h-4 w-4" />
                                  Xuất hóa đơn
                                </Button>
                                <Button asChild className="flex gap-2">
                                  <Link to="/user/booking">
                                    <TicketCheck className="h-4 w-4" />
                                    Đặt lịch lại
                                  </Link>
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => handleShowDetail(booking)}
                              >
                                Chi tiết
                              </Button>
                            )}
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
                  Chưa có lịch sử đặt lịch
                </h3>
                <p className="text-gray-500 mt-2 mb-6">
                  Bạn chưa có lịch sử đặt lịch dịch vụ nào với TechMate
                </p>
                <Button asChild>
                  <Link to="/user/booking">Đặt lịch ngay</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default BookingHistory;
