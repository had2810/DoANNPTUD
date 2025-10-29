import { useRef, useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_API;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function CustomImageUploader({
  value, // nếu có thì controlled
  onChange,
  onUploadComplete, // nếu không dùng form, vẫn dùng được
  resetTrigger,
  variant = "simple",
}) {
  const [previews, setPreviews] = useState(value || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Khi controlled: sync internal previews với value từ cha
  useEffect(() => {
    if (value) {
      setPreviews(value);
    }
  }, [value]);

  useEffect(() => {
    if (resetTrigger) {
      setPreviews([]);
      onChange?.([]);
      onUploadComplete?.([]);
    }
  }, [resetTrigger]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (e) => {
    let files = Array.from(e.target.files);
    const current = value ?? previews;

    if (files.length + current.length > 5) {
      toast({
        title: "Giới hạn số lượng ảnh",
        description: "Chỉ được chọn tối đa 5 ảnh.",
        variant: "warning",
      });
      files = files.slice(0, 5 - current.length);
    }

    if (files.length === 0) return;

    setIsUploading(true);
    const newUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(`${CLOUDINARY_URL}/${CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        newUrls.push(data.secure_url);
      }

      toast({
        title: "Thành công",
        description: `Tải lên ${newUrls.length} ảnh thành công.`,
        variant: "default",
      });

      const updated = [...current, ...newUrls];

      if (value && onChange) {
        onChange(updated); // controlled
      } else {
        setPreviews(updated); // uncontrolled
        onUploadComplete?.(updated); // notify old style
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Tải ảnh thất bại. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index) => {
    const current = value ?? previews;
    const updated = current.filter((_, i) => i !== index);

    if (value && onChange) {
      onChange(updated);
    } else {
      setPreviews(updated);
      onUploadComplete?.(updated);
    }
  };

  const imagesToRender = value ?? previews;

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        hidden
        multiple
        ref={fileInputRef}
        onChange={handleFiles}
      />

      {variant === "fancy" ? (
        <div
          className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 cursor-pointer transition"
          onClick={handleUploadClick}
        >
          <UploadCloud className="mx-auto text-purple-400 mb-2 w-6 h-6" />
          <p className="text-sm text-gray-600">
            Kéo và thả ảnh vào đây, hoặc nhấn để chọn
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Hỗ trợ: JPG, PNG, GIF (tối đa 5MB và tối đa 5 ảnh)
          </p>
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleUploadClick}
          className="mb-4 flex gap-2 items-center"
          disabled={isUploading}
          variant={isUploading ? "outline" : "default"}
        >
          <UploadCloud
            className={`w-4 h-4 ${isUploading ? "animate-bounce" : ""}`}
          />
          {isUploading ? "Đang tải..." : "Tải ảnh lên"}
        </Button>
      )}

      {isUploading && (
        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2 mt-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Đang tải ảnh lên, vui lòng chờ...</span>
        </div>
      )}

      <div className="flex gap-3 flex-wrap mt-4">
        {imagesToRender.map((url, idx) => (
          <div key={idx} className="relative w-16 h-16">
            <img
              src={url}
              alt={`Preview ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute -top-2 -right-2 bg-white border border-gray-300 text-gray-600 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
              type="button"
              title="Xóa ảnh"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
