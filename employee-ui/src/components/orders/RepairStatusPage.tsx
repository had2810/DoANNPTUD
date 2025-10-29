import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { getAppointmentById } from "@/services/appontmentService";
import {
  getRepairStatusByAppointmentId,
  updateRepairStatus,
} from "@/services/repairStatusService";
import type { Appointment, RepairStatus } from "@/types";

const RepairStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data: appointment,
    isLoading: loadingOrder,
    isError: errorOrder,
  } = useQuery<Appointment>({
    queryKey: ["appointment", orderId],
    queryFn: () => getAppointmentById(orderId!),
    enabled: !!orderId,
  });

  const {
    data: repairStatus,
    isLoading: loadingStatus,
    isError: errorStatus,
    refetch,
  } = useQuery<RepairStatus>({
    queryKey: ["repair-status", orderId],
    queryFn: () => getRepairStatusByAppointmentId(orderId!),
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<RepairStatus>) =>
      updateRepairStatus(repairStatus!._id, payload),
    onSuccess: async () => {
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái!" });
      await refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Cập nhật thất bại";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    },
  });

  const markCompleted = () => {
    if (!repairStatus) return;
    mutation.mutate({ status: "Completed" });
  };

  if (loadingOrder || loadingStatus) {
    return <div className="p-6">Đang tải trạng thái sửa chữa...</div>;
  }

  if (errorOrder || errorStatus || !appointment || !repairStatus) {
    return (
      <div className="p-6">
        <p>Không tìm thấy đơn hàng hoặc trạng thái sửa chữa.</p>
        <Button variant="outline" onClick={() => navigate(`/orders/${orderId}`)}>
          Quay lại đơn hàng
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(`/orders/${orderId}`)}>
          Quay lại đơn hàng
        </Button>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={markCompleted}
            disabled={mutation.isPending || repairStatus.status === "Completed"}
          >
            Hoàn thành đơn hàng
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Trạng thái sửa chữa — #{appointment.orderCode || appointment._id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              Trạng thái hiện tại: <span className="font-semibold">{repairStatus.status}</span>
            </p>
            <Separator />
            <div>
              <p className="font-medium mb-2">Lịch sử trạng thái</p>
              <div className="space-y-2">
                {repairStatus.statusLog?.length ? (
                  repairStatus.statusLog.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.status}</span>
                      <span className="text-muted-foreground">
                        {new Date(item.time).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có lịch sử trạng thái</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepairStatusPage;