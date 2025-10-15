import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import serviceService from "@/services/serviceService";
import deviceTemplateService from "@/services/deviceTemplateService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServiceFormDialog = ({ open, onOpenChange, service, onSave }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    deviceTemplateId: "",
    serviceName: "",
    serviceType: "",
    imageUrl: "",
    estimatedDuration: "",
    description: "",
    price: "",
  });

  const { data: deviceTemplates = [] } = useQuery({
    queryKey: ["deviceTemplates"],
    queryFn: deviceTemplateService.getAllDeviceTemplates,
  });

  const activeDeviceTemplates = deviceTemplates.filter(
    (device) => device.active
  );
  useEffect(() => {
    if (service) {
      setFormData({
        deviceTemplateId:
          typeof service.deviceTemplateId === "object"
            ? service.deviceTemplateId._id
            : service.deviceTemplateId || "",
        serviceName: service.serviceName || "",
        serviceType: service.serviceType || "",
        imageUrl: service.imageUrl || "",
        estimatedDuration: service.estimatedDuration || "",
        description: service.description || "",
        price: service.price || "",
      });
    } else {
      setFormData({
        deviceTemplateId: "",
        serviceName: "",
        serviceType: "",
        imageUrl: "",
        estimatedDuration: "",
        description: "",
        price: "",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createMutation = useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      onSave();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      onSave();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.deviceTemplateId) {
      toast({
        title: "Thiếu thông tin",
        description: "Bạn chưa chọn thiết bị!",
        variant: "destructive",
      });
      return;
    }

    const serviceData = {
      ...formData,
      deviceTemplateId:
        typeof formData.deviceTemplateId === "object"
          ? formData.deviceTemplateId._id
          : formData.deviceTemplateId,
      estimatedDuration: parseInt(formData.estimatedDuration),
      price: parseFloat(formData.price),
    };

    if (service) {
      updateMutation.mutate({ id: service._id, data: serviceData });
    } else {
      createMutation.mutate(serviceData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Cột trái */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Tên dịch vụ</Label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Loại dịch vụ</Label>
                <Input
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceTemplateId">Thiết bị</Label>
                <Select
                  value={formData.deviceTemplateId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      deviceTemplateId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDeviceTemplates.map((device) => (
                      <SelectItem key={device._id} value={device._id}>
                        {device.brand} - {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá (VNĐ)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">
                  Thời lượng dự kiến (phút)
                </Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  type="number"
                  min={1}
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  placeholder="VD: 90 cho 1h30p"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL hình ảnh</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">{service ? "Cập nhật" : "Thêm mới"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
