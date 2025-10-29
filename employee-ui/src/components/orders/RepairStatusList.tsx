import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getRepairStatuses, updateRepairStatus } from "@/services/repairStatusService";
import type { RepairStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

const statusBadge = (status: RepairStatus["status"]) => {
  const map: Record<string, { label: string; cls: string }> = {
    Checking: { label: "Đang kiểm tra", cls: "bg-purple-100 text-purple-800" },
    "In Repair": { label: "Đang sửa chữa", cls: "bg-blue-100 text-blue-800" },
    "Waiting for Customer": { label: "Chờ phản hồi & thanh toán", cls: "bg-yellow-100 text-yellow-800" },
    Completed: { label: "Hoàn thành", cls: "bg-green-100 text-green-800" },
    Cancelled: { label: "Đã hủy", cls: "bg-red-100 text-red-800" },
  };
  const cfg = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return <Badge className={cfg.cls}>{cfg.label}</Badge>;
};

const formatDate = (date?: string) => {
  if (!date) return "Không xác định";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Không hợp lệ";
  return new Intl.DateTimeFormat("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
};

const formatDateTime = (date?: string) => {
  if (!date) return "Không xác định";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Không hợp lệ";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const RepairStatusList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<RepairStatus[]>({
    queryKey: ["repair-status-list"],
    queryFn: getRepairStatuses,
  });
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<RepairStatus | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus["status"] | "">("");

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing || !selectedStatus) throw new Error("Thiếu dữ liệu cập nhật");
      return updateRepairStatus(editing._id, { status: selectedStatus });
    },
    onSuccess: async () => {
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái" });
      setEditing(null);
      setSelectedStatus("");
      await queryClient.invalidateQueries({ queryKey: ["repair-status-list"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Cập nhật thất bại";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    },
  });

  const filtered = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      const device = item?.appointmentId?.deviceTemplateId?.name || "";
      const customer = item?.appointmentId?.userId?.fullName || "";
      const desc = item?.appointmentId?.description || "";
      const service = item?.appointmentId?.serviceId?.serviceName || "";
      const tech = (item?.appointmentId?.employeeId as any)?.fullName || "";
      return [device, customer, desc, service, tech].some((s) => s.toLowerCase().includes(q));
    });
  }, [data, query]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Trạng Thái Sửa Chữa Thiết Bị</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm theo thiết bị, khách hàng, mô tả, dịch vụ..."
              className="max-w-md"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2">STT</th>
                  <th className="text-left p-2">Thiết bị</th>
                  <th className="text-left p-2">Khách hàng</th>
                  <th className="text-left p-2">Mô tả lỗi</th>
                  <th className="text-left p-2">Ngày nhận</th>
                  <th className="text-left p-2">Dịch vụ</th>
                  <th className="text-left p-2">Thời gian hoàn thành</th>
                  <th className="text-left p-2">Trạng thái</th>
                  <th className="text-left p-2">Kỹ thuật viên</th>
                  <th className="text-left p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-4" colSpan={10}>Đang tải...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="p-4" colSpan={10}>Không có dữ liệu</td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => {
                    const appointment = item.appointmentId;
                    return (
                      <tr key={item._id} className="border-b hover:bg-muted/40">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{appointment?.deviceTemplateId?.name || "Không rõ"}</td>
                        <td className="p-2">{appointment?.userId?.fullName || "Không rõ"}</td>
                        <td className="p-2">{appointment?.description || "Không rõ"}</td>
                        <td className="p-2">{formatDate(appointment?.appointmentTime)}</td>
                        <td className="p-2">{appointment?.serviceId?.serviceName || "Không rõ"}</td>
                        <td className="p-2">{formatDateTime(item.estimatedCompletionTime)}</td>
                        <td className="p-2">{statusBadge(item.status)}</td>
                        <td className="p-2">{(appointment?.employeeId as any)?.fullName || "Không rõ"}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => navigate(`/orders/${appointment?._id}/status`)}>Xem</Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditing(item);
                                setSelectedStatus(item.status);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                            </Button>
                          </div>
                    </td>
                  </tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={!!editing} onOpenChange={(open) => {
        if (!open) { setEditing(null); setSelectedStatus(""); }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Checking">Đang kiểm tra</SelectItem>
                <SelectItem value="In Repair">Đang sửa chữa</SelectItem>
                <SelectItem value="Waiting for Customer">Đang chờ khách hàng</SelectItem>
                <SelectItem value="Completed">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setSelectedStatus(""); }}>Hủy</Button>
            <Button disabled={updateMutation.isPending || !selectedStatus} onClick={() => updateMutation.mutate()}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RepairStatusList;