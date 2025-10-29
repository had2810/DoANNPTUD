import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import ServiceCard from "@/components/layout/user/ServiceCard";
import ServiceCategory from "@/components/layout/user/ServiceCategory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RepairStep from "@/components/layout/user/RepairStep";
import { Button } from "@/components/ui/button";
import serviceService from "@/services/serviceService";
import { Info, Wrench, Rocket, Star, HelpCircle } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Group services by device type
  const groupedServices = services.reduce((acc, service) => {
    const type = service.deviceTemplateId.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {});

  const faqItems = [
    {
      question: "Thời gian sửa chữa thiết bị mất bao lâu?",
      answer:
        "Thời gian sửa chữa phụ thuộc vào tình trạng thiết bị và loại dịch vụ. Thông thường từ 1-3 giờ với các sửa chữa đơn giản, và 1-3 ngày với các sửa chữa phức tạp.",
    },
    {
      question: "Các thiết bị sau khi sửa chữa có được bảo hành không?",
      answer:
        "Có, tất cả các dịch vụ sửa chữa của chúng tôi đều được bảo hành từ 6-12 tháng tùy theo loại dịch vụ.",
    },
    {
      question: "Tôi có thể theo dõi tiến độ sửa chữa thiết bị của mình không?",
      answer:
        "Có, bạn có thể theo dõi tiến độ sửa chữa thông qua tài khoản của mình trên website hoặc liên hệ trực tiếp với chúng tôi.",
    },
    {
      question: "Nếu thiết bị không thể sửa chữa được thì sao?",
      answer:
        "Trong trường hợp thiết bị không thể sửa chữa được, chúng tôi sẽ tư vấn cho bạn các giải pháp thay thế và không tính phí kiểm tra.",
    },
  ];

  const repairSteps = [
    {
      number: 1,
      title: "Tiếp nhận và kiểm tra",
      description:
        "Kỹ thuật viên tiếp nhận thiết bị và tiến hành kiểm tra, chẩn đoán lỗi ban đầu để xác định nguyên nhân.",
    },
    {
      number: 2,
      title: "Báo giá và tư vấn",
      description:
        "Sau khi xác định lỗi, chúng tôi sẽ báo giá chi tiết và tư vấn phương án sửa chữa tối ưu nhất cho khách hàng.",
    },
    {
      number: 3,
      title: "Tiến hành sửa chữa",
      description:
        "Sau khi khách hàng đồng ý, kỹ thuật viên sẽ tiến hành sửa chữa, thay thế linh kiện theo quy trình chuyên nghiệp.",
    },
    {
      number: 4,
      title: "Kiểm tra chất lượng",
      description:
        "Sau khi sửa chữa, thiết bị sẽ được kiểm tra kỹ lưỡng để đảm bảo hoạt động tốt và đáp ứng yêu cầu của khách hàng.",
    },
    {
      number: 5,
      title: "Bàn giao và hướng dẫn",
      description:
        "Bàn giao thiết bị cho khách hàng, hướng dẫn sử dụng và cung cấp thông tin bảo hành, bảo dưỡng.",
    },
    {
      number: 6,
      title: "Hỗ trợ sau bán hàng",
      description:
        "Chúng tôi luôn sẵn sàng hỗ trợ khách hàng sau khi sửa chữa với dịch vụ bảo hành và tư vấn kỹ thuật.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <header className="w-full bg-gradient-to-br from-techmate-purple to-purple-400 rounded-bl-[80px] rounded-br-[80px] py-20 text-white mb-8 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wrench className="w-10 h-10 text-white drop-shadow" />
            <h1 className="text-5xl font-extrabold drop-shadow">
              Dịch vụ của chúng tôi
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            TechMate cung cấp các dịch vụ sửa chữa chất lượng cao với đội ngũ kỹ
            thuật viên chuyên nghiệp
          </p>
        </div>
        <Rocket className="absolute right-10 bottom-0 w-32 h-32 text-white/10 rotate-12 hidden md:block" />
        <Star className="absolute left-10 top-10 w-16 h-16 text-white/10 animate-spin-slow hidden md:block" />
      </header>
      <div className="container mx-auto px-4 py-12">
        {/* Services by Device Type */}
        {Object.entries(groupedServices).map(([type, typeServices]) => (
          <ServiceCategory key={type} title={`Sửa chữa ${type.toLowerCase()}`}>
            {typeServices.map((service) => (
              <ServiceCard
                key={service._id}
                title={service.serviceName}
                description={service.description}
                price={`Từ ${service.price.toLocaleString("vi-VN")} VND`}
                features={[
                  `Thời gian ước tính: ${service.estimatedDuration} phút`,
                  `Loại dịch vụ: ${service.serviceType}`,
                  `Thiết bị: ${service.deviceTemplateId.name}`,
                  `Trạng thái: ${service.status}`,
                ]}
              />
            ))}
          </ServiceCategory>
        ))}

        {/* Repair Process */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Wrench className="w-7 h-7 text-techmate-purple" />
            <h2 className="text-3xl font-extrabold text-techmate-purple text-center">
              Quy trình sửa chữa
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {repairSteps.map((step) => (
              <RepairStep
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="w-7 h-7 text-techmate-purple" />
            <h2 className="text-3xl font-extrabold text-techmate-purple text-center">
              Câu hỏi thường gặp
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => {
                // Color palette for left border and hover
                const borderColors = [
                  "border-l-purple-400",
                  "border-l-blue-400",
                  "border-l-pink-400",
                  "border-l-green-400",
                  "border-l-yellow-400",
                  "border-l-cyan-400",
                ];
                const bgHoverColors = [
                  "hover:bg-purple-50",
                  "hover:bg-blue-50",
                  "hover:bg-pink-50",
                  "hover:bg-green-50",
                  "hover:bg-yellow-50",
                  "hover:bg-cyan-50",
                ];
                const borderColor = borderColors[index % borderColors.length];
                const bgHover = bgHoverColors[index % bgHoverColors.length];
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className={`bg-white rounded-xl shadow mb-4 border border-gray-100 overflow-hidden transition-transform duration-200 hover:scale-[1.025] hover:shadow-lg border-l-4 ${borderColor}`}
                  >
                    <AccordionTrigger
                      className={`text-lg font-semibold px-6 py-4 transition-colors flex items-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${borderColor.replace(
                        "border-l-",
                        ""
                      )} ${bgHover} no-underline`}
                      style={{ textDecoration: "none" }}
                    >
                      <span>{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50 px-6 pb-6 pt-5 text-gray-700 animate-fade-slide-down flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>{item.answer}</span>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
