import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Thay màn hình điện thoại",
    description: "Thay thế màn hình điện thoại bị hư hỏng, nứt vỡ, đốm màu",
    price: "800.000đ - 5.000.000đ",
    estimatedTime: "1-2 giờ",
    category: "Thay thế linh kiện",
    deviceType: "Điện thoại",
  },
  {
    id: 2,
    name: "Sửa mainboard laptop",
    description: "Sửa chữa, thay thế các linh kiện trên mainboard laptop",
    price: "500.000đ - 3.000.000đ",
    estimatedTime: "2-3 ngày",
    category: "Sửa chữa",
    deviceType: "Laptop",
  },
  {
    id: 3,
    name: "Vệ sinh máy tính",
    description: "Vệ sinh máy tính, thay keo tản nhiệt, bảo dưỡng định kỳ",
    price: "200.000đ - 500.000đ",
    estimatedTime: "2-3 giờ",
    category: "Bảo trì",
    deviceType: "Máy tính",
  },
  {
    id: 4,
    name: "Cài đặt phần mềm",
    description: "Cài đặt hệ điều hành, phần mềm ứng dụng, driver thiết bị",
    price: "200.000đ - 800.000đ",
    estimatedTime: "2-4 giờ",
    category: "Phần mềm",
    deviceType: "Laptop",
  },
  {
    id: 5,
    name: "Thay pin điện thoại",
    description: "Thay pin điện thoại các loại, đảm bảo chính hãng",
    price: "300.000đ - 1.500.000đ",
    estimatedTime: "30 phút",
    category: "Thay thế linh kiện",
    deviceType: "Điện thoại",
  },
  {
    id: 6,
    name: "Sửa tivi",
    description: "Sửa chữa tivi các loại, thay thế linh kiện chính hãng",
    price: "500.000đ - 3.000.000đ",
    estimatedTime: "1-3 ngày",
    category: "Sửa chữa",
    deviceType: "Thiết bị điện tử",
  },
];

const deviceTypes = [
  "Tất cả",
  "Điện thoại",
  "Laptop",
  "Máy tính",
  "Thiết bị điện tử",
];
const categories = [
  "Tất cả",
  "Thay thế linh kiện",
  "Sửa chữa",
  "Bảo trì",
  "Phần mềm",
];

const ServicesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice =
      selectedDevice === "Tất cả" || service.deviceType === selectedDevice;
    const matchesCategory =
      selectedCategory === "Tất cả" || service.category === selectedCategory;

    return matchesSearch && matchesDevice && matchesCategory;
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
          <SelectTrigger>
            <SelectValue placeholder="Loại thiết bị" />
          </SelectTrigger>
          <SelectContent>
            {deviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Loại dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl">{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-techmate-purple" />
                  <span>Giá: {service.price}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-techmate-purple" />
                  <span>Thời gian: {service.estimatedTime}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-techmate-purple/10 text-techmate-purple rounded text-sm">
                    {service.deviceType}
                  </span>
                  <span className="px-2 py-1 bg-techmate-purple/10 text-techmate-purple rounded text-sm">
                    {service.category}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
