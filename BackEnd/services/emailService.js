// src/services/emailService.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure transporter using env vars.
// For Gmail: host smtp.gmail.com, port 465 (secure=true) or 587 (secure=false).
// NOTE: Google blocks plain password login for regular accounts. Use an
// App Password (recommended) or OAuth2. See README notes below.
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const secure = typeof process.env.SMTP_SECURE !== "undefined"
  ? process.env.SMTP_SECURE === "true"
  : port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Common styles for all emails
const commonStyles = {
  container: `max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e0e0e0;padding:40px 24px;font-family:'Inter','Segoe UI',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.05);color:#333333`,
  logo: `text-align:center;margin-bottom:32px`,
  logoWrapper: `display:inline-block;padding:12px 24px;border-radius:12px;background-color:#f9f7ff`,
  logoText: `font-size:32px;font-weight:800;color:#8f5cf7`,
  heading: `color:#333333;margin-bottom:16px;font-size:24px;text-align:center`,
  text: `color:#555555;font-size:16px;line-height:1.6;margin-bottom:16px`,
  button: `display:inline-block;padding:12px 28px;background-color:#8f5cf7;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 6px rgba(143,92,247,0.2)`,
  footer: `margin-top:40px;padding-top:20px;border-top:1px solid #eaeaea;font-size:13px;color:#888888;text-align:center`,
};

// Template email HTML với thiết kế hiện đại
const templates = {
  registration: (name) => ({
    subject:
      "🎉 Chào mừng bạn đến với TechMate – Đặt lịch sửa chữa dễ dàng hơn bao giờ hết!",
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/6195/6195700.png" alt="Welcome" style="width:120px;height:120px">
        </div>

        <h2 style="${commonStyles.heading}">Xin chào ${name}!</h2>

        <p style="${commonStyles.text}">
          Cảm ơn bạn đã đăng ký tài khoản tại <b>TechMate</b> – nền tảng hỗ trợ đặt lịch sửa chữa tiện lợi, nhanh chóng và đáng tin cậy.
        </p>

        <div style="background-color:#f9f7ff;border-radius:12px;padding:20px;margin-top:24px">
          <ul style="color:#555555;font-size:15px;line-height:1.5;margin:0;padding-left:24px">
            <li style="margin-bottom:8px">Đặt lịch sửa chữa dễ dàng</li>
            <li style="margin-bottom:8px">Theo dõi tiến trình sửa chữa</li>
            <li style="margin-bottom:8px">Nhận thông báo tự động</li>
            <li>Được hỗ trợ bởi đội ngũ kỹ thuật viên chuyên nghiệp</li>
          </ul>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/had2810" style="${commonStyles.button}">
            Khám phá ngay
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  // Forgot password template
  forgotPassword: (name, url) => ({
    subject: "🔐 Đặt lại mật khẩu TechMate",
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <h2 style="${commonStyles.heading}">Đặt lại mật khẩu</h2>

        <p style="${commonStyles.text}">Xin chào ${name || "Người dùng"},</p>

        <p style="${commonStyles.text}">Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn nút bên dưới để thiết lập mật khẩu mới. Liên kết chỉ có hiệu lực trong thời gian giới hạn.</p>

        <div style="text-align:center;margin:24px 0">
          <a href="${url}" style="${commonStyles.button}">Đặt lại mật khẩu</a>
        </div>

        <p style="${commonStyles.text}">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Nếu cần hỗ trợ, vui lòng liên hệ hỗ trợ.</div>
        </div>
      </div>
    `,
  }),

  scheduleRepair: (name, datetime) => ({
    subject: "🔧 TechMate đã nhận yêu cầu sửa chữa của bạn!",
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/2592/2592258.png" alt="Schedule" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đặt lịch thành công!</h2>

        <p style="${commonStyles.text}">Chào ${name},</p>

        <p style="${commonStyles.text}">
          Chúng tôi đã nhận được yêu cầu đặt lịch sửa chữa của bạn và đang chờ đội ngũ kỹ thuật viên xác nhận.
        </p>

        <div style="background-color:#f9f7ff;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#8f5cf7;margin:0 0 12px;font-size:18px">Chi tiết lịch hẹn:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Thời gian:</td>
              <td style="padding:8px 0">${datetime}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#fff0c7;color:#d97706;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Chờ xác nhận
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Xem chi tiết đơn hàng
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  orderCancelled: (name, orderId) => ({
    subject: `❌ Đơn hàng #${orderId} đã bị hủy`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png" alt="Cancelled" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đơn hàng đã bị hủy</h2>

        <p style="${commonStyles.text}">Chào ${name},</p>

        <p style="${commonStyles.text}">
          Chúng tôi thông báo rằng đơn đặt lịch sửa chữa <b style="color:#333333">#${orderId}</b> của bạn đã được hủy.
        </p>

        <div style="background-color:#fef2f2;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#ef4444;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#fecaca;color:#b91c1c;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Đã hủy
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Liên hệ hỗ trợ
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  orderConfirmed: (name, orderId) => ({
    subject: `✅ Đơn hàng #${orderId} của bạn đã được xác nhận`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Confirmed" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đơn hàng đã được xác nhận!</h2>

        <p style="${commonStyles.text}">Xin chào ${name},</p>

        <p style="${commonStyles.text}">
          Đơn đặt lịch sửa chữa của bạn đã được <b style="color:#333333">xác nhận</b> và sẽ được tiến hành theo lịch trình.
        </p>

        <div style="background-color:#f0fdf4;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#22c55e;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#dcfce7;color:#16a34a;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Đã xác nhận
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Xem chi tiết đơn hàng
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  inrepair: (name, orderId) => ({
    subject: `🔧 Đơn hàng #${orderId} đang được sửa chữa`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/1057/1057072.png" alt="In Repair" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đang tiến hành sửa chữa</h2>

        <p style="${commonStyles.text}">Xin chào ${name},</p>

        <p style="${commonStyles.text}">
          Đơn đặt lịch sửa chữa <b style="color:#333333">#${orderId}</b> của bạn hiện đang được tiến hành bởi đội ngũ kỹ thuật viên của chúng tôi.
        </p>

        <div style="background-color:#f1f5f9;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#475569;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#e2e8f0;color:#475569;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Đang sửa chữa
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Theo dõi đơn hàng
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  waitingforcustomer: (name, orderId) => ({
    subject: `⏳ Đơn hàng #${orderId} đang chờ bạn xác nhận`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/5726/5726771.png" alt="Waiting" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Cần xác nhận từ phía bạn</h2>

        <p style="${commonStyles.text}">Xin chào ${name},</p>

        <p style="${commonStyles.text}">
          Đơn đặt lịch sửa chữa <b style="color:#333333">#${orderId}</b> của bạn đang chờ xác nhận hoặc thông tin bổ sung từ phía bạn.
        </p>

        <div style="background-color:#fff7ed;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#ea580c;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#fed7aa;color:#c2410c;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Chờ phản hồi
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Phản hồi ngay
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  completed: (name, orderId) => ({
    subject: `🎉 Đơn hàng #${orderId} của bạn đã hoàn tất`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/3472/3472620.png" alt="Completed" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đơn hàng đã hoàn thành!</h2>

        <p style="${commonStyles.text}">Xin chào ${name},</p>

        <p style="${commonStyles.text}">
          Chúng tôi vui mừng thông báo rằng đơn đặt lịch sửa chữa <b style="color:#333333">#${orderId}</b> của bạn đã được hoàn thành thành công!
        </p>

        <div style="background-color:#f0fdf4;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#22c55e;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#dcfce7;color:#16a34a;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Hoàn thành
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color:#f9f7ff;border-radius:12px;padding:20px;margin-top:32px;text-align:center">
          <p style="color:#555555;font-size:16px;margin-bottom:16px">Hãy để lại đánh giá về trải nghiệm của bạn!</p>
          <div>
            <a href="#" style="text-decoration:none;margin:0 4px;font-size:24px">⭐</a>
            <a href="#" style="text-decoration:none;margin:0 4px;font-size:24px">⭐</a>
            <a href="#" style="text-decoration:none;margin:0 4px;font-size:24px">⭐</a>
            <a href="#" style="text-decoration:none;margin:0 4px;font-size:24px">⭐</a>
            <a href="#" style="text-decoration:none;margin:0 4px;font-size:24px">⭐</a>
          </div>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Xem chi tiết đơn hàng
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),

  checking: (name, orderId) => ({
    subject: `🔍 Đơn hàng #${orderId} đang được kiểm tra ban đầu`,
    html: `
      <div style="${commonStyles.container}">
        <div style="${commonStyles.logo}">
          <div style="${commonStyles.logoWrapper}">
            <span style="${commonStyles.logoText}">Tech<span style="color:#4fc3f7">Mate</span></span>
          </div>
        </div>

        <div style="text-align:center;margin-bottom:24px">
          <img src="https://cdn-icons-png.flaticon.com/512/2810/2810051.png" alt="Checking" style="width:100px">
        </div>

        <h2 style="${commonStyles.heading}">Đang kiểm tra thiết bị</h2>

        <p style="${commonStyles.text}">Xin chào ${name},</p>

        <p style="${commonStyles.text}">
          Đơn đặt lịch sửa chữa <b style="color:#333333">#${orderId}</b> của bạn đã được tiếp nhận và hiện đang trong quá trình kiểm tra ban đầu.
        </p>

        <div style="background-color:#eff6ff;border-radius:12px;padding:24px;margin-bottom:24px">
          <h3 style="color:#3b82f6;margin:0 0 12px;font-size:18px">Chi tiết đơn hàng:</h3>
          <table style="width:100%;color:#555555;font-size:15px">
            <tr>
              <td style="padding:8px 0;width:40%;font-weight:600">Mã đơn hàng:</td>
              <td style="padding:8px 0">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600">Trạng thái:</td>
              <td style="padding:8px 0">
                <span style="background-color:#bfdbfe;color:#1d4ed8;padding:4px 10px;border-radius:50px;font-size:13px;font-weight:500">
                  Đang kiểm tra
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin:32px 0;text-align:center">
          <a href="https://github.com/MT-KS-04" style="${commonStyles.button}">
            Theo dõi đơn hàng
          </a>
        </div>

        <div style="${commonStyles.footer}">
          <div>© 2025 TechMate. Tất cả các quyền được bảo lưu.</div>
          <div style="margin-top:8px">
            <a href="#" style="color:#8f5cf7;text-decoration:none;margin-right:12px">Chính sách bảo mật</a>
            <a href="#" style="color:#8f5cf7;text-decoration:none">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    `,
  }),
};

async function sendMail(to, templateName, ...args) {
  const { subject, html } = templates[templateName](...args);
  const mailOptions = {
    // Allow overriding the From header. If SMTP_FROM not set, use SMTP_USER.
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendMail,
  templates,
};
