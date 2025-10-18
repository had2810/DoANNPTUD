import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appontmentService";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const STATUS_LABELS = {
  new: "Mới",
  active: "Đang xử lý",
  pending: "Chờ phản hồi",
  resolved: "Đã xử lý",
  confirmed: "Đã giao",
};

const PRIORITY_LABELS = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const StatusBadge = ({ status }) => (
  <Badge
    className={cn(
      "text-xs capitalize",
      status === "new" && "bg-blue-500 hover:bg-blue-600",
      status === "active" && "bg-amber-500 hover:bg-amber-600",
      status === "pending" && "bg-purple-500 hover:bg-purple-600",
      status === "resolved" && "bg-green-500 hover:bg-green-600",
      status === "confirmed" && "bg-cyan-500 hover:bg-cyan-600"
    )}
  >
    {STATUS_LABELS[status] || status}
  </Badge>
);

const PriorityIndicator = ({ priority }) => (
  <span className="flex items-center">
    <span
      className={cn(
        "w-2 h-2 rounded-full mr-1",
        priority === "low" && "bg-green-500",
        priority === "medium" && "bg-amber-500",
        priority === "high" && "bg-red-500"
      )}
    />
    <span className="text-xs capitalize text-muted-foreground">
      {PRIORITY_LABELS[priority] || priority}
    </span>
  </span>
);

const RecentTickets = () => {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  // Lọc các đơn đã được giao (status === 'confirmed' hoặc có employeeId)
  const assignedTickets = appointments
    .filter((a) => a.status === "confirmed" || a.employeeId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Phiếu hỗ trợ gần đây</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">Mã phiếu</th>
                <th className="px-4 py-2 text-left font-medium">Khách hàng</th>
                <th className="px-4 py-2 text-left font-medium">Nội dung</th>
                <th className="px-4 py-2 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-2 text-left font-medium">Độ ưu tiên</th>
                <th className="px-4 py-2 text-right font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : assignedTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    Không có phiếu nào.
                  </td>
                </tr>
              ) : (
                assignedTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {ticket.orderCode || ticket._id}
                    </td>
                    <td className="px-4 py-3 font-medium text-sm">
                      {ticket.userId?.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block max-w-[400px] cursor-pointer">
                              {ticket.description}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs whitespace-pre-line break-words"
                          >
                            {ticket.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityIndicator priority="medium" />
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
