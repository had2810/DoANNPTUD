import { useState, useEffect } from "react";
import { Rocket, RefreshCcw } from "lucide-react";
import Progress from "@/components/ui/progress";

const UpdatingView = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4 animate-fade-in">
      <div className="max-w-2xl w-full mx-auto text-center space-y-8">
        {/* Icon Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <Rocket className="w-24 h-24 text-purple-500 animate-bounce" />
            <RefreshCcw className="w-12 h-12 text-blue-500 absolute -top-2 -right-2 animate-spin-slow" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 animate-scale-in pb-3">
            Tính Năng Sắp Ra Mắt!
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
            Chúng tôi đang nỗ lực phát triển tính năng mới để mang đến trải
            nghiệm tốt nhất cho bạn.
          </p>

          {/* Feature Status with Progress */}
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl transition-all duration-300 max-w-lg mx-auto space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">
              Trạng Thái Phát Triển
            </h2>

            <Progress
              value={progress}
              className="h-3 w-full rounded-full shadow-inner"
            />

            <div className="flex items-center justify-center gap-2 text-blue-600 mt-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium">Đang Cập Nhật... {progress}%</span>
            </div>
          </div>

          <p className="text-gray-500 mt-8 animate-pulse text-sm">
            Hãy quay lại sau để khám phá những tính năng mới nhất của chúng tôi!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatingView;
