import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import ServiceCard from "@/components/layout/user/ServiceCard";
import TestimonialCard from "@/components/layout/user/TestimonialCard";
import {
  CheckCircle,
  Smartphone,
  Laptop,
  Tv,
  FileText,
  Clock,
  Wrench,
  Package,
  Users,
  Star,
  HelpCircle,
} from "lucide-react";
import ZigzagProcessFlow from "@/components/layout/user/ZigzagProcessFlow";
import laptopRepair from "@/assets/images/laptop-repair.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-techmate-purple to-techmate-purpleLight text-white py-20 rounded-b-[50px]">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 px-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Dịch vụ sửa chữa điện tử chuyên nghiệp
            </h1>
            <p className="text-lg mb-8">
              Chúng tôi cung cấp dịch vụ sửa chữa nhanh chóng, uy tín với đội
              ngũ kỹ thuật viên giàu kinh nghiệm và trang thiết bị hiện đại.
            </p>
            <div className="flex space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-techmate-purple hover:bg-gray-100"
              >
                <Link to="/user/booking">Đặt lịch ngay</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 border-white  hover:text-techmate-purple  "
              >
                <Link to="/user/services">Xem dịch vụ</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={laptopRepair}
              alt="Laptop sửa chữa"
              className="max-w-full rounded-lg shadow-2xl hover:scale-[1.02] transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-techmate-purple/60" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4">
              Dịch vụ của chúng tôi
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Smartphone />}
              title="Sửa chữa & thay thế linh kiện điện thoại"
              description="Dịch vụ sửa chữa, thay màn hình, pin, camera, loa, cổng sạc... cho các dòng điện thoại iPhone, Samsung, Oppo, Xiaomi. Cam kết linh kiện chính hãng, bảo hành dài hạn, lấy ngay trong ngày."
              features={[
                "Kiểm tra & tư vấn miễn phí",
                "Linh kiện chính hãng 100%",
                "Bảo hành 6-12 tháng",
                "Sửa chữa lấy ngay",
                "Giá giao động: 300.000đ – 3.000.000đ",
              ]}
              link="/services/phone"
            />
            <ServiceCard
              icon={<Laptop />}
              title="Sửa chữa & nâng cấp laptop chuyên sâu"
              description="Sửa mainboard, thay màn hình, nâng cấp RAM, SSD, vệ sinh, cài lại Windows, khắc phục lỗi phần mềm, phần cứng. Đội ngũ kỹ thuật viên giàu kinh nghiệm, thiết bị hiện đại, bảo hành uy tín."
              features={[
                "Kiểm tra miễn phí, báo giá nhanh",
                "Nâng cấp linh kiện theo yêu cầu",
                "Vệ sinh, bảo dưỡng định kỳ",
                "Bảo hành 3-12 tháng",
                "Giá giao động: 400.000đ – 5.000.000đ",
              ]}
              link="/services/laptop"
            />
            <ServiceCard
              icon={<Tv />}
              title="Sửa chữa & nâng cấp PC - Máy tính để bàn"
              description="Dịch vụ sửa chữa, nâng cấp PC: thay main, nguồn, RAM, SSD, card đồ họa, vệ sinh, cài đặt phần mềm, lắp ráp máy mới. Đội ngũ kỹ thuật viên chuyên sâu, linh kiện chính hãng, bảo hành uy tín."
              features={[
                "Kiểm tra miễn phí, tư vấn cấu hình",
                "Nâng cấp, thay thế linh kiện theo yêu cầu",
                "Vệ sinh, bảo dưỡng định kỳ",
                "Bảo hành 3-12 tháng",
                "Giá giao động: 300.000đ – 7.000.000đ",
              ]}
              link="/services/computer"
            />
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <ZigzagProcessFlow />

      {/* About Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-blue-400/70" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4">
              Về chúng tôi
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300">
              <img
                src={laptopRepair}
                alt="Về chúng tôi"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <p className="mb-6 text-gray-700">
                TechFix là đơn vị hàng đầu trong lĩnh vực sửa chữa thiết bị điện
                tử với hơn 10 năm kinh nghiệm. Chúng tôi tự hào mang đến dịch vụ
                chất lượng cao với giá cả hợp lý.
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="text-techmate-purple mr-2" />
                  <span>Đội ngũ kỹ thuật viên giàu kinh nghiệm</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-techmate-purple mr-2" />
                  <span>Trang thiết bị hiện đại</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-techmate-purple mr-2" />
                  <span>Linh kiện chính hãng 100%</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-techmate-purple mr-2" />
                  <span>Bảo hành dài hạn</span>
                </div>
              </div>

              <Button
                asChild
                className="mt-6 bg-techmate-purple hover:bg-techmate-purpleLight"
              >
                <Link to="/about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400/80" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Nguyễn Văn A"
              role="Khách hàng"
              image={laptopRepair}
              stars={5}
              testimonial="Dịch vụ rất tốt, nhân viên nhiệt tình, sửa chữa nhanh chóng và chất lượng. Tôi rất hài lòng và sẽ quay lại lần sau."
            />
            <TestimonialCard
              name="Trần Thị B"
              role="Khách hàng"
              image={laptopRepair}
              stars={4.5}
              testimonial="Laptop của tôi được sửa chữa rất nhanh chóng và chuyên nghiệp. Giá cả hợp lý và dịch vụ rất tốt."
            />
            <TestimonialCard
              name="Lê Văn C"
              role="Khách hàng"
              image={laptopRepair}
              stars={5}
              testimonial="Đội ngũ kỹ thuật viên rất chuyên nghiệp và tn tâm. Họ đã giải thích rõ ràng vấn đề và cách khắc phục. Tôi rất hài lòng."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-techmate-purple text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bạn cần sửa chữa thiết bị?
          </h2>
          <p className="mb-8">Đặt lịch ngay hôm nay để nhận ưu đãi đặc biệt!</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-techmate-purple hover:bg-gray-100"
          >
            <Link to="/schedule">Đặt lịch ngay</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
