import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Appointment, getAppointments } from "@/services/appontmentService";
import { getAccessToken } from "@/lib/authStorage";
import useSearchPagination from "@/hooks/useSearchPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "shipped":
      return "Đang vận chuyển";
    case "delivered":
      return "Đã hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "border-yellow-500 text-yellow-500";
      case "confirmed":
        return "border-blue-500 text-blue-500";
      case "shipped":
        return "border-purple-500 text-purple-500";
      case "delivered":
        return "border-green-500 text-green-500";
      case "cancelled":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyles()}>
      {getStatusLabel(status)}
    </Badge>
  );
};

const Orders = () => {
  const navigate = useNavigate();

  const { data: appointments = [], isPending } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    enabled: !!getAccessToken(),
  });

  const mappedAppointments =
    appointments
      ?.map((a) => ({
        ...a,
        orderCode: a.orderCode || "",
        customerName: a.userId?.fullName || "",
        serviceName: a.serviceId?.serviceName || "",
        totalCost: a.estimatedCost || 0,
        appointmentDate: new Date(a.appointmentTime).toLocaleDateString(),
      }))
      // Sắp xếp mới nhất lên đầu
      .sort(
        (a, b) =>
          new Date(b.appointmentTime).getTime() -
          new Date(a.appointmentTime).getTime()
      ) || [];

  const {
    paginatedData: filteredAppointments,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    mappedAppointments,
    ["orderCode", "customerName", "serviceName"],
    5
  );

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách đơn hàng</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8 h-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left font-semibold">Dịch vụ</th>
                <th className="px-4 py-3 text-left font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày đặt</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {appointment.orderCode || "Không có mã"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {appointment.customerName}
                  </td>
                  <td className="px-4 py-3">{appointment.serviceName}</td>
                  <td className="px-4 py-3">
                    ₫{appointment.totalCost.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">{appointment.appointmentDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orders/${appointment._id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
