import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import repairStatusService from "@/services/repairStatusService";
import RepairStatusFormDialog from "@/components/dialogs/RepairStatusFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDateTimeFull, formatDuration } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";

const RepairStatusList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const { toast } = useToast();
  const perPage = 10;
  const queryClient = useQueryClient();

  const {
    data: repairStatuses,
    isLoading,
    isError,
  } = useEntityList("repairStatuses", repairStatusService.getRepairStatuses);

  const deleteMutation = useDeleteEntity(
    repairStatusService.deleteRepairStatus, // đúng là deleteFn
    "repairStatuses", // query key
    "Đã xóa trạng thái sửa chữa thiết bị" // success msg
  );

  const {
    paginatedData: paginatedWorks,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    (repairStatuses || []).map((item) => ({
      ...item,
      deviceName: item?.appointmentId?.deviceTemplateId?.name || "",
      customerName: item?.appointmentId?.userId?.fullName || "",
      problem: item?.appointmentId?.description || "",
      serviceName: item?.appointmentId?.serviceId?.serviceName || "",
      technician: item?.appointmentId?.employeeId?.fullName || "",
    })),
    ["deviceName", "customerName", "problem", "serviceName", "technician"],
    perPage
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleAddEquipment = () => {
    setSelectedEquipment(null);
    setIsAddDialogOpen(true);
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleEquipmentSaved = () => {
    toast({
      title: "Thành công!",
      description: "Thông tin thiết bị đã được lưu.",
    });
    queryClient.invalidateQueries({ queryKey: ["repairStatuses"] });
  };

  const handleDeleteClick = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const id = selectedEquipment?._id;
    if (!id) {
      toast({
        title: "Lỗi!",
        description: "Không tìm thấy ID để xóa.",
        variant: "destructive",
      });
      return;
    }

    deleteMutation.mutate(id);
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không hợp lệ";
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Checking: {
        label: "Đang kiểm tra",
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      },
      "In Repair": {
        label: "Đang sửa chữa",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      "Waiting for Customer": {
        label: "Chờ phản hồi khách",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      Completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      Cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "device",
      label: "Thiết bị",
      render: (equipment) =>
        equipment?.appointmentId?.deviceTemplateId?.name || "Không rõ",
    },
    {
      key: "customer",
      label: "Khách hàng",
      render: (equipment) =>
        equipment?.appointmentId?.userId?.fullName || "Không rõ",
    },
    {
      key: "problem",
      label: "Mô tả lỗi",
      render: (equipment) =>
        equipment?.appointmentId?.description || "Không rõ",
    },
    {
      key: "appointmentTime",
      label: "Ngày nhận",
      render: (equipment) =>
        formatDate(equipment?.appointmentId?.appointmentTime),
    },
    {
      key: "service",
      label: "Dịch vụ",
      render: (equipment) =>
        equipment?.appointmentId?.serviceId?.serviceName || "Không rõ",
    },
    {
      key: "estimatedCompletionTime",
      label: "Thời gian hoàn thành",
      render: (equipment) =>
        formatDateTimeFull(equipment?.estimatedCompletionTime),
    },
    {
      key: "duration",
      label: "Tổng thời gian sửa chữa",
      render: (equipment) => {
        const time = equipment?.estimatedCompletionTime;
        const createdAt = equipment?.statusLog?.[0]?.time;

        if (!time || !createdAt) return "Không xác định";

        const totalMinutes = Math.floor(
          (new Date(time) - new Date(createdAt)) / 60000
        );

        return formatDuration(totalMinutes);
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (equipment) => getStatusBadge(equipment.status),
    },
    {
      key: "technician",
      label: "Kỹ thuật viên",
      render: (equipment) =>
        equipment?.appointmentId?.employeeId?.fullName || "Không rõ",
    },
  ];

  return (
    <>
      <DataTable
        title="Trạng Thái Sửa Chữa Thiết Bị"
        data={paginatedWorks}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onEdit={handleEditEquipment}
        onDelete={handleDeleteClick}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên thiết bị, khách hàng..."
        formDialog={
          <>
            {isEditDialogOpen && selectedEquipment && (
              <RepairStatusFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                repairStatus={selectedEquipment}
                onSave={handleEquipmentSaved}
              />
            )}
          </>
        }
        deleteDialog={
          isDeleteDialogOpen &&
          selectedEquipment && (
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              customerName={"Trạng thái sửa chữa thiết bị này không"}
            />
          )
        }
      />
    </>
  );
};

export default RepairStatusList;
