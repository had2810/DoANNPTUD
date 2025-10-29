import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import appointmentService from "@/services/appointmentService";
import { format } from "date-fns";
import useDropdownData from "@/hooks/useDropdownData";
import ScheduleBoard from "@/components/calendar/ScheduleBoard";
import scheduleService from "@/services/scheduleService";
import employeeWorkService from "@/services/employeeWorkService";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  userId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  deviceTemplateId: z.string().min(1, { message: "Vui lòng chọn thiết bị" }),
  serviceId: z.string().min(1, { message: "Vui lòng chọn dịch vụ" }),
  employeeId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable()
  ),
  appointmentTime: z.string().min(1, { message: "Chọn thời gian hẹn" }),
  description: z.string().min(5, { message: "Mô tả phải có ít nhất 5 ký tự" }),
  imageUrl: z.string().optional(),
  estimatedCost: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

const AppointmentFormDialog = ({ open, onOpenChange, appointment, onSave }) => {
  const isEditMode = !!appointment;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      deviceTemplateId: "",
      serviceId: "",
      employeeId: "",
      appointmentTime: "",
      description: "",
      imageUrl: "",
      estimatedCost: "",
      status: "pending",
    },
  });

  const { customers, deviceTemplates, services, employees, loading } =
    useDropdownData();

  // State để đồng bộ nhân viên và ngày hẹn
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Lấy danh sách lịch làm việc của nhân viên
  const { data: employeeWorks = [] } = useQuery({
    queryKey: ["employeeWorks"],
    queryFn: employeeWorkService.getAllEmployeeWorks,
  });

  // Khi có appointment (edit), set mặc định nhân viên/ngày
  useEffect(() => {
    if (appointment) {
      setSelectedEmployeeId(appointment.employeeId?._id || "");
      setSelectedDate(
        appointment.appointmentTime
          ? format(new Date(appointment.appointmentTime), "yyyy-MM-dd")
          : ""
      );
    }
  }, [appointment]);

  // Khi chọn nhân viên/ngày trên form, đồng bộ state
  useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "employeeId") setSelectedEmployeeId(value.employeeId || "");
      if (name === "appointmentTime") {
        // Lấy ngày yyyy-MM-dd từ datetime-local
        const dateStr = value.appointmentTime?.slice(0, 10) || "";
        setSelectedDate(dateStr);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Tìm employeeWorkScheduleId phù hợp
  const employeeWorkSchedule = employeeWorks.find(
    (w) =>
      (w.employeeId?._id || w.employeeId) === selectedEmployeeId &&
      w.appointmentId?.some(
        (a) => a.appointmentTime?.slice(0, 10) === selectedDate
      )
  );

  console.log("Dữ liệu lịch làm việc >> ", employeeWorkSchedule);
  const employeeWorkScheduleId = employeeWorkSchedule?._id;

  // Lấy lịch làm việc trong ngày
  const { data: availableTimes = {} } = useQuery({
    queryKey: ["availableTimes", employeeWorkScheduleId, selectedDate],
    queryFn: () =>
      scheduleService.getAnAvailableTime(employeeWorkScheduleId, selectedDate),
    enabled: !!employeeWorkScheduleId && !!selectedDate,
  });

  // Chuyển đổi dữ liệu cho ScheduleBoard
  const scheduleItems = Array.isArray(availableTimes?.appointmentToday)
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

  useEffect(() => {
    if (appointment) {
      const appointmentTime = appointment.appointmentTime
        ? format(new Date(appointment.appointmentTime), "yyyy-MM-dd'T'HH:mm")
        : "";

      form.reset({
        userId: appointment.userId?._id || "",
        deviceTemplateId: appointment.deviceTemplateId?._id || "",
        serviceId: appointment.serviceId?._id || "",
        employeeId: appointment.employeeId?._id || "",
        appointmentTime,
        description: appointment.description || "",
        imageUrl: appointment.imageUrl || "",
        estimatedCost: appointment.estimatedCost?.toString() || "",
        status: appointment.status || "pending",
      });
    }
  }, [appointment, form]);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const formData = {
        ...values,
        estimatedCost: values.estimatedCost
          ? Number(values.estimatedCost)
          : undefined,
      };

      if (isEditMode) {
        await appointmentService.updateAppointment(appointment._id, formData);
        toast({
          title: "Thành công!",
          description: "Lịch hẹn đã được cập nhật.",
        });
      } else {
        await appointmentService.createAppointment(formData);
        toast({
          title: "Thành công!",
          description: "Lịch hẹn mới đã được tạo.",
        });
      }

      onOpenChange(false);
      onSave?.();
    } catch (error) {
      toast({
        title: "Lỗi!",
        description:
          error.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Đang tải dữ liệu</DialogTitle>
          </DialogHeader>
          <p className="p-4 text-center">Đang tải dữ liệu...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh Sửa Lịch Hẹn" : "Tạo Lịch Hẹn Mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin chi tiết của lịch hẹn."
              : "Điền thông tin để tạo lịch hẹn mới."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bên trái: Lịch làm việc trong ngày */}
          <div className="md:w-1/2 w-full flex justify-center items-start py-2">
            <ScheduleBoard
              date={selectedDate ? new Date(selectedDate) : new Date()}
              scheduleItems={scheduleItems}
            />
          </div>
          {/* Bên phải: Form chỉnh sửa lịch hẹn */}
          <div className="md:w-1/2 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer */}
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khách hàng</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isEditMode}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn khách hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((u) => (
                              <SelectItem key={u._id} value={u._id}>
                                {u.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Device */}
                  <FormField
                    control={form.control}
                    name="deviceTemplateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thiết bị</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thiết bị" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deviceTemplates.map((d) => (
                              <SelectItem key={d._id} value={d._id}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Service */}
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dịch vụ</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn dịch vụ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s._id} value={s._id}>
                                {s.serviceName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Employee */}
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhân viên</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((e) => (
                              <SelectItem key={e._id} value={e._id}>
                                {e.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian hẹn</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="confirmed">
                              Đã xác nhận
                            </SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả vấn đề"
                          {...field}
                          className={"min-h-[132px]"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Row 4 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Image URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình ảnh (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="URL hình ảnh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cost */}
                  <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chi phí ước tính</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập chi phí"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Đang xử lý..."
                      : isEditMode
                      ? "Cập Nhật"
                      : "Tạo Lịch Hẹn"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
