import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAppointmentById,
  updateAppointment,
} from "@/services/appontmentService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Smartphone, Wrench, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ConfirmOrderDialog from "@/components/orders/ConfirmOrderDialog";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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
      {status}
    </Badge>
  );
};

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationType, setConfirmationType] = useState<
    "confirm" | "cancel"
  >("confirm");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: appointment,
    isLoading: queryLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["appointment", orderId],
    queryFn: () => getAppointmentById(orderId!),
    enabled: !!orderId,
  });

  const handleUpdateStatus = async (newStatus: "pending" | "confirmed") => {
    if (!appointment) return;
    try {
      await updateAppointment(appointment._id, { status: newStatus });
      await refetch();
      toast({
        title: "Thành công",
        description:
          newStatus === "confirmed"
            ? "Đã xác nhận đơn hàng!"
            : "Đã hủy xác nhận đơn hàng!",
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmWithEmployee = async (employeeId: string) => {
    if (!appointment) return;
    setIsLoading(true);
    try {
      await updateAppointment(appointment._id, {
        status: "confirmed",
        employeeId: employeeId,
      });
      await refetch();
      toast({
        title: "Thành công",
        description: "Đã xác nhận đơn hàng!",
      });
      setConfirmDialogOpen(false);
    } catch (error) {
      let errorMsg = "Không thể cập nhật trạng thái đơn hàng.";
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      toast({
        title: "Lỗi",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (queryLoading) return <div className="p-6">Đang tải đơn hàng...</div>;

  if (isError || !appointment) {
    return (
      <div className="p-6 bg-slate-50 h-full flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-muted-foreground mb-4">
          Đơn hàng bạn tìm không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/unresolved-orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const customer = appointment.userId;
  const service = appointment.serviceId;
  const employee = appointment.employeeId;
  const device = appointment.deviceTemplateId;

  // Xử lý imageUrls từ API mới
  const images = appointment.imageUrls || [];
  if (appointment.imageUrl && !images.includes(appointment.imageUrl)) {
    images.push(appointment.imageUrl);
  }

  const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
    const [error, setError] = useState(false);

    if (error) {
      return (
        <p className="text-sm text-gray-500 italic text-center">
          Ảnh bị lỗi hoặc không tồn tại
        </p>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className="max-h-[500px] w-auto object-contain"
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Navigation and Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/unresolved-orders")}
          variant="outline"
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>

        {appointment.status === "pending" ? (
          <Button onClick={() => setConfirmDialogOpen(true)}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Xác nhận đơn
          </Button>
        ) : appointment.status === "confirmed" ? (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus("pending")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Hủy xác nhận
            </Button>
          </div>
        ) : null}
      </div>

      {/* Main Content - YouTube-like Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (2/3) - Image and Description */}
        <div className="w-[748px] shrink-0 space-y-6">
          {/* Images with gallery if available */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <div className="relative w-full max-w-2xl h-[350px] flex items-center justify-center border rounded overflow-hidden bg-white">
                {images.length > 0 ? (
                  <ImageWithFallback
                    src={images[currentImageIndex]}
                    alt={`Ảnh ${currentImageIndex + 1}`}
                  />
                ) : (
                  <p className="text-sm text-gray-500 italic text-center">
                    Người dùng không cung cấp ảnh
                  </p>
                )}

                {/* Điều hướng trái */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (currentImageIndex - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow"
                  >
                    ‹
                  </button>
                )}

                {/* Điều hướng phải */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (currentImageIndex + 1) % images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow"
                  >
                    ›
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  Đơn hàng #{appointment.orderCode || appointment._id}
                </span>
                <StatusBadge status={appointment.status} />
              </CardTitle>
              <CardDescription>
                Ngày đặt:{" "}
                {new Date(appointment.appointmentTime).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Mô tả lỗi
                </h3>
                <div className="p-4 bg-muted rounded-md">
                  <p>{appointment.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) - Order Metadata */}
        <div className="flex-1 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Thông tin chi tiết đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              {/* Khách hàng */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">Thông tin khách hàng</span>
                </div>
                <div className="space-y-1 pl-6">
                  <p className="font-medium">{customer.fullName}</p>
                  <p>{customer.email}</p>
                  <p>{customer.phoneNumber}</p>
                  <p>{customer.address}</p>
                </div>
              </div>

              {/* Thiết bị & Dịch vụ */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-semibold">Thiết bị & Dịch vụ</span>
                </div>
                <div className="space-y-1 pl-6">
                  <p className="font-medium">
                    Thiết bị: {device.brand} {device.name}
                  </p>
                  <p className="font-medium">Dịch vụ: {service.serviceName}</p>
                  <p className="text-muted-foreground">{service.description}</p>
                  <p>Thời gian dự kiến: {service.estimatedDuration} phút</p>
                </div>
              </div>

              {/* Kỹ thuật viên */}
              {employee && typeof employee !== "string" && (
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Wrench className="w-4 h-4" />
                    <span className="font-semibold">
                      Kỹ thuật viên phụ trách
                    </span>
                  </div>
                  <div className="space-y-1 pl-6">
                    <p className="font-medium">{employee.fullName}</p>
                    <p>{employee.email}</p>
                  </div>
                </div>
              )}

              {/* Chi phí */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BadgeDollarSign className="w-4 h-4" />
                  <span className="font-semibold">Chi phí dự kiến</span>
                </div>
                <div className="pl-6">
                  <p className="font-medium text-green-600 text-xl">
                    ₫{(appointment.serviceId?.price || appointment.estimatedCost || 0).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog chọn nhân viên xác nhận */}
      <ConfirmOrderDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmWithEmployee}
        order={appointment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrderDetail;
