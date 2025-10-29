import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { CalendarDays, Clock, Save, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import employeeWorkService from "@/services/employeeWorkService";
import { WorkDay, CreateWeeklyScheduleRequest } from "@/types";

const workDaySchema = z.object({
  dayOfWeek: z.number().min(1).max(7),
  startHour: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  endHour: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
});

const formSchema = z.object({
  weekStartDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu tuần"),
  workDays: z.array(workDaySchema).min(1, "Vui lòng chọn ít nhất 1 ngày làm việc"),
});

type FormData = z.infer<typeof formSchema>;

const DAYS_OF_WEEK = [
  { value: 1, label: "Chủ nhật", short: "CN" },
  { value: 2, label: "Thứ 2", short: "T2" },
  { value: 3, label: "Thứ 3", short: "T3" },
  { value: 4, label: "Thứ 4", short: "T4" },
  { value: 5, label: "Thứ 5", short: "T5" },
  { value: 6, label: "Thứ 6", short: "T6" },
  { value: 7, label: "Thứ 7", short: "T7" },
];

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
];

const WeeklyScheduleRegistration: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const { toast } = useToast();
  const { data: me } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get initial weekStartDate from navigation state or use current Monday
  const location = useLocation();
  const initialWeekStartDate = useMemo(() => {
    const stateDate = location.state?.weekStartDate;
    if (stateDate) {
      // If a date was passed, ensure it's a Monday
      const date = dayjs(stateDate);
      return date.day() === 1 ? date : date.startOf('week').add(1, 'day');
    }
    // Default to current week's Monday
    return dayjs().startOf('week').add(1, 'day');
  }, [location.state?.weekStartDate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekStartDate: initialWeekStartDate.format('YYYY-MM-DD'),
      workDays: [],
    },
  });

  // Lấy lịch đã đăng ký cho tuần được chọn
  const selectedWeekDate = form.watch("weekStartDate");
  const { data: registeredWeekResponse, isLoading: registeredWeekLoading, error: registeredWeekError } = useQuery({
    queryKey: ["weekly-schedule", "registered-view", selectedWeekDate],
    queryFn: () => employeeWorkService.getWeeklySchedule(selectedWeekDate),
    enabled: !!selectedWeekDate && !!me?.data?._id,
  });
  const registeredWeek = registeredWeekResponse?.data;

  // Mutation để tạo/cập nhật lịch tuần
  const createWeeklyScheduleMutation = useMutation({
    mutationFn: (data: CreateWeeklyScheduleRequest) => {
      console.log("=== SUBMITTING WEEKLY SCHEDULE ===");
      console.log("Data being sent:", data);
      return employeeWorkService.createWeeklySchedule(data);
    },
    onSuccess: (response) => {
      console.log("=== WEEKLY SCHEDULE CREATED SUCCESSFULLY ===");
      console.log("Response:", response);
      
      toast({
        title: "Thành công",
        description: "Đăng ký lịch làm việc tuần thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ["employee-work"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      
      // Chuyển về trang lịch làm việc để xem kết quả
      setTimeout(() => {
        navigate("/personal-calendar");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi đăng ký lịch",
        variant: "destructive",
      });
    },
  });

  // Xử lý chọn ngày trong tuần
  const handleDayToggle = (dayOfWeek: number) => {
    try {
      const newSelectedDays = selectedDays.includes(dayOfWeek)
        ? selectedDays.filter(d => d !== dayOfWeek)
        : [...selectedDays, dayOfWeek];
      
      setSelectedDays(newSelectedDays);
      
      // Cập nhật workDays trong form
      const currentWorkDays = (form.getValues("workDays") as WorkDay[]) || [];
      const updatedWorkDays = currentWorkDays.filter((wd: WorkDay) => wd.dayOfWeek !== dayOfWeek);
      
      if (newSelectedDays.includes(dayOfWeek)) {
        // Thêm ngày mới với giờ mặc định
        updatedWorkDays.push({
          dayOfWeek,
          startHour: "08:00",
          endHour: "17:00",
        });
      }
      
      form.setValue("workDays", updatedWorkDays);
    } catch (error) {
      console.error("Error in handleDayToggle:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi chọn ngày làm việc",
        variant: "destructive",
      });
    }
  };

  // Xử lý thay đổi giờ làm việc
  const handleTimeChange = (dayOfWeek: number, field: 'startHour' | 'endHour', value: string) => {
    try {
      const currentWorkDays = (form.getValues("workDays") as WorkDay[]) || [];
      const updatedWorkDays = currentWorkDays.map((wd: WorkDay) => 
        wd.dayOfWeek === dayOfWeek 
          ? { ...wd, [field]: value }
          : wd
      );
      form.setValue("workDays", updatedWorkDays);
    } catch (error) {
      console.error("Error in handleTimeChange:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thay đổi giờ làm việc",
        variant: "destructive",
      });
    }
  };

  // Submit form
  const onSubmit = (data: FormData) => {
    if (!me?.data?._id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin nhân viên",
        variant: "destructive",
      });
      return;
    }

    const normalizedWeekStart = dayjs(data.weekStartDate).startOf('week').add(1, 'day').format('YYYY-MM-DD');
    const submitData: CreateWeeklyScheduleRequest = {
      employeeId: me.data._id,
      weekStartDate: normalizedWeekStart,
      workDays: data.workDays as WorkDay[],
      status: "Đang trực",
    };

    createWeeklyScheduleMutation.mutate(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Đăng ký lịch làm việc theo tuần</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Chọn tuần */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Chọn tuần làm việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="weekStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu tuần (chỉ chọn thứ 2)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={dayjs().format('YYYY-MM-DD')}
                        onChange={(e) => {
                          // Ensure the selected date is a Monday
                          const selectedDate = dayjs(e.target.value);
                          const dayOfWeek = selectedDate.day(); // 0 = Sunday, 1 = Monday, ...
                          if (dayOfWeek !== 1) {
                            // Find the next Monday
                            const nextMonday = selectedDate.add(
                              dayOfWeek === 0 ? 1 : 8 - dayOfWeek, 
                              'day'
                            );
                            field.onChange(nextMonday.format('YYYY-MM-DD'));
                            toast({
                              description: "Đã tự động chọn thứ 2 gần nhất",
                            });
                          } else {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-gray-600 mt-2">
                Tuần từ {dayjs(form.watch("weekStartDate")).format('DD/MM/YYYY')} đến {dayjs(form.watch("weekStartDate")).add(6, 'day').format('DD/MM/YYYY')}
              </p>
            </CardContent>
          </Card>

          {/* Chọn ngày làm việc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chọn ngày làm việc trong tuần
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                    key={day.value}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDays.includes(day.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleDayToggle(day.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{day.short}</div>
                        <div className="text-sm text-gray-600">{day.label}</div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedDays.includes(day.value)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedDays.includes(day.value) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cài đặt giờ làm việc cho từng ngày */}
          {selectedDays.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt giờ làm việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDays.map((dayOfWeek) => {
                  const dayInfo = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
                  const workDays = (form.watch("workDays") as WorkDay[]) || [];
                  const workDay = workDays.find((wd: WorkDay) => wd.dayOfWeek === dayOfWeek);
                  
                  return (
                    <div key={dayOfWeek} className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-3">{dayInfo?.label}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Giờ bắt đầu</label>
                          <Select
                            value={workDay?.startHour || "08:00"}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'startHour', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Giờ kết thúc</label>
                          <Select
                            value={workDay?.endHour || "17:00"}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'endHour', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Nút submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                try {
                  setSelectedDays([]);
                  form.reset({
                    weekStartDate: dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'),
                    workDays: [] as WorkDay[],
                  });
                } catch (error) {
                  console.error("Error in reset:", error);
                  toast({
                    title: "Lỗi",
                    description: "Có lỗi xảy ra khi đặt lại form",
                    variant: "destructive",
                  });
                }
              }}
            >
              Đặt lại
            </Button>
            <Button
              type="submit"
              disabled={createWeeklyScheduleMutation.isPending || selectedDays.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createWeeklyScheduleMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Đăng ký lịch tuần
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Hiển thị lịch đã đăng ký */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch làm việc đã đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
          {registeredWeekLoading ? (
            <div className="text-center text-gray-500 py-8">Đang tải lịch đã đăng ký…</div>
          ) : registeredWeek ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Tuần từ {dayjs(registeredWeek.weekStartDate).format('DD/MM/YYYY')} đến {dayjs(registeredWeek.weekEndDate).format('DD/MM/YYYY')}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((d) => {
                  const wd = registeredWeek.workDays?.find((w: any) => w.dayOfWeek === d.value);
                  return (
                    <div key={d.value} className="p-3 border rounded-md">
                      <div className="text-sm font-medium">{d.short}</div>
                      <div className="text-xs text-gray-600">{d.label}</div>
                      <div className="mt-1 text-sm">
                        {wd ? `${wd.startHour} - ${wd.endHour}` : 'Nghỉ'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Chưa có lịch đã đăng ký cho tuần này
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyScheduleRegistration;
