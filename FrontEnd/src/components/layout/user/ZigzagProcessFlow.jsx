import { FileText, Clock, Wrench, CheckCircle, Package } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Tiếp nhận",
    description: "Tiếp nhận thiết bị và chẩn đoán sơ bộ.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-pink-500 to-pink-300",
  },
  {
    id: 2,
    title: "Báo giá",
    description: "Đề xuất phương án sửa chữa tối ưu.",
    icon: <Clock className="w-6 h-6" />,
    color: "from-orange-500 to-orange-300",
  },
  {
    id: 3,
    title: "Sửa chữa",
    description: "Thay linh kiện và xử lý lỗi theo quy trình.",
    icon: <Wrench className="w-6 h-6" />,
    color: "from-yellow-500 to-yellow-300",
  },
  {
    id: 4,
    title: "Kiểm tra",
    description: "Đảm bảo thiết bị hoạt động ổn định.",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "from-cyan-500 to-cyan-300",
  },
  {
    id: 5,
    title: "Bàn giao",
    description: "Giao thiết bị, hướng dẫn và bảo hành.",
    icon: <Package className="w-6 h-6" />,
    color: "from-indigo-500 to-indigo-300",
  },
];

export default function ZigzagProcessFlow() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wrench className="w-5 h-5 text-techmate-purple/60" />
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4">
            Quy trình hoạt động
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative mt-10 py-10">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex flex-col items-center text-center p-6 rounded-xl shadow-md bg-gradient-to-br ${
                step.color
              } text-white z-10 ${
                index % 2 === 1 ? "md:translate-y-16" : "md:translate-y-0"
              }`}
            >
              <div className="bg-white text-black rounded-full p-3 mb-3">
                {step.icon}
              </div>
              <div className="text-xl font-bold mb-1">{step.title}</div>
              <div className="text-sm opacity-90 max-w-[12rem]">
                {step.description}
              </div>
            </div>
          ))}

          {/* Line connector */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0 hidden md:block"></div>
        </div>
      </div>
    </section>
  );
}
