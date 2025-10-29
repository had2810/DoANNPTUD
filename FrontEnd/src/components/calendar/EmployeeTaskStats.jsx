/* 
  📌 TODO: Xử lý thống kê công việc theo vai trò chi tiết hơn trong tương lai

  Mục tiêu:
  - Tách riêng logic tính toán thống kê (total, completed, pending) theo từng role cụ thể
  - Với role === 2 (Kỹ thuật viên): Dựa vào trạng thái sửa chữa thực tế như "In Repair", "Completed", "Checking"...
  - Với role === 3 (Tư vấn viên): Dựa vào trạng thái lịch hẹn như "confirmed", "pending", "cancelled"...

  Hiện tại:
  - Logic đang viết đơn giản để phục vụ hiển thị giao diện ban đầu
  - Chưa phân loại hết các trạng thái nghiệp vụ và chưa xử lý các edge-case (ví dụ: đơn hủy, đơn chuyển kỹ thuật viên khác...)

  🔧 Sau này:
  - Có thể tách logic thống kê ra hook riêng: `useEmployeeTaskStats()`
  - Bổ sung thêm UI cho trạng thái "Đang thực hiện", "Đã hủy", hoặc tỷ lệ phần trăm hoàn thành
  - Đồng bộ với logic backend (nếu có enum trạng thái chuẩn)

  Tạm thời để ở đây để giữ flow phát triển UI. Sẽ xử lý kỹ hơn sau khi các API/logic nghiệp vụ ổn định.
*/

const EmployeeTaskStats = ({
  role,
  appointments = [],
  repairStatuses = [],
}) => {
  let total = 0;
  let completed = 0;
  let pending = 0;

  if (role === 2) {
    // 👨‍🔧 Kỹ thuật viên — Dùng dữ liệu từ repairStatuses
    total = repairStatuses.length;
    completed = repairStatuses.filter((r) => r.status === "Completed").length;
    pending = repairStatuses.filter((r) => r.status !== "In Repair").length;
  } else if (role === 3) {
    // 🧑‍💼 Tư vấn viên — Dùng từ appointments
    total = appointments.length;
    completed = appointments.filter((a) => a.status === "confirmed").length;
    pending = appointments.filter((a) => a.status === "pending").length;
  }

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <div className="flex flex-col items-center bg-blue-50 rounded-lg py-3 w-full">
        <span className="text-blue-600 text-lg font-bold">{total}</span>
        <span className="text-xs text-blue-700 mt-1">Tổng công việc</span>
      </div>
      <div className="flex flex-col items-center bg-green-50 rounded-lg py-3 w-full">
        <span className="text-green-600 text-lg font-bold">{completed}</span>
        <span className="text-xs text-green-700 mt-1">Hoàn thành</span>
      </div>
      <div className="flex flex-col items-center bg-yellow-50 rounded-lg py-3 w-full">
        <span className="text-yellow-700 text-lg font-bold">{pending}</span>
        <span className="text-xs text-yellow-700 mt-1">Chờ xử lý</span>
      </div>
    </div>
  );
};

export default EmployeeTaskStats;
