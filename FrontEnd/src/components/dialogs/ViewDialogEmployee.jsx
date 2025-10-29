import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduleBoard from "@/components/calendar/ScheduleBoard";
import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";
import scheduleService from "@/services/scheduleService";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ViewDialogEmployee = ({ open, onOpenChange, work }) => {
  if (!work) return null;

  // Use work.startTime when available, otherwise fall back to today
  const [selectedDate, setSelectedDate] = useState(
    work?.startTime ? new Date(work.startTime) : new Date()
  );

  // const formattedDate = selectedDate.toLocaleDateString("en-CA");
  const formattedDate =
    selectedDate instanceof Date && !isNaN(selectedDate)
      ? selectedDate.toLocaleDateString("en-CA")
      : "";

  const { data: availableTimes = [], isLoading } = useQuery({
    queryKey: ["availableTimes", work._id, formattedDate],
    queryFn: () => scheduleService.getAnAvailableTime(work._id, formattedDate),
    enabled: !!work._id && !!formattedDate,
  });

  console.log("Ngày được chọn: >> ", formattedDate);
  console.log("ID làm việc nhân viên được chọn: >> ", work._id);

  const scheduleItems = Array.isArray(availableTimes?.appointmentToday)
    ? availableTimes.appointmentToday.map((item) => ({
        id: item._id,
        timeSlot: item.appointmentTime, // Truyền thẳng, để ScheduleBoard xử lý
        serviceName: item.serviceId?.serviceName || "N/A",
        phoneNumber: item.userId?.phoneNumber || "N/A",
        content: item.description || "",
        customer: item.userId?.fullName || "Khách hàng",
        description: item.description || "N/A",
        status: item.status,
      }))
    : [];

  console.log("Lịch làm việc trong ngày: >> ", scheduleItems);

  const employeeId =
    work.employeeId?._id || work.employeeId?.id || work.employeeId;

  const handleDateSelect = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return;
    setSelectedDate(new Date(date));
  };

  const completedTasks = availableTimes?.appointmentToday?.filter(
    (item) => item.status === "confirmed"
  );

  const pendingTasks = availableTimes?.appointmentToday?.filter(
    (item) => item.status === "pending"
  );

  const totalTasks = completedTasks?.length + pendingTasks?.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1400px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chi tiết lịch làm việc
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Thông tin nhân viên - giao diện mới, giữ nguyên kích thước */}
          <div className="col-span-12 md:col-span-2 flex flex-col items-center justify-start">
            <div className="bg-white rounded-xl border p-4 w-full flex flex-col items-center">
              <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                Thông tin nhân viên
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-3">
                {work.employeeId?.avatar_url ? (
                  <img
                    src={work.employeeId.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-2xl">
                    {work.employeeId?.lastName?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <div className="text-base font-bold text-center mb-1">
                {work.employeeId?.fullName || "N/A"}
              </div>
              <div className="text-sm text-gray-500 text-center mb-1">
                {work.employeeId?.role === 2 ? "Kỹ thuật viên" : "Tư vấn viên"}
              </div>
              <div className="text-sm text-center mb-4">
                {work.status === "Đang trực" ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                    Đang trực
                  </span>
                ) : work.status === "Nghỉ" ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
                    Nghỉ
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">
                    {work.status || "Không có trạng thái"}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex flex-col items-center bg-blue-50 rounded-lg py-3 w-full">
                  {isLoading ? (
                    <span className="text-blue-600 text-lg font-bold">
                      Loading...
                    </span>
                  ) : (
                    <span className="text-blue-600 text-lg font-bold">
                      {totalTasks ?? 0}
                    </span>
                  )}
                  <span className="text-xs text-blue-700 mt-1">
                    Tổng công việc
                  </span>
                </div>
                <div className="flex flex-col items-center bg-green-50 rounded-lg py-3 w-full">
                  {isLoading ? (
                    <span className="text-green-600 text-lg font-bold">
                      Loading...
                    </span>
                  ) : (
                    <span className="text-green-600 text-lg font-bold">
                      {completedTasks?.length ?? 0}
                    </span>
                  )}
                  <span className="text-xs text-green-700 mt-1">
                    Hoàn thành
                  </span>
                </div>
                <div className="flex flex-col items-center bg-yellow-50 rounded-lg py-3 w-full">
                  {isLoading ? (
                    <span className="text-yellow-700 text-lg font-bold">
                      Loading...
                    </span>
                  ) : (
                    <span className="text-yellow-700 text-lg font-bold">
                      {pendingTasks?.length ?? 0}
                    </span>
                  )}
                  <span className="text-xs text-yellow-700 mt-1">
                    Chờ xử lý
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lịch calendar - chiếm vừa phải */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-start">
            <div className="bg-white rounded-lg border p-4 w-full flex justify-center">
              <ScheduleCalendar
                employeeId={employeeId}
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md"
                allowDayOffAction={true}
              />
            </div>
          </div>

          {/* Lịch làm việc trong ngày - chiếm nhiều diện tích nhất */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-lg border p-2 overflow-x-auto">
            <div className="min-w-[600px]">
              <ScheduleBoard
                date={selectedDate}
                scheduleItems={scheduleItems}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDialogEmployee;
