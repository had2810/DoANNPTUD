import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CalendarDays, Clock, Save, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekStartDate: dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'), // Thứ 2 của tuần hiện tại
      workDays: [],
    },
  });

  // Mutation để tạo/cập nhật lịch tuần
  const createWeeklyScheduleMutation = useMutation({
    mutationFn: (data: CreateWeeklyScheduleRequest) => 
      employeeWorkService.createWeeklySchedule(data),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đăng ký lịch làm việc tuần thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ["employee-work"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
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

    const submitData: CreateWeeklyScheduleRequest = {
      employeeId: me.data._id,
      weekStartDate: data.weekStartDate,
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
                    <FormLabel>Ngày bắt đầu tuần (Thứ 2)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={dayjs().format('YYYY-MM-DD')}
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
                      <Checkbox
                        checked={selectedDays.includes(day.value)}
                        disabled
                      />
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
          <div className="text-center text-gray-500 py-8">
            Tính năng xem lịch đã đăng ký sẽ được thêm vào sau
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyScheduleRegistration;
