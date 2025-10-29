import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import deviceTemplateService from "@/services/deviceTemplateService";

const deviceTypes = ["Laptop", "Phone", "Tablet", "PC", "Other"];

const DeviceTemplateFormDialog = ({ open, onOpenChange, onSave, template }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      type: "",
      brand: "",
      image_url: "",
      active: true,
    },
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        type: template.type,
        brand: template.brand,
        image_url: template.image_url,
        active: template.active,
      });
    } else {
      reset({
        name: "",
        type: "",
        brand: "",
        image_url: "",
        active: true,
      });
    }
  }, [template, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (template) {
        await deviceTemplateService.updateDeviceTemplate(template._id, data);
      } else {
        await deviceTemplateService.createDeviceTemplate(data);
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving device template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {template ? "Chỉnh sửa mẫu thiết bị" : "Thêm mẫu thiết bị mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên mẫu</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Nhập tên mẫu thiết bị"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại thiết bị</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Hãng</Label>
            <Input
              id="brand"
              {...register("brand", { required: true })}
              placeholder="Nhập tên hãng"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL hình ảnh</Label>
            <Input
              id="image_url"
              {...register("image_url")}
              placeholder="Nhập URL hình ảnh"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={watch("active")}
              onCheckedChange={(checked) => setValue("active", checked)}
            />
            <Label htmlFor="active">Hoạt động</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceTemplateFormDialog;
