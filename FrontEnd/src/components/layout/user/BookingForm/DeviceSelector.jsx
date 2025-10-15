import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Smartphone,
  Laptop,
  Tablet,
  Settings,
  CheckCircle2,
} from "lucide-react";

import deviceTemplateService from "@/services/deviceTemplateService";
import useEntityList from "@/hooks/useEntityList";

// Hiển thị thông tin cho từng loại
export const deviceTypes = [
  {
    id: "Phone",
    name: "Điện thoại",
    description: "Sửa các loại điện thoại di động",
    icon: Smartphone,
  },
  {
    id: "Laptop",
    name: "Máy tính",
    description: "Sửa máy tính xách tay và PC",
    icon: Laptop,
  },
  {
    id: "Tablet",
    name: "Máy tính bảng",
    description: "Sửa các loại máy tính bảng",
    icon: Tablet,
  },
  {
    id: "Software",
    name: "Phần mềm",
    description: "Xử lý lỗi phần mềm và phục hồi dữ liệu",
    icon: Settings,
  },
];

const DeviceSelector = ({ control }) => {
  const {
    data: deviceTemplates = [],
    isLoading,
    error,
  } = useEntityList(
    "deviceTemplates",
    deviceTemplateService.getAllDeviceTemplates
  );

  // Lọc các loại duy nhất và nằm trong typeDisplayMap
  const uniqueTypes = Array.from(
    new Set(
      deviceTemplates
        .map((d) => d.type)
        .filter((type) => deviceTypes.find((device) => device.id === type))
    )
  );

  if (isLoading) return <p>Đang tải thiết bị...</p>;
  if (error) return <p>Lỗi khi tải thiết bị.</p>;
  if (uniqueTypes.length === 0) return <p>Không có loại thiết bị phù hợp.</p>;

  return (
    <FormField
      control={control}
      name="deviceType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-lg font-semibold">
            Chọn loại thiết bị
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {uniqueTypes.map((type) => {
                const deviceInfo = deviceTypes.find(
                  (device) => device.id === type
                );
                const { name, description, icon: Icon } = deviceInfo;
                const isSelected = field.value === type;

                return (
                  <div key={type} className="group">
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className="peer hidden"
                    />
                    <Label
                      htmlFor={type}
                      className={`relative flex flex-col items-center justify-between rounded-md border-2 bg-white p-4 cursor-pointer 
                        transition-all duration-300 ease-in-out
                        ${
                          isSelected
                            ? "border-techmate-purple bg-techmate-purple/10 shadow-lg scale-105"
                            : "border-muted hover:border-techmate-purple hover:bg-techmate-purple/5 hover:shadow-md hover:scale-[1.02]"
                        }
                      `}
                    >
                      <span
                        className={`absolute top-2 right-2 transition-all duration-300 ${
                          isSelected
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6 text-techmate-purple" />
                      </span>
                      <div
                        className={`mb-3 rounded-full p-3 transition-all duration-300 ${
                          isSelected
                            ? "bg-techmate-purple"
                            : "bg-techmate-purple/10 group-hover:bg-techmate-purple/20"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 transition-all duration-300 ${
                            isSelected
                              ? "text-white"
                              : "text-techmate-purple group-hover:scale-110"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-base font-medium leading-none mb-2 transition-all duration-300 ${
                            isSelected ? "text-techmate-purple font-bold" : ""
                          }`}
                        >
                          {name}
                        </p>
                        <p
                          className={`text-sm text-gray-500 transition-colors duration-300 ${
                            isSelected ? "text-techmate-purple/70" : ""
                          }`}
                        >
                          {description}
                        </p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DeviceSelector;
