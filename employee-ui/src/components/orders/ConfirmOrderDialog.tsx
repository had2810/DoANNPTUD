import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import employeeService from "@/services/employeeService";
import scheduleService from "@/services/scheduleService";
import employeeWorkService from "@/services/employeeWorkService";
import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";
import ScheduleBoard from "@/components/calendar/ScheduleBoard";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { Appointment, Employee } from "@/types";
import { AvailableTimeResponse } from "@/types/schedule";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Hash,
  Wrench,
  Calendar,
  Info,
  BadgeDollarSign,
} from "lucide-react";

interface ConfirmOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (employeeId: string) => void;
  order: Appointment;
  isLoading?: boolean;
}

const ConfirmOrderDialog: React.FC<ConfirmOrderDialogProps> = ({
  open,
  onClose,
  onConfirm,
  order,
  isLoading = false,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const [employeeWorkScheduleId, setEmployeeWorkScheduleId] =
    useState<string>("");

  // Lấy thông tin nhân viên đang đăng nhập
  const { data: me } = useAuth();
  
  useEffect(() => {
    if (open && me?.data) {
      setSelectedEmployee(me.data._id);
      setEmployees([me.data]);
    }
  }, [open, me]);

  useEffect(() => {
    if (open && order?.appointmentTime) {
      const orderDate = new Date(order.appointmentTime);
      setSelectedDate(orderDate);
      setDisplayedMonth(orderDate);
    }
  }, [open, order]);

  const selectedEmp = employees.find((e) => e._id === selectedEmployee);

  // Format ngày/tháng
  const monthStr = useMemo(() => {
    return `${displayedMonth.getFullYear()}-${String(
      displayedMonth.getMonth() + 1
    ).padStart(2, "0")}`;
  }, [displayedMonth]);

  const formattedDate = useMemo(() => {
    return dayjs(selectedDate).format("YYYY-MM-DD");
  }, [selectedDate]);

  const { data: employeeWork } = useQuery({
    queryKey: ["employee-work"],
    queryFn: () => employeeWorkService.getMyEmployeeWorks(),
    enabled: !!selectedEmployee,
  });

  useEffect(() => {
    if (selectedEmployee) {
      employeeWorkService.getAllEmployeeWorks().then((data) => {
        const work = Array.isArray(data)
          ? data.find(
              (w) => w.employeeId && w.employeeId._id === selectedEmployee
            )
          : undefined;
        setEmployeeWorkScheduleId(work?._id || "");
      });
    } else {
      setEmployeeWorkScheduleId("");
    }
  }, [selectedEmployee]);

 const { data: availableTimes } = useQuery<AvailableTimeResponse, Error>({
  queryKey: ["availableTimes", employeeWorkScheduleId, formattedDate],
  queryFn: async () =>
    (await scheduleService.getAnAvailableTime(employeeWorkScheduleId, formattedDate)) as unknown as AvailableTimeResponse,
  enabled: !!employeeWorkScheduleId && !!formattedDate,
});

  console.log("availableTimes", availableTimes);

  // Chuẩn bị dữ liệu cho ScheduleBoard
  const scheduleItemsForBoard = Array.isArray(availableTimes?.appointmentToday)
    ? availableTimes.appointmentToday.map((item) => ({
        id: item._id,
        timeSlot: item.appointmentTime,
        serviceName: item.serviceId?.serviceName || "N/A",
        phoneNumber: item.userId?.phoneNumber || "N/A",
        content: item.description || "",
        customer: item.userId?.fullName || "Khách hàng",
        description: item.description || "N/A",
        status: item.status,
      }))
    : [];

  // Xử lý chọn ngày trên lịch
  const handleDateSelect = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return;
    setSelectedDate(date);
  };

  const totalTasks = scheduleItemsForBoard.length;
  const pendingTasks = scheduleItemsForBoard.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] w-full min-h-[500px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn nhân viên xác nhận đơn</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bên trái: Thông tin đơn hàng đơn giản */}
          <div className="col-span-12 md:col-span-3 flex flex-col items-center justify-start">
            <div className="bg-white rounded-xl border p-4 w-full flex flex-col items-center">
              <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                Thông tin đơn hàng
              </div>
              <div className="w-full text-left space-y-2 text-base">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold">Mã đơn:</span>{" "}
                  {order?.orderCode || order?._id}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">Khách hàng:</span>{" "}
                  {order?.userId?.fullName}
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <span className="font-semibold">Thiết bị:</span>{" "}
                  {order?.deviceTemplateId?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Ngày đặt:</span>{" "}
                  {order?.appointmentTime
                    ? new Date(order.appointmentTime).toLocaleDateString()
                    : ""}
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  {order?.status}
                </div>
                <div className="flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4" />
                  <span className="font-semibold">Chi phí:</span> ₫
                  {(order?.serviceId?.price || order?.estimatedCost || 0)?.toLocaleString("vi-VN")}
                </div>
              </div>
              {/* Hiển thị thông tin nhân viên xác nhận */}
              <div className="mt-6 w-full">
                <label className="block font-semibold mb-1">
                  Nhân viên xác nhận
                </label>
                <div className="w-full p-2 bg-gray-50 border rounded-md flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  {selectedEmp ? (
                    <span className="text-gray-700">{selectedEmp.fullName}</span>
                  ) : (
                    <span className="text-gray-500">Đang tải...</span>
                  )}
                </div>
              </div>
              {/* Thông tin nhân viên đã chọn */}
              {selectedEmp && (
                <div className="mt-6 w-full bg-white rounded-xl border p-4 flex flex-col items-center">
                  {/* Tên nhân viên */}
                  <div className="font-bold text-lg text-center mb-4">
                    {selectedEmp.fullName}
                  </div>
                  {/* Box số lượng công việc */}
                  <div className="w-full flex flex-col gap-2">
                    <div className="bg-blue-50 rounded-lg py-2 flex flex-col items-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {totalTasks}
                      </span>
                      <span className="text-blue-500 text-sm">
                        Tổng công việc
                      </span>
                    </div>
                    <div className="bg-yellow-50 rounded-lg py-2 flex flex-col items-center">
                      <span className="text-yellow-700 font-bold text-xl">
                        {pendingTasks}
                      </span>
                      <span className="text-yellow-700 text-sm">Chờ xử lý</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Lịch calendar - ở giữa */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-start">
            <div className="bg-white rounded-lg border p-4 w-full flex justify-center">
              <ScheduleCalendar
                employeeId={selectedEmployee}
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md"
              />
            </div>
          </div>
          {/* Bảng công việc - bên phải */}
          <div className="col-span-12 md:col-span-5 bg-white rounded-lg border p-2 overflow-x-auto">
            <div className="min-w-[600px]">
              <ScheduleBoard
                date={selectedDate}
                scheduleItems={scheduleItemsForBoard}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (selectedEmployee) onConfirm(selectedEmployee);
            }}
            disabled={!selectedEmployee || isLoading}
          >
            {isLoading ? "Đang xác nhận..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderDialog;
