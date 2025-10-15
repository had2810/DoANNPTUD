import { Check } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import OrderStatusTimeline from "@/components/layout/user/profile/OrderStatusTimeLine";
import StatusHistoryList from "@/components/layout/user/profile/StatusHistoryList";

const statusMap = {
  pending: 1,
  confirmed: 2,
  Checking: 3,
  "In Repair": 4,
  Completed: 5,
  Cancelled: -1,
};

const orderSteps = [
  { id: 1, label: "Đã tiếp nhận" },
  { id: 2, label: "Đã xác nhận" },
  { id: 3, label: "Đang kiểm tra" },
  { id: 4, label: "Đang sửa chữa" },
  { id: 5, label: "Hoàn thành" },
];

const OrderTracking = ({ appointment, repairStatus }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "Checking":
        return "Đang kiểm tra";
      case "In Repair":
        return "Đang sửa chữa";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const transformStatusHistory = () => {
    if (!repairStatus && !appointment) return [];

    const statusHistory = [];
    const currentStatus = repairStatus?.status || appointment.status;

    // Add initial appointment creation
    statusHistory.push({
      id: 1,
      ...formatDateTime(appointment.createdAt),
      description: "Đã tiếp nhận đơn đặt lịch",
    });

    // Add confirmed status if employee is assigned AND status is confirmed or later
    if (
      appointment.employeeId &&
      statusMap[currentStatus] >= statusMap.confirmed
    ) {
      statusHistory.push({
        id: 2,
        ...formatDateTime(appointment.updatedAt),
        description: `Đơn hàng đã được xác nhận và phân công cho kỹ thuật viên ${appointment.employeeId.fullName}`,
      });
    }

    // Add repair status log entries
    if (repairStatus && repairStatus.statusLog) {
      repairStatus.statusLog.forEach((log, index) => {
        statusHistory.push({
          id: statusHistory.length + 1,
          ...formatDateTime(log.time),
          description: `Trạng thái được cập nhật thành: ${translateStatus(
            log.status
          )}`,
        });
      });
    }

    return statusHistory.reverse();
  };

  const getCurrentStep = () => {
    const status = repairStatus?.status || appointment.status;
    if (status === "Cancelled") return -1;
    return statusMap[status] || 1;
  };

  return (
    <div className="container max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">
        Theo dõi đơn hàng
      </h1>

      <Card className="p-6 mb-8 shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Mã đơn hàng: #{appointment.orderCode}
          </h2>
          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <div>
              <p>
                Ngày tiếp nhận:{" "}
                {`${new Date(appointment.createdAt).toLocaleDateString(
                  "vi-VN"
                )} ${new Date(appointment.createdAt).toLocaleTimeString(
                  "vi-VN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`}
              </p>
              <p>Loại thiết bị: {appointment.deviceTemplateId?.name}</p>
            </div>
            <div>
              <p>
                Dự kiến hoàn thành:{" "}
                {repairStatus?.estimatedCompletionTime
                  ? `${new Date(
                      repairStatus.estimatedCompletionTime
                    ).toLocaleDateString("vi-VN")} ${new Date(
                      repairStatus.estimatedCompletionTime
                    ).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Đang cập nhật"}
              </p>
              <p>
                Trạng thái:{" "}
                {translateStatus(repairStatus?.status || appointment.status)}
              </p>
            </div>
          </div>
        </div>

        <OrderStatusTimeline
          steps={orderSteps}
          currentStep={getCurrentStep()}
        />
      </Card>

      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Lịch sử trạng thái</h2>
        <StatusHistoryList statusUpdates={transformStatusHistory()} />
      </Card>
    </div>
  );
};

export default OrderTracking;
