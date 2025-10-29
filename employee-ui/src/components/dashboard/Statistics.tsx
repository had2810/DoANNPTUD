import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appontmentService";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs ${
                trend.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.value} {trend.positive ? "↑" : "↓"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Statistics = () => {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  console.log(">> data appointments", appointments);

  // Số phiếu hỗ trợ đang mở
  const openTickets = appointments.filter((a) =>
    ["pending", "active"].includes(a.status)
  ).length;

  // Số phiếu đã xử lý
  const resolvedTickets = appointments.filter((a) =>
    ["resolved", "confirmed"].includes(a.status)
  ).length;

  // Khách hàng mới (7 ngày gần nhất)
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const newCustomers = Array.from(
    new Set(
      appointments
        .filter((a) => {
          const created = new Date(a.userId?.createdAt);
          return created >= sevenDaysAgo && created <= now;
        })
        .map((a) => a.userId?._id)
    )
  ).length;

  // Thời gian phản hồi TB (giả sử có trường responseTime, nếu không có thì để giá trị tĩnh)
  const avgResponseTime = "1.8h"; // placeholder nếu chưa có dữ liệu

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Phiếu hỗ trợ đang mở"
        value={isLoading ? "..." : openTickets.toString()}
        icon={MessageCircle}
        description="Tổng số phiếu chưa xử lý"
        trend={{ value: "12%", positive: false }}
      />
      <StatCard
        title="Khách hàng mới"
        value={isLoading ? "..." : newCustomers.toString()}
        icon={Users}
        description="7 ngày gần nhất"
        trend={{ value: "8%", positive: true }}
      />
      <StatCard
        title="Thời gian phản hồi TB"
        value={avgResponseTime}
        icon={Clock}
        description="24h gần nhất"
        trend={{ value: "14%", positive: true }}
      />
      <StatCard
        title="Phiếu đã xử lý"
        value={isLoading ? "..." : resolvedTickets.toString()}
        icon={CheckCircle}
        description="7 ngày gần nhất"
        trend={{ value: "6%", positive: true }}
      />
    </div>
  );
};

export default Statistics;
