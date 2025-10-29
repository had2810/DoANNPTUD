import Navbar from "@/components/layout/user/Navbar";
import Footer from "@/components/layout/user/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  ShieldCheck,
  Gem,
  Wrench,
  BadgeCheck,
  Building2,
  Handshake,
  Rocket,
  Star,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import aboutUs from "@/assets/images/aboutus-banner.png";
const coreValues = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-purple-500" />,
    title: "Chất lượng",
    color: "bg-purple-50",
    desc: "Cam kết dịch vụ sửa chữa chất lượng cao với linh kiện chính hãng và bảo hành dài hạn.",
  },
  {
    icon: <Award className="w-8 h-8 text-yellow-500" />,
    title: "Uy tín",
    color: "bg-yellow-50",
    desc: "Luôn giữ chữ tín với khách hàng, minh bạch trong báo giá và quá trình sửa chữa.",
  },
  {
    icon: <Gem className="w-8 h-8 text-blue-500" />,
    title: "Chuyên nghiệp",
    color: "bg-blue-50",
    desc: "Đội ngũ nhân viên đào tạo chuyên sâu, tác phong chuyên nghiệp và tận tâm với công việc.",
  },
];

const strengths = [
  {
    icon: <Users className="w-6 h-6 text-purple-500" />,
    title: "Kỹ thuật viên giàu kinh nghiệm",
    desc: "Đội ngũ kỹ thuật viên trên 10 năm kinh nghiệm, đào tạo chuyên sâu.",
  },
  {
    icon: <Wrench className="w-6 h-6 text-blue-500" />,
    title: "Trang thiết bị hiện đại",
    desc: "Sử dụng máy móc, thiết bị hiện đại phục vụ sửa chữa nhanh chóng, chính xác.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-green-500" />,
    title: "Linh kiện chính hãng",
    desc: "Cam kết linh kiện chính hãng, nguồn gốc rõ ràng, chất lượng tốt nhất.",
  },
  {
    icon: <Handshake className="w-6 h-6 text-yellow-500" />,
    title: "Bảo hành dài hạn",
    desc: "Chính sách bảo hành dài hạn cho mọi dịch vụ, an tâm tuyệt đối.",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Header Section */}
      <header className="w-full bg-gradient-to-br from-techmate-purple to-purple-400 py-20 text-white relative overflow-hidden rounded-bl-[80px] rounded-br-[80px] mb-12">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Về TechMate
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 opacity-90">
            Đơn vị hàng đầu trong lĩnh vực sửa chữa thiết bị điện tử, tận tâm
            phục vụ khách hàng suốt hơn 10 năm.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="bg-white/20 px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm">
              Hơn 50 kỹ thuật viên
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm">
              10000+ khách hàng hài lòng
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm">
              Bảo hành dài hạn
            </span>
          </div>
        </div>
        <Rocket className="absolute right-10 bottom-0 w-32 h-32 text-white/10 rotate-12 hidden md:block" />
        <Star className="absolute left-10 top-10 w-16 h-16 text-white/10 animate-spin-slow hidden md:block" />
      </header>

      {/* Story & Mission */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex justify-center">
            <img
              src={aboutUs}
              alt="Về chúng tôi"
              className="rounded-2xl shadow-xl max-w-xl w-full border-4 border-white"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-techmate-purple" /> Câu chuyện
              TechMate
            </h2>
            <p className="text-gray-600 mb-4 text-lg">
              TechMate là đơn vị hàng đầu trong lĩnh vực sửa chữa thiết bị điện
              tử với hơn 10 năm kinh nghiệm. Được thành lập năm 2013, từ một cửa
              hàng nhỏ, chúng tôi đã phát triển thành trung tâm lớn với hơn 50
              kỹ thuật viên chuyên nghiệp.
            </p>
            <p className="text-gray-600 mb-4 text-lg">
              Chúng tôi tự hào mang đến dịch vụ chất lượng cao, giá hợp lý, luôn
              đặt sự hài lòng của khách hàng lên hàng đầu.
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mt-6">
              <h3 className="text-xl font-semibold mb-2 text-techmate-purple flex items-center gap-2">
                <Gem className="w-6 h-6" /> Sứ mệnh
              </h3>
              <p className="text-gray-700">
                Cung cấp dịch vụ sửa chữa thiết bị điện tử chất lượng cao, không
                ngừng đổi mới, nâng cao trải nghiệm khách hàng và đóng góp tích
                cực cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-7 h-7 text-techmate-purple" />
          <h2 className="text-3xl font-extrabold text-techmate-purple">
            Giá trị cốt lõi
          </h2>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-techmate-purple to-purple-400 mx-auto mb-8 rounded-full"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((v, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 ${v.color} transition-transform duration-200 hover:scale-105`}
            >
              {v.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
                {v.title}
              </h3>
              <p className="text-gray-600 text-base">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-7 h-7 text-yellow-400" />
          <h2 className="text-3xl font-extrabold text-techmate-purple">
            Điểm mạnh của chúng tôi
          </h2>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-techmate-purple mx-auto mb-8 rounded-full"></div>
        <div className="grid md:grid-cols-2 gap-8">
          {strengths.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100 transition-transform duration-200 hover:scale-105"
            >
              <div className="flex-shrink-0">{s.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-base">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-techmate-purple to-purple-400 text-white py-16 rounded-t-3xl shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <PhoneCall className="w-8 h-8" /> Bạn cần sửa chữa thiết bị?
          </h2>
          <p className="mb-8 text-lg">
            Đặt lịch ngay hôm nay để nhận ưu đãi đặc biệt!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-techmate-purple hover:bg-gray-100 font-bold shadow-lg px-10"
          >
            <Link to="/schedule">Đặt lịch ngay</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
