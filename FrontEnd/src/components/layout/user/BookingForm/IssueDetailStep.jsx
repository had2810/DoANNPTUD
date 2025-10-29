import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import CustomImageUploader from "@/components/images/CustomImageUploader";

const IssueDetailStep = ({ control }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Thiết bị của bạn gặp vấn đề gì?
        </h2>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 text-sm text-purple-600 flex items-center gap-2 bg-purple-50 p-4 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Càng nhiều thông tin chi tiết, chúng tôi càng có thể chuẩn bị tốt
            hơn cho việc sửa chữa. Hãy mô tả các triệu chứng, thời điểm bắt đầu
            gặp vấn đề và các thông báo lỗi nếu có.
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-2">
          Tải ảnh lên (không bắt buộc)
        </h3>
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tải ảnh lên (không bắt buộc)</FormLabel>
              <CustomImageUploader
                variant="fancy"
                value={field.value || []}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default IssueDetailStep;
