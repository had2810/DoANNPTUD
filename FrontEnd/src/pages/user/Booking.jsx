import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Rocket, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import DeviceSelector from "@/components/layout/user/BookingForm/DeviceSelector";
import IssueSelector from "@/components/layout/user/BookingForm/IssueSelector";
import IssueDetailStep from "@/components/layout/user/BookingForm/IssueDetailStep";
import DateTimePicker from "@/components/layout/user/BookingForm/DateTimePicker";
import ContactInfo from "@/components/layout/user/BookingForm/ContactInfo";
import BookingSummary from "@/components/layout/user/BookingForm/BookingSummary";
import DeviceTemplateSelect from "@/components/layout/user/BookingForm/DeviceTemplateSelect";
import { Button } from "@/components/ui/button";
import NotificationDialog from "@/components/dialogs/NotificationDialog";
import { useNavigate } from "react-router-dom";

import useEntityList from "@/hooks/useEntityList";
import { signupUser, login } from "@/services/authService";
import appointmentService from "@/services/appointmentService";
import { getMe } from "@/services/authService";

const formSchema = z.object({
  deviceType: z.string().min(1, { message: "Vui lòng chọn loại thiết bị" }),
  issueType: z.string().min(1, { message: "Vui lòng chọn loại vấn đề" }),
  deviceTemplateId: z.string().min(1, { message: "Thiếu thông tin thiết bị" }),
  date: z.date({ required_error: "Vui lòng chọn ngày" }).refine(
    (d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    },
    { message: "Không được chọn ngày trong quá khứ" }
  ),
  time: z.string().min(1, { message: "Vui lòng chọn giờ" }),
  firstName: z.string().min(2, { message: "Vui lòng nhập tên" }),
  lastName: z.string().min(2, { message: "Vui lòng nhập họ" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Vui lòng nhập số điện thoại hợp lệ" }),
  address: z.string().min(5, { message: "Vui lòng nhập địa chỉ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const Booking = () => {
  const [currentStep, setCurrentStep] = useState("device");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();

  const { data, isLoading } = useEntityList("users", getMe);
  const user = data?.data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceType: "",
      issueType: "",
      deviceTemplateId: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      email: "",
      description: "",
      estimatedCost: 0,
      images: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);
  const watchDeviceType = form.watch("deviceType");

  const handleStepChange = (step) => {
    const currentValues = form.getValues();
    let canProceed = true;

    // Validate based on current step
    if (
      step === "datetime" &&
      (!currentValues.deviceType || !currentValues.issueType)
    ) {
      canProceed = false;
      toast({
        title: "Thông tin không đầy đủ",
        description:
          "Vui lòng chọn loại thiết bị và vấn đề trước khi tiếp tục.",
        variant: "destructive",
      });
    } else if (step === "contact") {
      if (!currentValues.date || !currentValues.time) {
        canProceed = false;
        toast({
          title: "Thông tin không đầy đủ",
          description: "Vui lòng chọn ngày và giờ trước khi tiếp tục.",
          variant: "destructive",
        });
      } else {
        // Kiểm tra ngày/giờ hợp lệ
        const year = currentValues.date.getFullYear();
        const month = currentValues.date.getMonth();
        const day = currentValues.date.getDate();
        const [hours, minutes] = currentValues.time.split(":").map(Number);
        const localDate = new Date(year, month, day, hours, minutes, 0, 0);
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (localDate < today) {
          canProceed = false;
          toast({
            title: "Thời gian không hợp lệ",
            description: "Không được chọn ngày trong quá khứ.",
            variant: "destructive",
          });
        } else if (
          localDate.getFullYear() === now.getFullYear() &&
          localDate.getMonth() === now.getMonth() &&
          localDate.getDate() === now.getDate()
        ) {
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          if (
            hours < currentHour ||
            (hours === currentHour && minutes <= currentMinute)
          ) {
            canProceed = false;
            toast({
              title: "Thời gian không hợp lệ",
              description: "Không được chọn giờ nhỏ hơn hoặc bằng hiện tại.",
              variant: "destructive",
            });
          }
        }
      }
    } else if (
      step === "summary" &&
      (!currentValues.firstName ||
        !currentValues.lastName ||
        !currentValues.phoneNumber ||
        !currentValues.email)
    ) {
      canProceed = false;
      toast({
        title: "Thông tin không đầy đủ",
        description:
          "Vui lòng nhập đầy đủ thông tin liên hệ trước khi tiếp tục.",
        variant: "destructive",
      });
    }

    if (canProceed) {
      setCurrentStep(step);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let user = null;

      {
        try {
          const res = await getMe();
          user = res?.data;
        } catch (err) {
          console.warn("Token có thể đã hết hạn.");
        }
      }

      if (!user) {
        const userPayload = {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          userName: `${data.firstName}${data.phoneNumber.slice(-4)}`,
          email: data.email.trim().toLowerCase(),
          phoneNumber: data.phoneNumber.trim(),
          address: data.address.trim(),
          password: "TechMate@123",
        };

        try {
          await signupUser(userPayload);

          const loginRes = await login(
            userPayload.email,
            userPayload.password,
            "user"
          );
          saveTokens(loginRes.accessToken, loginRes.refreshToken);

          const res = await getMe();
          user = res?.data;
        } catch (err) {
          if (
            err.response?.data?.message &&
            err.response.data.message.includes("duplicate key")
          ) {
            setShowSuccessDialog(true);
            setIsSubmitting(false);
            return;
          } else {
            setShowSuccessDialog(true);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const year = data.date.getFullYear();
      const month = data.date.getMonth(); // 0-based
      const day = data.date.getDate();
      const [hours, minutes] = data.time.split(":").map(Number);
      const localDate = new Date(year, month, day, hours, minutes, 0, 0);
      // Kiểm tra không cho đặt lịch bé hơn hiện tại
      if (localDate < new Date()) {
        toast({
          title: "Thời gian không hợp lệ",
          description: "Không được chọn ngày giờ trong quá khứ.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      const appointmentTime = localDate.toISOString();

      const appointmentPayload = {
        userId: user?._id || null,
        deviceTemplateId: data.deviceTemplateId,
        serviceId: data.issueType,
        appointmentTime,
        description: data.description || "",
        imageUrls: data.images || [],
        estimatedCost: data.estimatedCost || 0,
        status: "pending",
      };

      await appointmentService.createAppointment(appointmentPayload);
      setShowSuccessDialog(true);
      form.reset();
      setCurrentStep("device");
    } catch (error) {
      console.error("Lỗi submit:", error);
      setShowSuccessDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessAction = () => {
    navigate("/user/profile/orders");
  };

  return (
    <>
      <Navbar />
      <header className="w-full bg-gradient-to-br from-techmate-purple to-purple-400 rounded-bl-[80px] rounded-br-[80px] py-20 text-white mb-8 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wrench className="w-10 h-10 text-white drop-shadow" />
            <h1 className="text-5xl font-extrabold drop-shadow">
              Đặt lịch sửa chữa
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            Đặt lịch nhanh chóng và dễ dàng để được phục vụ tốt nhất
          </p>
        </div>
        <Rocket className="absolute right-10 bottom-0 w-32 h-32 text-white/10 rotate-12 hidden md:block" />
        <Star className="absolute left-10 top-10 w-16 h-16 text-white/10 animate-spin-slow hidden md:block" />
      </header>
      <main>
        <section className="bg-tech-gray-light py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs
                      value={currentStep}
                      onValueChange={handleStepChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger
                          value="device"
                          className="data-[state=active]:bg-techmate-purple data-[state=active]:text-white"
                        >
                          Thiết bị
                        </TabsTrigger>
                        <TabsTrigger
                          value="issueDetail"
                          className="data-[state=active]:bg-techmate-purple data-[state=active]:text-white"
                        >
                          Chi tiết lỗi
                        </TabsTrigger>
                        <TabsTrigger
                          value="datetime"
                          className="data-[state=active]:bg-techmate-purple data-[state=active]:text-white"
                        >
                          Ngày & Giờ
                        </TabsTrigger>
                        <TabsTrigger
                          value="contact"
                          className="data-[state=active]:bg-techmate-purple data-[state=active]:text-white"
                        >
                          Liên hệ
                        </TabsTrigger>
                        <TabsTrigger
                          value="summary"
                          className="data-[state=active]:bg-techmate-purple data-[state=active]:text-white"
                        >
                          Xác nhận
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="device" className="space-y-6">
                        <DeviceSelector control={form.control} />
                        <DeviceTemplateSelect
                          control={form.control}
                          selectedDeviceType={watchDeviceType}
                        />
                        <IssueSelector
                          control={form.control}
                          deviceType={watchDeviceType}
                          setValue={form.setValue}
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={() => handleStepChange("issueDetail")}
                            className="bg-techmate-purple hover:bg-techmate-purple/90"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="issueDetail">
                        <IssueDetailStep control={form.control} />
                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("device")}
                            className="border-techmate-purple text-techmate-purple hover:bg-techmate-purple/10"
                          >
                            Quay lại
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleStepChange("datetime")}
                            className="bg-techmate-purple hover:bg-techmate-purple/90"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="datetime">
                        <DateTimePicker control={form.control} />
                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("issueDetail")}
                            className="border-techmate-purple text-techmate-purple hover:bg-techmate-purple/10"
                          >
                            Quay lại
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleStepChange("contact")}
                            className="bg-techmate-purple hover:bg-techmate-purple/90"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="contact">
                        <ContactInfo control={form.control} />
                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("datetime")}
                            className="border-techmate-purple text-techmate-purple hover:bg-techmate-purple/10"
                          >
                            Quay lại
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleStepChange("summary")}
                            className="bg-techmate-purple hover:bg-techmate-purple/90"
                          >
                            Tiếp tục
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="summary">
                        <BookingSummary
                          formData={form.getValues()}
                          isSubmitting={isSubmitting}
                        />
                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("contact")}
                            className="border-techmate-purple text-techmate-purple hover:bg-techmate-purple/10"
                          >
                            Quay lại
                          </Button>
                          <Button
                            type="submit"
                            className="bg-techmate-purple hover:bg-techmate-purple/90"
                            disabled={isSubmitting}
                            onClick={() => console.log(form.getValues())}
                          >
                            {isSubmitting
                              ? "Đang xử lý..."
                              : "Xác nhận đặt lịch"}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </form>
                </Form>
              </Card>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Cần hỗ trợ ngay? Gọi ngay số{" "}
                  <span className="text-blue-400 font-semibold">
                    0123 456 789
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NotificationDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Đặt lịch thành công!"
        description="Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ liên hệ sớm nhất có thể. Vui lòng kiểm tra email để xem chi tiết đơn hàng."
        actionText="Xem đơn hàng"
        onAction={handleSuccessAction}
        type="success"
      />
      <Footer />
    </>
  );
};

export default Booking;
