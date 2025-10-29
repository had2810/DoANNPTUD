import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, X } from "lucide-react";

const NotificationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  actionText = "Đóng",
  onAction,
  type = "success",
  showCancel = true,
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={handleCancel}
          aria-label="Đóng"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-2">
          {showCancel && (
            <AlertDialogCancel onClick={handleCancel}>Đóng</AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleAction}
            className={`${
              type === "success"
                ? "bg-techmate-purple hover:bg-techmate-purple/90"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotificationDialog;
