import React from "react";
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
import { useMemo } from "react";
import serviceService from "@/services/serviceService";
import useEntityList from "@/hooks/useEntityList";

const IssueSelector = ({ control, deviceType, setValue }) => {
  const {
    data: services = [],
    isLoading,
    error,
  } = useEntityList("services", serviceService.getAllServices);

  const filteredServices = useMemo(() => {
    if (!deviceType) return [];

    return services.filter(
      (service) => service.deviceTemplateId?.type === deviceType
    );
  }, [services, deviceType]);

  return (
    <FormField
      control={control}
      name="issueType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">Loại vấn đề</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value); // cập nhật issueType
                const selected = services.find((s) => s._id === value);
                setValue("estimatedCost", selected?.price || 0); // cập nhật estimatedCost
              }}
              defaultValue={field.value}
              disabled={
                !deviceType || isLoading || filteredServices.length === 0
              }
            >
              <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg p-3">
                <SelectValue
                  placeholder="Chọn vấn đề với thiết bị của bạn"
                  className="text-gray-500"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {filteredServices.map((service) => (
                  <SelectItem
                    key={service._id}
                    value={service._id}
                    className="p-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer
                    data-[state=checked]:bg-techmate-purple/10 
                    data-[state=checked]:font-semibold 
                    data-[state=checked]:text-techmate-purple 
                    data-[state=checked]:before:content-none 
                    data-[state=checked]:before:hidden
                  "
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium pl-4">
                        {service.serviceName}
                      </span>
                      <span className="text-xs text-gray-500 pl-3">
                        {`(${service.price.toLocaleString()}₫)`}
                      </span>
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

export default IssueSelector;
