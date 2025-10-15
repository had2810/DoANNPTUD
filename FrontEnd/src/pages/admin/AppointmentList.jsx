import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import AppointmentFormDialog from "@/components/dialogs/AppointmentFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";

// Import Hooks Custom & Services
import appointmentService from "@/services/appointmentService";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";
import { formatDate, formatTime } from "@/lib/format";

const AppointmentList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { toast } = useToast();
  const perPage = 10;

  const {
    data: appointmentsRaw = [],
    isLoading,
    refetch,
  } = useEntityList("appointments", appointmentService.getAppointments);

  const appointments = appointmentsRaw?.data ?? [];

  // Sắp xếp: Đơn chưa có nhân viên tiếp nhận lên đầu
  const sortedAppointments = [...appointments].sort((a, b) => {
    const aNoStaff = !a.employeeId;
    const bNoStaff = !b.employeeId;
    if (aNoStaff !== bNoStaff) return aNoStaff ? -1 : 1;
    // Nếu cùng nhóm, sắp xếp theo ngày đặt lịch mới nhất lên đầu
    return new Date(b.appointmentTime) - new Date(a.appointmentTime);
  });

  const deleteAppointment = useDeleteEntity(
    appointmentService.deleteAppointment,
    "appointments",
    "Lịch hẹn đã được xóa thành công",
    () => setIsDeleteDialogOpen(false)
  );

  const {
    paginatedData,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    sortedAppointments.map((a) => ({
      ...a,
      customerName: a.userId?.fullName || "",
      phoneNumber: a.userId?.phoneNumber || "",
      deviceType: a.deviceTemplateId?.type || "",
      deviceModel: a.deviceTemplateId?.name || "",
    })),
    ["customerName", "phoneNumber", "deviceType", "deviceModel"],
    perPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setIsAddDialogOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleAppointmentSaved = () => {
    refetch();
    toast({
      title: "Thành công!",
      description: "Thông tin lịch hẹn đã được lưu.",
    });
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Xoá:", selectedAppointment);
    if (selectedAppointment) {
      deleteAppointment.mutate(selectedAppointment._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Chờ xử lý",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      confirmed: {
        label: "Đã xác nhận",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "customerName",
      label: "Khách hàng",
      render: (a) => a.userId?.fullName,
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      render: (a) => a.userId?.phoneNumber,
    },
    {
      key: "deviceType",
      label: "Loại thiết bị",
      render: (a) => a.deviceTemplateId?.type,
    },
    {
      key: "deviceModel",
      label: "Model",
      render: (a) => a.deviceTemplateId?.name,
    },
    {
      key: "service",
      label: "Dịch vụ",
      render: (a) => a.serviceId?.serviceName || "Không rõ",
    },
    { key: "problem", label: "Vấn đề", render: (a) => a.description },
    {
      key: "appointmentTime",
      label: "Thời gian hẹn",
      render: (a) => formatTime(a.appointmentTime),
    },
    {
      key: "appointmentDate",
      label: "Ngày hẹn",
      render: (a) => formatDate(a.appointmentTime),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (a) => getStatusBadge(a.status),
    },
    {
      key: "receptionStaff",
      label: "Nhân viên tiếp nhận",
      render: (a) => a.employeeId?.fullName || "—",
    },
    {
      key: "price",
      label: "Chi phí",
      render: (a) =>
        a.estimatedCost ? `${a.estimatedCost.toLocaleString()}đ` : "—",
    },
  ];

  // Custom row class: đỏ nếu chưa có nhân viên tiếp nhận
  const getRowClassName = (a) => (!a.employeeId ? "bg-red-200" : "");

  return (
    <>
      <DataTable
        title="Danh Sách Lịch Hẹn Sửa Chữa"
        data={paginatedData.map(
          (item) => sortedAppointments.find((a) => a._id === item._id) || item
        )}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onAdd={handleAddAppointment}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteClick}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên khách hàng, số điện thoại, thiết bị..."
        addButtonText="Thêm Lịch Hẹn"
        rowClassName={getRowClassName}
        formDialog={
          <>
            {isAddDialogOpen && (
              <AppointmentFormDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleAppointmentSaved}
              />
            )}
            {isEditDialogOpen && selectedAppointment && (
              <AppointmentFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                appointment={selectedAppointment}
                onSave={handleAppointmentSaved}
              />
            )}
          </>
        }
        deleteDialog={
          isDeleteDialogOpen &&
          selectedAppointment && (
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              itemName={selectedAppointment.customerName}
              itemType="lịch hẹn"
            />
          )
        }
      />
    </>
  );
};

export default AppointmentList;
