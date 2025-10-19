import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";
import ScheduleBoard from "@/components/calendar/ScheduleBoard";
import { Button } from "@/components/ui/button";
import scheduleService from "@/services/scheduleService";
import employeeWorkService from "@/services/employeeWorkService";
import { useAuth } from "@/hooks/useAuth";
import { AvailableTimeResponse } from "@/types";
import dayjs from "dayjs";

const PersonalSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const navigate = useNavigate();

  // 1. Lấy thông tin nhân viên hiện tại
  const { data: me } = useAuth();
  const myEmployeeId = me?.data?._id;

  // 2. Lấy lịch làm việc đã lọc theo backend
  const { data: employeeWork } = useQuery({
    queryKey: ["employee-work"],
    queryFn: () => employeeWorkService.getMyEmployeeWorks(),
    enabled: !!myEmployeeId,
  });

  const currentWorkSchedule = employeeWork?.data?.[0];
  const employeeWorkScheduleId = currentWorkSchedule?._id;
  console.log(
    ">> ID lịch làm việc của nhân viên hiện tại:",
    employeeWorkScheduleId
  );

  // 3. Format tháng và ngày
  const monthStr = `${displayedMonth.getFullYear()}-${String(
    displayedMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  // const formattedDate = selectedDate.toISOString().split("T")[0];
  const formattedDate = useMemo(() => {
    return dayjs(selectedDate).format("YYYY-MM-DD");
  }, [selectedDate]);

  // 4. Lịch theo tháng
  const { data: monthSchedule } = useQuery({
    queryKey: ["schedule", monthStr, employeeWorkScheduleId],
    queryFn: () =>
      scheduleService.getMonthSchedule(employeeWorkScheduleId, monthStr),
    enabled: !!employeeWorkScheduleId,
  });

  console.log(">> Ngày được gửi vào selectedDate: ", selectedDate);
  console.log(">> Ngày được gửi vào formatDate: ", formattedDate);

  // 5. Lịch theo ngày
  const { data: availableTimes } = useQuery<AvailableTimeResponse>({
    queryKey: ["availableTimes", employeeWorkScheduleId, formattedDate],
    queryFn: () =>
      scheduleService.getAnAvailableTime(employeeWorkScheduleId, formattedDate),
    enabled: !!employeeWorkScheduleId && !!formattedDate,
  });

  // 6. Chuẩn bị dữ liệu cho ScheduleBoard
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

  console.log(">> Dữ liệu lịch của ngày được chọn:", scheduleItemsForBoard);

  // 7. Thống kê số lượng công việc
  const completedTasks = availableTimes?.appointmentToday?.filter(
    (item) => item.status === "confirmed"
  );
  const pendingTasks = availableTimes?.appointmentToday?.filter(
    (item) => item.status === "pending"
  );
  const totalTasks =
    (completedTasks?.length || 0) + (pendingTasks?.length || 0);

  const handleDateSelect = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return;
    setSelectedDate(date);
  };

  return (
    <div className="p-6 bg-slate-50 h-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lịch làm việc cá nhân</h1>
        <Button
          onClick={() => navigate("/weekly-schedule")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Đăng ký lịch tuần
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
        <div className="col-span-1">
          <ScheduleCalendar
            employeeId={myEmployeeId}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />
        </div>
        <div className="col-span-2">
          <div className="bg-white rounded-lg border p-4 mb-4">
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-blue-600 text-lg font-bold">
                  {totalTasks}
                </div>
                <div className="text-sm text-blue-700">Tổng công việc</div>
              </div>
              <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
                <div className="text-green-600 text-lg font-bold">
                  {completedTasks?.length || 0}
                </div>
                <div className="text-sm text-green-700">Hoàn thành</div>
              </div>
              <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-yellow-700 text-lg font-bold">
                  {pendingTasks?.length || 0}
                </div>
                <div className="text-sm text-yellow-700">Chờ xử lý</div>
              </div>
            </div>
          </div>
          <div className="min-h-[500px] overflow-y-hidden overflow-x-hidden">
            <ScheduleBoard
              date={selectedDate}
              scheduleItems={scheduleItemsForBoard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSchedule;
