import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">TechMate</h2>
            <p className="text-sm">
              Chúng tôi cung cấp dịch vụ sửa chữa thiết bị điện tử chuyên nghiệp
              với chất lượng cao và giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <Link
                to="https://github.com/MT-KS-04"
                className="bg-gray-700 p-2 rounded-full hover:bg-techmate-purple transition-colors"
              >
                <Facebook size={18} />
              </Link>
              <Link
                to="https://github.com/MT-KS-04"
                className="bg-gray-700 p-2 rounded-full hover:bg-techmate-purple transition-colors"
              >
                <Twitter size={18} />
              </Link>
              <Link
                to="https://github.com/MT-KS-04"
                className="bg-gray-700 p-2 rounded-full hover:bg-techmate-purple transition-colors"
              >
                <Instagram size={18} />
              </Link>
              <Link
                to="https://github.com/MT-KS-04"
                className="bg-gray-700 p-2 rounded-full hover:bg-techmate-purple transition-colors"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-techmate-purple">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-techmate-purple">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-techmate-purple">
                  Đặt lịch
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-techmate-purple">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services/phone"
                  className="hover:text-techmate-purple"
                >
                  Sửa chữa điện thoại
                </Link>
              </li>
              <li>
                <Link
                  to="/services/laptop"
                  className="hover:text-techmate-purple"
                >
                  Sửa chữa laptop
                </Link>
              </li>
              <li>
                <Link
                  to="/services/computer"
                  className="hover:text-techmate-purple"
                >
                  Sửa chữa máy tính
                </Link>
              </li>
              <li>
                <Link
                  to="/services/electronics"
                  className="hover:text-techmate-purple"
                >
                  Sửa chữa thiết bị điện tử
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin size={16} /> 123 Đường ABC, Quận XYZ, TP.HCM
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> 0123 456 789
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@techmate.com
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} /> 8:00 - 20:00, Thứ 2 - Chủ nhật
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>© 2025 TechMate. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
