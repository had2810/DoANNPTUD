import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import employeeWorkService from "@/services/employeeWorkService";
import employeeService from "@/services/employeeService";
import { toLocalDatetimeString } from "@/lib/changeUTC";
import ScheduleCalendar from "@/components/calendar/ScheduleCalendar";

const EmployeeWorkFormDialog = ({ open, onOpenChange, onSave, work }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Đúng: Dùng useQuery để fetch nhân viên
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAllEmployees,
  });

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const form = useForm({
    defaultValues: {
      employeeId: work?.employeeId?._id || "",
      startTime: work?.startTime
        ? toLocalDatetimeString(work.startTime).slice(11, 16)
        : "",
      endTime: work?.endTime
        ? toLocalDatetimeString(work.endTime).slice(11, 16)
        : "",
      status: work?.status || "Đang trực",
      note: work?.note || "",
    },
  });

  useEffect(() => {
    if (work) {
      setSelectedDate(new Date());
      form.reset({
        employeeId: work.employeeId?._id,
        startTime: toLocalDatetimeString(work.startTime).slice(11, 16),
        endTime: toLocalDatetimeString(work.endTime).slice(11, 16),
        status: work.status,
        note: work.note,
      });
    }
  }, [work, form]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const dateStr = selectedDate.toISOString().split("T")[0];
      const startTime = `${dateStr}T${data.startTime}`;
      const endTime = `${dateStr}T${data.endTime}`;
      const payload = {
        ...data,
        startTime,
        endTime,
      };
      if (work) {
        await employeeWorkService.updateEmployeeWork(work._id, payload);
      } else {
        await employeeWorkService.createEmployeeWork(payload);
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi lưu thông tin lịch làm việc.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {work ? "Chỉnh sửa lịch làm việc" : "Thêm lịch làm việc mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-0">
          <div className="md:w-1/2 flex justify-center items-start py-6">
            <ScheduleCalendar
              employeeId={form.watch("employeeId")}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              allowDayOffAction={true}
            />
          </div>
          <div
            className="hidden md:block border-l mx-6"
            style={{ height: "auto", minHeight: 400 }}
          />
          <div className="md:w-1/2 py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="employeeId"
                  rules={{ required: "Vui lòng chọn nhân viên" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={!!work}
                      >
                        <FormControl>
                          <SelectTrigger disabled={!!work}>
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem
                              key={employee._id}
                              value={employee._id}
                              disabled={!!work}
                            >
                              {employee.fullName ||
                                `${employee.firstName} ${employee.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  rules={{ required: "Vui lòng chọn thời gian bắt đầu" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  rules={{ required: "Vui lòng chọn thời gian kết thúc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian kết thúc</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: "Vui lòng chọn trạng thái" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Đang trực">Đang trực</SelectItem>
                          <SelectItem value="Bận">Bận</SelectItem>
                          <SelectItem value="Nghỉ">Nghỉ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeWorkFormDialog;
