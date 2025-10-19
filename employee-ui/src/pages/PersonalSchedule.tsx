import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import scheduleService from "@/services/scheduleService";
import employeeWorkService from "@/services/employeeWorkService";
import { useAuth } from "@/hooks/useAuth";
import { AvailableTimeResponse } from "@/types";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const PersonalSchedule = () => {
  const navigate = useNavigate();

  // 1. Lấy thông tin nhân viên hiện tại
  const { data: me } = useAuth();
  const myEmployeeId = me?.data?._id;

  // 2. Tính toán tuần hiện tại và tuần tiếp theo (luôn bắt đầu từ thứ 2)
  const today = dayjs();
  
  // Tính thứ 2 của tuần hiện tại
  const currentDayOfWeek = today.day(); // 0=CN, 1=T2, 2=T3, ..., 6=T7
  const daysToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // Số ngày cần trừ để về thứ 2
  const currentWeekStart = today.add(daysToMonday, 'day');
  const currentWeekEnd = currentWeekStart.add(6, 'day');
  
  // Tuần tiếp theo
  const nextWeekStart = currentWeekStart.add(7, 'day');
  const nextWeekEnd = nextWeekStart.add(6, 'day');

  // Debug: Kiểm tra tuần có đúng không
  console.log('Today:', today.format('dddd, YYYY-MM-DD'));
  console.log('Current day of week (0=Sun, 1=Mon, ..., 6=Sat):', currentDayOfWeek);
  console.log('Days to Monday:', daysToMonday);
  console.log('Current week start (should be Monday):', currentWeekStart.format('dddd, YYYY-MM-DD'));
  console.log('Current week end (should be Sunday):', currentWeekEnd.format('dddd, YYYY-MM-DD'));
  console.log('Next week start (should be Monday):', nextWeekStart.format('dddd, YYYY-MM-DD'));
  console.log('Next week end (should be Sunday):', nextWeekEnd.format('dddd, YYYY-MM-DD'));

  // 3. Lấy lịch làm việc hiện tại
  const { data: employeeWork } = useQuery({
    queryKey: ["employee-work"],
    queryFn: () => employeeWorkService.getMyEmployeeWorks(),
    enabled: true,
  });

  const currentWorkSchedule = employeeWork?.data?.[0];

  // 4. Lấy lịch tuần hiện tại (tìm tuần có chứa ngày hôm nay)
  const { data: currentWeekScheduleResponse } = useQuery({
    queryKey: ["weekly-schedule", "current", dayjs().format('YYYY-MM-DD')],
    queryFn: () => {
      const date = dayjs().format('YYYY-MM-DD');
      console.log("PersonalSchedule - calling getWeeklySchedule with date:", date);
      return employeeWorkService.getWeeklySchedule(date);
    },
    enabled: true,
  });

  // 5. Lấy lịch tuần tiếp theo (tìm tuần có chứa ngày thứ 2 tuần sau)
  const { data: nextWeekScheduleResponse, isLoading: nextWeekLoading, error: nextWeekError } = useQuery({
    queryKey: ["weekly-schedule", "next", nextWeekStart.format('YYYY-MM-DD')],
    queryFn: async () => {
      const date = nextWeekStart.format('YYYY-MM-DD');
      console.log("PersonalSchedule - calling getWeeklySchedule for next week with date:", date);
      const response = await employeeWorkService.getWeeklySchedule(date);
      console.log("PersonalSchedule - API response for next week:", response);
      return response;
    },
    enabled: true,
  });

  const currentWeekSchedule = currentWeekScheduleResponse?.data;
  const nextWeekSchedule = nextWeekScheduleResponse?.data;

  // Fallback: nếu API weekly-schedule không có dữ liệu, dò từ danh sách employeeWork
  const allSchedules = employeeWork?.data ?? [];
  const fallbackCurrentWeekSchedule = allSchedules.find((s: any) => {
    const start = dayjs(s.weekStartDate);
    const end = dayjs(s.weekEndDate);
    return currentWeekStart.isSameOrAfter(start, 'day') && currentWeekStart.isSameOrBefore(end, 'day');
  });
  const fallbackNextWeekSchedule = allSchedules.find((s: any) => {
    const start = dayjs(s.weekStartDate);
    const end = dayjs(s.weekEndDate);
    return nextWeekStart.isSameOrAfter(start, 'day') && nextWeekStart.isSameOrBefore(end, 'day');
  });
  const effectiveCurrentWeekSchedule = currentWeekSchedule || fallbackCurrentWeekSchedule;
  const effectiveNextWeekSchedule = nextWeekSchedule || fallbackNextWeekSchedule;
  
  // Debug: Kiểm tra dữ liệu thô từ API và fallback
  console.log("=== DEBUG API RESPONSES ===");
  console.log("nextWeekLoading:", nextWeekLoading);
  console.log("nextWeekError:", nextWeekError);
  console.log("currentWeekScheduleResponse:", currentWeekScheduleResponse);
  console.log("nextWeekScheduleResponse:", nextWeekScheduleResponse);
  console.log("effectiveCurrentWeekSchedule:", effectiveCurrentWeekSchedule);
  console.log("effectiveNextWeekSchedule:", effectiveNextWeekSchedule);
  
  // Kiểm tra xem có dữ liệu workDays không
  if (effectiveNextWeekSchedule && effectiveNextWeekSchedule.workDays) {
    console.log("=== NEXT WEEK WORK DAYS ===");
    console.log("workDays count:", effectiveNextWeekSchedule.workDays.length);
    console.log("workDays details:", effectiveNextWeekSchedule.workDays);
  } else {
    console.log("=== NO WORK DAYS FOUND ===");
    console.log("effectiveNextWeekSchedule exists:", !!effectiveNextWeekSchedule);
    console.log("workDays exists:", !!(effectiveNextWeekSchedule && effectiveNextWeekSchedule.workDays));
  }

  // 6. Tạo danh sách ngày trong tuần
  const createWeekDays = (weekStart: dayjs.Dayjs) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = weekStart.add(i, 'day');
      // dayjs: 0=CN, 1=T2, 2=T3, ..., 6=T7
      // Database: 1=CN, 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7
      const dayOfWeek = date.day() === 0 ? 1 : date.day() + 1; // Convert to database format
      days.push({
        date: date.toDate(),
        dayOfWeek,
        dayName: date.format('dddd'),
        shortDate: date.format('DD/MM'),
        isToday: date.isSame(dayjs(), 'day'),
        isPast: date.isBefore(dayjs(), 'day'),
      });
    }
    return days;
  };

  const currentWeekDays = createWeekDays(currentWeekStart);
  const nextWeekDays = createWeekDays(nextWeekStart);

  // Debug: Kiểm tra dayOfWeek mapping
  console.log('Current week days:', currentWeekDays.map(d => ({
    date: d.shortDate,
    dayName: d.dayName,
    dayOfWeek: d.dayOfWeek
  })));
  console.log('Next week days:', nextWeekDays.map(d => ({
    date: d.shortDate,
    dayName: d.dayName,
    dayOfWeek: d.dayOfWeek
  })));
  console.log('Current week schedule:', currentWeekSchedule);
  console.log('Next week schedule:', nextWeekSchedule);
  console.log('Current week schedule workDays:', currentWeekSchedule?.workDays);
  console.log('Next week schedule workDays:', nextWeekSchedule?.workDays);
  
  // Debug: Kiểm tra chi tiết dữ liệu
  if (nextWeekSchedule) {
    console.log('Next week schedule details:', {
      weekStartDate: nextWeekSchedule.weekStartDate,
      weekEndDate: nextWeekSchedule.weekEndDate,
      workDays: nextWeekSchedule.workDays,
      workDaysCount: nextWeekSchedule.workDays?.length
    });
  } else {
    console.log('No next week schedule found');
  }
  
  // Debug: Kiểm tra current week schedule
  if (currentWeekSchedule) {
    console.log('Current week schedule details:', {
      weekStartDate: currentWeekSchedule.weekStartDate,
      weekEndDate: currentWeekSchedule.weekEndDate,
      workDays: currentWeekSchedule.workDays,
      workDaysCount: currentWeekSchedule.workDays?.length
    });
  } else {
    console.log('No current week schedule found');
  }

  // 7. Kiểm tra xem có thể sửa lịch tuần hiện tại không (chỉ cho phép sửa ngày tương lai)
  const canEditCurrentWeek = currentWeekSchedule?.workDays?.some((workDay: any) => {
    const workDate = currentWeekStart.add(workDay.dayOfWeek - 1, 'day');
    return workDate.isAfter(dayjs(), 'day');
  }) || false;

  // 8. Render work days cho một tuần
  const renderWorkDays = (weekDays: any[], workSchedule: any, isCurrentWeek: boolean) => {
    return weekDays.map((day) => {
      // Kiểm tra xem ngày này có nằm trong tuần của workSchedule không
      // Đơn giản hóa logic: chỉ cần so sánh format YYYY-MM-DD để tránh vấn đề timezone
      const isInScheduleWeek = workSchedule && 
        dayjs(day.date).format('YYYY-MM-DD') >= dayjs(workSchedule.weekStartDate).format('YYYY-MM-DD') &&
        dayjs(day.date).format('YYYY-MM-DD') <= dayjs(workSchedule.weekEndDate).format('YYYY-MM-DD');
      
      // Debug: Kiểm tra chi tiết việc so sánh ngày
      if (workSchedule) {
        console.log(`Date comparison for ${day.shortDate}:`, {
          dayDate: dayjs(day.date).format('YYYY-MM-DD'),
          scheduleStart: dayjs(workSchedule.weekStartDate).format('YYYY-MM-DD'),
          scheduleEnd: dayjs(workSchedule.weekEndDate).format('YYYY-MM-DD'),
          isAfterStart: dayjs(day.date).isSameOrAfter(dayjs(workSchedule.weekStartDate)),
          isBeforeEnd: dayjs(day.date).isSameOrBefore(dayjs(workSchedule.weekEndDate)),
          isInScheduleWeek,
          workDaysInSchedule: workSchedule.workDays?.map((w: any) => ({ dayOfWeek: w.dayOfWeek, startHour: w.startHour, endHour: w.endHour }))
        });
      } else {
        console.log(`No workSchedule for ${day.shortDate}`);
      }
      
      // Tìm workDay nếu ngày nằm trong tuần của schedule
      const workDay = isInScheduleWeek ? 
        workSchedule.workDays?.find((w: any) => w.dayOfWeek === day.dayOfWeek) : null;
      
      const isWorking = !!workDay;
      const canEdit = isCurrentWeek && !day.isPast;

      console.log(`Day ${day.shortDate} (${day.dayName}):`, {
        dayOfWeek: day.dayOfWeek,
        isInScheduleWeek,
        workDay,
        isWorking,
        scheduleWeek: workSchedule ? `${dayjs(workSchedule.weekStartDate).format('DD/MM')} - ${dayjs(workSchedule.weekEndDate).format('DD/MM')}` : 'No schedule',
        workDaysInSchedule: workSchedule?.workDays?.map((w: any) => ({ dayOfWeek: w.dayOfWeek, startHour: w.startHour, endHour: w.endHour })),
        matchingWorkDay: workSchedule?.workDays?.find((w: any) => w.dayOfWeek === day.dayOfWeek)
      });

      return (
        <div
          key={day.dayOfWeek}
          className={`p-3 border rounded-lg ${
            isWorking 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-sm">{day.dayName}</div>
              <div className="text-xs text-gray-600">{day.shortDate}</div>
            </div>
            {day.isToday && (
              <Badge variant="secondary" className="text-xs">Hôm nay</Badge>
            )}
          </div>
          
          {isWorking ? (
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-700">
                {workDay.startHour} - {workDay.endHour}
              </div>
              <div className="text-xs text-green-600">Đã đăng ký</div>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    console.log('Edit work day:', workDay);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Sửa
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {day.isPast ? 'Đã qua' : isInScheduleWeek ? 'Đã đăng ký làm' : 'Nghỉ'}
            </div>
          )}
        </div>
      );
    });
  };

  // Test function để kiểm tra API
  const testAPI = async () => {
    try {
      console.log("=== TESTING API DIRECTLY ===");
      const date = nextWeekStart.format('YYYY-MM-DD');
      console.log("Testing with date:", date);
      const response = await employeeWorkService.getWeeklySchedule(date);
      console.log("Direct API response:", response);
      
      // Kiểm tra dữ liệu chi tiết
      if (response && response.data) {
        console.log("Schedule found:", response.data);
        console.log("Work days:", response.data.workDays);
        console.log("Week start:", response.data.weekStartDate);
        console.log("Week end:", response.data.weekEndDate);
      } else {
        console.log("No schedule found in database");
      }
    } catch (error) {
      console.error("API test error:", error);
    }
  };

  return (
    <div className="p-6 bg-slate-50 h-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lịch làm việc cá nhân</h1>
        <Button onClick={testAPI} variant="outline" size="sm">
          Test API
        </Button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Khung 1: Tuần này */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Tuần này ({currentWeekStart.format('DD/MM')} - {currentWeekEnd.format('DD/MM')})
              </CardTitle>
              {canEditCurrentWeek && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement edit current week functionality
                    console.log('Edit current week');
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
              )}
                </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {renderWorkDays(currentWeekDays, effectiveCurrentWeekSchedule, true)}
              </div>
            {!effectiveCurrentWeekSchedule && (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch làm việc tuần này</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/weekly-schedule")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Đăng ký lịch
                </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Khung 2: Tuần tiếp theo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Tuần tiếp theo ({nextWeekStart.format('DD/MM')} - {nextWeekEnd.format('DD/MM')})
              </CardTitle>
              <Button
                size="sm"
                onClick={() => navigate("/weekly-schedule")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Đăng ký lịch
              </Button>
              </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {renderWorkDays(nextWeekDays, effectiveNextWeekSchedule, false)}
                </div>
            {!effectiveNextWeekSchedule && (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch làm việc tuần tiếp theo</p>
                <Button
                  size="sm"
                  className="mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/weekly-schedule")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Đăng ký lịch
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalSchedule;
