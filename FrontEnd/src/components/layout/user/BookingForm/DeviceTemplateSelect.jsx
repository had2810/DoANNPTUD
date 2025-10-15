import React, { useMemo } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import deviceTemplateService from "@/services/deviceTemplateService";
import useEntityList from "@/hooks/useEntityList";
import { Smartphone, Laptop, Tablet } from "lucide-react";

const DeviceTemplateSelect = ({ control, selectedDeviceType }) => {
  const { data: deviceTemplates = [], isLoading } = useEntityList(
    "deviceTemplates",
    deviceTemplateService.getAllDeviceTemplates
  );

  const filteredTemplates = useMemo(() => {
    if (!selectedDeviceType) return [];
    return deviceTemplates.filter(
      (device) => device.type === selectedDeviceType
    );
  }, [deviceTemplates, selectedDeviceType]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="w-5 h-5" />;
      case "laptop":
        return <Laptop className="w-5 h-5" />;
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <FormField
      control={control}
      name="deviceTemplateId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">
            Chi tiết thiết bị
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading || !selectedDeviceType}
            >
              <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg p-3">
                <SelectValue
                  placeholder={
                    selectedDeviceType
                      ? "Chọn chi tiết thiết bị của bạn"
                      : "Vui lòng chọn loại thiết bị trước"
                  }
                  className="text-gray-500"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {filteredTemplates.map((device) => (
                  <SelectItem
                    key={device._id}
                    value={device._id}
                    className="p-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer
                      data-[state=checked]:bg-techmate-purple/10 
                      data-[state=checked]:font-semibold 
                      data-[state=checked]:text-techmate-purple 
                      data-[state=checked]:before:content-none 
                      data-[state=checked]:before:hidden"
                  >
                    <div className="flex items-center gap-3 w-full pl-4">
                      <span className="text-gray-500">
                        {getDeviceIcon(device.type)}
                      </span>
                      <span className="text-sm font-medium">{device.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DeviceTemplateSelect;
