import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TimeSlot from "./TimeSlot";

const ScheduleBoard = ({ date, scheduleItems }) => {
  const formattedDate = format(date, "dd 'tháng' M, yyyy", { locale: vi });

  // Nhóm các lịch theo giờ
  const scheduleMap = scheduleItems.reduce((acc, item) => {
    const localDate = new Date(item.timeSlot);
    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");
    const timeKey = `${hours}:${minutes}`;

    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(item);
    return acc;
  }, {});

  // Tạo danh sách khung giờ từ 08:00 đến 17:00
  const allTimeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    const timeKey = `${hour.toString().padStart(2, "0")}:00`;
    const displayTime = `${timeKey} - ${String(hour + 1).padStart(2, "0")}:00`;

    const scheduleItemsAtSlot = scheduleMap[timeKey] || [];

    return {
      timeKey,
      displayTime,
      scheduleItems: scheduleItemsAtSlot,
    };
  });

  return (
    <Card className="w-full mx-auto shadow-sm border-gray-200">
      <CardHeader className="bg-white py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium flex items-center gap-2 text-gray-800">
            <Calendar className="h-5 w-5 text-blue-600" />
            Lịch làm việc ngày {formattedDate}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">
                  Thời gian
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">
                  Dịch vụ
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">
                  Khách hàng
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">
                  Ghi chú
                </TableHead>
                <TableHead className="py-3 px-4 text-center font-semibold text-gray-600">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTimeSlots.map(({ displayTime, scheduleItems }, index) =>
                scheduleItems.length > 0 ? (
                  scheduleItems.map((item, idx) => (
                    <TimeSlot
                      key={item.id}
                      timeSlot={displayTime}
                      showTimeSlot={idx === 0}
                      serviceName={item.serviceName}
                      phoneNumber={item.phoneNumber}
                      content={item.content}
                      customer={item.customer}
                      description={item.description}
                      status={item.status}
                      isEven={(index + idx) % 2 === 0}
                    />
                  ))
                ) : (
                  <TimeSlot
                    key={`empty-${displayTime}`}
                    timeSlot={displayTime}
                    showTimeSlot={true}
                    serviceName=""
                    phoneNumber=""
                    content=""
                    customer=""
                    description=""
                    status=""
                    isEven={index % 2 === 0}
                  />
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleBoard;
