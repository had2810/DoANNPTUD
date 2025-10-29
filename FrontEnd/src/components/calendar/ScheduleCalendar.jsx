import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import scheduleService from "@/services/scheduleService";
import dayjs from "dayjs";
import CalendarContextMenu from "./CalendarContextMenu";
import LeaveRequestDialog from "./LeaveRequestDialog";
import { X, AlertCircle, TriangleAlert } from "lucide-react";

const ScheduleCalendar = ({
  employeeId,
  selectedDate,
  onSelect,
  className,
  allowDayOffAction = false,
}) => {
  const [displayedMonth, setDisplayedMonth] = useState(
    selectedDate || new Date()
  );
  const [openMenuDate, setOpenMenuDate] = useState(null);
  const [leaveDialogDate, setLeaveDialogDate] = useState(null);

  const {
    data: scheduleResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "schedule",
      displayedMonth.getMonth(),
      displayedMonth.getFullYear(),
      employeeId,
    ],
    queryFn: () => {
      const monthStr = `${displayedMonth.getFullYear()}-${String(
        displayedMonth.getMonth() + 1
      ).padStart(2, "0")}`;
      return scheduleService.getMonthSchedule(employeeId, monthStr);
    },
    enabled: !!employeeId,
  });

  const scheduleData = scheduleResponse?.data || [];

  const modifiers = {
    available: scheduleData
      .filter((item) => item.status === "available")
      .map((item) => new Date(item.date)),
    semi_busy: scheduleData
      .filter((item) => item.status === "semi_busy")
      .map((item) => new Date(item.date)),
    light_busy: scheduleData
      .filter((item) => item.status === "light_busy")
      .map((item) => new Date(item.date)),
    full: scheduleData
      .filter((item) => item.status === "full")
      .map((item) => new Date(item.date)),
    off: scheduleData
      .filter((item) => item.status === "off")
      .map((item) => new Date(item.date)),
  };

  const handleSetDayOff = async (dateStr) => {
    const item = scheduleData.find((d) => d.date === dateStr);
    if (item?.appointmentCount > 0) {
      setLeaveDialogDate(dateStr);
      setOpenMenuDate(null);
      return;
    }

    try {
      console.log("[SetDayOff] Ngày gửi lên backend:", dateStr, typeof dateStr);
      const response = await scheduleService.setDayOff(employeeId, dateStr);
      console.log("Đặt ngày nghỉ thành công:", response);
      setOpenMenuDate(null);
      refetch();
    } catch (error) {
      console.error("Lỗi khi đặt ngày nghỉ:", error);
    }
  };

  const handleLeaveRequestConfirm = async () => {
    if (!leaveDialogDate) return;
    try {
      await scheduleService.setDayOff(employeeId, leaveDialogDate);
      setLeaveDialogDate(null);
      refetch();
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu nghỉ:", error);
    }
  };

  const handleRemoveDayOff = async (dateStr) => {
    try {
      const response = await scheduleService.removeDayOff(employeeId, dateStr);
      console.log("Xóa ngày nghỉ thành công:", response);
      setOpenMenuDate(null);
      refetch();
    } catch (error) {
      console.error("Lỗi khi xóa ngày nghỉ:", error);
    }
  };

  const DayContent = ({ date }) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const item = scheduleData.find((d) => d.date === dateStr);
    const count = item?.appointmentCount || 0;

    const handleRightClick = (e) => {
      if (!allowDayOffAction) return;
      e.preventDefault();
      setOpenMenuDate(dateStr);
    };

    return (
      <div
        onContextMenu={allowDayOffAction ? handleRightClick : undefined}
        className="w-full h-full relative"
        style={{ height: "100%", width: "100%" }}
      >
        {item?.status === "full" && (
          <TriangleAlert className="absolute w-4 h-4 text-gray-900 pointer-events-none top-1 right-1 z-10" />
        )}
        {allowDayOffAction ? (
          <CalendarContextMenu
            open={openMenuDate === dateStr}
            onClose={() => setOpenMenuDate(null)}
            dateStr={dateStr}
            onSetDayOff={handleSetDayOff}
            onRemoveDayOff={handleRemoveDayOff}
            isOff={item?.status === "off"}
          >
            <div
              className="relative flex flex-col items-center justify-center h-full w-full"
              style={{ minHeight: 60 }}
            >
              <span className="text-sm relative">
                {date.getDate()}
                {item?.status === "off" && (
                  <X className="absolute w-6 h-6 text-red-600 pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </span>
              {count > 0 && (
                <span
                  className="text-[13px] text-gray-600 mt-0.5"
                  title={`${count} đơn cần xử lý`}
                >
                  ({count})
                </span>
              )}
            </div>
          </CalendarContextMenu>
        ) : (
          <div
            className="relative flex flex-col items-center justify-center h-full w-full"
            style={{ minHeight: 60 }}
          >
            <span className="text-sm">{date.getDate()}</span>
            {count > 0 && (
              <span
                className="text-[13px] text-gray-600 mt-0.5"
                title={`${count} đơn cần xử lý`}
              >
                ({count})
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Đóng context menu khi click ra ngoài
  React.useEffect(() => {
    const handleClick = () => setOpenMenuDate(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Đang tải lịch làm việc...
      </div>
    );
  }

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        className={`rounded-lg border shadow p-4 bg-white ${className || ""}`}
        modifiers={modifiers}
        modifiersClassNames={{
          available: "bg-emerald-300 text-emerald-900",
          light_busy: "bg-lime-300 text-lime-900",
          semi_busy: "bg-amber-300 text-amber-900",
          full: "bg-orange-400 text-orange-900",
          off: "bg-rose-400 text-rose-900",
        }}
        components={{ DayContent }}
        classNames={{
          table: "w-full border-separate border-spacing-0",
          head_row: "",
          head_cell:
            "text-muted-foreground w-[70px] h-[70px] font-bold text-base text-center [border-bottom-width:2px] [border-right-width:2px] border-gray-400 bg-gray-50",
          row: "",
          cell: "w-[70px] h-[70px] p-0 [border-bottom-width:2px] [border-right-width:2px] border-gray-400 bg-white relative",
          day: "w-full h-full flex flex-col items-center justify-center rounded-md font-medium cursor-pointer transition-colors duration-100 hover:bg-primary/10 aria-selected:bg-blue-100 aria-selected:text-blue-900 aria-selected:font-bold border border-transparent aria-selected:border-gray-500",
          caption_label: "text-lg font-semibold mb-2 text-center",
        }}
      />

      {/* ✅ Legend */}
      <div className="mt-4 flex gap-4 text-sm text-gray-600 px-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-300 border border-emerald-600" />
          Có thể đặt lịch
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-lime-300 border border-lime-600" />
          Khung giờ còn nhiều
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-amber-300 border border-amber-600" />
          Khung giờ còn ít
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-orange-400 border border-orange-600" />
          Full lịch
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-rose-400 border border-rose-600" />
          Nghỉ
        </div>
      </div>

      <LeaveRequestDialog
        isOpen={!!leaveDialogDate}
        onClose={() => setLeaveDialogDate(null)}
        onConfirm={handleLeaveRequestConfirm}
        date={leaveDialogDate}
        appointmentCount={
          scheduleData.find((d) => d.date === leaveDialogDate)
            ?.appointmentCount || 0
        }
      />
    </div>
  );
};

export default ScheduleCalendar;
