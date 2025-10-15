import React from "react";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Laptop,
  Tablet,
  Settings,
  Calendar,
  Clock,
  User,
  Phone,
  Wrench,
  AlertCircle,
  Mail,
  FileText,
  Image as ImageIcon,
  MapPin,
  DollarSign,
} from "lucide-react";
import { deviceTypes } from "./DeviceSelector";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useEntityList from "@/hooks/useEntityList";
import serviceService from "@/services/serviceService";
import deviceTemplateService from "@/services/deviceTemplateService";

const BookingSummary = ({ formData, isSubmitting }) => {
  const { toast } = useToast();

  // Fetch services and device templates
  const { data: services = [] } = useEntityList(
    "services",
    serviceService.getAllServices
  );
  const { data: deviceTemplates = [] } = useEntityList(
    "deviceTemplates",
    deviceTemplateService.getAllDeviceTemplates
  );

  // Get device information
  const selectedDevice = deviceTypes.find(
    (device) => device.id === formData.deviceType
  );
  const DeviceIcon = selectedDevice ? selectedDevice.icon : Smartphone;

  // Get selected device template
  const selectedDeviceTemplate = deviceTemplates.find(
    (template) => template._id === formData.deviceTemplateId
  );

  // Get selected service
  const selectedService = services.find(
    (service) => service._id === formData.issueType
  );

  // Check if all required fields are filled
  const isFormComplete =
    formData.deviceType &&
    formData.deviceTemplateId &&
    formData.issueType &&
    formData.date &&
    formData.time &&
    formData.firstName &&
    formData.lastName &&
    formData.phoneNumber &&
    formData.address &&
    formData.email;

  const isSundayBooking = formData.date
    ? new Date(formData.date).getDay() === 0
    : false;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {!isFormComplete && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Vui lòng điền đầy đủ thông tin
          </AlertDescription>
        </Alert>
      )}

      {isSundayBooking && (
        <Alert className="bg-yellow-50 border-yellow-400 text-yellow-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Lưu ý: Đơn đặt lịch ngày Chủ nhật sẽ được xử lý vào Thứ 2 kế tiếp.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="space-y-8">
          {/* Thông tin khách hàng */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin khách hàng
            </h3>
            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <User className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Họ và tên:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {formData.lastName && formData.firstName
                    ? `${formData.lastName} ${formData.firstName}`
                    : "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <Phone className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Số điện thoại:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {formData.phoneNumber ||
                    "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <Mail className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Email:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {formData.email || "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <MapPin className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Địa chỉ:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {formData.address || "..................................."}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin đặt lịch */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin đặt lịch
            </h3>
            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <DeviceIcon className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Loại thiết bị:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {selectedDevice?.name ||
                    "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <Settings className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Tên thiết bị:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {selectedDeviceTemplate?.name ||
                    "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <Wrench className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Vấn đề cần sửa:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {selectedService?.serviceName ||
                    "..................................."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-tech-blue/10 p-3">
                <DollarSign className="h-6 w-6 text-tech-blue" />
              </div>
              <div className="flex gap-2 flex-1">
                <p className="min-w-[140px]">Chi phí ước tính:</p>
                <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                  {selectedService?.price
                    ? `${selectedService.price.toLocaleString("vi-VN")} VNĐ`
                    : "..................................."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-4 items-center">
                <div className="rounded-full bg-tech-blue/10 p-3">
                  <Calendar className="h-6 w-6 text-tech-blue" />
                </div>
                <div className="flex gap-2 flex-1">
                  <p className="min-w-[80px]">Ngày hẹn:</p>
                  <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                    {formData.date
                      ? format(formData.date, "dd/MM/yyyy")
                      : "..................................."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="rounded-full bg-tech-blue/10 p-3">
                  <Clock className="h-6 w-6 text-tech-blue" />
                </div>
                <div className="flex gap-2 flex-1">
                  <p className="min-w-[80px]">Giờ hẹn:</p>
                  <p className="font-medium flex-1 border-b border-dotted border-gray-400">
                    {formData.time || "..................................."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin bổ sung */}
          {(formData.description ||
            (formData.images && formData.images.length > 0)) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Thông tin bổ sung
              </h3>

              {formData.description && (
                <div className="flex gap-4 items-start pt-2">
                  <div className="rounded-full bg-tech-blue/10 p-3">
                    <FileText className="h-6 w-6 text-tech-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="min-w-[140px] mb-2">Mô tả chi tiết:</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {formData.description}
                    </div>
                  </div>
                </div>
              )}

              {formData.images && formData.images.length > 0 && (
                <div className="flex gap-4 items-start pt-2">
                  <div className="rounded-full bg-tech-blue/10 p-3">
                    <ImageIcon className="h-6 w-6 text-tech-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="min-w-[140px] mb-2">Hình ảnh đính kèm:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={image}
                            alt={`Hình ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt lịch. Thông
            tin đã nhập sẽ không thể thay đổi sau khi xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
