import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appontmentService";
import React from "react";
import { formatDateTimeFull } from "@/lib/format";
import { toast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  new: "Mới",
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge
      variant="outline"
      className={
        status === "active"
          ? "border-green-500 text-green-500"
          : status === "inactive"
          ? "border-gray-500 text-gray-500"
          : "border-blue-500 text-blue-500"
      }
    >
      {STATUS_LABELS[status] || status}
    </Badge>
  );
};

const Customers = () => {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  // Lọc khách hàng duy nhất từ các appointment
  const customers = React.useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      if (a.userId && !map.has(a.userId._id)) {
        map.set(a.userId._id, {
          _id: a.userId._id,
          fullName: a.userId.fullName,
          email: a.userId.email,
          phoneNumber: a.userId.phoneNumber,
          status: a.userId.status,
          tickets: 1,
          lastContact: a.updatedAt || a.createdAt,
        });
      } else if (a.userId && map.has(a.userId._id)) {
        map.get(a.userId._id).tickets += 1;
        if (a.updatedAt > map.get(a.userId._id).lastContact) {
          map.get(a.userId._id).lastContact = a.updatedAt;
        }
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  // State cho filter và search
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");

  // Lọc theo trạng thái và tìm kiếm
  const filteredCustomers = customers.filter((customer) => {
    const matchStatus =
      filterStatus === "all" ? true : customer.status === filterStatus;
    const matchSearch =
      customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phoneNumber.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách khách hàng</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="pl-8 h-9 w-[250px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            Lọc
          </Button>
          <Button
            size="sm"
            disabled
            onClick={() =>
              toast({
                title: "Chức năng đang được phát triển!",
                description: "Vui lòng quay lại sau.",
                variant: "destructive",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">ID</th>
                <th className="px-4 py-2 text-left font-medium">Khách hàng</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">
                  Số điện thoại
                </th>
                <th className="px-4 py-2 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-2 text-left font-medium">
                  Số đơn đang mở
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Liên hệ gần nhất
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    Đang tải danh sách khách hàng...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    Không có khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {customer._id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {customer.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {customer.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{customer.email}</td>
                    <td className="px-4 py-3 text-sm">
                      {customer.phoneNumber}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {customer.tickets > 0 ? (
                        <Badge variant="default">{customer.tickets}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Không có</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDateTimeFull(customer.lastContact)}
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

export default Customers;
