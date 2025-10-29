import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface LeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: string | null;
  appointmentCount: number;
}

const LeaveRequestDialog: React.FC<LeaveRequestDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  date,
  appointmentCount,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Cảnh báo lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Nhân viên này có {appointmentCount} lịch hẹn trong ngày{" "}
            {date ? new Date(date).toLocaleDateString("vi-VN") : ""}.
            <br />
            <span className="font-semibold text-red-500">
              Khi xác nhận nghỉ, tất cả các đơn hàng trong ngày này sẽ tự động
              chuyển về trạng thái chưa có người phụ trách để phân công lại.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestDialog;
